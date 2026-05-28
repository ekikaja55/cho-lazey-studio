<script>
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import { onMount } from 'svelte';

  let { works = [] } = $props();

  // Carousel State
  let selectedIndex = $state(0);
  let carouselOffset = $state(0);
  let autoTimer;

  const VISIBLE = 3;
  const maxOffset = $derived(Math.max(0, works.length - VISIBLE));

  function selectWork(i) {
    selectedIndex = i;
    if (i >= carouselOffset + VISIBLE) {
      carouselOffset = Math.min(i - VISIBLE + 1, maxOffset);
    } else if (i < carouselOffset) {
      carouselOffset = i;
    }
    resetAuto();
  }

  function next() {
    selectedIndex = (selectedIndex + 1) % works.length;
    selectWork(selectedIndex);
  }

  function prev() {
    selectedIndex = (selectedIndex - 1 + works.length) % works.length;
    selectWork(selectedIndex);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  onMount(() => {
    resetAuto();
    return () => clearInterval(autoTimer);
  });

  const selected = $derived(works[selectedIndex]);
  const thumbTranslate = $derived(`translateX(-${carouselOffset * (100 / VISIBLE)}%)`);
</script>

<section class="works-section">
  <div class="section-header">
    <div class="title-badge">
      <span class="star">✦</span> RECENT WORKS <span class="star">✦</span>
    </div>
    <div class="divider-line"></div>
  </div>

  <div class="works-container">
    
    <div class="featured-col">
      <div class="featured-card">
        <div class="image-viewport">
          <WatermarkWrapper opacity={0.12} fontSize={12} spacing={80}>
            <img src={selected.image_url} alt={selected.title} class="main-img" />
          </WatermarkWrapper>
          
          <div class="img-badge">{selected.file_format}</div>
          
          <div class="nav-overlay">
            <button onclick={prev} class="nav-btn" aria-label="Prev">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button onclick={next} class="nav-btn" aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="side-panel">
      
      <div class="info-box">
        <h3 class="work-title">{selected.title}</h3>
        <p class="work-desc">{selected.description || 'A piece from the latest collection. Dive into the gallery to see more details.'}</p>
      </div>

      <div class="thumbs-wrapper">
        <div class="thumbs-viewport">
          <div class="thumbs-track" style="transform: {thumbTranslate}">
            {#each works as work, i}
              <button 
                class="thumb-card" 
                class:active={i === selectedIndex}
                onclick={() => selectWork(i)}
              >
                <img src={work.image_url} alt={work.title} />
                <div class="thumb-label">{work.title}</div>
              </button>
            {/each}
          </div>
        </div>

        <div class="carousel-controls">
          <button class="ctrl-btn" onclick={prev}>Prev</button>
          <div class="dot-nav">
            {#each works as _, i}
              <button 
                class="dot" 
                class:active={i === selectedIndex}
                onclick={() => selectWork(i)}
              ></button>
            {/each}
          </div>
          <button class="ctrl-btn" onclick={next}>Next</button>
        </div>
      </div>

      <div class="cta-section">
        <a href="/gallery" class="cta-button">
          <div class="cta-text">
            <span class="cta-title">Explore Gallery</span>
            <span class="cta-sub">See all my past works</span>
          </div>
          <div class="cta-icon">→</div>
        </a>
      </div>

    </div>
  </div>
</section>

<style>
  .works-section {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ── Divider Bertenaga (Badge Style) ── */
  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .title-badge {
    background: #eae4f8; /* Ungu pastel dari tema sebelumnya */
    border: 2.5px solid #1a1a1a;
    padding: 0.6rem 1.5rem;
    border-radius: 99px;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 4px 4px 0px #1a1a1a;
    white-space: nowrap;
  }

  .star { color: #de5c23; }

  .divider-line {
    flex: 1;
    height: 3px;
    background: #1a1a1a;
    border-radius: 2px;
    opacity: 0.15;
  }

  /* ── Layout Baru ── */
  .works-container {
    display: grid;
    grid-template-columns: 1.3fr 0.9fr; /* Kiri lebih lebar sedikit */
    gap: 2.5rem;
    align-items: stretch; /* Memaksa tinggi sejajar */
  }

  /* ── Kiri: Featured Card Full Image ── */
  .featured-col {
    display: flex;
    flex-direction: column;
  }

  .featured-card {
    background: #ffffff;
    border: 3px solid #1a1a1a;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 10px 10px 0px #1a1a1a;
    height: 100%; /* Memenuhi ruang vertikal */
    display: flex;
    flex-direction: column;
  }

  .image-viewport {
    position: relative;
    flex: 1; /* Mengambil seluruh sisa tinggi */
    min-height: 400px;
    background: #f4f0ea;
    overflow: hidden;
  }

  .main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .image-viewport:hover .main-img {
    transform: scale(1.03);
  }

  .img-badge {
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    background: #ff9e7d;
    border: 2px solid #1a1a1a;
    padding: 0.3rem 0.8rem;
    border-radius: 99px;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.75rem;
    color: #1a1a1a;
    box-shadow: 3px 3px 0px #1a1a1a;
    z-index: 10;
  }

  .nav-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none; /* Biar ngga ganggu seleksi */
  }

  .image-viewport:hover .nav-overlay { opacity: 1; }

  .nav-btn {
    pointer-events: auto;
    background: white;
    border: 3px solid #1a1a1a;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0 #1a1a1a;
    transition: all 0.2s;
  }

  .nav-btn:hover { transform: translate(-3px, -3px); box-shadow: 7px 7px 0 #1a1a1a; background: #e3f7ee; }
  .nav-btn:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0 #1a1a1a; }

  /* ── Kanan: Side Panel ── */
  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
    justify-content: space-between; /* Menyebar konten agar pas di kolom */
  }

  .info-box {
    background: #ffffff;
    border: 2.5px solid #1a1a1a;
    border-radius: 20px;
    padding: 1.5rem 1.8rem;
    box-shadow: 6px 6px 0px #1a1a1a;
  }

  .work-title {
    font-family: 'HammersmithOne', sans-serif;
    font-size: 1.8rem;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .work-desc {
    font-family: 'DM Sans', sans-serif;
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }

  /* ── Thumbs Carousel ── */
  .thumbs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .thumbs-viewport {
    overflow: hidden;
    border-radius: 16px;
    padding: 0.5rem;
    margin: -0.5rem;
  }

  .thumbs-track {
    display: flex;
    gap: 1rem;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .thumb-card {
    flex: 0 0 calc((100% - 2rem) / 3);
    aspect-ratio: 1;
    border: 2.5px solid #1a1a1a;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #fff;
    padding: 0;
    box-shadow: 4px 4px 0 #1a1a1a;
    transition: all 0.3s;
  }

  .thumb-card img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(40%); transition: all 0.3s;}
  .thumb-card.active img, .thumb-card:hover img { filter: grayscale(0%); transform: scale(1.1); }

  .thumb-card.active {
    transform: scale(1.05) translateY(-4px);
    box-shadow: 6px 6px 0 #b19ffb;
    border-color: #1a1a1a;
    z-index: 2;
  }

  .thumb-label {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: white;
    border-top: 2.5px solid #1a1a1a;
    padding: 0.4rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Control Panel Kanan */
  .carousel-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 2.5px solid #1a1a1a;
    border-radius: 99px;
    padding: 0.5rem 1rem;
    box-shadow: 4px 4px 0 #1a1a1a;
  }

  .ctrl-btn {
    background: none;
    border: none;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    color: #1a1a1a;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .ctrl-btn:hover { color: #de5c23; }

  .dot-nav {
    display: flex;
    gap: 0.4rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1a1a1a;
    opacity: 0.2;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }
  .dot.active {
    opacity: 1;
    background: #ff9e7d;
    transform: scale(1.5);
  }

  /* ── CTA Penutup Kekosongan ── */
  .cta-section {
    margin-top: auto; /* Mendorong tombol ini ke paling bawah panel */
  }

  .cta-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #e3f7ee;
    border: 2.5px solid #1a1a1a;
    border-radius: 20px;
    padding: 1.2rem 1.5rem;
    text-decoration: none;
    color: #1a1a1a;
    box-shadow: 6px 6px 0px #1a1a1a;
    transition: all 0.2s ease;
  }

  .cta-button:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0px #1a1a1a;
    background: #d4ede9;
  }

  .cta-button:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  .cta-text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .cta-title {
    font-family: 'HammersmithOne', sans-serif;
    font-size: 1.3rem;
    line-height: 1;
  }

  .cta-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .cta-icon {
    font-size: 1.8rem;
    font-family: monospace;
    font-weight: bold;
  }

  /* ── Responsif ── */
  @media (max-width: 960px) {
    .works-container {
      grid-template-columns: 1fr;
    }
    .image-viewport { min-height: 350px; }
  }

  @media (max-width: 600px) {
    .title-badge { font-size: 0.8rem; padding: 0.5rem 1rem; }
    .thumb-card { flex: 0 0 calc((100% - 1rem) / 2); }
    .nav-btn { width: 38px; height: 38px; }
    .info-box, .cta-button { padding: 1.2rem; }
  }
</style>
