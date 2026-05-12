export let mockTransactions = [
  {
    id: 1,
    kode: "TRX-20240510-001",
    tanggal: "2024-05-10",
    jam: "09:15",
    metode_bayar: "Tunai",
    total: 50000,
    status: "Lunas",
    items: [
      { product_id: 1, nama: "Nasi Goreng Spesial", harga: 25000, qty: 2 },
    ],
    created_at: "2024-05-10T09:15:00.000Z",
    updated_at: "2024-05-10T09:15:00.000Z",
  },
  {
    id: 2,
    kode: "TRX-20240510-002",
    tanggal: "2024-05-10",
    jam: "10:30",
    metode_bayar: "QRIS",
    total: 32000,
    status: "Lunas",
    items: [
      { product_id: 2, nama: "Mie Ayam Bakso", harga: 20000, qty: 1 },
      { product_id: 4, nama: "Jus Jeruk", harga: 12000, qty: 1 },
    ],
    created_at: "2024-05-10T10:30:00.000Z",
    updated_at: "2024-05-10T10:30:00.000Z",
  },
  {
    id: 3,
    kode: "TRX-20240510-003",
    tanggal: "2024-05-10",
    jam: "11:45",
    metode_bayar: "Transfer",
    total: 30000,
    status: "Pending",
    items: [
      { product_id: 5, nama: "Sate Ayam", harga: 30000, qty: 1 },
    ],
    created_at: "2024-05-10T11:45:00.000Z",
    updated_at: "2024-05-10T11:45:00.000Z",
  },
  {
    id: 4,
    kode: "TRX-20240511-001",
    tanggal: "2024-05-11",
    jam: "08:00",
    metode_bayar: "Tunai",
    total: 15000,
    status: "Lunas",
    items: [
      { product_id: 3, nama: "Es Teh Manis", harga: 5000, qty: 1 },
      { product_id: 6, nama: "Air Mineral", harga: 3000, qty: 1 },
      { product_id: 2, nama: "Mie Ayam Bakso", harga: 20000, qty: 0 },
    ],
    created_at: "2024-05-11T08:00:00.000Z",
    updated_at: "2024-05-11T08:00:00.000Z",
  },
  {
    id: 5,
    kode: "TRX-20240512-001",
    tanggal: "2024-05-12",
    jam: "07:30",
    metode_bayar: "QRIS",
    total: 45000,
    status: "Batal",
    items: [
      { product_id: 1, nama: "Nasi Goreng Spesial", harga: 25000, qty: 1 },
      { product_id: 4, nama: "Jus Jeruk", harga: 12000, qty: 1 },
    ],
    created_at: "2024-05-12T07:30:00.000Z",
    updated_at: "2024-05-12T07:30:00.000Z",
  },
];

export function generateKode() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const count = mockTransactions.filter((t) =>
    t.kode.includes(date)
  ).length + 1;
  return `TRX-${date}-${String(count).padStart(3, "0")}`;
}
