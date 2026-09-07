import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditProfileForm from "@/components/customer/EditProfileForm";

export default async function EditProfilePage() {
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

      <h1 className="text-3xl font-bold text-white mb-2">Edit Profil</h1>
      <p className="text-gray-400 mb-8">Perbarui informasi akun Anda</p>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <EditProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  );
}