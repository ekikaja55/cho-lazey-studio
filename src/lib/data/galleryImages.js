/**
 * galleryImages.js
 * Cho's Studio — Mock Gallery Data
 * Mirrors the `gallery` table schema from Laravel
 */

/** @typedef {'not_sold'|'available'|'reserved'|'sold'|'archived'} GalleryStatus */

/**
 * @typedef {Object} GalleryImage
 * @property {number}        gallery_id
 * @property {string}        title
 * @property {string|null}   description
 * @property {string}        image_url
 * @property {string}        file_format
 * @property {GalleryStatus} status
 * @property {number|null}   price
 * @property {string}        created_at
 * @property {string}        updated_at
 * @property {null}          deleted_at
 */

/** @type {GalleryImage[]} */
export const galleryImages = [
  {
    gallery_id: 1,
    title: "Sunset Over The Harbor",
    description:
      "Warm tones of a late-afternoon sun reflecting on calm waters. Framed and ready for exhibition.",
    image_url: "/gallery/1.jpg",
    file_format: "JPG",
    status: "available",
    price: 75000,
    created_at: "2024-11-01T08:00:00Z",
    updated_at: "2024-11-01T08:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 2,
    title: "Coastal Cliffs",
    description: "Dramatic coastline captured with wide-angle perspective.",
    image_url: "/gallery/2.jpg",
    file_format: "JPG",
    status: "available",
    price: 110000,
    created_at: "2024-11-03T09:00:00Z",
    updated_at: "2024-11-03T09:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 3,
    title: "Cityscape at Dusk",
    description: "Skyline silhouette against a colorful sunset sky.",
    image_url: "/gallery/3.jpg",
    file_format: "JPG",
    status: "available",
    price: 115000,
    created_at: "2024-11-05T10:00:00Z",
    updated_at: "2024-11-05T10:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 4,
    title: "Floral Explosion",
    description: "Vibrant bouquet captured with high saturation and contrast.",
    image_url: "/gallery/4.jpeg",
    file_format: "JPEG",
    status: "available",
    price: 60000,
    created_at: "2024-11-07T11:00:00Z",
    updated_at: "2024-11-07T11:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 5,
    title: "Abstract Color Study",
    description:
      "Bold brush strokes and layered textures exploring motion and depth.",
    image_url: "/gallery/5.jpg",
    file_format: "JPG",
    status: "sold",
    price: 120000,
    created_at: "2024-11-09T12:00:00Z",
    updated_at: "2024-11-09T12:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 6,
    title: "Portrait: Quiet Gaze",
    description:
      "A tight portrait study capturing subtle emotion and light across the face.",
    image_url: "/gallery/6.jpg",
    file_format: "JPG",
    status: "sold",
    price: 95000,
    created_at: "2024-11-11T13:00:00Z",
    updated_at: "2024-11-11T13:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 7,
    title: "Industrial Geometry",
    description:
      "High-contrast study of shapes and steel; minimal color palette.",
    image_url: "/gallery/7.jpg",
    file_format: "JPG",
    status: "reserved",
    price: 65000,
    created_at: "2024-11-13T14:00:00Z",
    updated_at: "2024-11-13T14:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 8,
    title: "Forest Morning",
    description:
      "Mist between trees with soft green highlights—a calming landscape piece.",
    image_url: "/gallery/8.jpeg",
    file_format: "JPEG",
    status: "reserved",
    price: 88000,
    created_at: "2024-11-15T08:30:00Z",
    updated_at: "2024-11-15T08:30:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 9,
    title: "Vintage Architecture",
    description: "Study of old facades and ornate details in natural light.",
    image_url: "/gallery/9.jpeg",
    file_format: "JPEG",
    status: "sold",
    price: 70000,
    created_at: "2024-11-17T09:00:00Z",
    updated_at: "2024-11-17T09:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 10,
    title: "Macro: Dew on Petal",
    description:
      "Close-up study of texture and color with shallow depth of field.",
    image_url: "/gallery/10.jpg",
    file_format: "JPG",
    status: "not_sold",
    price: 45000,
    created_at: "2024-11-19T10:00:00Z",
    updated_at: "2024-11-19T10:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 11,
    title: "Night Traffic Trails",
    description: "Long exposure capturing movement and urban rhythm.",
    image_url: "/gallery/11.jpg",
    file_format: "JPG",
    status: "not_sold",
    price: 98000,
    created_at: "2024-11-21T11:00:00Z",
    updated_at: "2024-11-21T11:00:00Z",
    deleted_at: null,
  },
  {
    gallery_id: 12,
    title: "Minimal Still Life",
    description:
      "Soft light, careful composition, and muted tones for a refined result.",
    image_url: "/gallery/12.jpg",
    file_format: "JPG",
    status: "not_sold",
    price: 53000,
    created_at: "2024-11-23T12:00:00Z",
    updated_at: "2024-11-23T12:00:00Z",
    deleted_at: null,
  },
];

/**
 * Helper: ambil N items pertama yang tidak archived
 * @param {number} n
 * @returns {GalleryImage[]}
 */
export function getRecentWorks(n = 6) {
  return galleryImages.filter((img) => img.status !== "archived").slice(0, n);
}

/**
 * Helper: format harga ke Rupiah
 * @param {number|null} price
 * @returns {string}
 */
export function formatRupiah(price) {
  if (price == null) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
