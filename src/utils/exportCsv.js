import api from "../composables/useApi.js";

/**
 * Download a transaction export from the backend.
 * @param {'harian'|'mingguan'|'bulanan'|'semua'} period
 * @param {'csv'|'xlsx'} format
 */
export async function downloadReport(period, format) {
  const res = await api.get("/reports/export", {
    params: { period, format },
    responseType: "blob",
  });

  // Extract filename from Content-Disposition header if present
  const disposition = res.headers["content-disposition"] ?? "";
  const match = disposition.match(/filename="?([^";\r\n]+)"?/);
  const filename = match ? match[1] : `transaksi-${period}.${format}`;

  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
