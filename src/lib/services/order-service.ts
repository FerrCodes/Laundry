import { createClient } from "@/lib/supabase/server";

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  service_id: string;
  weight_kg: number;
  total_price: number;
  notes: string | null;
  pick_up_address: string;
  status: "pending" | "confirmed" | "washing" | "drying" | "ironing" | "ready" | "picked_up" | "cancelled";
  order_date: string;
  created_at: string;
  updated_at: string;
  // Relasi
  service?: {
    name: string;
    duration_hours: number;
  };
}

export async function getCustomerOrders(customerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      service:laundry_services (
        name,
        duration_hours
      )
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data as Order[];
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      service:laundry_services (
        name,
        description,
        price_per_kg,
        duration_hours
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data as Order;
}

