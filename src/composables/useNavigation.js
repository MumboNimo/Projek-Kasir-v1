import { ref } from "vue";

export const currentPage = ref("beranda");
export const navigateTo = (pageName) => {
  currentPage.value = pageName;
};

export const menuItems = [
  { id: "beranda", nama: "Beranda", ikon: "🏠" },
  { id: "transaksi", nama: "Transaksi", ikon: "🧾" },
  { id: "inventori", nama: "Inventori", ikon: "📦" },
  { id: "laporan", nama: "Laporan", ikon: "📊" },
];
