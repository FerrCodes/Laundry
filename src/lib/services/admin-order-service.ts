import { createClient } from "@/lib/supabase/server";

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_id: string;
  service_name: string;
  weight_kg: number;
  total_price: number;
  status: string;
  pick_up_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderDetail extends AdminOrder {
  service: {
    name: string;
    description: string;
    price_per_kg: number;
    duration_hours: number;
  };
}

// Tipe untuk response dari Supabase
interface OrderWithRelations {
  id: string;
  order_number: string;
  total_price: number;
  status: string;
  weight_kg: number;
  pick_up_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_id: string;
  service_id: string;
  profiles: { full_name: string }[];
  laundry_services: { name: string }[];
}

export async function getAllOrders(status?: string): Promise<AdminOrder[]> {
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_price,
      status,
      weight_kg,
      pick_up_address,
      notes,
      created_at,
      updated_at,
      customer_id,
      service_id,
      profiles!customer_id (
        full_name
      ),
      laundry_services!service_id (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  const orders = data as OrderWithRelations[];

  return orders.map((order) => ({
    id: order.id,
    order_number: order.order_number || `ORD-${order.id.slice(0, 8)}`,
    customer_name: order.profiles?.[0]?.full_name || "Customer",
    customer_id: order.customer_id,
    service_name: order.laundry_services?.[0]?.name || "Layanan",
    weight_kg: order.weight_kg,
    total_price: order.total_price,
    status: order.status,
    pick_up_address: order.pick_up_address || "-",
    notes: order.notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
  }));
}

export async function getAdminOrderById(orderId: string): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_price,
      status,
      weight_kg,
      pick_up_address,
      notes,
      created_at,
      updated_at,
      customer_id,
      service_id,
      profiles!customer_id (
        full_name
      ),
      laundry_services!service_id (
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

  const order = data as OrderWithRelations & {
    laundry_services: { name: string; description: string; price_per_kg: number; duration_hours: number }[];
  };

  return {
    id: order.id,
    order_number: order.order_number || `ORD-${order.id.slice(0, 8)}`,
    customer_name: order.profiles?.[0]?.full_name || "Customer",
    customer_id: order.customer_id,
    service_name: order.laundry_services?.[0]?.name || "Layanan",
    weight_kg: order.weight_kg,
    total_price: order.total_price,
    status: order.status,
    pick_up_address: order.pick_up_address || "-",
    notes: order.notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    service: {
      name: order.laundry_services?.[0]?.name || "Layanan",
      description: order.laundry_services?.[0]?.description || "",
      price_per_kg: order.laundry_services?.[0]?.price_per_kg || 0,
      duration_hours: order.laundry_services?.[0]?.duration_hours || 0,
    },
  };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
}