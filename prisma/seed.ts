import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ==========================================
  // 1. Buat Admin Default
  // ==========================================
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.profile.upsert({
    where: { email: "ferdiantoferi1303@gmail.com" },
    update: {},
    create: {
      email: "admin@laundry.com",
      fullName: "Admin",
      phone: "081234567890",
      address: "Kantor Pusat",
      role: "admin",
      password: adminPassword,
    },
  });

  console.log("✅ Admin created:", admin.email);

  // ==========================================
  // 2. Buat Customer Default
  // ==========================================
  const customerPassword = await bcrypt.hash("customer123", 10);

  const customer = await prisma.profile.upsert({
    where: { email: "customer@laundry.com" },
    update: {},
    create: {
      email: "customer@laundry.com",
      fullName: "Customer Test",
      phone: "081298765432",
      address: "Jalan Mawar No. 10",
      role: "customer",
      password: customerPassword,
    },
  });

  console.log("✅ Customer created:", customer.email);

  // ==========================================
  // 3. Buat Layanan Laundry
  // ==========================================
  const services = [
    {
      name: "Reguler",
      description: "Cuci dan setrika standar, selesai 1 hari",
      pricePerKg: 15000,
      durationHours: 24,
      category: "reguler",
    },
    {
      name: "Express",
      description: "Cuci dan setrika cepat, selesai 6 jam",
      pricePerKg: 25000,
      durationHours: 6,
      category: "express",
    },
    {
      name: "Premium",
      description: "Cuci, setrika, dan pewangi premium",
      pricePerKg: 35000,
      durationHours: 12,
      category: "premium",
    },
    {
      name: "Dry Clean",
      description: "Cuci kering khusus bahan tertentu",
      pricePerKg: 45000,
      durationHours: 48,
      category: "premium",
    },
  ];

  for (const service of services) {
    await prisma.laundryService.upsert({
      where: { id: service.name.toLowerCase() },
      update: {},
      create: {
        id: service.name.toLowerCase(),
        ...service,
      },
    });
    console.log("✅ Service created:", service.name);
  }

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });