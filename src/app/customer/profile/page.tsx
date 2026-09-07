import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";

export default async function CustomerProfilePage() {
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
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Profil</h1>
        <Link
          href="/customer/profile/edit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-sm"
        >
          <Edit className="w-4 h-4" />
          Edit Profil
        </Link>
      </div>
      <p className="text-gray-400 mb-8">Kelola informasi akun Anda</p>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xs text-gray-500">Nama Lengkap</p>
            <p className="text-white">{profile?.full_name || "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xs text-gray-500">Nomor Telepon</p>
            <p className="text-white">{profile?.phone || "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xs text-gray-500">Alamat</p>
            <p className="text-white">{profile?.address || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}