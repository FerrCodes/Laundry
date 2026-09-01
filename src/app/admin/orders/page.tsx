export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Daftar Order</h1>
      <p className="text-gray-400 mt-2">Kelola semua order laundry.</p>

      <div className="mt-6 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <p className="text-gray-400 text-center py-8">Belum ada order</p>
      </div>
    </div>
  );
}