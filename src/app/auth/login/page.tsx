"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Form */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold text-white">Selamat Datang Kembali</h2>
            <p className="text-gray-400 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              placeholder="masukkan email Anda"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              placeholder="masukkan password Anda"
              showPasswordToggle
              required
            />

            <Button type="submit" loading={isPending} fullWidth>
              Login
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Daftar di sini
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs">
          © 2026 LaundryApp. All rights reserved.
        </p>
      </div>
    </div>
  );
}