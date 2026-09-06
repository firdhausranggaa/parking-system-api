# Gandaria City Mall - Parking System API

RESTful API backend untuk mengelola operasional sistem parkir di Gandaria City Mall. Proyek ini mencakup alur pencatatan kendaraan masuk, penghitungan durasi dan biaya parkir otomatis saat kendaraan keluar, manajemen data parkir (CRUD), serta sistem otorisasi pengguna berbasis JSON Web Token (JWT).

## Fitur Utama

- **Autentikasi & Otorisasi:** Registrasi dan login operator dengan enkripsi password menggunakan `bcrypt` dan proteksi endpoint menggunakan `jsonwebtoken` (JWT).
- **Check-In Kendaraan:** Pencatatan plat nomor dan waktu masuk kendaraan secara otomatis.
- **Check-Out & Kalkulasi Biaya:** Penghitungan durasi parkir berbasis jam (pembulatan ke atas) dengan tarif dinamis (default: Rp 5.000/jam).
- **Manajemen Data (CRUD):** Melihat riwayat seluruh kendaraan parkir dan menghapus data parkir.
- **Logging Middleware:** Pencatatan otomatis setiap HTTP request method dan URL yang masuk ke server.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Security & Utilities:** JSON Web Token (JWT), Bcrypt, Dotenv, Body-Parser

## Struktur Direktori

```text
parking-system/
├── src/
│   ├── controllers/
│   │   └── parkingController.js   # Logika bisnis transaksi parkir
│   ├── middleware/
│   │   ├── authenticateToken.js   # Validasi bearer token JWT
│   │   └── logger.js              # Request logger
│   ├── models/
│   │   ├── Parking.js             # Skema koleksi parkir
│   │   └── User.js                # Skema koleksi user/operator
│   ├── routes/
│   │   ├── parkingRoutes.js       # Routing endpoint parkir
│   │   └── user.js                # Routing endpoint user (auth)
│   ├── app.js                     # Inisialisasi Express & server
│   └── db.js                      # Konfigurasi koneksi MongoDB
├── .env                           # Environment variables (diabaikan oleh git)
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


Aplikasi akan berjalan pada `http://localhost:3000`.

## Dokumentasi Endpoint API

### 1. Autentikasi (`/api/users`)

| Method | Endpoint | Auth | Deskripsi | Request Body |
| --- | --- | --- | --- | --- |
| `POST` | `/api/users/register` | Publik | Mendaftarkan operator baru | `{"name": "Admin", "email": "admin@mall.com", "password": "123"}` |
| `POST` | `/api/users/login` | Publik | Login dan mendapatkan token | `{"email": "admin@mall.com", "password": "123"}` |

### 2. Operasional Parkir (`/api/parking`)

> **Catatan:** Semua rute di bawah ini wajib menyertakan Header: `Authorization: Bearer <ACCESS_TOKEN>`

| Method | Endpoint | Deskripsi | Body / Parameter |
| --- | --- | --- | --- |
| `POST` | `/api/parking/in` | Kendaraan masuk (Check-in) | `{"platNomor": "B 1234 CD"}` |
| `PUT` | `/api/parking/out/:id` | Kendaraan keluar & kalkulasi biaya | Param `id`: ID karcis |
| `GET` | `/api/parking/` | Menampilkan seluruh data transaksi | - |
| `DELETE` | `/api/parking/:id` | Menghapus riwayat transaksi | Param `id`: ID karcis |
