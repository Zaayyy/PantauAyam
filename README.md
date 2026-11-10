# BRMP DIY - PoultryTrack 🐔📊
### Sistem Monitoring Ayam Pedaging & Petelur
**Balai Penerapan Standar Instrumen Pertanian / Riset Unggas D.I. Yogyakarta**

---

Aplikasi untuk memisahkan pencatatan ayam pedaging dan petelur serta memonitor aktivitas pemeliharaan mingguan BRMP DIY.

## ✨ Fitur Utama

1. **Dashboard Ayam Pedaging**: catatan pakan, populasi terkini dan mutasi (bertambah, berkurang), serta bobot rata-rata mingguan.
2. **Dashboard Ayam Petelur**: populasi, jumlah telur, bobot total telur, serta jumlah pakan per minggu.
3. **Pencatatan mingguan** per flok/kandang, dengan foto dokumentasi dan catatan tambahan.
4. **Rekap dan ekspor CSV** berdasarkan kategori ayam, serta cetak dan backup database.
5. **Grafik bobot dan standar BRMP** tetap tersedia pada dashboard ayam pedaging.
6. **Penyimpanan SQLite atau Supabase**, tampilan responsif, dan tema terang/gelap.

Flok lama tetap terbaca; flok yang belum memiliki kategori akan ditampilkan sebagai ayam pedaging. Data populasi yang sudah tercatat sebagai mortalitas/afkir tetap diperhitungkan.

---

## 🚀 Cara Menjalankan

### Cara 1: Buka Langsung (Tanpa Install)
Cukup klik ganda (double click) file [`index.html`](file:///d:/A%20KULIAH/MAGANG/BRMP%20DIY/Requestan%20mas%20argo/WEB2/index.html) di browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, Safari).

### Cara 2: Menjalankan Local Server (Node.js)
Buka terminal / PowerShell di direktori ini dan jalankan:
```bash
npm install
npm start
```
Lalu buka: `http://localhost:3000`

### Pembaruan Database Supabase
Jika menggunakan Supabase dengan tabel yang sudah ada, jalankan blok `ALTER TABLE` pada `supabase-schema.sql` melalui SQL Editor agar kolom kategori, mutasi populasi, dan produksi telur ditambahkan. Hindari menjalankan ulang blok `CREATE POLICY` jika kebijakan akses sebelumnya sudah dibuat.

---

## 📂 Struktur Berkas
```
WEB2/
├── index.html          # Struktur halaman dashboard & modal dialog
├── css/
│   └── style.css       # Desain modern, tema dark/light, responsif & print style
├── js/
│   ├── standards.js    # Data acuan standar pertumbuhan ayam KUB, Joper, Broiler
│   ├── storage.js      # Pengelola LocalStorage, backup JSON, & data awal BRMP
│   ├── charts.js       # Konfigurasi grafik interaktif Chart.js
│   └── app.js          # Controller aplikasi, kalkulasi ADG, FCR, Uniformity & event
└── README.md           # Petunjuk penggunaan aplikasi
```
