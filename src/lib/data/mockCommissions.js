/**
 * mockCommissions.js
 * Cho's Studio — Mock Commissions Data
 */

/** * @typedef {'pending'|'accepted'|'declined'|'in_progress_sketch'|'in_progress_coloring'|'review'|'revision'|'completed'|'cancelled'} CommissionStatus
 * @typedef {'pending'|'dp'|'paid'|'refunded'} PaymentStatus
 * * @typedef {Object} CommissionItem
 * @property {string} id
 * @property {Object} customer
 * @property {string} customer.name
 * @property {string} customer.email
 * @property {string} category
 * @property {string} details
 * @property {number} price
 * @property {string} orderDate
 * @property {string} dueDate
 * @property {CommissionStatus} status
 * @property {PaymentStatus} paymentStatus
 * @property {string} image_url
 */

/** @type {CommissionItem[]} */
export const commissions = [
  {
    id: "COM-2026-001",
    customer: { name: "Aria Wijaya", email: "aria.wijaya@outlook.com" },
    category: "halfbody",
    details:
      "Commission of my VTuber model concept. A demon girl with asymmetrical wings holding a crystal staff.",
    price: 149000,
    orderDate: "2026-05-22",
    dueDate: "2026-07-09",
    status: "review",
    paymentStatus: "dp",
    image_url: "/gallery/1.jpg",
  },
  {
    id: "COM-2026-002",
    customer: { name: "Bintang Ramadhan", email: "bintang.ram@gmail.com" },
    category: "headshot",
    details:
      "Portrait for my gaming clan logo. My character has a cyberpunk visor and neon green highlights.",
    price: 45000,
    orderDate: "2026-05-07",
    dueDate: "2026-07-18",
    status: "revision",
    paymentStatus: "dp",
    image_url: "/gallery/2.jpg",
  },
  {
    id: "COM-2026-003",
    customer: { name: "Chandra Kirana", email: "chandra.k@yahoo.com" },
    category: "headshot",
    details:
      "Character illustration for my game development project. A quiet elf observing the surroundings.",
    price: 125000,
    orderDate: "2026-05-02",
    dueDate: "2026-07-04",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/3.jpg",
  },
  {
    id: "COM-2026-004",
    customer: { name: "Dian Saputra", email: "dian.saputra@protonmail.com" },
    category: "cartoon_fullbody",
    details:
      "Character art for my webcomic protagonist. She's a vibrant baker who wields giant rolling pins.",
    price: 55000,
    orderDate: "2026-04-29",
    dueDate: "2026-08-23",
    status: "in_progress_sketch",
    paymentStatus: "dp",
    image_url: "/gallery/4.jpeg",
  },
  {
    id: "COM-2026-005",
    customer: { name: "Eka Lestari", email: "eka.lestari99@gmail.com" },
    category: "halfbody",
    details:
      "Need artwork of my Honkai Star Rail OC. She's an erudition character manipulating cosmic cards.",
    price: 188000,
    orderDate: "2026-04-29",
    dueDate: "2026-06-29",
    status: "in_progress_coloring",
    paymentStatus: "dp",
    image_url: "/gallery/5.jpg",
  },
  {
    id: "COM-2026-006",
    customer: { name: "Fadel Muhammad", email: "fadel.muh@live.com" },
    category: "headshot",
    details:
      "Need a portrait of my Valorant-inspired OC. She has mechanical eyes and a sharp street-style undercut.",
    price: 45000,
    orderDate: "2026-04-29",
    dueDate: "2026-06-17",
    status: "review",
    paymentStatus: "dp",
    image_url: "/gallery/7.jpg",
  },
  {
    id: "COM-2026-007",
    customer: { name: "Gita Permata", email: "gita.permata@windowslive.com" },
    category: "cartoon_fullbody",
    details:
      "Commission for my story character - a knight with floral-themed armor and a glowing shield.",
    price: 65000,
    orderDate: "2026-04-26",
    dueDate: "2026-06-29",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/8.jpeg",
  },
  {
    id: "COM-2026-008",
    customer: { name: "Hendra Wijaya", email: "hendra.w@gmail.com" },
    category: "headshot",
    details:
      "Want an artwork of my furry OC - a wolf with silver fur and traditional tribal markings on the cheek.",
    price: 79000,
    orderDate: "2026-04-25",
    dueDate: "2026-07-27",
    status: "in_progress_sketch",
    paymentStatus: "dp",
    image_url: "/gallery/9.jpeg",
  },
  {
    id: "COM-2026-009",
    customer: { name: "Indah Cahyani", email: "indah.cahyani@icloud.com" },
    category: "fullbody",
    details:
      "Retro pop art illustration of an astronaut playing an electric guitar floating in deep purple nebula.",
    price: 210000,
    orderDate: "2026-04-20",
    dueDate: "2026-06-15",
    status: "accepted",
    paymentStatus: "dp",
    image_url: "/gallery/10.jpg",
  },
  {
    id: "COM-2026-010",
    customer: { name: "Joko Susilo", email: "joko.susilo@gmail.com" },
    category: "chibi",
    details:
      "Cute chibi illustration of two cats sharing a single bowl of ramen, bright colors.",
    price: 35000,
    orderDate: "2026-04-18",
    dueDate: "2026-05-10",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/11.jpg",
  },
  {
    id: "COM-2026-011",
    customer: { name: "Kevin Sanjaya", email: "kevin.sj@outlook.com" },
    category: "fullbody",
    details:
      "Dark fantasy necromancer character sitting on a bone throne surrounded by green ethereal flames.",
    price: 195000,
    orderDate: "2026-04-15",
    dueDate: "2026-06-10",
    status: "cancelled",
    paymentStatus: "refunded",
    image_url: "/gallery/12.jpg",
  },
  {
    id: "COM-2026-012",
    customer: { name: "Larasati Putri", email: "laras.putri@gmail.com" },
    category: "halfbody",
    details:
      "Modern witch brewing coffee in a magical modern kitchen setup, soft morning lighting.",
    price: 135000,
    orderDate: "2026-04-12",
    dueDate: "2026-05-28",
    status: "declined",
    paymentStatus: "refunded",
    image_url: "/gallery/1.jpg",
  },
  {
    id: "COM-2026-013",
    customer: { name: "Muhammad Rizky", email: "rizky.m@gmail.com" },
    category: "headshot",
    details:
      "Steam-punk engineer with dynamic brass goggles and metallic smoke effects around him.",
    price: 50000,
    orderDate: "2026-04-10",
    dueDate: "2026-05-25",
    status: "pending",
    paymentStatus: "pending",
    image_url: "/gallery/2.jpg",
  },
  {
    id: "COM-2026-014",
    customer: { name: "Nadia Utami", email: "nadia.utami@protonmail.com" },
    category: "halfbody",
    details:
      "Magical girl transformation sequence scene, lots of sparkles and a pink celestial background.",
    price: 160000,
    orderDate: "2026-04-08",
    dueDate: "2026-05-20",
    status: "in_progress_coloring",
    paymentStatus: "dp",
    image_url: "/gallery/3.jpg",
  },
  {
    id: "COM-2026-015",
    customer: { name: "Oki Setiawan", email: "oki.setiawan@yahoo.com" },
    category: "cartoon_fullbody",
    details:
      "Stylized street wear dynamic pose of a skater holding a board with graffiti patterns.",
    price: 70000,
    orderDate: "2026-04-05",
    dueDate: "2026-05-18",
    status: "review",
    paymentStatus: "dp",
    image_url: "/gallery/4.jpeg",
  },
  {
    id: "COM-2026-016",
    customer: { name: "Putu Gede", email: "putu.gede@gmail.com" },
    category: "headshot",
    details:
      "Traditional Balinese dancer mask overlayed with modern neon vaporwave aesthetics.",
    price: 60000,
    orderDate: "2026-04-01",
    dueDate: "2026-05-15",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/5.jpg",
  },
  {
    id: "COM-2026-017",
    customer: { name: "Qonita Salsabila", email: "qonita.salsa@gmail.com" },
    category: "chibi",
    details:
      "Chibi character eating a massive match ice cream cone, ultra pastel tone palette.",
    price: 40000,
    orderDate: "2026-03-29",
    dueDate: "2026-04-20",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/7.jpg",
  },
  {
    id: "COM-2026-018",
    customer: { name: "Rian Hidayat", email: "rian.hidayat@outlook.com" },
    category: "fullbody",
    details:
      "Mecha samurai slicing through an ancient temple gateway, highly detailed plating and wire highlights.",
    price: 250000,
    orderDate: "2026-03-25",
    dueDate: "2026-05-10",
    status: "in_progress_sketch",
    paymentStatus: "dp",
    image_url: "/gallery/8.jpeg",
  },
  {
    id: "COM-2026-019",
    customer: { name: "Siti Aminah", email: "siti.aminah@gmail.com" },
    category: "halfbody",
    details:
      "Lo-Fi study environment aesthetic. A student coding near a rainy window at night.",
    price: 120000,
    orderDate: "2026-03-22",
    dueDate: "2026-04-30",
    status: "revision",
    paymentStatus: "dp",
    image_url: "/gallery/9.jpeg",
  },
  {
    id: "COM-2026-020",
    customer: { name: "Taufik Hidayat", email: "taufik.h@gmail.com" },
    category: "headshot",
    details:
      "Profile picture vector style of a chef holding a knife with a fiery background ring.",
    price: 45000,
    orderDate: "2026-03-18",
    dueDate: "2026-04-10",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/10.jpg",
  },
  {
    id: "COM-2026-021",
    customer: { name: "Utami Dewi", email: "utami.dewi@yahoo.com" },
    category: "cartoon_fullbody",
    details:
      "Fantasy explorer with a giant backpack examining glowing blue mushrooms inside a cave.",
    price: 85000,
    orderDate: "2026-03-15",
    dueDate: "2026-04-28",
    status: "in_progress_coloring",
    paymentStatus: "dp",
    image_url: "/gallery/11.jpg",
  },
  {
    id: "COM-2026-022",
    customer: { name: "Vino Bastian", email: "vino.bastian@outlook.com" },
    category: "fullbody",
    details:
      "Cyberpunk netrunner floating inside a massive digital mainframe database construct.",
    price: 190000,
    orderDate: "2026-03-12",
    dueDate: "2026-05-01",
    status: "accepted",
    paymentStatus: "dp",
    image_url: "/gallery/12.jpg",
  },
  {
    id: "COM-2026-023",
    customer: { name: "Winda Utari", email: "winda.utari@gmail.com" },
    category: "headshot",
    details:
      "Gothic lolita character with deep crimson eyes and an intricate lace umbrella.",
    price: 55000,
    orderDate: "2026-03-10",
    dueDate: "2026-04-05",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/1.jpg",
  },
  {
    id: "COM-2026-024",
    customer: { name: "Xavier Niel", email: "xavier.niel@protonmail.com" },
    category: "halfbody",
    details:
      "Sci-fi pilot leaning against a futuristic starship console looking outside to deep space.",
    price: 150000,
    orderDate: "2026-03-05",
    dueDate: "2026-04-20",
    status: "review",
    paymentStatus: "dp",
    image_url: "/gallery/2.jpg",
  },
  {
    id: "COM-2026-025",
    customer: { name: "Yayan Ruhian", email: "yayan.ruhian@gmail.com" },
    category: "fullbody",
    details:
      "Martial artist execution of a tiger strike dynamic strike pose with ink-brush splash effects.",
    price: 180000,
    orderDate: "2026-03-01",
    dueDate: "2026-04-15",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/3.jpg",
  },
  {
    id: "COM-2026-026",
    customer: { name: "Zack Lee", email: "zack.lee@outlook.com" },
    category: "headshot",
    details:
      "Post-apocalyptic wanderer wearing a heavily weathered respirator and dynamic gas goggles.",
    price: 45000,
    orderDate: "2026-02-28",
    dueDate: "2026-03-20",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/4.jpeg",
  },
  {
    id: "COM-2026-027",
    customer: { name: "Aditya Pratama", email: "aditya.prat@gmail.com" },
    category: "cartoon_fullbody",
    details:
      "Retro 80s arcade manager standing next to neon-glowing arcade machines.",
    price: 75000,
    orderDate: "2026-02-25",
    dueDate: "2026-04-05",
    status: "in_progress_sketch",
    paymentStatus: "dp",
    image_url: "/gallery/5.jpg",
  },
  {
    id: "COM-2026-028",
    customer: { name: "Bella Citra", email: "bella.citra@yahoo.com" },
    category: "halfbody",
    details:
      "Mermaid resting on a glowing coral reef surrounded by colorful jellyfish at midnight.",
    price: 140000,
    orderDate: "2026-02-20",
    dueDate: "2026-04-01",
    status: "revision",
    paymentStatus: "dp",
    image_url: "/gallery/7.jpg",
  },
  {
    id: "COM-2026-029",
    customer: { name: "Cipta Wijaya", email: "cipta.wijaya@gmail.com" },
    category: "fullbody",
    details: "Steampunk sniper perched on top of a Victorian clock tower roof.",
    price: 220000,
    orderDate: "2026-02-18",
    dueDate: "2026-03-30",
    status: "cancelled",
    paymentStatus: "refunded",
    image_url: "/gallery/8.jpeg",
  },
  {
    id: "COM-2026-030",
    customer: { name: "Dina Mariana", email: "dina.m@outlook.com" },
    category: "chibi",
    details:
      "Chibi wizard trying to mix potions but causing a tiny colorful explosion on his face.",
    price: 35000,
    orderDate: "2026-02-15",
    dueDate: "2026-03-10",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/9.jpeg",
  },
  {
    id: "COM-2026-031",
    customer: { name: "Erwin Gutawa", email: "erwin.g@gmail.com" },
    category: "headshot",
    details:
      "Classical phantom profile with a golden cracked porcelain mask and rose petals.",
    price: 50000,
    orderDate: "2026-02-10",
    dueDate: "2026-03-05",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/10.jpg",
  },
  {
    id: "COM-2026-032",
    customer: { name: "Fitriani Bakri", email: "fitri.bakri@gmail.com" },
    category: "halfbody",
    details:
      "Cyber-pop idol singing on stage with massive holographic projection wings around her.",
    price: 165000,
    orderDate: "2026-02-05",
    dueDate: "2026-03-25",
    status: "in_progress_coloring",
    paymentStatus: "dp",
    image_url: "/gallery/11.jpg",
  },
  {
    id: "COM-2026-033",
    customer: { name: "Gilang Dirga", email: "gilang.d@yahoo.com" },
    category: "fullbody",
    details:
      "Ancient tribal warrior summoner conjuring a massive spiritual bear totem.",
    price: 240000,
    orderDate: "2026-02-01",
    dueDate: "2026-03-20",
    status: "accepted",
    paymentStatus: "dp",
    image_url: "/gallery/12.jpg",
  },
  {
    id: "COM-2026-034",
    customer: { name: "Hany Budiarti", email: "hany.b@protonmail.com" },
    category: "cartoon_fullbody",
    details:
      "Cute mail carrier delivery girl riding a giant fluffy floating cloud.",
    price: 65000,
    orderDate: "2026-01-28",
    dueDate: "2026-03-01",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/1.jpg",
  },
  {
    id: "COM-2026-035",
    customer: { name: "Irfan Hakim", email: "irfan.hakim@gmail.com" },
    category: "headshot",
    details:
      "Vampire count with dual crimson eyes holding a golden antique chalice close to lips.",
    price: 55000,
    orderDate: "2026-01-25",
    dueDate: "2026-02-20",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/2.jpg",
  },
  {
    id: "COM-2026-036",
    customer: { name: "Julia Perez", email: "julia.p@outlook.com" },
    category: "halfbody",
    details:
      "Elf archer aiming towards the screen through dense fantasy forest brush.",
    price: 130000,
    orderDate: "2026-01-20",
    dueDate: "2026-03-05",
    status: "review",
    paymentStatus: "dp",
    image_url: "/gallery/3.jpg",
  },
  {
    id: "COM-2026-037",
    customer: { name: "Kurniawan Dwi", email: "kurniawan.dwi@gmail.com" },
    category: "fullbody",
    details:
      "Interstellar bounty hunter standing under alien twin suns landscape scenery.",
    price: 200000,
    orderDate: "2026-01-15",
    dueDate: "2026-03-01",
    status: "in_progress_sketch",
    paymentStatus: "dp",
    image_url: "/gallery/4.jpeg",
  },
  {
    id: "COM-2026-038",
    customer: { name: "Luna Maya", email: "luna.maya@yahoo.com" },
    category: "chibi",
    details:
      "Chibi version of a cozy detective drinking tea while inspecting a tiny stamp magnifier.",
    price: 35000,
    orderDate: "2026-01-12",
    dueDate: "2026-02-05",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/5.jpg",
  },
  {
    id: "COM-2026-039",
    customer: { name: "Mahendra Putra", email: "mahendra.p@gmail.com" },
    category: "headshot",
    details:
      "Anubis-inspired modern techno-deity portrait mask with sleek neon circuitry layout.",
    price: 60000,
    orderDate: "2026-01-08",
    dueDate: "2026-02-01",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/7.jpg",
  },
  {
    id: "COM-2026-040",
    customer: { name: "Nabila Syakieb", email: "nabila.s@outlook.com" },
    category: "halfbody",
    details:
      "Ice princess casting a Blizzard crystal shards matrix structure, blue aesthetic tones.",
    price: 150000,
    orderDate: "2026-01-05",
    dueDate: "2026-02-25",
    status: "revision",
    paymentStatus: "dp",
    image_url: "/gallery/8.jpeg",
  },
  {
    id: "COM-2026-041",
    customer: { name: "Omesh Ananda", email: "omesh.a@gmail.com" },
    category: "cartoon_fullbody",
    details:
      "Street breakdancer spinning with high speed dynamic color smear motion lines.",
    price: 80000,
    orderDate: "2025-12-28",
    dueDate: "2026-02-10",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/9.jpeg",
  },
  {
    id: "COM-2026-042",
    customer: { name: "Prisia Nasution", email: "prisia.n@protonmail.com" },
    category: "fullbody",
    details:
      "Desert assassin stealthily sliding off sand dunes under moonlight silhouette shadow.",
    price: 185000,
    orderDate: "2025-12-22",
    dueDate: "2026-02-01",
    status: "in_progress_coloring",
    paymentStatus: "dp",
    image_url: "/gallery/10.jpg",
  },
  {
    id: "COM-2026-043",
    customer: { name: "Raffi Ahmad", email: "raffi.ahmad@yahoo.com" },
    category: "headshot",
    details:
      "Cyber punk racer helmet design pattern with holographic sticker accents.",
    price: 45000,
    orderDate: "2025-12-18",
    dueDate: "2026-01-10",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/11.jpg",
  },
  {
    id: "COM-2026-044",
    customer: { name: "Sule Wijaya", email: "sule.w@gmail.com" },
    category: "chibi",
    details:
      "Chibi ninja accidentally tripping over a giant wooden dummy trunk log.",
    price: 35000,
    orderDate: "2025-12-15",
    dueDate: "2026-01-05",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/12.jpg",
  },
  {
    id: "COM-2026-045",
    customer: { name: "Titi Kamal", email: "titi.kamal@outlook.com" },
    category: "halfbody",
    details:
      "Forest druid weaving glowing green vine structures around an ancient glowing oak.",
    price: 140000,
    orderDate: "2025-12-10",
    dueDate: "2026-01-30",
    status: "review",
    paymentStatus: "dp",
    image_url: "/gallery/1.jpg",
  },
  {
    id: "COM-2026-046",
    customer: { name: "Uus Mansyur", email: "uus.m@gmail.com" },
    category: "fullbody",
    details:
      "Heavy armor dwarf paladin smashing down a volcanic hammer fissure explosion.",
    price: 230000,
    orderDate: "2025-12-05",
    dueDate: "2026-01-25",
    status: "declined",
    paymentStatus: "refunded",
    image_url: "/gallery/2.jpg",
  },
  {
    id: "COM-2026-047",
    customer: { name: "Vanesha Prescilla", email: "vanesha.p@gmail.com" },
    category: "cartoon_fullbody",
    details:
      "Magical scholar holding open an oversized floating encyclopedic leather tome book.",
    price: 75000,
    orderDate: "2025-12-01",
    dueDate: "2026-01-15",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/3.jpg",
  },
  {
    id: "COM-2026-048",
    customer: { name: "Wira Nagara", email: "wira.n@protonmail.com" },
    category: "headshot",
    details:
      "Dark melancholic phantom shrouded by raven feathers and smoke effects landscape.",
    price: 50000,
    orderDate: "2025-11-28",
    dueDate: "2025-12-20",
    status: "completed",
    paymentStatus: "paid",
    image_url: "/gallery/4.jpeg",
  },
  {
    id: "COM-2026-049",
    customer: { name: "Yura Yunita", email: "yura.yunita@gmail.com" },
    category: "halfbody",
    details:
      "Ethereal goddess of spring stepping over water with lotus flowers instantly blooming.",
    price: 170000,
    orderDate: "2025-11-25",
    dueDate: "2026-01-10",
    status: "in_progress_sketch",
    paymentStatus: "dp",
    image_url: "/gallery/5.jpg",
  },
  {
    id: "COM-2026-050",
    customer: { name: "Ziva Magnolya", email: "ziva.m@yahoo.com" },
    category: "fullbody",
    details:
      "Steampunk sky-pirate captain standing on the bow deck of an airship looking into clouds.",
    price: 215000,
    orderDate: "2025-11-20",
    dueDate: "2025-12-30",
    status: "pending",
    paymentStatus: "pending",
    image_url: "/gallery/7.jpg",
  },
];

/**
 * Helper: Ambil semua data komisi
 * @returns {CommissionItem[]}
 */
export function getAllCommissions() {
  return commissions;
}

/**
 * Helper: Filter komisi berdasarkan status progres (order status)
 * @param {CommissionStatus} status
 * @returns {CommissionItem[]}
 */
export function getCommissionsByStatus(status) {
  return commissions.filter((item) => item.status === status);
}

/**
 * Helper: Filter komisi berdasarkan status pembayaran
 * @param {PaymentStatus} paymentStatus
 * @returns {CommissionItem[]}
 */
export function getCommissionsByPayment(paymentStatus) {
  return commissions.filter((item) => item.paymentStatus === paymentStatus);
}

/**
 * Helper: Format integer harga ke standard mata uang Rupiah
 * @param {number} price
 * @returns {string}
 */
export function formatRupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}
