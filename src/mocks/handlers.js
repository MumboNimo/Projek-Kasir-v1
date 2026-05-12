import { http, HttpResponse } from "msw";
import { mockUsers, mockToken, mockAdminUser } from "./data/users.js";
import * as productsData from "./data/products.js";
import * as usersData from "./data/users.js";
import * as transactionsData from "./data/transactions.js";
import { generateKode } from "./data/transactions.js";

const BASE = `${(import.meta.env.VITE_BASE_URL || "http://localhost:8000").replace(/\/$/, "")}/api`;

// ─── Helpers ────────────────────────────────────────────────────────────────

function ok(data, meta = {}) {
  return HttpResponse.json({ success: true, data, ...meta });
}

function err(message, status = 400, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return HttpResponse.json(body, { status });
}

function requireAuth(request) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;
  const token = auth.replace("Bearer ", "");
  return token === mockToken;
}

function now() {
  return new Date().toISOString();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

const authHandlers = [
  // POST /api/auth/login
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return err("Email dan password wajib diisi.", 422, {
        email: !email ? ["Email wajib diisi."] : undefined,
        password: !password ? ["Password wajib diisi."] : undefined,
      });
    }

    const user = mockUsers.find((u) => u.email === email);
    if (!user || password !== "password") {
      return err("Email atau password salah.", 401);
    }

    return ok({ token: mockToken, user });
  }),

  // POST /api/auth/logout
  http.post(`${BASE}/auth/logout`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);
    return ok(null, { message: "Berhasil logout." });
  }),

  // GET /api/auth/me
  http.get(`${BASE}/auth/me`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);
    return ok(mockAdminUser);
  }),
];

// ─── Products ────────────────────────────────────────────────────────────────

const productHandlers = [
  // GET /api/products
  http.get(`${BASE}/products`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const url = new URL(request.url);
    const kategori = url.searchParams.get("kategori");

    let list = [...productsData.mockProducts];
    if (kategori) {
      list = list.filter(
        (p) => p.kategori.toLowerCase() === kategori.toLowerCase()
      );
    }
    return ok(list);
  }),

  // POST /api/products
  http.post(`${BASE}/products`, async ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const body = await request.json();
    const { nama, harga, stok, kategori, deskripsi } = body;

    if (!nama || harga === undefined || stok === undefined || !kategori) {
      return err("Data produk tidak lengkap.", 422, {
        nama: !nama ? ["Nama produk wajib diisi."] : undefined,
        harga: harga === undefined ? ["Harga wajib diisi."] : undefined,
        stok: stok === undefined ? ["Stok wajib diisi."] : undefined,
        kategori: !kategori ? ["Kategori wajib diisi."] : undefined,
      });
    }

    const product = {
      id: Math.max(0, ...productsData.mockProducts.map((p) => p.id)) + 1,
      nama,
      harga: Number(harga),
      stok: Number(stok),
      kategori,
      deskripsi: deskripsi ?? "",
      created_at: now(),
      updated_at: now(),
    };
    productsData.mockProducts.push(product);
    return HttpResponse.json({ success: true, data: product }, { status: 201 });
  }),

  // PUT /api/products/:id
  http.put(`${BASE}/products/:id`, async ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = productsData.mockProducts.findIndex((p) => p.id === id);
    if (idx === -1) return err("Produk tidak ditemukan.", 404);

    const body = await request.json();
    productsData.mockProducts[idx] = {
      ...productsData.mockProducts[idx],
      ...body,
      id,
      updated_at: now(),
    };
    return ok(productsData.mockProducts[idx]);
  }),

  // DELETE /api/products/:id
  http.delete(`${BASE}/products/:id`, ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = productsData.mockProducts.findIndex((p) => p.id === id);
    if (idx === -1) return err("Produk tidak ditemukan.", 404);

    productsData.mockProducts.splice(idx, 1);
    return ok(null, { message: "Produk berhasil dihapus." });
  }),

  // PATCH /api/products/:id/stock
  http.patch(`${BASE}/products/:id/stock`, async ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = productsData.mockProducts.findIndex((p) => p.id === id);
    if (idx === -1) return err("Produk tidak ditemukan.", 404);

    const { jumlah } = await request.json();
    if (jumlah === undefined) return err("Jumlah wajib diisi.", 422);

    productsData.mockProducts[idx].stok += Number(jumlah);
    productsData.mockProducts[idx].updated_at = now();
    return ok(productsData.mockProducts[idx]);
  }),
];

// ─── Transactions ────────────────────────────────────────────────────────────

const transactionHandlers = [
  // GET /api/transactions
  http.get(`${BASE}/transactions`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let list = [...transactionsData.mockTransactions];
    if (status) {
      list = list.filter((t) => t.status === status);
    }
    return ok(list);
  }),

  // POST /api/transactions
  http.post(`${BASE}/transactions`, async ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const body = await request.json();
    const { items, metode_bayar, total } = body;

    if (!items || !items.length || !metode_bayar) {
      return err("Data transaksi tidak lengkap.", 422, {
        items: !items?.length ? ["Items wajib diisi."] : undefined,
        metode_bayar: !metode_bayar
          ? ["Metode bayar wajib diisi."]
          : undefined,
      });
    }

    const dateNow = new Date();
    const transaction = {
      id: Math.max(0, ...transactionsData.mockTransactions.map((t) => t.id)) + 1,
      kode: generateKode(),
      tanggal: dateNow.toISOString().slice(0, 10),
      jam: dateNow.toTimeString().slice(0, 5),
      metode_bayar,
      total: Number(total) || items.reduce((s, i) => s + i.harga * i.qty, 0),
      status: "Lunas",
      items,
      created_at: dateNow.toISOString(),
      updated_at: dateNow.toISOString(),
    };
    transactionsData.mockTransactions.push(transaction);
    return HttpResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  }),

  // PATCH /api/transactions/:id/status
  http.patch(`${BASE}/transactions/:id/status`, async ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = transactionsData.mockTransactions.findIndex((t) => t.id === id);
    if (idx === -1) return err("Transaksi tidak ditemukan.", 404);

    const { status } = await request.json();
    const valid = ["Lunas", "Pending", "Batal"];
    if (!valid.includes(status)) {
      return err(`Status tidak valid. Pilih: ${valid.join(", ")}.`, 422);
    }

    transactionsData.mockTransactions[idx].status = status;
    transactionsData.mockTransactions[idx].updated_at = now();
    return ok(transactionsData.mockTransactions[idx]);
  }),
];

// ─── Users ───────────────────────────────────────────────────────────────────

let nextUserId = 4;

const userHandlers = [
  // GET /api/users
  http.get(`${BASE}/users`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);
    return ok([...usersData.mockUsers]);
  }),

  // POST /api/users
  http.post(`${BASE}/users`, async ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return err("Data pengguna tidak lengkap.", 422, {
        name: !name ? ["Nama wajib diisi."] : undefined,
        email: !email ? ["Email wajib diisi."] : undefined,
        password: !password ? ["Password wajib diisi."] : undefined,
        role: !role ? ["Role wajib diisi."] : undefined,
      });
    }

    if (usersData.mockUsers.find((u) => u.email === email)) {
      return err("Email sudah digunakan.", 422, {
        email: ["Email sudah digunakan."],
      });
    }

    const user = {
      id: nextUserId++,
      name,
      email,
      role,
      created_at: now(),
      updated_at: now(),
    };
    usersData.mockUsers.push(user);
    return HttpResponse.json({ success: true, data: user }, { status: 201 });
  }),

  // PUT /api/users/:id
  http.put(`${BASE}/users/:id`, async ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = usersData.mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) return err("Pengguna tidak ditemukan.", 404);

    const body = await request.json();
    usersData.mockUsers[idx] = {
      ...usersData.mockUsers[idx],
      ...body,
      id,
      updated_at: now(),
    };
    return ok(usersData.mockUsers[idx]);
  }),

  // DELETE /api/users/:id
  http.delete(`${BASE}/users/:id`, ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = usersData.mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) return err("Pengguna tidak ditemukan.", 404);

    usersData.mockUsers.splice(idx, 1);
    return ok(null, { message: "Pengguna berhasil dihapus." });
  }),

  // PATCH /api/users/:id/password
  http.patch(`${BASE}/users/:id/password`, async ({ params, request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const id = Number(params.id);
    const idx = usersData.mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) return err("Pengguna tidak ditemukan.", 404);

    const { password } = await request.json();
    if (!password || password.length < 6) {
      return err("Password minimal 6 karakter.", 422, {
        password: ["Password minimal 6 karakter."],
      });
    }

    usersData.mockUsers[idx].updated_at = now();
    return ok(null, { message: "Password berhasil diubah." });
  }),
];

// ─── Dashboard ───────────────────────────────────────────────────────────────

const dashboardHandlers = [
  // GET /api/dashboard/stats
  http.get(`${BASE}/dashboard/stats`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const lunas = transactionsData.mockTransactions.filter(
      (t) => t.status === "Lunas"
    );
    const totalPendapatan = lunas.reduce((s, t) => s + t.total, 0);

    return ok({
      total_pendapatan: totalPendapatan,
      jumlah_transaksi: transactionsData.mockTransactions.length,
      jumlah_produk: productsData.mockProducts.length,
      stok_menipis: productsData.mockProducts.filter((p) => p.stok <= 5)
        .length,
    });
  }),

  // GET /api/dashboard/recent-transactions
  http.get(`${BASE}/dashboard/recent-transactions`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const recent = [...transactionsData.mockTransactions]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    return ok(recent);
  }),

  // GET /api/dashboard/low-stock
  http.get(`${BASE}/dashboard/low-stock`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const low = productsData.mockProducts.filter((p) => p.stok <= 5);
    return ok(low);
  }),
];

// ─── Reports ─────────────────────────────────────────────────────────────────

const reportHandlers = [
  // GET /api/reports/summary
  http.get(`${BASE}/reports/summary`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const all = transactionsData.mockTransactions;
    const lunas = all.filter((t) => t.status === "Lunas");
    const pending = all.filter((t) => t.status === "Pending");
    const totalPendapatan = lunas.reduce((s, t) => s + t.total, 0);
    const rataRata = lunas.length ? Math.round(totalPendapatan / lunas.length) : 0;

    return ok({
      total_pendapatan: totalPendapatan,
      total_transaksi: all.length,
      jumlah_lunas: lunas.length,
      jumlah_pending: pending.length,
      rata_rata: rataRata,
    });
  }),

  // GET /api/reports/by-payment
  http.get(`${BASE}/reports/by-payment`, ({ request }) => {
    if (!requireAuth(request)) return err("Unauthenticated.", 401);

    const lunas = transactionsData.mockTransactions.filter(
      (t) => t.status === "Lunas"
    );
    const grouped = {};
    for (const t of lunas) {
      if (!grouped[t.metode_bayar]) {
        grouped[t.metode_bayar] = { metode_bayar: t.metode_bayar, jumlah: 0, total: 0 };
      }
      grouped[t.metode_bayar].jumlah += 1;
      grouped[t.metode_bayar].total += t.total;
    }
    return ok(Object.values(grouped));
  }),
];

// ─── Export all handlers ─────────────────────────────────────────────────────

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...transactionHandlers,
  ...userHandlers,
  ...dashboardHandlers,
  ...reportHandlers,
];
