import { createClient } from "@/lib/supabase/server";

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const supabase = await createClient();

  // Ambil semua profil
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  // Ambil data order per customer
  const customers: Customer[] = [];

  for (const profile of profiles) {
    const { data: orders } = await supabase
      .from("orders")
      .select("total_price")
      .eq("customer_id", profile.id)
      .in("status", ["ready", "picked_up"]);

    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0;

    // Ambil email dari auth.users (tidak bisa langsung join)
    const { data: userData } = await supabase
      .from("auth.users")
      .select("email")
      .eq("id", profile.id)
      .single();

    customers.push({
      id: profile.id,
      full_name: profile.full_name || "Customer",
      email: userData?.email || "-",
      phone: profile.phone || null,
      address: profile.address || null,
      role: profile.role,
      created_at: profile.created_at,
      total_orders: totalOrders,
      total_spent: totalSpent,
    });
  }

  return customers;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !profile) {
    return null;
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("total_price")
    .eq("customer_id", profile.id)
    .in("status", ["ready", "picked_up"]);

  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0;

  const { data: userData } = await supabase
    .from("auth.users")
    .select("email")
    .eq("id", profile.id)
    .single();

  return {
    id: profile.id,
    full_name: profile.full_name || "Customer",
    email: userData?.email || "-",
    phone: profile.phone || null,
    address: profile.address || null,
    role: profile.role,
    created_at: profile.created_at,
    total_orders: totalOrders,
    total_spent: totalSpent,
  };
}