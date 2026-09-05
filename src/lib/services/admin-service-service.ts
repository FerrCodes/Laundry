import { createClient } from "@/lib/supabase/server";

export interface Service {
  id: string;
  name: string;
  description: string;
  price_per_kg: number;
  duration_hours: number;
  category: "reguler" | "express" | "premium";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllServices(): Promise<Service[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laundry_services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data as Service[];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laundry_services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching service:", error);
    return null;
  }

  return data as Service;
}

export async function createService(service: Omit<Service, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laundry_services")
    .insert(service)
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function updateService(id: string, service: Partial<Omit<Service, "id" | "created_at" | "updated_at">>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laundry_services")
    .update(service)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating service:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function deleteService(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("laundry_services")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting service:", error);
    return { success: false, error };
  }

  return { success: true };
}

export async function toggleServiceStatus(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("laundry_services")
    .update({ is_active })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling service status:", error);
    return { success: false, error };
  }

  return { success: true, data };
}