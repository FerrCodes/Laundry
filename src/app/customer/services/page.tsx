import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getActiveServices } from "@/lib/services/service-actions";
import ServiceCard from "@/components/customer/ServiceCard";
import { LayoutGrid } from "lucide-react";

export default async function CustomerServicesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const services = await getActiveServices();

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <LayoutGrid className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Layanan Laundry</h1>
      </div>
      <p className="text-gray-400 mb-8">Pilih layanan yang sesuai dengan kebutuhan Anda</p>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <LayoutGrid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Belum ada layanan tersedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              description={service.description || ""}
              price_per_kg={Number(service.pricePerKg)}
              duration_hours={service.durationHours}
              category={service.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}