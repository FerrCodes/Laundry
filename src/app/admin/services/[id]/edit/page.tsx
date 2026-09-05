import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceForm from "@/components/admin/ServiceForm";
import { getServiceById } from "@/lib/services/admin-service-service";

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const service = await getServiceById(id);

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <p className="text-gray-400">Layanan tidak ditemukan</p>
          <Link href="/admin/services" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Kembali ke Daftar Layanan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Layanan
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">Edit Layanan</h1>
      <p className="text-gray-400 mb-6">Ubah informasi layanan laundry</p>

      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <ServiceForm initialData={service} isEditing />
      </div>
    </div>
  );
}