"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

export async function createPaymentToken(orderId: string) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "Anda belum login" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return { success: false, error: "Order tidak ditemukan" };
    }

    if (order.customerId !== session.user.id) {
      return { success: false, error: "Akses ditolak" };
    }

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: Number(order.totalPrice),
      },
      customer_details: {
        first_name: order.customer.fullName,
        email: order.customer.email,
      },
      item_details: [
        {
          id: order.id,
          price: Number(order.totalPrice),
          quantity: 1,
          name: `Laundry Order #${order.orderNumber}`,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/customer/orders/${order.id}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/customer/orders/${order.id}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/customer/orders/${order.id}`,
      },
    };

    console.log("📤 Midtrans request:", JSON.stringify(parameter, null, 2));

    const transaction = await snap.createTransaction(parameter);

    console.log("✅ Midtrans success:", transaction);

    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  } catch (error) {
  console.error("❌ Error message:", error instanceof Error ? error.message : "Unknown");
  console.error("❌ Error detail:", error);
  return { success: false, error: "Gagal membuat pembayaran" };
}
}