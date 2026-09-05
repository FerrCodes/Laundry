"use client";

import { Clock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price_per_kg: number;
  duration_hours: number;
  category: string;
}

export default function ServiceCard({
  id,
  name,
  description,
  price_per_kg,
  duration_hours,
  category,
}: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryBadge = (cat: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      reguler: { color: "bg-blue-500/20 text-blue-400", label: "Reguler" },
      express: { color: "bg-yellow-500/20 text-yellow-400", label: "Express" },
      premium: { color: "bg-purple-500/20 text-purple-400", label: "Premium" },
    };
    return badges[cat] || badges.reguler;
  };

  const badge = getCategoryBadge(category);

  return (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/5 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-3">{description}</p>
        </div>
        <Sparkles className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333333]">
        <div>
          <p className="text-2xl font-bold text-white">{formatPrice(price_per_kg)}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Clock className="w-3 h-3" />
            <span>{duration_hours} jam selesai</span>
          </div>
        </div>

        <Link
          href={`/customer/booking?service=${id}`}
          className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          Pilih
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}