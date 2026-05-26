<script>
  // Menggunakan Svelte 5 Runes untuk komponen inner page header yang reusable
  let { 
    title = 'Order Archive', 
    description = 'A quiet look back at your history with the studio. Revisiting the illustrations and stories you have gathered over time.',
    eyebrow = 'OWNED PIECES'
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
  /* ── Header (Boxed Style Matched - Soft Brutalist) ── */
  .page-header.boxed-header {
    position: relative;
    background: #f3eee6; /* Warna krem hangat menyesuaikan tema */
    border: 2.5px solid #2a2420;
    border-radius: 20px;
    padding: 2.5rem 3rem;
    box-shadow: 6px 6px 0px #2a2420;
    overflow: hidden; /* Memastikan ornamen tidak keluar kotak */
    z-index: 1;
  }

  .header-content {
    position: relative;
    z-index: 2; /* Menjaga teks tetap di atas ornamen dekorasi */
    display: flex; 
    flex-direction: column; 
    gap: 0.6rem;
  }

  .header-eyebrow {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #c05c20;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  /* Ikon donat kecil di teks eyebrow */
  .eyebrow-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2.5px solid #2a2420;
  }

  .header-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.2rem);
    color: #2a2420;
    margin: 0;
    line-height: 1.1;
  }

  /* Garis gradasi peach ke ungu */
  .header-rule {
    width: 72px;
    height: 5px;
    background: linear-gradient(90deg, #f4a87c, #bda6d6); 
    border-radius: 999px;
    margin-top: 0.2rem;
    margin-bottom: 0.4rem;
  }

  .header-desc {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1.05rem;
    line-height: 1.65;
    color: #7a706a;
    max-width: 680px;
    margin: 0;
  }

  /* ── Decorative Background Shapes ── */
  .bg-shapes {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none; /* Agar tidak menghalangi seleksi teks */
  }

  .shape {
    position: absolute;
    border: 2px solid rgba(42, 36, 32, 0.1);
  }

  .shape-purple {
    width: 35px; height: 35px;
    background: #e2dcf2;
    border-radius: 10px;
    top: 35px; right: 180px;
    transform: rotate(-8deg);
  }

  .shape-green {
    width: 90px; height: 90px;
    background: #dcf2e9;
    border-radius: 18px;
    top: -30px; right: 40px;
    transform: rotate(12deg);
  }

  .shape-peach {
    width: 65px; height: 65px;
    background: #fae0cd;
    border-radius: 14px;
    bottom: -20px; right: 100px;
    transform: rotate(18deg);
  }

  /* Responsive penyesuaian khusus header include media query */
  @media (max-width: 600px) {
    .page-header.boxed-header {
      padding: 1.5rem;
      border-radius: 16px;
    }
    .bg-shapes { 
      opacity: 0.4; /* Diredam di layar kecil agar teks tidak bertabrakan */
    }
  }
</style>
