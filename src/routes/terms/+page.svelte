<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let mounted = $state(false);
  let scrollProgress = $state(0);
  let scrollContainer;
  let hasScrolledToBottom = $state(false);

  function goBack() {
    history.back();
  }

  function handleScroll() {
    if (!scrollContainer) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const progress = scrollTop / (scrollHeight - clientHeight);
    scrollProgress = Math.min(progress * 100, 100);
    if (progress >= 0.98) hasScrolledToBottom = true;
  }

  onMount(() => {
    mounted = true;
  });

  const sections = [
    {
      color: '#a2e1db',
      darkColor: '#1a5c58',
      title: 'Ketentuan Umum',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`,
      body: 'Dengan mengakses dan menggunakan layanan Cho\'s Studio, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku. Semua aset visual, ilustrasi, dan karya seni yang ditampilkan merupakan hak cipta dari seniman terkait.'
    },
    {
      color: '#f4a87c',
      darkColor: '#6b2d0a',
      title: 'Hak Cipta & Larangan',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></svg>`,
      body: 'Pengguna dilarang untuk menyebarluaskan, menyalin, atau menggunakan ulang aset yang tersedia tanpa izin tertulis. Sistem ini memiliki perlindungan tambahan untuk mencegah tindakan seperti pengambilan gambar (screenshot) dan penyimpanan langsung terhadap aset.'
    },
    {
      color: '#b4a6d5',
      darkColor: '#2d1a5c',
      title: 'Data & Privasi',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      body: 'Seluruh data pengguna yang disimpan melalui proses registrasi akan masuk ke dalam basis data resmi Cho\'s Studio. Data tersebut digunakan untuk kepentingan pengelolaan akun, peningkatan layanan, serta keamanan sistem. Dengan melakukan registrasi, pengguna menyetujui pengumpulan data seperti nama, alamat email, serta aktivitas dalam platform.'
    },
    {
      color: '#a2e1db',
      darkColor: '#1a5c58',
      title: 'Akun & Keamanan',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      body: 'Pengguna diharapkan menggunakan akun secara benar dan bertanggung jawab. Menjaga kerahasiaan kata sandi merupakan tanggung jawab pribadi pengguna. Apabila pengguna lupa atau kehilangan akses terhadap kata sandinya, maka terdapat kemungkinan sebagian atau seluruh data tidak dapat dipulihkan.'
    },
    {
      color: '#f4a87c',
      darkColor: '#6b2d0a',
      title: 'Ketentuan Penggunaan',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
      body: 'Dengan menerima ketentuan ini, pengguna menyetujui untuk menggunakan layanan secara etis dan sesuai kebijakan platform. Pelanggaran terhadap ketentuan ini dapat mengakibatkan pembatasan, penangguhan, atau penghapusan akun tanpa pemberitahuan sebelumnya.'
    },
  ];
</script>

<svelte:head>
  <title>Terms & Conditions — Cho's Studio</title>
</svelte:head>

<div class="terms-root">
  <!-- Decorative tilted shapes (echo background.png) -->
  <div class="deco-shapes" aria-hidden="true">
    <div class="deco deco-1"></div>
    <div class="deco deco-2"></div>
    <div class="deco deco-3"></div>
    <div class="deco deco-4"></div>
    <div class="deco deco-5"></div>
  </div>

  <!-- Main card -->
  <div class="terms-card" class:visible={mounted}>

    <!-- Progress bar -->
    <div class="progress-track" aria-hidden="true">
      <div class="progress-fill" style="width: {scrollProgress}%"></div>
    </div>

    <!-- <!-- Back button --> -->
    <!-- <button class="back-btn" onclick={goBack} aria-label="Go back"> -->
    <!--   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> -->
    <!--     <line x1="19" y1="12" x2="5" y2="12"/> -->
    <!--     <polyline points="12,19 5,12 12,5"/> -->
    <!--   </svg> -->
    <!--   <span>Kembali</span> -->
    <!-- </button> -->
    <!---->
    <!-- Header -->
    <div class="terms-header">
      <div class="header-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
        ✦ dokumen resmi ✦
      </div>
      <h1 class="terms-title">Terms &amp; Conditions</h1>
      <div class="title-underline"></div>
      <p class="terms-subtitle">
        Harap baca seluruh ketentuan sebelum menggunakan layanan Cho's Studio.
      </p>
    </div>

    <!-- Scrollable content -->
    <div
      class="terms-scroll"
      bind:this={scrollContainer}
      onscroll={handleScroll}
      role="region"
      aria-label="Terms and conditions content"
    >
      <div class="sections-list">
        {#each sections as sec, i}
          <div class="section-card stagger-{i + 1}" style="--sec-color: {sec.color}; --sec-dark: {sec.darkColor};">
            <div class="section-icon-wrap">
              <div class="section-icon" style="background: {sec.color}; color: {sec.darkColor};">
                {@html sec.icon}
              </div>
              <div class="section-num">0{i + 1}</div>
            </div>
            <div class="section-body">
              <h2 class="section-title">{sec.title}</h2>
              <p class="section-text">{sec.body}</p>
            </div>
            <!-- Decorative corner accent -->
            <div class="section-corner" style="background: {sec.color};" aria-hidden="true"></div>
          </div>
        {/each}

        <!-- Closing note -->
        <div class="closing-note">
          <div class="closing-icon" aria-hidden="true">⚠</div>
          <p>
            Jika pengguna tidak menyetujui salah satu dari ketentuan di atas, proses pendaftaran
            atau penggunaan layanan <strong>tidak dapat dilanjutkan</strong>.
          </p>
        </div>
      </div>

      <!-- Scroll hint -->
      {#if scrollProgress < 90}
        <div class="scroll-hint" aria-hidden="true">
          <span>Scroll untuk membaca selengkapnya</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19,12 12,19 5,12"/>
          </svg>
        </div>
      {/if}
    </div>

    <!-- Footer action -->
    <div class="terms-footer">
      <div class="footer-divider" aria-hidden="true">
        <span>— Cho's Studio —</span>
      </div>
      <button
        class="btn-back"
        onclick={goBack}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12,19 5,12 12,5"/>
        </svg>
        Kembali
      </button>
    </div>

  </div>
</div>

<style>
  /* ── Root ── */
  .terms-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* ── Decorative shapes (mirroring Background.png) ── */
  .deco-shapes {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .deco {
    position: absolute;
    border: 2.5px solid #2a2420;
    border-radius: 10px;
    animation: decoIn 0.9s ease both;
  }

  .deco-1 {
    width: 220px; height: 220px;
    background: #a2e1db;
    top: -4%; left: -6%;
    transform: rotate(-14deg);
    opacity: 0.5;
  }
  .deco-2 {
    width: 175px; height: 175px;
    background: #f4a87c;
    top: 4%; right: -4%;
    transform: rotate(18deg);
    opacity: 0.45;
    animation-delay: 0.15s;
  }
  .deco-3 {
    width: 155px; height: 155px;
    background: #b4a6d5;
    bottom: 4%; left: -4%;
    transform: rotate(-9deg);
    opacity: 0.45;
    animation-delay: 0.3s;
  }
  .deco-4 {
    width: 130px; height: 130px;
    background: #f4a87c;
    bottom: 2%; right: -3%;
    transform: rotate(24deg);
    opacity: 0.4;
    animation-delay: 0.45s;
  }
  .deco-5 {
    width: 100px; height: 100px;
    background: #a2e1db;
    top: 50%; left: -3%;
    transform: rotate(8deg) translateY(-50%);
    opacity: 0.3;
    animation-delay: 0.6s;
  }

  @keyframes decoIn {
    from { opacity: 0; transform: scale(0.75) rotate(var(--rot, 0deg)); }
    to   { opacity: inherit; }
  }

  /* ── Main card ── */
  .terms-card {
    position: relative;
    z-index: 1;
    background: rgba(240, 235, 227, 0.95);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 8px 8px 0px #2a2420;
    width: 100%;
    max-width: 680px;
    overflow: hidden;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }

  .terms-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Progress bar ── */
  .progress-track {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: rgba(42, 36, 32, 0.1);
    z-index: 10;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #7dc8c1, #f4a87c, #b4a6d5);
    border-radius: 0 2px 2px 0;
    transition: width 0.1s ease;
  }

  /* ── Back button (top) ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.82rem;
    color: #2a2420;
    background: #a2e1db;
    border: 2px solid #2a2420;
    border-radius: 999px;
    padding: 6px 14px;
    cursor: pointer;
    margin: 1.5rem 1.75rem 0;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .back-btn:hover {
    background: #7dc8c1;
    transform: translateX(-3px);
  }

  /* ── Header ── */
  .terms-header {
    padding: 1.25rem 2rem 1.5rem;
    text-align: center;
    border-bottom: 2px solid rgba(42, 36, 32, 0.12);
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #7dc8c1;
    margin-bottom: 0.65rem;
  }

  .terms-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(1.9rem, 5vw, 2.75rem);
    color: #2a2420;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  .title-underline {
    width: 44px;
    height: 3px;
    background: linear-gradient(90deg, #7dc8c1, #b4a6d5);
    border-radius: 2px;
    margin: 0.7rem auto 0.85rem;
  }

  .terms-subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    color: #6a5f58;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.55;
  }

  /* ── Scrollable area ── */
  .terms-scroll {
    max-height: 55vh;
    overflow-y: auto;
    padding: 1.5rem 2rem 1rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(125, 200, 193, 0.5) transparent;
    position: relative;
  }

  .terms-scroll::-webkit-scrollbar { width: 4px; }
  .terms-scroll::-webkit-scrollbar-track { background: transparent; }
  .terms-scroll::-webkit-scrollbar-thumb {
    background: rgba(125, 200, 193, 0.5);
    border-radius: 999px;
  }

  /* ── Section cards ── */
  .sections-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .section-card {
    position: relative;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    background: rgba(255, 255, 255, 0.55);
    border: 2px solid #2a2420;
    border-radius: 16px;
    padding: 1.1rem 1.2rem 1.1rem 1rem;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: cardIn 0.4s ease both;
  }

  .section-card:hover {
    transform: translateX(3px);
    box-shadow: -4px 4px 0px #2a2420;
  }

  /* Stagger delays */
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.12s; }
  .stagger-3 { animation-delay: 0.19s; }
  .stagger-4 { animation-delay: 0.26s; }
  .stagger-5 { animation-delay: 0.33s; }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Decorative corner accent */
  .section-corner {
    position: absolute;
    bottom: -12px; right: -12px;
    width: 48px; height: 48px;
    border-radius: 10px;
    border: 2px solid #2a2420;
    transform: rotate(15deg);
    opacity: 0.35;
  }

  /* Icon group */
  .section-icon-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .section-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    border: 2px solid #2a2420;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .section-num {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.65rem;
    color: rgba(42, 36, 32, 0.35);
    letter-spacing: 0.05em;
  }

  /* Text body */
  .section-body { flex: 1; min-width: 0; }

  .section-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.95rem;
    color: #2a2420;
    margin: 0 0 0.45rem;
    letter-spacing: 0.01em;
  }

  .section-text {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.85rem;
    color: #4a3f3a;
    line-height: 1.7;
    margin: 0;
    text-align: justify;
  }

  /* ── Closing note ── */
  .closing-note {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    background: rgba(244, 168, 124, 0.2);
    border: 2px solid rgba(244, 168, 124, 0.7);
    border-radius: 14px;
    padding: 1rem 1.2rem;
    margin-top: 0.5rem;
    animation: cardIn 0.4s 0.4s ease both;
  }

  .closing-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .closing-note p {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.85rem;
    color: #4a3f3a;
    line-height: 1.7;
    margin: 0;
  }

  .closing-note strong {
    color: #2a2420;
    font-weight: 700;
  }

  /* ── Scroll hint ── */
  .scroll-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0.75rem 0 0.25rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(42, 36, 32, 0.4);
    letter-spacing: 0.05em;
    animation: hintBob 2s ease-in-out infinite;
  }

  @keyframes hintBob {
    0%, 100% { transform: translateY(0); opacity: 0.5; }
    50%       { transform: translateY(3px); opacity: 0.8; }
  }

  /* ── Footer ── */
  .terms-footer {
    padding: 1.25rem 2rem 1.75rem;
    border-top: 2px solid rgba(42, 36, 32, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .footer-divider {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(42, 36, 32, 0.35);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  /* Back button (bottom) */
  .btn-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 48px;
    background: #b4a6d5;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    box-shadow: 4px 4px 0px #2a2420;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
    width: 100%;
    max-width: 340px;
  }

  .btn-back:hover {
    background: #9b8bc4;
    transform: translateY(-2px);
    box-shadow: 6px 6px 0px #2a2420;
  }

  .btn-back:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 0px #2a2420;
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .terms-card {
      border-radius: 20px;
      box-shadow: 5px 5px 0px #2a2420;
    }

    .terms-header {
      padding: 1rem 1.25rem 1.25rem;
    }

    .terms-scroll {
      padding: 1.25rem 1.25rem 0.75rem;
      max-height: 52vh;
    }

    .terms-footer {
      padding: 1rem 1.25rem 1.5rem;
    }

    .back-btn {
      margin: 1.25rem 1.25rem 0;
    }

    .section-card {
      padding: 0.9rem 1rem 0.9rem 0.85rem;
    }
  }

  @media (max-width: 400px) {
    .terms-scroll {
      max-height: 48vh;
    }
  }
</style>
