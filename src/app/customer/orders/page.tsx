import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCustomerOrders } from "@/lib/services/order-service";
import OrderCard from "@/components/customer/OrderCard";
import { Package, Inbox } from "lucide-react";

export default async function CustomerOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await getCustomerOrders(user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Package className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Riwayat Pesanan</h1>
      </div>
      <p className="text-gray-400 mb-8">Lihat semua pesanan laundry Anda</p>

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
              order_number={order.order_number || `ORD-${order.id.slice(0, 8)}`}
              service_name={order.service?.name || "Layanan"}
              weight_kg={order.weight_kg}
              total_price={order.total_price}
              status={order.status}
              pick_up_address={order.pick_up_address || "-"}
              created_at={order.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}