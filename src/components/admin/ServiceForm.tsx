"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

interface ServiceFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price_per_kg: number;
    duration_hours: number;
    category: string;
    is_active: boolean;
  };
  isEditing?: boolean;
}

export default function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price_per_kg?.toString() || "");
  const [duration, setDuration] = useState(initialData?.duration_hours?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "reguler");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!name.trim()) {
      showToast("Nama layanan wajib diisi", "error");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      showToast("Harga harus lebih dari 0", "error");
      return;
    }
    if (!duration || parseInt(duration) <= 0) {
      showToast("Durasi harus lebih dari 0 jam", "error");
      return;
    }

    setLoading(true);

    const data = {
      name: name.trim(),
      description: description.trim(),
      price_per_kg: parseFloat(price),
      duration_hours: parseInt(duration),
      category,
      is_active: isActive,
    };

    let result;

    if (isEditing && initialData?.id) {
      // Update
      const { error } = await supabase
        .from("laundry_services")
        .update(data)
        .eq("id", initialData.id);

      result = { error };
    } else {
      // Insert
      const { error } = await supabase
        .from("laundry_services")
        .insert(data);

      result = { error };
    }

    if (result.error) {
      showToast(isEditing ? "Gagal update layanan" : "Gagal tambah layanan", "error");
      setLoading(false);
      return;
    }

    showToast(isEditing ? "Layanan berhasil diupdate" : "Layanan berhasil ditambahkan", "success");
    setLoading(false);
    router.push("/admin/services");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nama */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nama Layanan <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Reguler, Express, Premium"
          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Deskripsi
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi layanan laundry"
          rows={3}
          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Harga & Durasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Harga per kg <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              min="0"
              step="500"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Durasi (jam) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="24"
            min="1"
            className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Kategori <span className="text-red-400">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#333333] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="reguler">Reguler</option>
          <option value="express">Express</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {/* Status Aktif */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Status
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="true"
              checked={isActive === true}
              onChange={() => setIsActive(true)}
              className="w-4 h-4 text-blue-600 bg-[#0A0A0A] border-[#333333] focus:ring-blue-500"
            />
            <span className="text-white text-sm">Aktif</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="false"
              checked={isActive === false}
              onChange={() => setIsActive(false)}
              className="w-4 h-4 text-blue-600 bg-[#0A0A0A] border-[#333333] focus:ring-blue-500"
            />
            <span className="text-white text-sm">Non-aktif</span>
          </label>
        </div>
      </div>

      {/* Tombol */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-medium rounded-xl border border-[#333333] transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : isEditing ? "Update Layanan" : "Tambah Layanan"}
        </button>
      </div>
    </form>
  );
}