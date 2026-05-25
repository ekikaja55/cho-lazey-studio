/**
 * mockHistory.js
 * Cho's Studio — Prototype Order & Commission History Database
 * Menyimpan data riwayat transaksi client untuk keperluan prototype dashboard
 */

export const MOCK_HISTORY = [
  {
    order_id: "ORD-2026-001",
    user_id: 2, // Client One
    title: "Sunset Over The Harbor",
    price: 75000, // Sesuai gallery_id: 1
    pathImage: "/gallery/1.jpg",
    typeCommis: "adoption",
    revision_note: null, // Hanya untuk commission
    deadlineDate: null, // Hanya untuk commission
    paymentDate: "2026-05-01T10:15:00Z",
    completeDate: "2026-05-03T16:00:00Z", // Diisi karena status completed
    statusOrder: "completed", // ['placed', 'processing', 'delivered', 'cancelled', 'completed']
    statusPayment: "paid", // ['pending', 'invalid', 'paid', 'refunded']
  },
  {
    order_id: "ORD-2026-002",
    user_id: 2, // Client One
    title: "Custom Character Illustration",
    price: 110000, // Menggunakan nominal setara gallery_id: 2
    pathImage: "/gallery/2.jpg",
    typeCommis: "commission",
    revision_note:
      "Tolong perbaiki bagian saturasi warna background agar lebih warm.",
    deadlineDate: "2026-06-15T23:59:59Z",
    paymentDate: "2026-05-10T14:20:00Z",
    completeDate: null, // Belum delivered/completed
    statusOrder: "revision", // ['pending', 'accepted', 'declined', 'sketching', 'coloring', 'review', 'revision', 'completed', 'cancelled']
    statusPayment: "dp", // ['pending', 'dp', 'paid', 'refunded']
  },
  {
    order_id: "ORD-2026-003",
    user_id: 3, // Client Two
    title: "Abstract Color Study",
    price: 120000, // Sesuai gallery_id: 5
    pathImage: "/gallery/5.jpg",
    typeCommis: "adoption",
    revision_note: null,
    deadlineDate: null,
    paymentDate: "2026-05-12T09:00:00Z",
    completeDate: "2026-05-14T11:30:00Z",
    statusOrder: "delivered",
    statusPayment: "paid",
  },
  {
    order_id: "ORD-2026-004",
    user_id: 3, // Client Two
    title: "Chibi Style Group Art",
    price: 60000, // Menggunakan nominal setara gallery_id: 4
    pathImage: "/gallery/4.jpeg",
    typeCommis: "commission",
    revision_note: null, // Belum ada revisi masuk
    deadlineDate: "2026-06-01T18:00:00Z",
    paymentDate: "2026-05-15T19:45:00Z",
    completeDate: null,
    statusOrder: "coloring",
    statusPayment: "paid",
  },
  {
    order_id: "ORD-2026-005",
    user_id: 2, // Client One
    title: "Coastal Cliffs Print",
    price: 110000, // Sesuai gallery_id: 2
    pathImage: "/gallery/5.jpg",
    typeCommis: "adoption",
    revision_note: null,
    deadlineDate: null,
    paymentDate: null, // Belum bayar
    completeDate: null,
    statusOrder: "cancelled",
    statusPayment: "invalid",
  },
  {
    order_id: "ORD-2026-006",
    user_id: 3, // Client Two
    title: "Cyberpunk Street Commission",
    price: 115000, // Menggunakan nominal setara gallery_id: 3
    pathImage: "/gallery/3.jpg",
    typeCommis: "commission",
    revision_note: null,
    deadlineDate: "2026-07-10T23:59:59Z",
    paymentDate: null,
    completeDate: null,
    statusOrder: "pending",
    statusPayment: "pending",
  },
];

/**
 * Helper: Ambil riwayat transaksi berdasarkan ID User tertentu
 * @param {number} userId
 * @returns {typeof MOCK_HISTORY}
 */
export function getHistoryByUserId(userId) {
  return MOCK_HISTORY.filter((item) => item.user_id === userId);
}

/**
 * Helper: Ambil seluruh riwayat untuk dashboard Artist (Cho)
 * @returns {typeof MOCK_HISTORY}
 */
export function getAllHistory() {
  return MOCK_HISTORY;
}
