import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function NewServicePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Layanan
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">Tambah Layanan Baru</h1>
      <p className="text-gray-400 mb-6">Isi form di bawah untuk menambahkan layanan laundry</p>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <ServiceForm />
      </div>
    </div>
  );
}