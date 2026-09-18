import Hero from "@/components/customer/Hero";
import ServiceCard from "@/components/customer/ServiceCard";
import { getActiveServices } from "@/lib/services/service-actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Truck,
  Shirt,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default async function CustomerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const services = await getActiveServices();
  const featuredServices = services.slice(0, 3);

  const steps = [
    {
      icon: ClipboardList,
      title: "1. Pesan Online",
      description: "Pilih layanan dan isi form pemesanan",
    },
    {
      icon: Truck,
      title: "2. Kami Jemput",
      description: "Kurir kami akan menjemput laundry Anda",
    },
    {
      icon: Shirt,
      title: "3. Cuci & Antar",
      description: "Laundry dicuci, disetrika, dan diantar kembali",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Tepat Waktu",
      description: "Pengerjaan sesuai durasi yang dipilih",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Pakaian Anda aman dan terawat",
    },
    {
      icon: Sparkles,
      title: "Hasil Memuaskan",
      description: "Bersih, wangi, dan rapi",
    },
    {
      icon: CheckCircle,
      title: "Garansi Kepuasan",
      description: "100% kepuasan atau kami ulangi",
    },
  ];

  const stats = [
    { label: "Layanan", value: services.length.toString() },
    { label: "Pelanggan", value: "100+" },
    { label: "Order Selesai", value: "500+" },
    { label: "Rating", value: "4.9" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero */}
      <Hero />

      {/* Cara Kerja */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Cara Kerja
          </h2>
          <p className="text-gray-400 mt-2">Pesan laundry hanya dalam 3 langkah mudah</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Layanan Unggulan</h2>
            <p className="text-gray-400 text-sm">Layanan terbaik pilihan pelanggan</p>
          </div>
          <Link
            href="/customer/services"
            className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
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
                description={service.description || ""}
                price_per_kg={Number(service.pricePerKg)}
                duration_hours={service.durationHours}
                category={service.category}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mengapa Memilih Kami */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Mengapa Memilih <span className="text-blue-400">LaundryApp?</span>
          </h2>
          <p className="text-gray-400 mt-2">Kami hadir untuk pengalaman laundry terbaik</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Statistik */}
      <section className="bg-linear-to-br from-blue-900 via-blue-800 to-blue-600 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-blue-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Siap Pesan Laundry Sekarang?
        </h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Dapatkan pengalaman laundry yang praktis, cepat, dan terpercaya
        </p>
        <Link
          href="/customer/booking"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20"
        >
          Pesan Sekarang
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}