"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock,  } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/customer");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
          </div>
          <h1 className="text-3xl font-bold text-white">Selamat Datang Kembali!</h1>
          <p className="text-gray-400 mt-2">Lihat kembali proses booking, status, riwayat dan manajemen Anda.</p>
        </div>

        {/* Form */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-8 space-y-6">

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="contoh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Lupa password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Login
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Buat Akun
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs">
          © 2026 Laundry. All rights reserved.
        </p>
      </div>
    </div>
  );
}