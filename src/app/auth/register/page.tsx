"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Sofa } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthSidebar from "@/components/auth/AuthSidebar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "customer",
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]">
      {/* Left - Visual Side */}
      <AuthSidebar
        title="Mulai Pesan Laundry Sekarang"
        subtitle="Daftar akun dan nikmati kemudahan laundry kiloan online."
      />

      {/* Right - Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
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

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Nama Lengkap"
              type="text"
              icon={User}
              placeholder="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

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
              placeholder="Minimal 8 Karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
              minLength={8}
            />

            <Button type="submit" loading={loading} fullWidth>
              Daftar
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}