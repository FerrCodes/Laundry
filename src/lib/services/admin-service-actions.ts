"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllServices() {
  const services = await prisma.laundryService.findMany({
    orderBy: { createdAt: "desc" },
  });

  return services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description || "",
    price_per_kg: Number(s.pricePerKg),
    duration_hours: s.durationHours,
    category: s.category,
    is_active: s.isActive,
    created_at: s.createdAt.toISOString(),
    updated_at: s.updatedAt.toISOString(),
  }));
}

export async function getServiceById(id: string) {
  const service = await prisma.laundryService.findUnique({
    where: { id },
  });

  if (!service) return null;

  return {
    id: service.id,
    name: service.name,
    description: service.description || "",
    price_per_kg: Number(service.pricePerKg),
    duration_hours: service.durationHours,
    category: service.category,
    is_active: service.isActive,
  };
}

export async function createService(data: {
  name: string;
  description: string;
  pricePerKg: number;
  durationHours: number;
  category: string;
  isActive: boolean;
}) {
  try {
    await prisma.laundryService.create({
      data: {
        name: data.name,
        description: data.description,
        pricePerKg: data.pricePerKg,
        durationHours: data.durationHours,
        category: data.category,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Create service error:", error);
    return { success: false, error: "Gagal membuat layanan" };
  }
}

export async function updateService(
  id: string,
  data: {
    name: string;
    description: string;
    pricePerKg: number;
    durationHours: number;
    category: string;
    isActive: boolean;
  }
) {
  try {
    await prisma.laundryService.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        pricePerKg: data.pricePerKg,
        durationHours: data.durationHours,
        category: data.category,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Update service error:", error);
    return { success: false, error: "Gagal update layanan" };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.laundryService.delete({ where: { id } });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Delete service error:", error);
    return { success: false, error: "Gagal hapus layanan" };
  }
}

export async function toggleServiceStatus(id: string, isActive: boolean) {
  try {
    await prisma.laundryService.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Toggle service error:", error);
    return { success: false, error: "Gagal ubah status" };
  }
}