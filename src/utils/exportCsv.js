import { formatRupiah } from "./format.js";

const HEADERS = ["Kode", "Tanggal", "Jam", "Metode Bayar", "Total", "Status"];

function toRow(trx) {
  return [
    trx.kode,
    trx.tanggal,
    trx.jam,
    trx.metodeBayar,
    formatRupiah(trx.total),
    trx.status,
  ];
}

function buildCsv(rows) {
  const escape = (val) => {
    const str = String(val ?? "");
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  return [HEADERS, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
}

function download(csv, filename) {
  // BOM (﻿) di awal agar Excel langsung mengenali encoding UTF-8
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sortByDateTime(a, b) {
  const keyA = `${a.tanggal}T${a.jam}`;
  const keyB = `${b.tanggal}T${b.jam}`;
  return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
}

export function exportHarian(transactions) {
  const today = new Date().toISOString().slice(0, 10);
  const sorted = transactions
    .filter((trx) => trx.tanggal === today)
    .sort(sortByDateTime);
  const csv = buildCsv(sorted.map(toRow));
  download(csv, `transaksi-harian-${today}.csv`);
}

export function exportMingguan(transactions) {
  const today = new Date();
  const day = today.getDay();
  // getDay() mengembalikan 0 untuk Minggu — kita perlakukan sebagai akhir minggu, bukan awal
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d) => d.toISOString().slice(0, 10);
  const [start, end] = [fmt(monday), fmt(sunday)];

  const sorted = transactions
    .filter((trx) => trx.tanggal >= start && trx.tanggal <= end)
    .sort(sortByDateTime);
  const csv = buildCsv(sorted.map(toRow));
  download(csv, `transaksi-mingguan-${start}_${end}.csv`);
}

export function exportBulanan(transactions) {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const sorted = transactions
    .filter((trx) => trx.tanggal.startsWith(currentMonth))
    .sort(sortByDateTime);
  const csv = buildCsv(sorted.map(toRow));
  download(csv, `transaksi-bulanan-${currentMonth}.csv`);
}
