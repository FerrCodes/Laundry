import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Ambil data order dari Prisma
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Pastikan order milik user yang login
    if (order.customerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Inisialisasi Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    // Parameter transaksi
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

    // Buat transaksi
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}