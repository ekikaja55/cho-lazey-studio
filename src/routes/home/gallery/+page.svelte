<script>
  /**
   * /gallery/+page.svelte
   * Cho's Studio — Gallery Page
   * Concept: Scattered folder tabs + masonry bento grid
   * All images shown (status shown as badge only, no filter — that's for Shop)
   */

  import { galleryImages, formatRupiah } from '$lib/data/galleryImages.js';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import { onMount } from 'svelte';

  let mounted = $state(false);

  // Lightbox state
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);

  // Hover state per card
  let hoveredId = $state(null);

  // All images, no status filter
  const items = galleryImages;

  const lightboxItem = $derived(items[lightboxIndex]);
  const lightboxStatus = $derived(
    lightboxItem ? (statusConfig[lightboxItem.status] ?? statusConfig.not_sold) : null
  );

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

  function lbNext() {
    lightboxIndex = (lightboxIndex + 1) % items.length;
  }

  function lbPrev() {
    lightboxIndex = (lightboxIndex - 1 + items.length) % items.length;
  }

  function handleKeydown(e) {
    if (!lightboxOpen) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'ArrowLeft')  lbPrev();
  }

  // Status config
  const statusConfig = {
    available:  { label: 'Available',  bg: '#a2e1a6', color: '#1a4d1d' },
    sold:       { label: 'Sold',       bg: '#f46958', color: '#fff'     },
    reserved:   { label: 'Reserved',   bg: '#ffba09', color: '#3d2800'  },
    not_sold:   { label: 'Not Listed', bg: '#b4a6d5', color: '#2d1a5c'  },
    archived:   { label: 'Archived',   bg: '#c8bfb8', color: '#4a3f3a'  },
  };

  // Assign a fixed tilt to each card for the "scattered folder" feel
  const tilts = [
    -2.2, 1.5, -1.1, 2.8, -0.7, 1.9,
    -2.5, 0.8, -1.8, 2.1, -0.4, 1.3,
  ];

  // Folder tab colors cycling through brand palette
  const tabColors = [
    '#a2e1db', '#f4a87c', '#b4a6d5',
    '#a2e1db', '#f4a87c', '#b4a6d5',
    '#a2e1db', '#f4a87c', '#b4a6d5',
    '#a2e1db', '#f4a87c', '#b4a6d5',
  ];

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Gallery — Cho's Studio</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="gallery-page" class:visible={mounted}>

  <!-- ── Page Header ── -->
  <header class="gallery-header animate-fade-up">
    <div class="header-eyebrow">
      <span class="eyebrow-dot" aria-hidden="true"></span>
      <span>✦ all works ✦</span>
    </div>
    <h1 class="gallery-title">Gallery</h1>
    <p class="gallery-subtitle">
      {items.length} pieces — digital art, illustrations &amp; more
    </p>
    <!-- Decorative accent shapes -->
    <div class="header-shape header-shape-1" aria-hidden="true"></div>
    <div class="header-shape header-shape-2" aria-hidden="true"></div>
  </header>

  <!-- ── Gallery Grid — folder/bento layout ── -->
  <div class="gallery-grid" role="list" aria-label="Gallery artworks">

    <!-- First item: always featured (larger) -->
    {#each items as item, i}
      {@const tilt = tilts[i % tilts.length]}
      {@const tabColor = tabColors[i % tabColors.length]}
      {@const status = statusConfig[item.status] ?? statusConfig.not_sold}
      {@const isFeatured = i === 0}

      <div
        class="folder-card"
        class:featured={isFeatured}
        class:hovered={hoveredId === item.gallery_id}
        style="--tilt: {tilt}deg; --tab-color: {tabColor}; --anim-delay: {i * 0.055}s;"
        role="listitem"
        onmouseenter={() => hoveredId = item.gallery_id}
        onmouseleave={() => hoveredId = null}
      >
        <!-- Folder tab -->
        <div class="folder-tab" aria-hidden="true">
          <span class="folder-tab-label">
            {item.file_format}
          </span>
        </div>

        <!-- Card body -->
        <button
          class="folder-body"
          onclick={() => openLightbox(i)}
          aria-label="View {item.title}"
        >
          <!-- Image -->
          <div class="folder-img-wrap">
            <WatermarkWrapper opacity={0.14} fontSize={11} spacing={75}>
              <img
                src={item.image_url}
                alt={item.title}
                class="folder-img"
                loading={i < 4 ? 'eager' : 'lazy'}
              />
            </WatermarkWrapper>
            <!-- Hover overlay -->
            <div class="folder-overlay" aria-hidden="true">
              <div class="overlay-inner">
                <span class="overlay-zoom" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </span>
                <span class="overlay-title">{item.title}</span>
              </div>
            </div>
          </div>

          <!-- Footer info -->
          <div class="folder-footer">
            <div class="folder-footer-left">
              <span class="folder-title">{item.title}</span>
            </div>
            <span
              class="folder-status"
              style="background: {status.bg}; color: {status.color};"
            >
              {status.label}
            </span>
          </div>
        </button>
      </div>
    {/each}

  </div>

</div>

<!-- ══════════════════════════════════════
     LIGHTBOX
══════════════════════════════════════ -->
{#if lightboxOpen && lightboxItem}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="lightbox-backdrop"
    onclick={closeLightbox}
    role="dialog"
    aria-modal="true"
    aria-label="Artwork lightbox"
    onkeydown={handleKeydown}
    tabindex="-1"
  >
    <!-- Stop propagation so clicking card doesn't close -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="lightbox-card"
      onclick={(e) => e.stopPropagation()}
      role="document"
      onkeydown={handleKeydown}
      tabindex="0"
    >
      <!-- Close -->
      <button class="lb-close" onclick={closeLightbox} aria-label="Close lightbox">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Prev -->
      <button class="lb-nav lb-prev" onclick={lbPrev} aria-label="Previous artwork">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>

      <!-- Image -->
      <div class="lb-img-wrap">
        <WatermarkWrapper opacity={0.13} fontSize={13} spacing={90}>
          <img src={lightboxItem.image_url} alt={lightboxItem.title} class="lb-img" />
        </WatermarkWrapper>
        <!-- Format badge -->
        <span class="lb-format">{lightboxItem.file_format}</span>
      </div>

      <!-- Info panel -->
      <div class="lb-info">
        <div class="lb-info-top">
          <h2 class="lb-title">{lightboxItem.title}</h2>
          {#if lightboxItem.description}
            <p class="lb-desc">{lightboxItem.description}</p>
          {/if}
        </div>

        <div class="lb-meta">
          {#if lightboxStatus}
            <span class="lb-status" style="background: {lightboxStatus.bg}; color: {lightboxStatus.color};">
              {lightboxStatus.label}
            </span>
          {/if}
          {#if lightboxItem.price != null}
            <span class="lb-price">{formatRupiah(lightboxItem.price)}</span>
          {/if}
        </div>

        <!-- Counter -->
        <span class="lb-counter">{lightboxIndex + 1} / {items.length}</span>
      </div>

      <!-- Next -->
      <button class="lb-nav lb-next" onclick={lbNext} aria-label="Next artwork">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9,6 15,12 9,18"/>
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  /* ══════════════════════════════════════
     PAGE WRAPPER
  ══════════════════════════════════════ */
  .gallery-page {
    width: 100%;
    max-width: 1020px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 2rem;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  .gallery-page.visible { opacity: 1; transform: translateY(0); }

  /* ══════════════════════════════════════
     HEADER
  ══════════════════════════════════════ */
  .gallery-header {
    background: rgba(240, 235, 227, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 6px 6px 0px #2a2420;
    padding: 2rem 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .header-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7dc8c1;
    margin-bottom: 0.45rem;
  }
  .eyebrow-dot {
    width: 7px; height: 7px;
    background: #7dc8c1;
    border: 2px solid #2a2420;
    border-radius: 50%;
  }

  .gallery-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    color: #2a2420;
    margin: 0 0 0.35rem;
    letter-spacing: -0.01em;
    line-height: 1.05;
    position: relative;
    z-index: 1;
  }

  .gallery-subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    color: rgba(42, 36, 32, 0.5);
    margin: 0;
    position: relative;
    z-index: 1;
  }

  /* Background shapes */
  .header-shape {
    position: absolute;
    border: 2px solid rgba(42, 36, 32, 0.1);
    border-radius: 12px;
    pointer-events: none;
  }
  .header-shape-1 {
    width: 80px; height: 80px;
    background: rgba(162, 225, 219, 0.3);
    top: -18px; right: 40px;
    transform: rotate(-14deg);
  }
  .header-shape-2 {
    width: 55px; height: 55px;
    background: rgba(244, 168, 124, 0.25);
    bottom: -10px; right: 100px;
    transform: rotate(20deg);
  }

  /* ══════════════════════════════════════
     GALLERY GRID
     Masonry-inspired with CSS grid areas
  ══════════════════════════════════════ */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    /* First card spans 2 cols and 2 rows */
    grid-auto-rows: 240px;
  }

  /* ══════════════════════════════════════
     FOLDER CARD
  ══════════════════════════════════════ */
  .folder-card {
    position: relative;
    /* Slight tilt for the "scattered on desk" feel */
    transform: rotate(var(--tilt));
    transition:
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      filter 0.2s ease;
    /* Staggered entrance */
    animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: var(--anim-delay);
    /* So tab peeks above */
    margin-top: 18px;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: rotate(var(--tilt)) translateY(24px) scale(0.9); }
    to   { opacity: 1; transform: rotate(var(--tilt)) translateY(0)     scale(1);   }
  }

  /* Featured: first card spans 2 cols + 2 rows */
  .folder-card.featured {
    grid-column: 1 / 3;
    grid-row:    1 / 3;
    margin-top: 22px;
  }

  /* On hover: snap straight + lift */
  .folder-card.hovered {
    transform: rotate(0deg) translateY(-6px) scale(1.02);
    z-index: 10;
    filter: drop-shadow(6px 8px 0px rgba(42, 36, 32, 0.35));
  }

  /* ── Folder Tab ── */
  .folder-tab {
    position: absolute;
    top: -18px;
    left: 14px;
    height: 22px;
    padding: 0 12px;
    background: var(--tab-color);
    border: 2.5px solid #2a2420;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    z-index: 1;
    box-shadow: 2px -2px 0px rgba(42, 36, 32, 0.15);
  }

  .folder-tab-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: #2a2420;
  }

  /* ── Folder Body ── */
  .folder-body {
    width: 100%;
    height: 100%;
    background: rgba(240, 235, 227, 0.97);
    border: 2.5px solid #2a2420;
    border-radius: 4px 18px 18px 18px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 0px #2a2420;
    transition: box-shadow 0.2s ease;
    /* Fill card height */
    position: absolute;
    inset: 0;
  }

  .folder-card.hovered .folder-body {
    box-shadow: 6px 8px 0px #2a2420;
  }

  /* ── Image ── */
  .folder-img-wrap {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
  }

  .folder-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  }

  .folder-card.hovered .folder-img {
    transform: scale(1.07);
  }

  /* Hover overlay */
  .folder-overlay {
    position: absolute;
    inset: 0;
    background: rgba(42, 36, 32, 0.52);
    opacity: 0;
    transition: opacity 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .folder-card.hovered .folder-overlay { opacity: 1; }

  .overlay-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #efeae4;
    padding: 1rem;
    text-align: center;
  }

  .overlay-zoom {
    width: 48px; height: 48px;
    background: rgba(162, 225, 219, 0.9);
    border: 2px solid #2a2420;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 3px 3px 0px rgba(42, 36, 32, 0.5);
    transform: scale(0.8);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .folder-card.hovered .overlay-zoom {
    transform: scale(1);
  }

  .overlay-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
    line-height: 1.3;
  }

  /* ── Footer ── */
  .folder-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 8px 12px;
    background: rgba(240, 235, 227, 0.97);
    border-top: 2px solid rgba(42, 36, 32, 0.12);
    flex-shrink: 0;
  }

  .folder-footer-left { min-width: 0; }

  .folder-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.75rem;
    color: #2a2420;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .folder-status {
    display: inline-flex;
    align-items: center;
    padding: 2px 9px;
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    border: 1.5px solid rgba(42, 36, 32, 0.18);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ══════════════════════════════════════
     LIGHTBOX
  ══════════════════════════════════════ */
  .lightbox-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(42, 36, 32, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: backdropIn 0.2s ease both;
  }

  @keyframes backdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .lightbox-card {
    background: rgba(240, 235, 227, 0.99);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 10px 10px 0px #2a2420;
    width: 100%;
    max-width: 860px;
    max-height: 90vh;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 1fr auto;
    overflow: hidden;
    position: relative;
    animation: lbCardIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes lbCardIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);     }
  }

  .lb-img-wrap {
    grid-column: 1;
    grid-row: 1;
    position: relative;
    max-height: 60vh;
    overflow: hidden;
    background: #d4ede9;
    border-radius: 0;
  }

  .lb-img {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
  }

  .lb-format {
    position: absolute;
    top: 12px; left: 12px;
    background: rgba(240, 235, 227, 0.92);
    border: 1.5px solid rgba(42, 36, 32, 0.3);
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #2a2420;
    padding: 3px 9px;
  }

  .lb-info {
    grid-column: 1 / -1;
    grid-row: 2;
    padding: 1.25rem 1.75rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    border-top: 2px solid rgba(42, 36, 32, 0.1);
    flex-wrap: wrap;
  }

  .lb-info-top {
    flex: 1;
    min-width: 0;
  }

  .lb-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.35rem;
    color: #2a2420;
    margin: 0 0 0.35rem;
    line-height: 1.2;
  }

  .lb-desc {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.86rem;
    color: #5a4f48;
    line-height: 1.65;
    margin: 0;
  }

  .lb-meta {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .lb-status {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1.5px solid rgba(42, 36, 32, 0.2);
  }

  .lb-price {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    color: #2a2420;
    letter-spacing: 0.02em;
  }

  .lb-counter {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    color: rgba(42, 36, 32, 0.4);
    letter-spacing: 0.06em;
    align-self: flex-end;
    flex-shrink: 0;
  }

  /* Nav buttons */
  .lb-close {
    position: absolute;
    top: 14px; right: 14px;
    width: 32px; height: 32px;
    background: rgba(240, 235, 227, 0.95);
    border: 2px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    z-index: 10;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .lb-close:hover {
    background: #f4a87c;
    transform: scale(1.12);
  }

  .lb-nav {
    position: absolute;
    top: calc(60vh / 2);
    transform: translateY(-50%);
    width: 40px; height: 40px;
    background: rgba(240, 235, 227, 0.92);
    border: 2.5px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 3px 3px 0px #2a2420;
    z-index: 10;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .lb-prev { left: 14px; }
  .lb-next { right: 14px; }
  .lb-nav:hover {
    background: #a2e1db;
    transform: translateY(-50%) scale(1.12);
  }
  .lb-nav:active {
    transform: translateY(-50%) scale(0.93);
    box-shadow: 1px 1px 0px #2a2420;
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */

  /* Tablet */
  @media (max-width: 860px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 200px;
      gap: 1rem;
    }
    .folder-card.featured {
      grid-column: 1 / -1;
      grid-row: 1 / 3;
    }
    .header-shape-1,
    .header-shape-2 { display: none; }
  }

  /* Mobile */
  @media (max-width: 560px) {
    .gallery-header {
      padding: 1.5rem 1.4rem;
      border-radius: 22px;
    }

    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 160px;
      gap: 0.85rem;
    }

    .folder-card.featured {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
    }

    /* On mobile, remove tilt for cleaner layout */
    .folder-card {
      transform: rotate(0deg) !important;
    }
    .folder-card.hovered {
      transform: translateY(-4px) scale(1.015) !important;
    }

    .lightbox-card {
      grid-template-columns: 1fr;
      max-height: 85vh;
      border-radius: 20px;
    }

    .lb-info {
      padding: 1rem 1.1rem;
    }

    .lb-nav {
      top: 35%;
    }
  }

  @media (max-width: 400px) {
    .gallery-grid {
      grid-template-columns: 1fr;
      grid-auto-rows: 220px;
    }
    .folder-card.featured {
      grid-column: 1;
      grid-row: 1;
    }
  }
</style>
