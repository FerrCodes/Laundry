"use server";

import { prisma } from "@/lib/prisma";

// ==========================================
// STATISTIK DASHBOARD
// ==========================================
export async function getDashboardStats() {
  const [totalOrders, totalCustomers, pendingOrders, revenueData] = await Promise.all([
    prisma.order.count(),
    prisma.profile.count({ where: { role: "customer" } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.findMany({
      where: { paymentStatus: "paid" },
      select: { totalPrice: true },
    }),
  ]);

  const totalRevenue = revenueData.reduce(
    (sum, o) => sum + Number(o.totalPrice),
    0
  );

  return {
    totalOrders,
    totalRevenue,
    totalCustomers,
    pendingOrders,
  };
}

// ==========================================
// ORDER TERBARU
// ==========================================
export async function getRecentOrders(limit: number = 5) {
  const orders = await prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { fullName: true },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    order_number: order.orderNumber || `ORD-${order.id.slice(0, 8)}`,
    customer_name: order.customer.fullName,
    total_price: Number(order.totalPrice),
    status: order.status,
    created_at: order.createdAt.toISOString(),
  }));
}

// ==========================================
// SEMUA ORDER (ADMIN)
// ==========================================
export async function getAllOrders(status?: string) {
  const orders = await prisma.order.findMany({
    where: status && status !== "all" ? { status } : undefined,
    include: {
      customer: {
        select: { fullName: true },
      },
      service: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    order_number: order.orderNumber || `ORD-${order.id.slice(0, 8)}`,
    customer_name: order.customer.fullName,
    customer_id: order.customerId,
    service_name: order.service.name,
    weight_kg: Number(order.weightKg),
    total_price: Number(order.totalPrice),
    status: order.status,
    pick_up_address: order.pickUpAddress || "-",
    notes: order.notes,
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
  }));
}

// ==========================================
// DETAIL ORDER (ADMIN)
// ==========================================
export async function getAdminOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        select: { fullName: true, email: true },
      },
      service: true,
      payments: true,
    },
  });

  if (!order) return null;

  return {
    id: order.id,
    order_number: order.orderNumber,
    customer_name: order.customer.fullName,
    customer_email: order.customer.email,
    customer_id: order.customerId,
    service_name: order.service.name,
    weight_kg: Number(order.weightKg),
    total_price: Number(order.totalPrice),
    status: order.status,
    pick_up_address: order.pickUpAddress || "-",
    notes: order.notes,
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
    service: {
      name: order.service.name,
      description: order.service.description || "",
      price_per_kg: Number(order.service.pricePerKg),
      duration_hours: order.service.durationHours,
    },
  };
}

// ==========================================
// UPDATE STATUS ORDER
// ==========================================
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    console.error("Update order status error:", error);
    return { success: false, error: "Gagal update status" };
  }
}

// ==========================================
// CONFIRM PAYMENT
// ==========================================
export async function confirmPayment(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "paid" },
    });

    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: "success", paidAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error("Confirm payment error:", error);
    return { success: false, error: "Gagal konfirmasi pembayaran" };
  }
}