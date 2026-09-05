import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}