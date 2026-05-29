<script>
  import { galleryImages } from '$lib/data/galleryImages.js';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import HomeGalleryDetailModal from './HomeGalleryDetailModal.svelte';

  // Lightbox state
  let lightboxOpen = $state(false);
  let lightboxIndex = $state(0);
  let hoveredId = $state(null);

  const items = galleryImages;

  const lightboxItem = $derived(items[lightboxIndex]);

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

  const statusConfig = {
    available:  { label: 'Available',  bg: '#a2e1a6', color: '#1a4d1d' },
    sold:       { label: 'Sold',       bg: '#f46958', color: '#fff'     },
    reserved:   { label: 'Reserved',   bg: '#ffba09', color: '#3d2800'  },
    not_sold:   { label: 'Not Listed', bg: '#b4a6d5', color: '#2d1a5c'  },
    archived:   { label: 'Archived',   bg: '#c8bfb8', color: '#4a3f3a'  },
  };

  const tilts = [
    -1.2, 1.5, -0.8, 1.8, -0.5, 1.1,
    -1.5, 0.8, -1.2, 1.4, -0.4, 0.9,
  ];

  const tabColors = [
    '#a2e1db', '#f4a87c', '#b4a6d5',
    '#a2e1db', '#f4a87c', '#b4a6d5',
    '#a2e1db', '#f4a87c', '#b4a6d5',
    '#a2e1db', '#f4a87c', '#b4a6d5',
  ];
</script>

<div class="gallery-grid" role="list" aria-label="Gallery artworks">
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
      <div class="folder-tab" aria-hidden="true">
        <span class="folder-tab-label">
          {item.file_format}
        </span>
      </div>

      <button
        class="folder-body"
        onclick={() => openLightbox(i)}
        aria-label="View {item.title}"
      >
        <div class="folder-img-wrap">
          <WatermarkWrapper opacity={0.5} fontSize={15} spacing={75}>
            <img
              src={item.image_url}
              alt={item.title}
              class="folder-img"
              loading={i < 4 ? 'eager' : 'lazy'}
            />
          </WatermarkWrapper>
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

        <div class="folder-footer">
          <div class="folder-footer-left">
            <span class="folder-title">{item.title}</span>
          </div>
        </div>
      </button>
    </div>
  {/each}
</div>

<HomeGalleryDetailModal
  isOpen={lightboxOpen}
  item={lightboxItem}
  currentIndex={lightboxIndex}
  totalItems={items.length}
  onClose={closeLightbox}
  onNext={lbNext}
  onPrev={lbPrev}
/>

<style>
  /* ══════════════════════════════════════
     GALLERY GRID
   ══════════════════════════════════════ */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 2rem;
    grid-auto-rows: 250px;
    padding-top: 1rem;
  }

  /* ══════════════════════════════════════
     FOLDER CARD
   ══════════════════════════════════════ */
  .folder-card {
    position: relative;
    grid-column: span 4;
    transform: rotate(var(--tilt));
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease;
    animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: var(--anim-delay);
    margin-top: 24px;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: rotate(var(--tilt)) translateY(24px) scale(0.9); }
    to   { opacity: 1; transform: rotate(var(--tilt)) translateY(0) scale(1); }
  }

  .folder-card.featured {
    grid-column: span 12;
    grid-row: span 2;
    transform: rotate(0deg) !important;
    margin-top: 0;
  }

  .folder-card.hovered {
    transform: rotate(0deg) translateY(-8px) scale(1.03);
    z-index: 20;
    filter: drop-shadow(8px 10px 0px rgba(42, 36, 32, 0.35));
  }

  .folder-card.featured.hovered {
    transform: translateY(-6px) scale(1.01) !important;
  }

  .folder-tab {
    position: absolute; top: -22px; left: 14px; height: 24px; padding: 0 14px;
    background: var(--tab-color); border: 2.5px solid #2a2420; border-bottom: none;
    border-radius: 10px 10px 0 0; display: flex; align-items: center; z-index: 1;
  }
  .folder-tab-label { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.68rem; letter-spacing: 0.1em; color: #2a2420; }

  .folder-body {
    width: 100%; height: 100%; background: #ffffff; border: 2.5px solid #2a2420;
    border-radius: 4px 20px 20px 20px; overflow: hidden; cursor: pointer; padding: 0;
    display: flex; flex-direction: column; box-shadow: 4px 4px 0px #2a2420;
    transition: box-shadow 0.2s ease; position: absolute; inset: 0;
  }
  .folder-card.hovered .folder-body { box-shadow: 6px 8px 0px #2a2420; }

  .folder-img-wrap { flex: 1; position: relative; overflow: hidden; min-height: 0; background: rgba(42, 36, 32, 0.03); }
  .folder-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; }
  .folder-card.hovered .folder-img { transform: scale(1.08); }
  .folder-card.featured.hovered .folder-img { transform: scale(1.04); }

  .folder-overlay {
    position: absolute; inset: 0; background: rgba(42, 36, 32, 0.65); opacity: 0;
    transition: opacity 0.25s ease; display: flex; align-items: center; justify-content: center;
  }
  .folder-card.hovered .folder-overlay { opacity: 1; }
  .overlay-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #ffffff; }
  .overlay-zoom {
    width: 52px; height: 52px; background: var(--tab-color); border: 2.5px solid #2a2420;
    border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #2a2420;
    box-shadow: 3px 3px 0px #2a2420; transform: scale(0.8); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .folder-card.hovered .overlay-zoom { transform: scale(1); }
  .overlay-title { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.9rem; letter-spacing: 0.05em; text-shadow: 0 2px 4px rgba(0,0,0,0.6); }

  .folder-footer {
    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
    padding: 12px 16px; background: #ffffff; border-top: 2.5px solid #2a2420; flex-shrink: 0;
  }
  .folder-footer-left { min-width: 0; width: 100%; }
  .folder-title { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.85rem; color: #2a2420; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }

  @media (max-width: 960px) {
    .gallery-grid { gap: 1.5rem; grid-auto-rows: 260px; }
    .folder-card { grid-column: span 6; }
    .folder-card.featured { grid-column: span 12; grid-row: span 2; }
  }

  @media (max-width: 600px) {
    .gallery-grid { gap: 1.2rem; grid-auto-rows: 280px; }
    .folder-card { grid-column: span 12; transform: rotate(0deg) !important; margin-top: 16px; }
    .folder-card.featured { grid-row: span 1; }
    .folder-card.hovered { transform: translateY(-4px) scale(1.02) !important; }
  }
</style>
