"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  fullName: string;
  phone: string | null;
  address?: string | null;
}) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Anda belum login" };
  }

  try {
    await prisma.profile.update({
      where: { id: session.user.id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        ...(data.address !== undefined && { address: data.address }),
      },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/customer/profile");
    revalidatePath("/customer/profile/edit");

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Gagal update profil" };
  }
}

export async function changePassword(newPassword: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Anda belum login" };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.profile.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: "Gagal ubah password" };
  }
}