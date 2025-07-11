# E-Commerce Mini

Mini project aplikasi E-Commerce sederhana menggunakan Golang (Fiber) sebagai backend dan HTML/CSS/JavaScript murni sebagai frontend.

## Fitur Utama

### Autentikasi
- Login dan register untuk user dan admin
- Autentikasi menggunakan JWT dan role-based access
- Redirect otomatis berdasarkan role

### User
- Melihat katalog produk
- Menambahkan produk ke keranjang
- Checkout dengan form alamat dan metode pembayaran
- Melihat riwayat pesanan dan status pesanan

### Admin
- Dashboard statistik (jumlah produk, pesanan, user)
- CRUD produk (tambah, edit, hapus)
- Manajemen pesanan (melihat dan mengubah status)

## Teknologi yang Digunakan

### Backend
- Golang
- Fiber (v2)
- PostgreSQL + GORM
- JWT Authentication
- Clean Architecture (handlers, services, models, utils)

### Frontend
- HTML5, CSS3, JavaScript
- Modular structure berdasarkan fitur dan role
- Fetch API untuk komunikasi ke backend
- LocalStorage untuk menyimpan token dan role

## Struktur Folder
```
ecommerce-mini/
├── frontend/
│ ├── auth/
│ ├── user/ 
│ ├── admin/
│ ├── css/ 
│ ├── js/ 
│ ├── assets/
├── handlers/
├── services/
├── models/
├── utils/
├── public/ # folder upload gambar produk
├── main.go
```

## Cara Menjalankan

### 1. Clone Repo

``git clone https://github.com/FahmiHeykal/ecommerce-mini.git
cd ecommerce-mini``

2. Setup Backend
- Buat file .env (lihat contoh pada .env.example)
- Pastikan PostgreSQL sudah berjalan

Jalankan server:
`go run main.go`
Aplikasi akan berjalan di: `http://localhost:8080`

3. Akses Frontend
Buka file HTML di dalam folder frontend\ secara langsung melalui browser atau gunakan static server jika diperlukan.


Akun Admin Default (Seeder)

Email: admin@gmail.com
Password: admin123

Rencana Pengembangan Selanjutnya

- Upload gambar produk ke Cloud (S3/Cloudinary)
- Filter produk berdasarkan kategori
- Integrasi dengan payment gateway (Midtrans, Stripe)
- Responsive design dan dukungan PWA
- Unit testing untuk backend
