import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProfileForm from "@/components/customer/EditProfileForm";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Edit Profil</h1>
      <p className="text-gray-400 mb-8">Perbarui informasi akun Anda</p>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <EditProfileForm
          profile={
            profile
              ? {
                  fullName: profile.fullName,
                  phone: profile.phone,
                  address: profile.address,
                }
              : null
          }
        />
      </div>
    </div>
  );
}