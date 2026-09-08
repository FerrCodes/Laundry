import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Key,
  Store,
  Edit,
} from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Pengaturan</h1>
      <p className="text-gray-400 mb-8">Kelola pengaturan aplikasi dan akun Anda</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil Admin */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Profil Admin</h3>
            </div>
            <Link
              href="/admin/settings/profile"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Nama</p>
                <p className="text-sm text-white">{profile?.full_name || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-white">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">No. Telepon</p>
                <p className="text-sm text-white">{profile?.phone || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ganti Password */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Ganti Password</h3>
            </div>
            <Link
              href="/admin/settings/password"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
            >
              <Edit className="w-4 h-4" />
              Ubah
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Ubah password akun admin Anda untuk keamanan.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            Terakhir diubah: {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
          </div>
        </div>
      </div>

      {/* Pengaturan Toko (Opsional) */}
      <div className="mt-6 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Pengaturan Toko</h3>
          </div>
          <span className="text-xs text-gray-500">Coming Soon</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Nama Toko</p>
            <p className="text-sm text-white">LaundryApp</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Jam Operasional</p>
            <p className="text-sm text-white">08:00 - 20:00</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-500">Alamat</p>
            <p className="text-sm text-white">-</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}