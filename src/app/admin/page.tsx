import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDashboardStats, getRecentOrders } from "@/lib/services/admin-service";
import StatCard from "@/components/admin/StatCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import { Package, DollarSign, Users, Clock, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders(5);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Kelola dan pantau semua aktivitas laundry</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          title="Pendapatan"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          color="bg-green-500/10 text-green-400"
          subtitle={`${stats.totalOrders} orders`}
        />
        <StatCard
          title="Customer"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-purple-500/10 text-purple-400"
        />
        <StatCard
          title="Pending"
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-yellow-500/10 text-yellow-400"
          subtitle="Menunggu konfirmasi"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Order Terbaru</h2>
            <p className="text-sm text-gray-400">5 order terakhir</p>
          </div>
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}