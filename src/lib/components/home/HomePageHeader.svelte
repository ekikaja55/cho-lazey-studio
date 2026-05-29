<script>
  // Menggunakan Svelte 5 Runes untuk komponen inner page header yang reusable
  let { 
    title = 'Default', 
    description = 'Default', 
    eyebrow = 'Default'
  } = $props();
</script>

<header class="page-header boxed-header">
  <div class="bg-shapes">
    <div class="shape shape-purple"></div>
    <div class="shape shape-green"></div>
    <div class="shape shape-peach"></div>
  </div>
  
  <div class="header-content">
    <p class="header-eyebrow">
      <span class="eyebrow-dot"></span> ✦ {eyebrow} ✦
    </p>
    <h1 class="header-title">{title}</h1>
    <div class="header-rule"></div>
    <p class="header-desc">{description}</p>
  </div>
</header>

<style>
  /* ── Header (Boxed Style - Modern Crisp Brutalist) ── */
  .page-header.boxed-header {
    position: relative;
    background: #ffffff; /* Menggunakan putih jelas/bersih */
    border: 2.5px solid #1a1a1a; /* Warna outline lebih kontras dan tegas */
    border-radius: 24px; /* Sudut sedikit lebih melengkung agar modern */
    padding: 3rem 3.5rem;
    box-shadow: 8px 8px 0px #1a1a1a; /* Bayangan pop-art yang lebih hidup */
    overflow: hidden; 
    z-index: 1;
    transition: all 0.3s ease;
  }

  /* Efek interaktif halus saat komponen di-hover */
  .page-header.boxed-header:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #1a1a1a;
  }

  .header-content {
    position: relative;
    z-index: 2; 
    display: flex; 
    flex-direction: column; 
    gap: 0.75rem;
  }

  .header-eyebrow {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #de5c23; /* Warna terracotta yang lebih vibrant di atas bg putih */
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  /* Detail titik estetis */
  .eyebrow-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #de5c23;
    border: 1.5px solid #1a1a1a;
  }

  .header-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2.4rem, 5vw, 3.5rem);
    color: #1a1a1a;
    margin: 0;
    line-height: 1.1;
    font-weight: 900;
  }

  /* Garis pembatas dengan gradasi warna studio yang segar */
  .header-rule {
    width: 80px;
    height: 6px;
    background: linear-gradient(90deg, #ff9e7d, #b19ffb); 
    border: 1.5px solid #1a1a1a;
    border-radius: 999px;
    margin-top: 0.4rem;
    margin-bottom: 0.5rem;
  }

  .header-desc {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1.05rem;
    line-height: 1.7;
    color: #333333; /* Warna lebih gelap untuk kontras dan readability yang lebih baik */
    max-width: 640px;
    margin: 0;
  }

  /* ── Decorative Background Shapes ── */
  .bg-shapes {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none; 
  }

  /* Bentuk geometri sekarang menggunakan outline tipis dan shadow pop-art kecil */
  .shape {
    position: absolute;
    border: 2px solid #1a1a1a;
  }

  .shape-purple {
    width: 38px; height: 38px;
    background: #eae4f8;
    border-radius: 12px;
    top: 40px; right: 220px;
    transform: rotate(-12deg);
    box-shadow: 3px 3px 0px #1a1a1a;
  }

  .shape-green {
    width: 95px; height: 95px;
    background: #e3f7ee;
    border-radius: 20px;
    top: -25px; right: 30px;
    transform: rotate(15deg);
    box-shadow: 4px 4px 0px #1a1a1a;
  }

  .shape-peach {
    width: 70px; height: 70px;
    background: #ffe3d1;
    border-radius: 16px;
    bottom: -15px; right: 120px;
    transform: rotate(25deg);
    box-shadow: 3px 3px 0px #1a1a1a;
  }

  /* Responsive Adjustments */
  @media (max-width: 600px) {
    .page-header.boxed-header {
      padding: 2.25rem 1.5rem;
      border-radius: 20px;
      box-shadow: 6px 6px 0px #1a1a1a;
    }

    .header-content {
      gap: 0.5rem;
    }

    .header-eyebrow {
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      gap: 0.5rem;
    }

    .eyebrow-dot {
      width: 6px;
      height: 6px;
    }

    .header-title {
      font-size: clamp(1.8rem, 8vw, 2.4rem);
      line-height: 1.2;
    }

    .header-rule {
      width: 60px;
      height: 5px;
      margin-top: 0.2rem;
      margin-bottom: 0.3rem;
    }

    .header-desc {
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* Adjust shapes for mobile to keep them from overwhelming the content */
    .shape-purple {
      width: 28px; height: 28px;
      top: 20px; right: 60px;
    }

    .shape-green {
      width: 70px; height: 70px;
      top: -25px; right: -10px;
    }

    .shape-peach {
      width: 50px; height: 50px;
      bottom: -15px; right: 30px;
    }
  }
</style>
