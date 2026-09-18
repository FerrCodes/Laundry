import Hero from "@/components/customer/Hero";
import ServiceCard from "@/components/customer/ServiceCard";
import { getActiveServices } from "@/lib/services/service-actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const services = await getActiveServices();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Hero />

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Layanan</h2>
            <p className="text-gray-400 text-sm">Pilih layanan yang sesuai dengan kebutuhan Anda</p>
          </div>
          <span className="text-sm text-gray-500">{services.length} layanan tersedia</span>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12 bg-[#1A1A1A] rounded-xl border border-[#333333]">
            <p className="text-gray-400">Belum ada layanan tersedia</p>
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
      </section>
    </div>
  );
}