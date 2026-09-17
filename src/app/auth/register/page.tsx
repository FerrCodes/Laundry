"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Sofa } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthSidebar from "@/components/auth/AuthSidebar";
import { registerAction } from "./actions";
import { useEffect } from "react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      <AuthSidebar
        title="Mulai Pesan Laundry Sekarang"
        subtitle="Daftar akun dan nikmati kemudahan laundry kiloan online."
      />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Sofa className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LaundryApp</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Buat Akun Baru</h2>
            <p className="text-gray-400">Daftar sekarang dan mulai pesan laundry</p>
          </div>

          {state?.success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm space-y-2">
              <p className="font-semibold">✅ Pendaftaran Berhasil!</p>
              <p>{state.success}</p>
              <p className="text-xs text-gray-400">Anda akan dialihkan ke halaman login...</p>
            </div>
          )}

          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <Input
              label="Nama Lengkap"
              type="text"
              name="fullName"
              icon={User}
              placeholder="masukkan nama lengkap"
              required
              disabled={!!state?.success}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              placeholder="masukkan email Anda"
              required
              disabled={!!state?.success}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              placeholder="minimal 6 karakter"
              showPasswordToggle
              required
              minLength={6}
              disabled={!!state?.success}
            />

            <Button type="submit" loading={isPending} fullWidth disabled={!!state?.success}>
              {state?.success ? "✅ Terkirim!" : "Daftar"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}