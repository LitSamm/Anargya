# Anargya Platform

Website Anargya Formula Student yang dibuat dengan Next.js, React, dan TypeScript.

## Persyaratan

- Node.js 22 atau lebih baru
- npm
- PostgreSQL lokal atau server PostgreSQL yang dapat diakses aplikasi

Proyek menggunakan PostgreSQL melalui Prisma untuk data produk dan pesanan. Endpoint katalog juga menggunakan DuckDB lokal; file database `data/anargya.duckdb` dibuat otomatis saat endpoint tersebut pertama kali dijalankan dan katalog awal akan diisi otomatis.

## Menjalankan di lingkungan lokal

1. Pasang dependensi:

   ```powershell
   npm install
   ```

2. Salin file contoh environment:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Edit `.env` dan atur koneksi PostgreSQL. Buat database `anargya_db` terlebih dahulu, lalu isi kedua variabel berikut dengan connection string yang sesuai:

   ```dotenv
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/anargya_db?schema=public"
   DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/anargya_db?schema=public"
   ```

   Ganti `postgres`, `password`, host, port, dan nama database sesuai konfigurasi PostgreSQL Anda. Untuk setup lokal standar, `DATABASE_URL` dan `DIRECT_URL` dapat menggunakan URL yang sama.

4. Buat/generasikan Prisma Client dan sinkronkan skema ke database:

   ```powershell
   npx prisma generate
   npx prisma db push
   ```

5. Jalankan server pengembangan:

   ```powershell
   npm run dev
   ```

6. Buka [http://localhost:3000](http://localhost:3000).

## Halaman dan akun admin

- Halaman utama: `/`
- Toko: `/store`
- Panel admin: `/admin`

Secara default, kredensial admin lokal adalah:

- Username: `admin`
- Password: `anargya2026`

Anda dapat menggantinya melalui `ADMIN_USER` dan `ADMIN_PASSWORD` di `.env`. `ADMIN_SECRET` dapat diatur untuk kunci penandatanganan sesi. Nilai bawaan hanya untuk pengembangan lokal; ganti semua nilai tersebut sebelum deployment.

## Perintah lain

```powershell
npm run build    # Membuat build production
npm run start    # Menjalankan build production (jalankan npm run build terlebih dahulu)
npm run lint     # Menjalankan lint Next.js
```

## Data lokal

- Skema PostgreSQL didefinisikan di `prisma/schema.prisma`.
- DuckDB disimpan di `data/anargya.duckdb`; aplikasi membuat tabel dan data produk awal secara otomatis jika diperlukan.
- Jangan hapus database DuckDB jika ingin mempertahankan data katalog yang telah tersimpan.
