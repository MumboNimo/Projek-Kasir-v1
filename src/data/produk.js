import { reactive } from "vue";

export const produk = reactive([
  {
    id: "PRD-001",
    nama: "Kopi Arabica 250g",
    kategori: "Minuman",
    harga: 45000,
    stok: 2,
    maxStok: 50,
  },
  {
    id: "PRD-002",
    nama: "Gula Pasir 1kg",
    kategori: "Sembako",
    harga: 18000,
    stok: 8,
    maxStok: 40,
  },
  {
    id: "PRD-003",
    nama: "Susu UHT 1L",
    kategori: "Minuman",
    harga: 22000,
    stok: 5,
    maxStok: 30,
  },
  {
    id: "PRD-004",
    nama: "Teh Celup Premium",
    kategori: "Minuman",
    harga: 15000,
    stok: 12,
    maxStok: 60,
  },
  {
    id: "PRD-005",
    nama: "Roti Tawar",
    kategori: "Makanan",
    harga: 12000,
    stok: 3,
    maxStok: 25,
  },
  {
    id: "PRD-006",
    nama: "Mie Instan",
    kategori: "Makanan",
    harga: 3500,
    stok: 80,
    maxStok: 100,
  },
  {
    id: "PRD-007",
    nama: "Air Mineral 600ml",
    kategori: "Minuman",
    harga: 4000,
    stok: 150,
    maxStok: 200,
  },
  {
    id: "PRD-008",
    nama: "Sabun Mandi",
    kategori: "Kebersihan",
    harga: 8500,
    stok: 45,
    maxStok: 60,
  },
]);

export const kategoriList = [
  "Minuman",
  "Makanan",
  "Sembako",
  "Kebersihan",
  "Lainnya",
];
