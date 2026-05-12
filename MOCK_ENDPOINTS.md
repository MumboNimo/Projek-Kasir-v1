# Mock API Endpoints (MSW)

Base URL (real): `http://localhost:8000/api`  
Semua endpoint dicegat oleh MSW saat `VITE_MOCK_API=true`.

> **Login default**: email `admin@kasirku.com` · password `password`  
> Token mock: `mock-bearer-token-dev-12345`

---

## Auth

### POST /api/auth/login
```json
// Request
{ "email": "admin@kasirku.com", "password": "password" }

// Response 200
{
  "success": true,
  "data": {
    "token": "mock-bearer-token-dev-12345",
    "user": { "id": 1, "name": "Admin Utama", "email": "admin@kasirku.com", "role": "admin" }
  }
}

// Response 401 (salah kredensial)
{ "success": false, "message": "Email atau password salah." }

// Response 422 (field kosong)
{ "success": false, "message": "Email dan password wajib diisi.", "errors": { "email": ["Email wajib diisi."] } }
```

### POST /api/auth/logout
```
Header: Authorization: Bearer <token>

// Response 200
{ "success": true, "data": null, "message": "Berhasil logout." }
```

### GET /api/auth/me
```
Header: Authorization: Bearer <token>

// Response 200
{ "success": true, "data": { "id": 1, "name": "Admin Utama", "email": "admin@kasirku.com", "role": "admin" } }

// Response 401
{ "success": false, "message": "Unauthenticated." }
```

---

## Products

### GET /api/products
```
Header: Authorization: Bearer <token>
Query: ?kategori=Makanan  (opsional)

// Response 200
{
  "success": true,
  "data": [
    { "id": 1, "nama": "Nasi Goreng Spesial", "harga": 25000, "stok": 50, "kategori": "Makanan", "deskripsi": "..." }
  ]
}
```

### POST /api/products
```json
// Request
{ "nama": "Ayam Bakar", "harga": 28000, "stok": 20, "kategori": "Makanan", "deskripsi": "Ayam bakar bumbu kecap" }

// Response 201
{ "success": true, "data": { "id": 7, "nama": "Ayam Bakar", ... } }

// Response 422
{ "success": false, "message": "Data produk tidak lengkap.", "errors": { "nama": ["Nama produk wajib diisi."] } }
```

### PUT /api/products/:id
```json
// Request
{ "nama": "Nasi Goreng Komplit", "harga": 27000, "stok": 45, "kategori": "Makanan" }

// Response 200
{ "success": true, "data": { "id": 1, "nama": "Nasi Goreng Komplit", ... } }

// Response 404
{ "success": false, "message": "Produk tidak ditemukan." }
```

### DELETE /api/products/:id
```
// Response 200
{ "success": true, "data": null, "message": "Produk berhasil dihapus." }

// Response 404
{ "success": false, "message": "Produk tidak ditemukan." }
```

### PATCH /api/products/:id/stock
```json
// Request — jumlah positif = tambah, negatif = kurangi
{ "jumlah": 10 }

// Response 200
{ "success": true, "data": { "id": 1, "stok": 60, ... } }
```

---

## Transactions

### GET /api/transactions
```
Query: ?status=Lunas  (opsional — Lunas | Pending | Batal)

// Response 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode": "TRX-20240510-001",
      "tanggal": "2024-05-10",
      "jam": "09:15",
      "metode_bayar": "Tunai",
      "total": 50000,
      "status": "Lunas",
      "items": [{ "product_id": 1, "nama": "Nasi Goreng Spesial", "harga": 25000, "qty": 2 }]
    }
  ]
}
```

### POST /api/transactions
```json
// Request
{
  "metode_bayar": "Tunai",
  "total": 50000,
  "items": [
    { "product_id": 1, "nama": "Nasi Goreng Spesial", "harga": 25000, "qty": 2 }
  ]
}

// Response 201
{ "success": true, "data": { "id": 6, "kode": "TRX-20240512-002", "status": "Lunas", ... } }

// Response 422
{ "success": false, "message": "Data transaksi tidak lengkap.", "errors": { "items": ["Items wajib diisi."] } }
```

### PATCH /api/transactions/:id/status
```json
// Request
{ "status": "Batal" }

// Response 200
{ "success": true, "data": { "id": 3, "status": "Batal", ... } }

// Response 422 (status tidak valid)
{ "success": false, "message": "Status tidak valid. Pilih: Lunas, Pending, Batal." }
```

---

## Users

### GET /api/users
```
// Response 200
{
  "success": true,
  "data": [
    { "id": 1, "name": "Admin Utama", "email": "admin@kasirku.com", "role": "admin" },
    { "id": 2, "name": "Budi Santoso", "email": "budi@kasirku.com", "role": "kasir" }
  ]
}
```

### POST /api/users
```json
// Request
{ "name": "Dewi Lestari", "email": "dewi@kasirku.com", "password": "password", "role": "kasir" }

// Response 201
{ "success": true, "data": { "id": 4, "name": "Dewi Lestari", ... } }

// Response 422 (email duplikat)
{ "success": false, "message": "Email sudah digunakan.", "errors": { "email": ["Email sudah digunakan."] } }
```

### PUT /api/users/:id
```json
// Request
{ "name": "Budi Santoso Updated", "role": "admin" }

// Response 200
{ "success": true, "data": { "id": 2, "name": "Budi Santoso Updated", ... } }
```

### DELETE /api/users/:id
```
// Response 200
{ "success": true, "data": null, "message": "Pengguna berhasil dihapus." }

// Response 404
{ "success": false, "message": "Pengguna tidak ditemukan." }
```

### PATCH /api/users/:id/password
```json
// Request
{ "password": "newpassword123" }

// Response 200
{ "success": true, "data": null, "message": "Password berhasil diubah." }

// Response 422 (terlalu pendek)
{ "success": false, "message": "Password minimal 6 karakter.", "errors": { "password": ["Password minimal 6 karakter."] } }
```

---

## Dashboard

### GET /api/dashboard/stats
```
// Response 200
{
  "success": true,
  "data": {
    "total_pendapatan": 97000,
    "jumlah_transaksi": 5,
    "jumlah_produk": 6,
    "stok_menipis": 2
  }
}
```

### GET /api/dashboard/recent-transactions
```
// Response 200 — 5 transaksi terbaru
{ "success": true, "data": [ ...transaksi... ] }
```

### GET /api/dashboard/low-stock
```
// Response 200 — produk dengan stok ≤ 5
{ "success": true, "data": [ { "id": 3, "nama": "Es Teh Manis", "stok": 3, ... } ] }
```

---

## Reports

### GET /api/reports/summary
```
// Response 200
{
  "success": true,
  "data": {
    "total_pendapatan": 97000,
    "total_transaksi": 5,
    "jumlah_lunas": 3,
    "jumlah_pending": 1,
    "rata_rata": 32333
  }
}
```

### GET /api/reports/by-payment
```
// Response 200
{
  "success": true,
  "data": [
    { "metode_bayar": "Tunai", "jumlah": 2, "total": 65000 },
    { "metode_bayar": "QRIS", "jumlah": 1, "total": 32000 }
  ]
}
```

---

## Error Responses Umum

| Status | Kondisi |
|--------|---------|
| 401    | Token tidak ada atau tidak valid |
| 404    | Resource tidak ditemukan |
| 422    | Validasi gagal (field kosong / tidak valid) |

---

## Catatan

- Data mock bersifat **in-memory** — reset setiap kali halaman di-refresh.
- Semua response mengikuti pola Laravel: `{ success, data, message?, errors? }`.
- Key otomatis dikonversi `snake_case → camelCase` oleh interceptor di `useApi.js`.
- MSW hanya aktif saat `VITE_MOCK_API=true` (default di `.env.development`).
