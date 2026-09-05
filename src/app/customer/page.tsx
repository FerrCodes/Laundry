import Hero from "@/components/customer/Hero";
import ServiceCard from "@/components/customer/ServiceCard";
import { getActiveServices } from "@/lib/services/laundry-services";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock, Shield, Sparkles, Truck, Recycle } from "lucide-react";

export default async function CustomerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const services = await getActiveServices();
  // Ambil 3 layanan pertama untuk ditampilkan di home
  const featuredServices = services.slice(0, 3);

  const benefits = [
    {
      icon: Clock,
      title: "Proses Cepat",
      description: "Pengerjaan tepat waktu sesuai dengan durasi yang dipilih",
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Pakaian Anda aman dan terawat dengan baik",
    },
    {
      icon: Sparkles,
      title: "Hasil Memuaskan",
      description: "Bersih, wangi, dan rapi seperti baru",
    },
    {
      icon: Truck,
      title: "Jemput & Antar",
      description: "Gratis jemput dan antar untuk area tertentu",
    },
    {
      icon: Recycle,
      title: "Ramah Lingkungan",
      description: "Menggunakan deterjen ramah lingkungan",
    },
    {
      icon: CheckCircle,
      title: "Garansi Kepuasan",
      description: "100% kepuasan pelanggan atau kami ulangi",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <Hero />

      {/* Why Us Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Mengapa Memilih <span className="text-blue-400">LaundryApp</span>?
          </h2>
          <p className="text-gray-400 mt-2">
            Kami hadir untuk memberikan pengalaman laundry terbaik untuk Anda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Services (Preview 3 layanan) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Layanan Unggulan</h2>
            <p className="text-gray-400 text-sm">Layanan terbaik pilihan pelanggan</p>
          </div>
          <a
            href="/customer/services"
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Lihat Semua →
          </a>
        </div>

        {featuredServices.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#333333]">
            <p className="text-gray-400">Belum ada layanan tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                price_per_kg={service.price_per_kg}
                duration_hours={service.duration_hours}
                category={service.category}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}