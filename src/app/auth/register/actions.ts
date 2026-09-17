"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerAction(
  prevState: { error: string; success: string } | undefined,
  formData: FormData
) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validasi
  if (!fullName || !email || !password) {
    return { error: "Semua field wajib diisi", success: "" };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter", success: "" };
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar", success: "" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    await prisma.profile.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: "customer",
      },
    });

    return { error: "", success: "Akun berhasil dibuat, silakan login" };
  } catch (error) {
    console.error("Register error:", error);
    return { error: "Gagal mendaftar, coba lagi", success: "" };
  }
}