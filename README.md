# KasirKu — Product Requirements Document

![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)

---

## Daftar Isi

- [Overview](#overview)
- [Latar Belakang & Masalah](#latar-belakang--masalah)
- [Target Pengguna](#target-pengguna)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Alur Pengguna](#alur-pengguna)
- [Entity Relationship](#entity-relationship)
- [Alur Transaksi POS](#alur-transaksi-pos)
- [Halaman & Rute](#halaman--rute)
- [API Endpoints](#api-endpoints)
- [Struktur Folder](#struktur-folder)
- [Cara Menjalankan](#cara-menjalankan)
- [Pengembangan Selanjutnya](#pengembangan-selanjutnya)

---

## Overview

**KasirKu** adalah aplikasi Point of Sale (POS) berbasis web yang dirancang khusus untuk kebutuhan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia. Aplikasi ini menyediakan solusi lengkap untuk mengelola transaksi penjualan, stok produk, laporan keuangan, dan manajemen pengguna dalam satu platform yang ringan dan mudah digunakan.

---

## Latar Belakang & Masalah

Banyak UMKM di Indonesia masih mengelola transaksi dan stok secara manual (buku kas, spreadsheet) yang rentan terhadap kesalahan pencatatan, sulit dilacak, dan tidak efisien. KasirKu hadir untuk menjawab kebutuhan tersebut dengan solusi digital yang:

- Mudah dipelajari oleh kasir tanpa latar belakang teknis
- Dapat diakses dari browser tanpa perlu instalasi aplikasi
- Menyajikan laporan penjualan secara real-time
- Mendukung multi-user dengan kontrol akses berbasis peran

---

## Target Pengguna

| Peran     | Deskripsi                                                             |
| --------- | --------------------------------------------------------------------- |
| **Kasir** | Staf yang bertugas melayani transaksi harian di counter               |
| **Admin** | Pemilik atau manajer bisnis yang mengelola produk, stok, dan pengguna |

---

## Fitur Utama

### Kasir

- Login aman dengan token autentikasi
- Dashboard ringkasan statistik bisnis (pendapatan, transaksi, stok rendah)
- POS — cari produk, tambah ke keranjang, pilih metode pembayaran, cetak struk
- Lihat riwayat transaksi dengan filter status
- Monitor stok produk secara real-time
- Lihat laporan penjualan & grafik performa
- Filter riwayat transaksi berdasarkan periode (harian, mingguan, bulanan)
- Ekspor riwayat transaksi ke CSV (harian, mingguan, bulanan)

### Admin

- Semua fitur Kasir
- Manajemen produk (CRUD + penyesuaian stok)
- Manajemen pengguna & role (CRUD + reset password)
- Akses ke seluruh data dan konfigurasi sistem

---

## Tech Stack

| Kategori       | Teknologi                 | Versi |
| -------------- | ------------------------- | ----- |
| Framework UI   | Vue.js                    | 3.x   |
| Build Tool     | Vite                      | 8.x   |
| Routing        | Vue Router                | 5.x   |
| HTTP Client    | Axios                     | 1.x   |
| Styling        | Tailwind CSS              | 3.x   |
| Visualisasi    | Chart.js                  | 4.x   |
| API Mock (dev) | Mock Service Worker (MSW) | 2.x   |
| CSS Processing | PostCSS + Autoprefixer    | 8.x   |

---

## Arsitektur Sistem

```mermaid
graph TD
    subgraph Browser["Browser (Client)"]
        UI["Vue 3 SPA"]
        Router["Vue Router\n(Route Guards)"]
        Composables["Composables\n(useAuth, useProducts,\nuseTransactions, ...)"]
        Axios["Axios Instance\n(Interceptors)"]
        LS["localStorage\n(token, user)"]
    end

    subgraph Backend["Backend Server"]
        API["REST API\n(Base URL: /api)"]
        Auth["Auth\n/auth/*"]
        Dashboard["Dashboard\n/dashboard/*"]
        Products["Products\n/products/*"]
        Transactions["Transactions\n/transactions/*"]
        Reports["Reports\n/reports/*"]
        Users["Users\n/users/*"]
    end

    subgraph Storage["Penyimpanan"]
        DB[(Database)]
    end

    UI --> Router
    Router --> Composables
    Composables --> Axios
    Axios -- "HTTP Request\n(Bearer Token)" --> API
    Axios --> LS

    API --> Auth
    API --> Dashboard
    API --> Products
    API --> Transactions
    API --> Reports
    API --> Users

    Auth --> DB
    Dashboard --> DB
    Products --> DB
    Transactions --> DB
    Reports --> DB
    Users --> DB
```

---

## Alur Pengguna

```mermaid
flowchart TD
    Start([Buka Aplikasi]) --> CheckToken{Token\ntersimpan?}
    CheckToken -- Tidak --> Login[/Halaman Login/]
    CheckToken -- Ya --> CheckRole{Cek Role}

    Login --> InputCreds[Input Email & Password]
    InputCreds --> AuthAPI[POST /auth/login]
    AuthAPI -- Gagal --> ErrMsg[Tampil Pesan Error]
    ErrMsg --> Login
    AuthAPI -- Berhasil --> SaveToken[Simpan Token\n& Data User]
    SaveToken --> CheckRole

    CheckRole -- kasir --> KasirMenu
    CheckRole -- admin --> AdminMenu

    subgraph KasirMenu["Menu Kasir"]
        D1[Dashboard]
        D2[POS / Kasir]
        D3[Transaksi]
        D4[Inventori]
        D5[Laporan]
    end

    subgraph AdminMenu["Menu Admin (tambahan)"]
        A1[Dashboard]
        A2[POS / Kasir]
        A3[Transaksi]
        A4[Inventori]
        A5[Laporan]
        A6[Manajemen Produk]
        A7[Manajemen Pengguna]
    end

    D1 & A1 --> Logout[Logout\nDELETE /auth/logout]
    Logout --> Login
```

---

## Entity Relationship

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email
        string password
        enum role "admin | kasir"
        timestamp created_at
    }

    PRODUCT {
        int id PK
        string code
        string name
        string category
        decimal price
        int stock
        int max_stock
        timestamp created_at
    }

    TRANSACTION {
        int id PK
        string code
        int user_id FK
        decimal total
        enum payment_method "cash | transfer | qris"
        enum status "paid | pending"
        timestamp created_at
    }

    TRANSACTION_ITEM {
        int id PK
        int transaction_id FK
        int product_id FK
        int quantity
        decimal price
        decimal subtotal
    }

    USER ||--o{ TRANSACTION : "membuat"
    TRANSACTION ||--|{ TRANSACTION_ITEM : "memiliki"
    PRODUCT ||--o{ TRANSACTION_ITEM : "ada di"
```

---

## Alur Transaksi POS

```mermaid
sequenceDiagram
    actor Kasir
    participant UI as Vue UI (KasirPage)
    participant API as REST API
    participant DB as Database

    Kasir->>UI: Buka halaman Kasir
    UI->>API: GET /products
    API->>DB: Query semua produk aktif
    DB-->>API: Data produk
    API-->>UI: Daftar produk
    UI-->>Kasir: Tampil grid produk

    Kasir->>UI: Pilih produk & atur kuantitas
    UI-->>Kasir: Update keranjang + total otomatis

    Kasir->>UI: Pilih metode pembayaran
    UI-->>Kasir: Tampil ringkasan transaksi

    Kasir->>UI: Klik "Bayar"
    UI->>API: POST /transactions
    API->>DB: Simpan transaksi & kurangi stok
    DB-->>API: Transaksi tersimpan
    API-->>UI: Response sukses + data struk
    UI-->>Kasir: Tampil struk & notifikasi berhasil
    UI-->>UI: Reset keranjang
```

---

## Halaman & Rute

| Halaman            | Rute                  | Akses        | Deskripsi                      |
| ------------------ | --------------------- | ------------ | ------------------------------ |
| Login              | `/login`              | Public       | Autentikasi pengguna           |
| Dashboard          | `/`                   | Kasir, Admin | Statistik ringkas & alert stok |
| POS / Kasir        | `/kasir`              | Kasir, Admin | Interface transaksi penjualan  |
| Transaksi          | `/transaksi`          | Kasir, Admin | Riwayat & filter transaksi     |
| Inventori          | `/inventori`          | Kasir, Admin | Monitor stok semua produk      |
| Laporan            | `/laporan`            | Kasir, Admin | Grafik & laporan penjualan     |
| Manajemen Produk   | `/manajemen-produk`   | Admin Only   | CRUD produk & stok             |
| Manajemen Pengguna | `/manajemen-pengguna` | Admin Only   | CRUD user & role               |

---

## API Endpoints

### Autentikasi

| Method | Endpoint       | Deskripsi           |
| ------ | -------------- | ------------------- |
| POST   | `/auth/login`  | Login pengguna      |
| POST   | `/auth/logout` | Logout pengguna     |
| GET    | `/auth/me`     | Info pengguna aktif |

### Dashboard

| Method | Endpoint                         | Deskripsi           |
| ------ | -------------------------------- | ------------------- |
| GET    | `/dashboard/stats`               | Statistik ringkas   |
| GET    | `/dashboard/recent-transactions` | 5 transaksi terbaru |
| GET    | `/dashboard/low-stock`           | Produk stok rendah  |

### Produk

| Method | Endpoint              | Deskripsi           |
| ------ | --------------------- | ------------------- |
| GET    | `/products`           | Daftar semua produk |
| POST   | `/products`           | Tambah produk baru  |
| PUT    | `/products/:id`       | Update produk       |
| DELETE | `/products/:id`       | Hapus produk        |
| PATCH  | `/products/:id/stock` | Sesuaikan stok      |

### Transaksi

| Method | Endpoint                   | Deskripsi               |
| ------ | -------------------------- | ----------------------- |
| GET    | `/transactions`            | Daftar transaksi        |
| POST   | `/transactions`            | Buat transaksi baru     |
| PATCH  | `/transactions/:id/status` | Update status transaksi |

### Laporan

| Method | Endpoint              | Deskripsi                |
| ------ | --------------------- | ------------------------ |
| GET    | `/reports/summary`    | Ringkasan laporan        |
| GET    | `/reports/by-payment` | Laporan per metode bayar |

### Pengguna

| Method | Endpoint              | Deskripsi            |
| ------ | --------------------- | -------------------- |
| GET    | `/users`              | Daftar pengguna      |
| POST   | `/users`              | Tambah pengguna baru |
| PUT    | `/users/:id`          | Update pengguna      |
| DELETE | `/users/:id`          | Hapus pengguna       |
| PATCH  | `/users/:id/password` | Ganti password       |

> Semua endpoint (kecuali `/auth/login`) memerlukan header `Authorization: Bearer <token>`.

---

## Struktur Folder

```
kasirku.v1/
├── public/
├── src/
│   ├── assets/              # Gambar, font, ikon
│   ├── components/          # Komponen UI reusable
│   │   ├── Sidebar.vue
│   │   ├── Topbar.vue
│   │   ├── StatCard.vue
│   │   ├── StatusBadge.vue
│   │   ├── StokBar.vue
│   │   └── LaporanChart.vue
│   ├── composables/         # Business logic (Vue Composables)
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useDashboard.js
│   │   ├── useProducts.js
│   │   ├── useTransactions.js
│   │   ├── useReports.js
│   │   ├── useUsers.js
│   │   └── useNotif.js
│   ├── layouts/
│   │   └── AuthLayout.vue   # Layout dengan sidebar & topbar
│   ├── mocks/               # MSW mock API (development)
│   ├── pages/               # Halaman utama
│   │   ├── LoginPage.vue
│   │   ├── BerandaPage.vue
│   │   ├── KasirPage.vue
│   │   ├── TransaksiPage.vue
│   │   ├── InventoriPage.vue
│   │   ├── LaporanPage.vue
│   │   ├── ManajemenProdukPage.vue
│   │   └── ManajemenPenggunaPage.vue
│   ├── router/              # Konfigurasi Vue Router + route guards
│   ├── utils/               # Helper & konstanta
│   │   ├── exportCsv.js     # Export transaksi ke CSV (harian/mingguan/bulanan)
│   │   ├── format.js        # Format rupiah & utilitas lain
│   │   └── icons.js         # Kumpulan ikon SVG
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env                     # Konfigurasi environment
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Cara Menjalankan

### Prasyarat

- Node.js >= 18
- npm >= 9
- Backend API berjalan (atau gunakan mode mock)

### Instalasi

```bash
# Clone repository
git clone <repo-url>
cd kasirku.v1

# Install dependencies
npm install
```

### Menjalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Build Production

```bash
npm run build
npm run preview   # Preview hasil build
```

---

## Pengembangan Selanjutnya

| Fitur                      | Prioritas | Deskripsi                                           |
| -------------------------- | --------- | --------------------------------------------------- |
| Ekspor Laporan (PDF/Excel) | Sedang    | Download laporan penjualan dalam format PDF / Excel (CSV sudah tersedia) |
| Manajemen Kategori Produk  | Sedang    | CRUD kategori produk yang dinamis                   |
| Diskon & Promo             | Sedang    | Fitur potongan harga per produk atau transaksi      |
| Multi-Outlet               | Rendah    | Dukungan beberapa cabang dalam satu akun            |
| Notifikasi Stok Otomatis   | Sedang    | Push notification saat stok mendekati batas minimum |
| Mode Offline               | Rendah    | Transaksi tetap berjalan saat koneksi terputus      |
| Barcode Scanner            | Sedang    | Input produk via scan barcode di KasirPage          |

---

<div align="center">
  <sub>Dibuat dengan Vue 3 + Vite · KasirKu v1</sub>
</div>
