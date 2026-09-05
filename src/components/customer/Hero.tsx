"use client";

import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-900 via-blue-800 to-blue-600 p-8 md:p-12 lg:p-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Laundry Kiloan Online</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Cuci Kiloan <br />
          <span className="text-blue-200">Praktis, Cepat & Wangi</span>
        </h1>

        <p className="mt-4 text-blue-100 text-base md:text-lg max-w-md">
          Pesan laundry kiloan langsung dari rumah. Kami jemput, cuci, setrika, dan antar kembali dengan hasil memuaskan.
        </p>

        {/* Benefit items */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Proses Cepat</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Terpercaya</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Hasil Memuaskan</span>
          </div>
        </div>

        <Link
          href="/customer/services"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg shadow-blue-600/30"
        >
          Pesan Sekarang
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}