"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  serviceId: string;
  weightKg: number;
  totalPrice: number;
  notes: string;
  pickUpAddress: string;
  paymentMethod: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Anda belum login" };
  }

  try {
    // Generate order number
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");
    const count = await prisma.order.count();
    const orderNumber = `LAU-${dateStr}-${(count + 1000).toString()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: session.user.id,
        serviceId: data.serviceId,
        weightKg: data.weightKg,
        totalPrice: data.totalPrice,
        notes: data.notes || null,
        pickUpAddress: data.pickUpAddress,
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: data.paymentMethod,
      },
    });

    // Buat payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: data.totalPrice,
        paymentMethod: data.paymentMethod,
        status: "pending",
        qrisCode: `QRIS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    });

    revalidatePath("/customer/orders");

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Create order error:", error);
    return { success: false, error: "Gagal membuat pesanan" };
  }
}

export async function cancelOrder(orderId: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Anda belum login" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.customerId !== session.user.id) {
      return { success: false, error: "Order tidak ditemukan" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });

    revalidatePath("/customer/orders");
    revalidatePath(`/customer/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Cancel order error:", error);
    return { success: false, error: "Gagal membatalkan pesanan" };
  }
}