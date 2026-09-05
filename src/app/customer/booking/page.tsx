"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Weight, MapPin, FileText, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";

interface Service {
  id: string;
  name: string;
  description: string;
  price_per_kg: number;
  duration_hours: number;
  category: string;
}

// Tipe untuk user
interface User {
  id: string;
  email: string;
}

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [weight, setWeight] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [user, setUser] = useState<User | null>(null); // ✅ Sudah diperbaiki

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { showToast } = useToast();

  // Ambil service ID dari URL
  const serviceId = searchParams.get("service");

  // Ambil data user & services
  useEffect(() => {
    const fetchData = async () => {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser({ id: user.id, email: user.email || "" });

      // Get services
      const { data: servicesData, error } = await supabase
        .from("laundry_services")
        .select("*")
        .eq("is_active", true)
        .order("price_per_kg", { ascending: true });

      if (error) {
        showToast("Gagal memuat layanan", "error");
        setLoadingServices(false);
        return;
      }

      setServices(servicesData || []);

      // Jika ada serviceId di URL, pilih otomatis
      if (serviceId && servicesData) {
        const found = servicesData.find((s) => s.id === serviceId);
        if (found) setSelectedService(found);
      }

      setLoadingServices(false);
    };

    fetchData();
  }, [serviceId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      showToast("Silakan pilih layanan terlebih dahulu", "warning");
      return;
    }

    if (weight <= 0) {
      showToast("Berat laundry harus lebih dari 0 kg", "warning");
      return;
    }

    if (!address.trim()) {
      showToast("Silakan isi alamat penjemputan", "warning");
      return;
    }

    setLoading(true);

    const totalPrice = selectedService.price_per_kg * weight;

    // Insert order ke database
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_id: user?.id,
        service_id: selectedService.id,
        weight_kg: weight,
        total_price: totalPrice,
        notes: notes.trim() || null,
        pick_up_address: address.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", error.message, error.details, error.hint);
      showToast("Gagal membuat pesanan: " + error.message, "error");
      setLoading(false);
      return;
    }

    showToast("Pesanan berhasil dibuat!", "success");
    router.push(`/customer/orders/${data.id}`);
    router.refresh();
  };

  const totalPrice = selectedService ? selectedService.price_per_kg * weight : 0;

  if (loadingServices) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-4">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/customer"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">Buat Pesanan Laundry</h1>
      <p className="text-gray-400 mb-8">Isi form di bawah untuk memesan laundry kiloan</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Layanan */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Pilih Layanan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={`
                      text-left p-4 rounded-xl border-2 transition-all duration-200
                      ${
                        selectedService?.id === service.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-[#333333] hover:border-[#555555]"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{service.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{service.description}</p>
                    <p className="text-sm font-semibold text-blue-400 mt-2">
                      {formatPrice(service.price_per_kg)}/kg
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Berat & Alamat */}
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Berat Laundry (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimal 0.5 kg</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alamat Penjemputan
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap untuk penjemputan"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Catatan (Opsional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan khusus untuk laundry (misal: jangan pakai pewangi, dll)"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Buat Pesanan
            </Button>
          </form>
        </div>

        {/* Ringkasan */}
        <div className="lg:col-span-1">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Ringkasan Pesanan</h3>

            {selectedService ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{selectedService.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{weight} kg</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{selectedService.duration_hours} jam</span>
                </div>

                <div className="border-t border-[#333333] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Harga per kg</span>
                    <span className="text-white">{formatPrice(selectedService.price_per_kg)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Berat</span>
                    <span className="text-white">{weight} kg</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-[#333333]">
                    <span className="text-white">Total</span>
                    <span className="text-blue-400">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Silakan pilih layanan terlebih dahulu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}