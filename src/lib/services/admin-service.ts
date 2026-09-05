import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

// Tipe untuk response dari Supabase
interface OrderWithProfile {
  id: string;
  order_number: string;
  total_price: number;
  status: string;
  created_at: string;
  customer_id: string;
  profiles: {
    full_name: string;
  }[]; // ⬅️ Array of objects
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Total orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // Total revenue (from completed orders)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .in("status", ["ready", "picked_up"]);

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_price, 0) || 0;

  // Total customers (unique)
  const { data: customersData } = await supabase
    .from("orders")
    .select("customer_id")
    .order("customer_id");

  const uniqueCustomers = new Set(customersData?.map((o) => o.customer_id) || []);
  const totalCustomers = uniqueCustomers.size;

  // Pending orders
  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  return {
    totalOrders: totalOrders || 0,
    totalRevenue,
    totalCustomers,
    pendingOrders: pendingOrders || 0,
  };
}

export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_price,
      status,
      created_at,
      customer_id,
      profiles!customer_id (
        full_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }

  // Type assertion ke array dengan tipe yang sudah didefinisikan
  const orders = data as OrderWithProfile[];

  return orders.map((order) => ({
    id: order.id,
    order_number: order.order_number || `ORD-${order.id.slice(0, 8)}`,
    customer_name: order.profiles && order.profiles.length > 0 
      ? order.profiles[0].full_name 
      : "Customer",
    total_price: order.total_price,
    status: order.status,
    created_at: order.created_at,
  }));
}