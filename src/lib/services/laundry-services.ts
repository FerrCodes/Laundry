import { createClient } from "@/lib/supabase/server";

export interface LaundryService {
  id: string;
  name: string;
  description: string;
  price_per_kg: number;
  duration_hours: number;
  category: "reguler" | "express" | "premium";
  is_active: boolean;
}

export async function getActiveServices() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("laundry_services")
    .select("*")
    .eq("is_active", true)
    .order("price_per_kg", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data as LaundryService[];
}