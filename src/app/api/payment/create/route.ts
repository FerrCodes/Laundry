import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import midtransClient from "midtrans-client";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Ambil data order (TANPA EMAIL)
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        total_price,
        customer_id,
        profiles!customer_id (
          full_name
        )
      `)
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("❌ Order not found:", error);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const profile = order.profiles?.[0] || {};
    const customerName = profile.full_name || "Customer";

    // Inisialisasi Snap
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    // Parameter transaksi
    const parameter = {
      transaction_details: {
        order_id: order.order_number,
        gross_amount: order.total_price,
      },
      customer_details: {
        first_name: customerName,
        email: "customer@example.com",
      },
      item_details: [
        {
          id: order.id,
          price: order.total_price,
          quantity: 1,
          name: `Laundry Order #${order.order_number}`,
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