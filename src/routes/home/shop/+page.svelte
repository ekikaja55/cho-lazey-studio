<!-- home/shop/+page.svelte -->
<script>
  import { onMount }      from 'svelte';
  import { goto }         from '$app/navigation';
  import { fade }         from 'svelte/transition';
  import { galleryImages, formatRupiah } from '$lib/data/galleryImages.js';
  import WatermarkWrapper  from '$lib/components/WatermarkWrapper.svelte';
  import ArtworkViewer     from '$lib/components/shop/ArtworkViewer.svelte';
  import PurchaseModal     from '$lib/components/shop/PurchaseModal.svelte';
  import { toast }         from '$lib/stores/toast.js';

  let mounted    = $state(false);
  let selected   = $state(null);
  let showModal  = $state(false);
  let showViewer = $state(false);
  let hoveredId  = $state(null);

  // Exclude archived
  const items = galleryImages.filter(i => i.status !== 'archived');
  const total = items.length;

  const statusCfg = {
    available: { bg: '#a2e1a6', color: '#1a4d1d', label: 'AVAILABLE' },
    reserved:  { bg: '#ffba09', color: '#3d2800', label: 'RESERVED'  },
    sold:      { bg: '#f46958', color: '#fff',     label: 'SOLD'      },
    not_sold:  { bg: '#b4a6d5', color: '#2d1a5c',  label: 'NOT SOLD'  },
    archived:  { bg: '#ccc',    color: '#555',     label: 'ARCHIVED'  },
  };

  function sc(status) { return statusCfg[status] ?? statusCfg.archived; }

  // Tab colors — peach-forward for shop vs turquoise-forward for gallery
  const tabColors = [
    '#f4a87c', '#b4a6d5', '#a2e1db',
    '#f4a87c', '#b4a6d5', '#a2e1db',
    '#f4a87c', '#b4a6d5', '#a2e1db',
    '#f4a87c', '#b4a6d5', '#a2e1db',
  ];

  const tilts = [
    -1.8, 1.2, -0.9, 2.2, -1.4, 1.7,
    -2.1, 0.6, -1.5, 1.9, -0.5, 1.1,
  ];

  function selectItem(item) { selected = item; }

  function openViewer() { if (selected) showViewer = true; }

  function openModal() {
    if (!selected) return;
    if (selected.status === 'sold')     { toast.error('This artwork has already been adopted.'); return; }
    if (selected.status === 'reserved') { toast.warning('Currently reserved. Contact the artist for availability.'); return; }
    if (selected.status === 'not_sold') { toast.info('This artwork is not currently listed for sale.'); return; }
    showModal = true;
  }

  function handleSuccess({ item, email, proofName }) {
    showModal = false;
    const invoiceData = { itemId: item.gallery_id, itemTitle: item.title, itemPrice: item.price, itemFormat: item.file_format, itemStatus: item.status, buyerEmail: email, proofName };
    sessionStorage.setItem('cho_invoice', JSON.stringify(invoiceData));
    toast.success('[PROTOTYPE] Payment submitted! Redirecting to your invoice…');
    setTimeout(() => goto('/home/shop/invoice'), 1200);
  }

  onMount(() => { mounted = true; });

  const canBuy = $derived(selected?.status === 'available');
  const availableCount = $derived(items.filter(i => i.status === 'available').length);

  const buyLabel = $derived(
    !selected ? 'Select a Design' :
    selected.status === 'available' ? 'Adopt This Artwork' :
    selected.status === 'sold'      ? 'Already Adopted' :
    selected.status === 'reserved'  ? 'Currently Reserved' :
    'Not For Sale'
  );
</script>

<svelte:head><title>Shop — Cho's Studio</title></svelte:head>

<div class="shop-root" class:visible={mounted}>

  <!-- ── Header card — same DNA as gallery-header ── -->
  <header class="shop-header animate-fade-up">
    <div class="header-eyebrow">
      <span class="eyebrow-dot" aria-hidden="true"></span>
      <span>✦ adopt an artwork ✦</span>
    </div>
    <h1 class="shop-title">Shop</h1>
    <div class="header-underline" aria-hidden="true"></div>
    <p class="shop-subtitle">
      {total} pieces — select a work, preview it, then make it yours.
    </p>

    <!-- Stats pills -->
    <div class="shop-stats" aria-label="Shop statistics">
      <span class="stat-pill">
        <span class="stat-dot" style="background:#a2e1a6; border-color:#1a4d1d;"></span>
        {availableCount} available
      </span>
      <span class="stat-pill">
        <span class="stat-dot" style="background:#f46958; border-color:#b23a2a;"></span>
        {items.filter(i => i.status === 'sold').length} adopted
      </span>
      <span class="stat-pill">
        <span class="stat-dot" style="background:#ffba09; border-color:#7a5500;"></span>
        {items.filter(i => i.status === 'reserved').length} reserved
      </span>
    </div>

    <!-- Decorative accent shapes — peach palette for shop -->
    <div class="header-shape hs-1" aria-hidden="true"></div>
    <div class="header-shape hs-2" aria-hidden="true"></div>
    <div class="header-shape hs-3" aria-hidden="true"></div>
  </header>

  <!-- ── Main: folder grid + sticky preview ── -->
  <div class="shop-layout">

    <!-- Grid — SAME folder-card DNA as gallery, peach-tab variant -->
    <section class="shop-grid-section" aria-label="Artworks for adoption">
      <div class="shop-grid" role="list">
        {#each items as item, i}
          {@const tilt = tilts[i % tilts.length]}
          {@const tabColor = tabColors[i % tabColors.length]}
          {@const s = sc(item.status)}
          {@const isFeatured = i === 0}

          <div
            class="folder-card"
            class:featured={isFeatured}
            class:hovered={hoveredId === item.gallery_id}
            class:selected-card={selected?.gallery_id === item.gallery_id}
            style="--tilt:{tilt}deg; --tab-color:{tabColor}; --anim-delay:{i * 0.05}s;"
            role="listitem"
            onmouseenter={() => hoveredId = item.gallery_id}
            onmouseleave={() => hoveredId = null}
          >
            <!-- Folder tab -->
            <div class="folder-tab" aria-hidden="true">
              <span class="folder-tab-label">{item.file_format}</span>
            </div>

            <!-- Card body -->
            <button
              class="folder-body"
              onclick={() => selectItem(item)}
              aria-label="Preview {item.title}"
              aria-pressed={selected?.gallery_id === item.gallery_id}
            >
              <div class="folder-img-wrap">
                <WatermarkWrapper opacity={0.14} fontSize={11} spacing={75}>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    class="folder-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                </WatermarkWrapper>

                <!-- Status stamp for unavailable -->
                {#if item.status !== 'available'}
                  <div
                    class="status-stamp"
                    style="background:{s.bg}; color:{s.color};"
                    aria-hidden="true"
                  >{s.label}</div>
                {/if}

                <!-- Hover overlay -->
                <div class="folder-overlay" aria-hidden="true">
                  <div class="overlay-inner">
                    <span class="overlay-icon" aria-hidden="true">
                      <!-- Available: heart; else: eye -->
                      {#if item.status === 'available'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {:else}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      {/if}
                    </span>
                    <span class="overlay-title">{item.title}</span>
                    {#if item.status === 'available'}
                      <span class="overlay-price">{formatRupiah(item.price)}</span>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="folder-footer">
                <span class="folder-title">{item.title}</span>
                <span class="folder-price">{formatRupiah(item.price)}</span>
              </div>
            </button>

            <!-- Selected ring -->
            {#if selected?.gallery_id === item.gallery_id}
              <div class="selected-ring" aria-hidden="true"></div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Preview panel — sticky on desktop -->
    <aside class="preview-panel" aria-label="Artwork preview">

      <!-- Panel inner card — same border+shadow DNA -->
      <div class="panel-card">

        <!-- Panel header bar -->
        <div class="panel-header">
          <div class="panel-header-left">
            <span class="panel-eyebrow">Preview</span>
            <span class="panel-name">
              {selected ? selected.title : 'Select an artwork'}
            </span>
          </div>
          {#if selected}
            <button class="view-full-btn" onclick={openViewer} aria-label="View full size">
              View Full
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            </button>
          {/if}
        </div>

        <!-- Image area -->
        <div class="preview-frame" class:has-image={!!selected}>
          {#if selected}
            {#key selected.gallery_id}
              <div class="preview-img-wrap" in:fade={{ duration: 220 }}>
                <WatermarkWrapper opacity={0.26} fontSize={11} spacing={65}>
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    class="preview-img"
                    draggable="false"
                  />
                </WatermarkWrapper>
                <!-- Tab accent on preview image -->
                <div class="preview-tab-accent" aria-hidden="true"></div>
              </div>
            {/key}
          {:else}
            <div class="preview-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4b0a8" stroke-width="1.5" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <p>Click an artwork<br>to preview it here</p>
            </div>
          {/if}
        </div>

        <!-- Detail strip -->
        {#if selected}
          {@const s = sc(selected.status)}
          <div class="detail-strip" in:fade={{ duration: 180 }}>
            <div class="detail-row">
              <div class="detail-cell">
                <span class="detail-label">Format</span>
                <span class="detail-value fmt-badge">{selected.file_format}</span>
              </div>
              <div class="detail-cell">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="background:{s.bg}; color:{s.color}; padding:2px 8px; border-radius:6px; font-size:0.65rem; font-weight:700; border:1.5px solid rgba(42,36,32,.2);">{s.label}</span>
              </div>
            </div>
            <div class="price-row">
              <span class="price-label-sm">Price</span>
              <span class="price-big">{formatRupiah(selected.price)}</span>
            </div>
          </div>
        {:else}
          <!-- Skeleton -->
          <div class="detail-skeleton-wrap">
            <div class="skeleton-row">
              <div class="skel"></div>
              <div class="skel"></div>
            </div>
            <div class="skel tall"></div>
          </div>
        {/if}

        <!-- Adopt button -->
        <button
          class="btn-adopt"
          class:unavailable={!canBuy}
          disabled={!canBuy}
          onclick={openModal}
          aria-label={buyLabel}
        >
          {#if canBuy}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {:else}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          {/if}
          {buyLabel}
        </button>

      </div>
    </aside>

  </div>
</div>

<!-- Modals -->
{#if showViewer && selected}
  <ArtworkViewer item={selected} onClose={() => showViewer = false} />
{/if}

{#if showModal && selected}
  <PurchaseModal
    item={selected}
    onClose={() => showModal = false}
    onSuccess={handleSuccess}
  />
{/if}

<style>
  /* ══════════════════════════════════════
     ROOT
  ══════════════════════════════════════ */
  .shop-root {
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
  .shop-root.visible { opacity: 1; transform: translateY(0); }

  /* ══════════════════════════════════════
     HEADER — identical DNA to gallery-header
     Nuance: peach accent instead of turquoise
  ══════════════════════════════════════ */
  .shop-header {
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
    /* Peach instead of turquoise */
    color: #d4845a;
    margin-bottom: 0.45rem;
  }

  .eyebrow-dot {
    width: 7px; height: 7px;
    background: #f4a87c;
    border: 2px solid #2a2420;
    border-radius: 50%;
  }

  .shop-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    color: #2a2420;
    margin: 0 0 0.35rem;
    letter-spacing: -0.01em;
    line-height: 1.05;
    position: relative; z-index: 1;
  }

  .header-underline {
    width: 56px; height: 4px;
    background: linear-gradient(90deg, #f4a87c, #b4a6d5);
    border-radius: 2px;
    margin-bottom: 0.85rem;
    position: relative; z-index: 1;
  }

  .shop-subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    color: rgba(42,36,32,0.5);
    margin: 0 0 1rem;
    position: relative; z-index: 1;
  }

  /* Stats pills */
  .shop-stats {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    position: relative; z-index: 1;
  }

  .stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: rgba(240,235,227,0.7);
    border: 1.5px solid rgba(42,36,32,0.15);
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(42,36,32,0.65);
  }

  .stat-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    flex-shrink: 0;
  }

  /* Decorative shapes — same pattern, peach palette */
  .header-shape {
    position: absolute;
    border: 2px solid rgba(42,36,32,0.1);
    border-radius: 12px;
    pointer-events: none;
  }
  .hs-1 { width: 72px; height: 72px; background: rgba(244,168,124,0.28); top: -16px; right: 36px; transform: rotate(-12deg); }
  .hs-2 { width: 48px; height: 48px; background: rgba(180,166,213,0.22); bottom: -8px; right: 92px; transform: rotate(19deg); }
  .hs-3 { width: 34px; height: 34px; background: rgba(162,225,219,0.2);  top: 22px;  right: 118px; transform: rotate(5deg); }

  /* ══════════════════════════════════════
     LAYOUT: 2-col on desktop
  ══════════════════════════════════════ */
  .shop-layout {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 1.5rem;
    align-items: start;
  }

  /* ══════════════════════════════════════
     FOLDER GRID — exact DNA from gallery
     Nuance: 3-col uniform (no featured span),
     tab colors peach-first,
     selected-ring in peach
  ══════════════════════════════════════ */
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.1rem;
    grid-auto-rows: 190px;
  }

  /* Featured: first item 2×2 */
  .folder-card.featured {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
    margin-top: 22px;
  }

  .folder-card {
    position: relative;
    transform: rotate(var(--tilt));
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s ease;
    animation: cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
    animation-delay: var(--anim-delay);
    margin-top: 18px;
  }

  @keyframes cardIn {
    from { opacity:0; transform: rotate(var(--tilt)) translateY(20px) scale(0.9); }
    to   { opacity:1; transform: rotate(var(--tilt)) translateY(0)     scale(1);  }
  }

  .folder-card.hovered {
    transform: rotate(0deg) translateY(-5px) scale(1.02);
    z-index: 10;
    filter: drop-shadow(5px 7px 0px rgba(42,36,32,0.3));
  }

  /* Selected: peach ring instead of turquoise */
  .selected-ring {
    position: absolute;
    inset: -4px;
    border: 3px solid #f4a87c;
    border-radius: 22px;
    pointer-events: none;
    z-index: 8;
    animation: ringPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes ringPop {
    from { opacity:0; transform: scale(1.12); }
    to   { opacity:1; transform: scale(1); }
  }

  /* Folder tab */
  .folder-tab {
    position: absolute;
    top: -18px; left: 14px;
    height: 22px;
    padding: 0 12px;
    background: var(--tab-color);
    border: 2.5px solid #2a2420;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    z-index: 1;
    box-shadow: 2px -2px 0px rgba(42,36,32,0.12);
  }

  .folder-tab-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: #2a2420;
  }

  /* Folder body */
  .folder-body {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    background: rgba(240,235,227,0.97);
    border: 2.5px solid #2a2420;
    border-radius: 4px 18px 18px 18px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 0px #2a2420;
    transition: box-shadow 0.2s ease;
  }

  .folder-card.hovered .folder-body { box-shadow: 6px 7px 0px #2a2420; }
  .folder-card.selected-card .folder-body { box-shadow: 5px 5px 0px #f4a87c, 7px 7px 0px #2a2420; }

  /* Image */
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
    transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
  }

  .folder-card.hovered .folder-img { transform: scale(1.07); }

  /* Status stamp */
  .status-stamp {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-14deg);
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: 999px;
    border: 2px solid rgba(42,36,32,0.35);
    box-shadow: 2px 2px 0px rgba(42,36,32,0.25);
    white-space: nowrap;
    z-index: 6;
    pointer-events: none;
  }

  /* Hover overlay */
  .folder-overlay {
    position: absolute;
    inset: 0;
    background: rgba(42,36,32,0.5);
    opacity: 0;
    transition: opacity 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }

  .folder-card.hovered .folder-overlay { opacity: 1; }

  .overlay-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #efeae4;
    padding: 0.75rem;
    text-align: center;
  }

  .overlay-icon {
    width: 44px; height: 44px;
    background: rgba(244,168,124,0.9);
    border: 2px solid #2a2420;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 2px 2px 0px rgba(42,36,32,0.4);
    transform: scale(0.8);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    flex-shrink: 0;
  }

  .folder-card.hovered .overlay-icon { transform: scale(1); }

  .overlay-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    line-height: 1.3;
  }

  .overlay-price {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    color: #f4a87c;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  }

  /* Footer */
  .folder-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    padding: 7px 11px;
    background: rgba(240,235,227,0.97);
    border-top: 2px solid rgba(42,36,32,0.1);
    flex-shrink: 0;
  }

  .folder-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.72rem;
    color: #2a2420;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .folder-price {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: #d4845a;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ══════════════════════════════════════
     PREVIEW PANEL — sticky sidebar
  ══════════════════════════════════════ */
  .preview-panel {
    position: sticky;
    top: 1.5rem;
  }

  .panel-card {
    background: rgba(240,235,227,0.97);
    border: 3px solid #2a2420;
    border-radius: 24px;
    box-shadow: 6px 6px 0px #2a2420;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Panel header */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.9rem 1rem 0.7rem;
    border-bottom: 2.5px solid rgba(42,36,32,0.1);
    background: rgba(244,168,124,0.12);
    flex-shrink: 0;
  }

  .panel-header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .panel-eyebrow {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #d4845a;
  }

  .panel-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.85rem;
    color: #2a2420;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    font-style: italic;
  }

  .view-full-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    background: rgba(240,235,227,0.9);
    border: 2px solid #2a2420;
    border-radius: 999px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.65rem;
    letter-spacing: 0.04em;
    color: #2a2420;
    cursor: pointer;
    box-shadow: 2px 2px 0px #2a2420;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .view-full-btn:hover {
    background: #f4a87c;
    transform: translateY(-1px);
  }

  /* Preview frame */
  .preview-frame {
    position: relative;
    height: 220px;
    background: #c8e3e0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .preview-img-wrap {
    position: absolute;
    inset: 0;
  }

  .preview-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Subtle peach tab accent on preview */
  .preview-tab-accent {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #f4a87c, #b4a6d5, #a2e1db);
    z-index: 6;
    pointer-events: none;
  }

  .preview-empty {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: #b0a09a;
    text-align: center;
  }

  .preview-empty p {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem;
    line-height: 1.5;
    margin: 0;
    color: #b0a09a;
  }

  /* Detail strip */
  .detail-strip {
    border-bottom: 1.5px solid rgba(42,36,32,0.08);
    flex-shrink: 0;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1.5px solid rgba(42,36,32,0.07);
  }

  .detail-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 9px 12px;
  }

  .detail-cell:first-child { border-right: 1.5px solid rgba(42,36,32,0.07); }

  .detail-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9a8e88;
  }

  .detail-value { display: inline-block; }

  .fmt-badge {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.75rem;
    color: #2a2420;
    background: rgba(244,168,124,0.22);
    border: 1.5px solid rgba(244,168,124,0.5);
    border-radius: 6px;
    padding: 2px 8px;
  }

  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    background: rgba(244,168,124,0.1);
    border-top: 1.5px solid rgba(244,168,124,0.2);
  }

  .price-label-sm {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9a8e88;
  }

  .price-big {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.05rem;
    color: #d4845a;
    letter-spacing: 0.02em;
  }

  /* Skeleton */
  .detail-skeleton-wrap { padding: 10px 12px; display: flex; flex-direction: column; gap: 7px; }
  .skeleton-row { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .skel { height: 48px; background: rgba(42,36,32,0.05); border-radius: 9px; animation: shimmer 1.5s ease-in-out infinite alternate; }
  .skel.tall { height: 38px; }
  @keyframes shimmer { from{opacity:.4} to{opacity:.9} }

  /* Adopt button */
  .btn-adopt {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 12px;
    padding: 13px;
    background: #f4a87c;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.92rem;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    box-shadow: 4px 4px 0px #2a2420;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  }

  .btn-adopt:hover:not(.unavailable) {
    background: #e89060;
    transform: translateY(-2px);
    box-shadow: 5px 6px 0px #2a2420;
  }

  .btn-adopt:active:not(.unavailable) {
    transform: translateY(1px);
    box-shadow: 2px 2px 0px #2a2420;
  }

  .btn-adopt.unavailable {
    background: rgba(42,36,32,0.06);
    color: #9a8e88;
    border-color: rgba(42,36,32,0.18);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */
  @media (max-width: 960px) {
    .shop-layout {
      grid-template-columns: 1fr;
    }
    .preview-panel {
      position: static;
      order: -1;
    }
    .panel-card {
      max-width: 560px;
      margin: 0 auto;
    }
    .preview-frame { height: 200px; }
  }

  @media (max-width: 680px) {
    .shop-grid {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 145px;
      gap: 0.85rem;
    }
    .folder-card.featured {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
    }
    /* No tilt on small screens */
    .folder-card { transform: rotate(0deg) !important; }
    .folder-card.hovered { transform: translateY(-3px) scale(1.015) !important; }

    .shop-header { padding: 1.5rem 1.4rem; border-radius: 22px; }
    .shop-title { font-size: clamp(1.8rem, 7vw, 2.5rem); }
  }

  @media (max-width: 420px) {
    .shop-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 155px;
    }
    .folder-card.featured {
      grid-column: 1 / -1;
      grid-row: 1 / 1;
    }
    .shop-stats { gap: 5px; }
    .stat-pill { font-size: 0.65rem; padding: 3px 9px; }
  }
</style>
