# Gandaria City Mall - Parking System API

RESTful API backend *enterprise-grade* untuk mengelola operasional sistem parkir di Gandaria City Mall. Proyek ini mencakup alur pencatatan kendaraan masuk, penghitungan durasi dan biaya parkir otomatis, manajemen data parkir dengan *pagination*, serta sistem keamanan tingkat produksi.

## Fitur Utama

* **Autentikasi & Otorisasi:** Registrasi dan login operator menggunakan enkripsi `bcrypt` dan proteksi endpoint berbasis JSON Web Token (JWT).
* **Keamanan Tingkat Lanjut:** Proteksi *header* HTTP menggunakan `helmet`, kebijakan lintas-sumber `cors`, dan pencegahan serangan *brute-force*/*DDoS* menggunakan `express-rate-limit`.
* **Validasi Input Ketat:** Pengecekan payload dan format data (contoh: validasi format plat nomor) sebelum mencapai *controller* menggunakan `joi`.
* **Check-In & Check-Out:** Pencatatan otomatis waktu masuk, keluar, dan kalkulasi tarif berbasis jam (default: Rp 5.000/jam) yang terhubung (berelasi) langsung dengan ID operator yang bertugas.
* **Manajemen Data & Pagination:** Fitur pengambilan riwayat parkir yang dioptimalkan dengan *filtering* status, *sorting*, dan *pagination* agar server tetap stabil meski data mencapai jutaan baris.
* **Logging Middleware:** Pencatatan lalu lintas HTTP request secara *real-time*.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose (ODM)
* **Keamanan & Validasi:** Helmet, CORS, Express-Rate-Limit, Joi, Bcrypt, JWT
* **Utilities:** Dotenv, Body-Parser

## Struktur Direktori

```text
parking-system/
├── src/
│   ├── controllers/
│   │   └── parkingController.js   # Logika transaksi, kalkulasi, & pagination
│   ├── middleware/
│   │   ├── authenticateToken.js   # Ekstraksi ID & validasi bearer token
│   │   ├── logger.js              # Request logger
│   │   └── validator.js           # Skema validasi input Joi
│   ├── models/
│   │   ├── Parking.js             # Skema koleksi parkir (Berelasi dengan User)
│   │   └── User.js                # Skema koleksi operator
│   ├── routes/
│   │   ├── parkingRoutes.js       # Routing endpoint operasional parkir
│   │   └── user.js                # Routing endpoint autentikasi
│   ├── app.js                     # Inisialisasi Express, Middleware Keamanan & Server
│   └── db.js                      # Konfigurasi koneksi MongoDB
├── .env                           # Environment variables
├── .gitignore
├── package.json
└── README.md

```

## Instalasi & Menjalankan

1. **Clone repositori:**

```bash
git clone [https://github.com/USERNAME_KAMU/NAMA_REPOSITORY.git](https://github.com/USERNAME_KAMU/NAMA_REPOSITORY.git)
cd NAMA_REPOSITORY

```

2. **Instal dependensi:**

```bash
npm install

```

3. **Konfigurasi Environment Variables:**
Buat file `.env` pada direktori root dan sesuaikan konfigurasinya:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/parking_db
SECRET_KEY=rahasia_super_secure_key

```

4. **Jalankan aplikasi:**

```bash
node src/app.js

```

Aplikasi akan berjalan pada `http://localhost:3000` dengan pembatasan 100 *request* per 15 menit per IP.

## Dokumentasi Endpoint API

### 1. Autentikasi (`/api/users`)

| Method | Endpoint | Auth | Deskripsi | Request Body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/users/register` | Publik | Mendaftarkan operator baru | `{"name": "Admin", "email": "admin@mall.com", "password": "123"}` |
| `POST` | `/api/users/login` | Publik | Login dan mendapatkan token | `{"email": "admin@mall.com", "password": "123"}` |

### 2. Operasional Parkir (`/api/parking`)

> **Catatan Penting:** Semua rute operasional wajib menyertakan Header: `Authorization: Bearer <ACCESS_TOKEN>`

| Method | Endpoint | Deskripsi | Body / Query / Parameter |
| --- | --- | --- | --- |
| `POST` | `/api/parking/in` | Kendaraan masuk (Check-in). Terdapat validasi format string Plat Nomor. | **Body:** `{"platNomor": "B 1234 CD"}` |
| `PUT` | `/api/parking/out/:id` | Kendaraan keluar & kalkulasi biaya dinamis. | **Param:** `id` (ID Karcis) |
| `GET` | `/api/parking/` | Menampilkan seluruh transaksi milik operator dengan format paginasi. | **Query Opsional:** `?status=IN&page=1&limit=10&sortBy=waktuMasuk&order=desc` |
| `DELETE` | `/api/parking/:id` | Menghapus riwayat transaksi. | **Param:** `id` (ID Karcis) |
