import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCustomerById } from "@/lib/services/admin-customer-service";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, DollarSign, User } from "lucide-react";

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const customer = await getCustomerById(id);

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <p className="text-gray-400">Customer tidak ditemukan</p>
          <Link href="/admin/customers" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Kembali ke Daftar Customer
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Customer
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Detail Customer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Customer */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Informasi Customer</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="text-sm text-white">{customer.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-white">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">No. HP</p>
                <p className="text-sm text-white">{customer.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">Alamat</p>
                <p className="text-sm text-white">{customer.address || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">Bergabung</p>
                <p className="text-sm text-white">{formatDate(customer.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Statistik</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Order</span>
              </div>
              <span className="text-xl font-bold text-white">{customer.total_orders}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Total Belanja</span>
              </div>
              <span className="text-xl font-bold text-green-400">{formatPrice(customer.total_spent)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}