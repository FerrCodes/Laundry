"use server";

import { prisma } from "@/lib/prisma";

export async function getAllCustomers() {
  const customers = await prisma.profile.findMany({
    where: { role: "customer" },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        where: { paymentStatus: "paid" },
        select: { totalPrice: true },
      },
    },
  });

  return customers.map((customer) => ({
    id: customer.id,
    full_name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    role: customer.role,
    created_at: customer.createdAt.toISOString(),
    total_orders: customer.orders.length,
    total_spent: customer.orders.reduce(
      (sum, o) => sum + Number(o.totalPrice),
      0
    ),
  }));
}

export async function getCustomerById(id: string) {
  const customer = await prisma.profile.findUnique({
    where: { id },
    include: {
      orders: {
        where: { paymentStatus: "paid" },
        select: { totalPrice: true },
      },
    },
  });

  if (!customer) return null;

  return {
    id: customer.id,
    full_name: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    role: customer.role,
    created_at: customer.createdAt.toISOString(),
    total_orders: customer.orders.length,
    total_spent: customer.orders.reduce(
      (sum, o) => sum + Number(o.totalPrice),
      0
    ),
  };
}