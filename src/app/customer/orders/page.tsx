import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderCard from "@/components/customer/OrderCard";
import { Package, Inbox } from "lucide-react";

export default async function CustomerOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      service: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Package className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Riwayat Pesanan</h1>
      </div>
      <p className="text-gray-400 mb-8">Lihat semua pesanan Anda</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#1A1A1A] rounded-xl border border-[#333333]">
          <Inbox className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Belum ada pesanan</p>
          <p className="text-gray-500 text-sm mt-1">Mulai pesan laundry sekarang!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              order_number={order.orderNumber || `ORD-${order.id.slice(0, 8)}`}
              service_name={order.service?.name || "Layanan"}
              weight_kg={Number(order.weightKg)}
              total_price={Number(order.totalPrice)}
              status={order.status}
              pick_up_address={order.pickUpAddress || "-"}
              created_at={order.createdAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}