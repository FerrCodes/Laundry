import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, Mail, Phone, Key, Store, Edit } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Pengaturan</h1>
      <p className="text-gray-400 mb-8">Kelola pengaturan aplikasi dan akun Anda</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <p className="text-sm text-white">{profile?.fullName || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-white">{profile?.email}</p>
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
        </div>
      </div>

      <div className="mt-6 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Pengaturan Toko</h3>
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
        </div>
      </div>

      <div className="mt-6 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Status Pembayaran</h3>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              process.env.MIDTRANS_IS_PRODUCTION === "true"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {process.env.MIDTRANS_IS_PRODUCTION === "true" ? "Production" : "Sandbox"}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Mode {process.env.MIDTRANS_IS_PRODUCTION === "true" ? "Production" : "Sandbox"} aktif.
        </p>
      </div>
    </div>
  );
}