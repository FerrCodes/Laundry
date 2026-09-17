import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditAdminProfileForm from "@/components/admin/EditAdminProfileForm";

export default async function EditAdminProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Edit Profil Admin</h1>
      <p className="text-gray-400 mb-8">Perbarui informasi akun admin Anda</p>
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <EditAdminProfileForm
          profile={
            profile
              ? {
                  fullName: profile.fullName,
                  phone: profile.phone,
                }
              : null
          }
          userId={session.user.id}
        />
      </div>
    </div>
  );
}