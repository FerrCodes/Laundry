# LaundryApp - Aplikasi Booking Laundry Online

Web App modern untuk booking laundry kiloan dengan sistem pembayaran terintegrasi (Midtrans)

---

## ✨ Fitur

### Customer
- Login & Register dengan verifikasi email
- Lihat daftar layanan laundry (Reguler, Express, Premium, Dry Clean)
- Booking laundry dengan pilihan berat & alamat penjemputan
- Pilih metode pembayaran (QRIS, E-Wallet, Cash)
- Integrasi pembayaran Midtrans (Kartu Kredit, QRIS, OVO, Gopay, DANA)
- Riwayat pesanan & detail order
- Status tracking laundry (Menunggu → Dicuci → Siap Diambil → Sudah Diambil)
- Batalkan pesanan (status pending)
- Edit profil (nama, no HP, alamat)

### Admin
- Dashboard statistik (total order, pendapatan, customer, pending)
- Kelola order (lihat, filter, update status, konfirmasi pembayaran)
- Kelola layanan (CRUD: tambah, edit, hapus, aktif/nonaktif)
- Kelola customer (lihat daftar & detail)
- Update status pembayaran manual

### Keamanan
- Autentikasi Supabase
- Middleware role-based (Customer / Admin)
- Row Level Security (RLS) di Supabase
- Verifikasi signature webhook Midtrans

---

## Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| Next.js 16 | Framework React (App Router) |
| TypeScript | Type safety |
| Tailwind | Styling |
| Supabase | Database, Auth, Storage |
| Midtrans | Payment Gateway (QRIS, E-Wallet, Kartu Kredit) |
| Lucide React | Icon library |
| Vercel | Deployment |

---

