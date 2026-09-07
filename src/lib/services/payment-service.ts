import { createClient } from "@/lib/supabase/server";

export async function getPaymentByOrderId(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching payment:", error);
    return null;
  }

  return data || null;
}

export async function confirmPaymentByOrderId(orderId: string) {
  const supabase = await createClient();

  // Update payment status di tabel payments
  const { error: paymentError } = await supabase
    .from("payments")
    .update({ status: "success", paid_at: new Date().toISOString() })
    .eq("order_id", orderId);

  if (paymentError) {
    console.error("Error confirming payment:", paymentError);
    return { success: false, error: paymentError };
  }

  // Update payment_status di orders
  const { error: orderError } = await supabase
    .from("orders")
    .update({ payment_status: "paid" })
    .eq("id", orderId);

  if (orderError) {
    console.error("Error updating order payment status:", orderError);
    return { success: false, error: orderError };
  }

  return { success: true, error: null };
}

export async function createPaymentRecord(orderId: string, amount: number, method: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: orderId,
      amount: amount,
      payment_method: method,
      status: "pending",
      qris_code: `QRIS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating payment record:", error);
    return null;
  }

  return data;
}

export async function confirmPayment(paymentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .update({ status: "success", paid_at: new Date().toISOString() })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) {
    console.error("Error confirming payment:", error);
    return null;
  }

  // Update payment_status di orders
  await supabase
    .from("orders")
    .update({ payment_status: "paid" })
    .eq("id", data.order_id);

  return data;
}