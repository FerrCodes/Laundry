import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Halaman Customer</h1>
        <p className="mt-2 text-gray-600">Selamat datang, {user.email}!</p>
      </div>
    </div>
  );
}