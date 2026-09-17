import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  console.log("🚀 Webhook endpoint dipanggil!");

  try {
    const body = await req.json();
    console.log("📩 Webhook received:", JSON.stringify(body, null, 2));

    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
    } = body;

    // 1. VERIFIKASI SIGNATURE
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("❌ Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Signature verified");

    // 2. CARI ORDER DI DATABASE
    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
    });

    if (!order) {
      console.error("❌ Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ Order found:", order.id);

    // 3. TENTUKAN STATUS PEMBAYARAN
    let paymentStatus = "unpaid";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        paymentStatus = "paid";
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "paid";
    } else if (
      transaction_status === "pending" ||
      transaction_status === "challenge"
    ) {
      paymentStatus = "pending";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire" ||
      transaction_status === "failure"
    ) {
      paymentStatus = "failed";
    }

    console.log("🔄 Updating payment status to:", paymentStatus);

    // 4. UPDATE STATUS ORDER
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus },
    });

    console.log(`✅ Order ${order_id} updated to ${paymentStatus}`);

    // 5. UPDATE PAYMENT RECORD
    if (paymentStatus === "paid") {
      await prisma.payment.updateMany({
        where: { orderId: order.id },
        data: {
          status: "success",
          paidAt: new Date(),
        },
      });
      console.log("✅ Payment record updated");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}