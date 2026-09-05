import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAllServices } from "@/lib/services/admin-service-service";
import Link from "next/link";
import { Package, Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";
import ToggleServiceButton from "@/components/admin/ToggleServiceButton";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const services = await getAllServices();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      reguler: { color: "bg-blue-500/20 text-blue-400", label: "Reguler" },
      express: { color: "bg-yellow-500/20 text-yellow-400", label: "Express" },
      premium: { color: "bg-purple-500/20 text-purple-400", label: "Premium" },
    };
    return badges[category] || badges.reguler;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Kelola Layanan</h1>
          <p className="text-gray-400 mt-1">Tambah, edit, atau hapus layanan laundry</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </Link>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Deskripsi</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Kategori</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Harga</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Durasi</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p>Belum ada layanan</p>
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const categoryBadge = getCategoryBadge(service.category);
                  return (
                    <tr key={service.id} className="border-b border-[#333333]/50 hover:bg-[#1A1A1A] transition">
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{service.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell max-w-[200px] truncate">
                        {service.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryBadge.color}`}>
                          {categoryBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {formatPrice(service.price_per_kg)}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {service.duration_hours} jam
                      </td>
                      <td className="py-3 px-4">
                        {service.is_active ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            Aktif
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                            Non-aktif
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ToggleServiceButton
                            serviceId={service.id}
                            isActive={service.is_active}
                          />
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-[#333333] transition text-gray-400 hover:text-blue-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}