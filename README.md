# Anargya Platform

Platform digital resmi dan merchandise store untuk **Anargya ITS EV Team** (Formula Student Electric Vehicle Team, Institut Teknologi Sepuluh Nopember Surabaya). Dibuat menggunakan **Next.js 15**, **React 19**, **TypeScript**, dan **Tailwind CSS**.

---

## Fitur Utama

- 🏎️ **Fleet Showcase**: Informasi spesifikasi teknis dan histori mobil balap Formula EV (Mark 1.0 hingga Mark 6.0).
- 🛍️ **Official Merchandise Store**: Katalog produk, varian ukuran, dan keranjang belanja interaktif.
- 💳 **Online Checkout**: Formulir pemesanan dengan kalkulasi otomatis dan integrasi WhatsApp.
- ⚙️ **Admin Dashboard**: Manajemen produk (tambah, edit, hapus, upload foto) dan pemantauan status pesanan.
- 📱 **PWA Ready**: Mendukung Progressive Web App untuk pengalaman akses cepat di perangkat mobile.

---

## Persyaratan Sistem

- **Node.js**: v20 atau lebih baru (direkomendasikan v22)
- **npm** atau package manager kompatibel
- *(Opsional)* **PostgreSQL**: Jika ingin menggunakan database relasional penuh untuk produksi.

> **Catatan Database:** Aplikasi sudah dilengkapi dengan sistem **Local JSON Fallback**. Jika PostgreSQL tidak dikonfigurasi, aplikasi tetap dapat dijalankan penuh untuk keperluan pengembangan lokal menggunakan penyimpanan file lokal (`src/data/`).

---

## Cara Menjalankan di Lingkungan Lokal

### 1. Pasang Dependensi
```bash
npm install
```

### 2. Buat File Environment
Salin template konfigurasi:
```bash
# Untuk Linux / macOS / Git Bash:
cp .env.example .env

# Atau untuk Windows PowerShell:
Copy-Item .env.example .env
```

### 3. Konfigurasi Database (Opsional)
Jika Anda menggunakan PostgreSQL, buat database `anargya_db` dan sesuaikan connection string di `.env`:
```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/anargya_db?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/anargya_db?schema=public"
```

Lalu sinkronkan skema database:
```bash
npx prisma generate
npx prisma db push
```

*(Jika tidak menggunakan PostgreSQL, lewati langkah ini — aplikasi akan otomatis menggunakan penyimpanan lokal).*

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## Halaman & Akun Admin

- **Halaman Utama**: `/`
- **Official Store**: `/store`
- **Admin Dashboard**: `/admin`

### Kredensial Default Admin:
- **Username**: `admin`
- **Password**: `anargya2026`

> Anda dapat mengubah kredensial melalui variabel `ADMIN_USER`, `ADMIN_PASSWORD`, dan `ADMIN_SECRET` di file `.env`.

---

## Perintah Tersedia

```bash
npm run dev      # Menjalankan server pengembangan lokal
npm run build    # Membuat bundle build untuk produksi
npm run start    # Menjalankan production server hasil build
npm run lint     # Menjalankan ESLint & type checking
```
