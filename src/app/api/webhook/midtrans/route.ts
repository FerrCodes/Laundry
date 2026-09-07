import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📩 Webhook received:", body);

    const {
      order_id,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
    } = body;

    // 1. VERIFIKASI SIGNATURE (WAJIB!)
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      console.error("❌ Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("✅ Signature verified");

    // 2. UPDATE STATUS ORDER
    const supabase = await createClient();

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, payment_status")
      .eq("order_number", order_id)
      .single();

    if (findError || !order) {
      console.error("❌ Order not found:", order_id);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

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

    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", order.id);

    if (updateError) {
      console.error("❌ Failed to update order:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    console.log(`✅ Order ${order_id} updated to ${paymentStatus}`);

    if (paymentStatus === "paid") {
      await supabase
        .from("payments")
        .update({ status: "success", paid_at: new Date().toISOString() })
        .eq("order_id", order.id);
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