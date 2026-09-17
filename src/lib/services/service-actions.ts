"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveServices() {
  const services = await prisma.laundryService.findMany({
    where: { isActive: true },
    orderBy: { pricePerKg: "asc" },
  });

  // Konversi Decimal ke number & Date ke string
  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description || "",
    pricePerKg: Number(service.pricePerKg),
    durationHours: service.durationHours,
    category: service.category,
    isActive: service.isActive,
  }));
}