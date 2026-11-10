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

### Cara 3: Menggunakan Google Spreadsheet sebagai Database Cloud (Vercel Ready)
1. Buka spreadsheet baru di Google Drive: [sheets.new](https://sheets.new)
2. Beri nama spreadsheet Anda, misalnya `BRMP PoultryTrack Database`.
3. Klik menu **Ekstensi (Extensions)** > **Apps Script**.
4. Hapus seluruh isi default, lalu salin dan tempelkan semua kode dari file [`google-apps-script.js`](google-apps-script.js).
5. Klik ikon **Simpan** (Ctrl + S).
6. Klik tombol biru **Terapkan (Deploy)** di pojok kanan atas > **Penerapan baru (New deployment)**.
7. Klik ikon roda gigi di samping "Pilih jenis", pilih **Aplikasi web (Web app)**.
8. Isi pengaturan:
   - **Deskripsi**: `BRMP API`
   - **Jalankan sebagai (Execute as)**: `Saya` (email akun Google Anda)
   - **Siapa yang memiliki akses (Who has access)**: `Siapa saja` (*Penting agar server dapat membaca & menulis data*)
9. Klik **Terapkan (Deploy)**, berikan izin akses Google (*Klik Beri Akses > Lanjutan > Buka... tidak aman*).
10. Salin **URL Aplikasi Web** yang berakhiran `/exec`.
11. Tambahkan ke file `.env` di komputer atau Environment Variables di Vercel:
    ```env
    GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx.../exec
    ```

---

## ☁️ Panduan Deploy ke Vercel
Aplikasi ini sudah siap dan dikonfigurasi penuh untuk Vercel Serverless (`vercel.json` dan `api/index.js`).

1. Pastikan kode terbaru sudah di-*push* ke GitHub repository Anda (`https://github.com/Zaayyy/PantauAyam.git`).
2. Buka dashboard [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
3. Klik **Add New...** > **Project**.
4. Impor repositori **`Zaayyy/PantauAyam`** (atau `icareMonitoring`).
5. Pada bagian **Environment Variables**, tambahkan:
   - **Key**: `GOOGLE_SCRIPT_URL`
   - **Value**: *(URL Web App Apps Script dari langkah di atas)*
6. Klik **Deploy**.
7. Selesai! Web Anda akan aktif di domain gratis Vercel (contoh: `pantau-ayam.vercel.app`) dan semua data kandang, mutasi, penimbangan, serta foto kegiatan otomatis tersimpan di Google Spreadsheet & Google Drive Anda.

---

### Opsi Alternatif: Database Supabase
Jika ingin menggunakan PostgreSQL via Supabase, setel `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di environment variable Vercel, lalu jalankan `supabase-schema.sql` di SQL Editor Supabase.

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
