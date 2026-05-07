import { reactive } from "vue";

export const transaksi = reactive([
  {
    id: "TRX-001",
    items: [
      { produkId: "PRD-001", qty: 2 },
      { produkId: "PRD-007", qty: 5 },
    ],
    total: 110000,
    tanggal: "2026-05-03",
    jam: "08:15",
    status: "Lunas",
    metodeBayar: "Cash",
  },
  {
    id: "TRX-002",
    items: [
      { produkId: "PRD-005", qty: 3 },
      { produkId: "PRD-003", qty: 2 },
    ],
    total: 80000,
    tanggal: "2026-05-03",
    jam: "09:32",
    status: "Pending",
    metodeBayar: "Transfer",
  },
  {
    id: "TRX-003",
    items: [{ produkId: "PRD-006", qty: 10 }],
    total: 35000,
    tanggal: "2026-05-03",
    jam: "10:45",
    status: "Lunas",
    metodeBayar: "QRIS",
  },
  {
    id: "TRX-004",
    items: [{ produkId: "PRD-004", qty: 1 }],
    total: 15000,
    tanggal: "2026-05-02",
    jam: "14:20",
    status: "Lunas",
    metodeBayar: "Cash",
  },
  {
    id: "TRX-005",
    items: [{ produkId: "PRD-001", qty: 4 }],
    total: 180000,
    tanggal: "2026-05-02",
    jam: "15:10",
    status: "Pending",
    metodeBayar: "Transfer",
  },
  {
    id: "TRX-006",
    items: [{ produkId: "PRD-002", qty: 5 }],
    total: 90000,
    tanggal: "2026-05-01",
    jam: "16:45",
    status: "Lunas",
    metodeBayar: "Debit",
  },
  {
    id: "TRX-007",
    items: [{ produkId: "PRD-008", qty: 5 }],
    total: 42500,
    tanggal: "2026-05-01",
    jam: "11:00",
    status: "Lunas",
    metodeBayar: "Cash",
  },
]);

export const formatRupiah = (angka) =>
  "Rp " + Number(angka).toLocaleString("id-ID");

// Semua transaksi diurutkan dari terbaru
export const getAllTrx = () =>
  [...transaksi].sort(
    (a, b) =>
      new Date(`${b.tanggal} ${b.jam}`) - new Date(`${a.tanggal} ${a.jam}`),
  );

// Transaksi terbaru
export const getTrxTerbaru = (n = 5) => getAllTrx().slice(0, n);

// Total pendapatan dari transaksi Lunas
export const getTotalPendapatan = () =>
  transaksi
    .filter((t) => t.status === "Lunas")
    .reduce((s, t) => s + t.total, 0);
