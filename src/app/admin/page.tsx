export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
      <p className="text-gray-400 mt-2">Kelola laundry order di sini.</p>

      {/* Stats Cards Sementara */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {["Total Order", "Pendapatan", "Customer", "Pending"].map((label) => (
          <div key={label} className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}