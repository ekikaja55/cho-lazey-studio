coba rework sidebar agar senada dari bg layout root ku aku berikan refrensi layout juga pastikan responsive nya bisa di semua device dan readebilitynya gunakan svg untuk icon, saranku pecah jadi beberapa komponen lagi untuk pages sementara jangan diurus dulu itu nanti
pastikan juga interaktivitasnya aku juga memberikan refrensi layouting di pages galerry ku kamu bisa pakai DNA nya
karena ini protoype jadi memang mainan local storage (aku berikan auth store ku dan usermock ku)

├── dashboard
│   ├── artist
│   │   ├── adoption
│   │   │   └── +page.svelte
│   │   ├── commision
│   │   │   └── +page.svelte
│   │   └── galery
│   │   └── +page.svelte
│   ├── client
│   │   ├── commision
│   │   │   └── +page.svelte
│   │   ├── history
│   │   │   └── +page.svelte
│   │   └── logout
│   │   └── +page.svelte
│   └── +layout.svelte
├── home
│   ├── gallery
│   │   └── +page.svelte
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── shop
│   ├── invoice
│   │   └── +page.svelte
│   └── +page.svelte
├── +layout.svelte
├── login
│   └── +page.svelte
├── +page.svelte
├── register
│   └── +page.svelte
└── terms
└── +page.svelte

## UNTUK ARTIST PAGES

### 1. Overview / Main Dashboard (`/dashboard/artist`)

- **Subtitle:** `✦ THE WORKSPACE ✦`
- **Title:** `Creative Solitude`
  _Deskripsi Baru:_ _"Welcome back, Cho. Here is the quiet rhythm of your work, ongoing creations, and studio updates."_

### 2. Commission (`/dashboard/artist/commision`)

- **Subtitle:** `✦ REQUESTED IDEAS ✦`
- **Title:** `Visions & Drafts`
  _Deskripsi Baru:_ _"Review and shape the custom pieces requested by your patrons. Turning thoughts into shared imagery."_

## UNTUK CLIENT PAGES

### 1. Overview / Main Dashboard (`/dashboard/client`)

- **Subtitle:** `✦ PATRON LOUNGE ✦`
- **Title:** `The Art Corner`
- _Deskripsi Baru:_ _"Your personal corner of the studio. Wander through your current art orders and collected pieces."_

### 2. Commission (`/dashboard/client/commision`)

- **Subtitle:** `✦ COMMISSION STUDIO ✦`
  **Title:** `Personal Commissions`
- _Deskripsi Baru:_ _"Request a unique piece to your own story. Watch its progress unfold from sketch to completion."_

### 3. History (`/dashboard/client/history`)

- **Subtitle:** `✦ OWNED PIECES ✦`
- **Title:** `Art Archives`
- _Deskripsi Baru:_ _"A quiet look back at your history with the studio. Revisiting the illustrations and stories you have gathered over time."_

├── dashboard
│   ├── artist
│   │   ├── adoption
│   │   │   └── +page.svelte
│   │   ├── commision
│   │   │   └── +page.svelte
│   │   └── galery
│   │   └── +page.svelte
│   ├── client
│   │   ├── commision
│   │   │   └── +page.svelte
│   │   ├── history
│   │   │   └── +page.svelte
│   │   └── logout
│   │   └── +page.svelte
│   └── +layout.svelte
├── home
│   ├── gallery
│   │   └── +page.svelte
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── shop
│   ├── invoice
│   │   └── +page.svelte
│   └── +page.svelte
├── +layout.svelte
├── login
│   └── +page.svelte
├── +page.svelte
├── register
│   └── +page.svelte
└── terms
└── +page.svelte

adapun untuk isi page gapapa sesimpel title dan subtitle page nya aja, itu dulu si
