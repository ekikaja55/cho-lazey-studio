<!-- home/shop/+page.svelte -->
<script>
  import { onMount }      from 'svelte';
  import { goto }         from '$app/navigation';
  import { fade, fly }    from 'svelte/transition';
  import { galleryImages, getRecentWorks, formatRupiah } from '$lib/data/galleryImages.js';
  import WatermarkWrapper  from '$lib/components/WatermarkWrapper.svelte';
  import ArtworkViewer     from '$lib/components/shop/ArtworkViewer.svelte';
  import PurchaseModal     from '$lib/components/shop/PurchaseModal.svelte';
  import { toast }         from '$lib/stores/toast.js';

  // ── State ──
  let mounted    = $state(false);
  let selected   = $state(null);
  let showModal  = $state(false);
  let showViewer = $state(false);

  // Filter: exclude archived
  const items = galleryImages.filter(i => i.status !== 'archived');
  const total = items.length;

  // Status config
  const statusCfg = {
    available: { bg: '#a2e1a6', color: '#1a4d1d', label: 'AVAILABLE' },
    reserved:  { bg: '#ffba09', color: '#3d2800', label: 'RESERVED'  },
    sold:      { bg: '#f46958', color: '#fff',     label: 'SOLD'      },
    not_sold:  { bg: '#b4a6d5', color: '#2d1a5c',  label: 'NOT SOLD'  },
    archived:  { bg: '#ccc',    color: '#555',     label: 'ARCHIVED'  },
  };

  function sc(status) { return statusCfg[status] ?? statusCfg.archived; }

  function selectItem(item) { selected = item; }

  function openViewer() {
    if (!selected) return;
    showViewer = true;
  }

  function openModal() {
    if (!selected) return;
    if (selected.status === 'sold') {
      toast.error('This artwork has already been adopted.');
      return;
    }
    if (selected.status === 'reserved') {
      toast.warning('This artwork is currently reserved. Contact the artist for availability.');
      return;
    }
    if (selected.status === 'not_sold') {
      toast.info('This artwork is not currently listed for sale.');
      return;
    }
    showModal = true;
  }

  function closeModal()  { showModal  = false; }
  function closeViewer() { showViewer = false; }

  function handleSuccess({ item, email, proofName }) {
    showModal = false;
    const invoiceData = {
      itemId:     item.gallery_id,
      itemTitle:  item.title,
      itemPrice:  item.price,
      itemFormat: item.file_format,
      itemStatus: item.status,
      buyerEmail: email,
      proofName,
    };
    sessionStorage.setItem('cho_invoice', JSON.stringify(invoiceData));
    toast.success('[PROTOTYPE] Payment submitted! Redirecting to your invoice…');
    setTimeout(() => goto('/home/shop/invoice'), 1200);
  }

  onMount(() => { mounted = true; });

  const canBuy = $derived(selected?.status === 'available');
  const buyLabel = $derived(() => {
    if (!selected) return 'Select a Design';
    const map = {
      available: 'Adopt This Artwork',
      sold:      'Already Adopted',
      reserved:  'Currently Reserved',
      not_sold:  'Not For Sale',
    };
    return map[selected.status] ?? 'Unavailable';
  });

  // Count by status for header stats
  const availableCount = $derived(items.filter(i => i.status === 'available').length);
</script>

<svelte:head>
  <title>Shop — Cho's Studio</title>
</svelte:head>

<main class="shop-root" class:visible={mounted}>

  <!-- ── Header ── -->
  <header class="shop-header">
    <div class="shop-header-inner">
      <div class="shop-tag">
        <span class="tag-dot" aria-hidden="true"></span>
        READY-TO-BUY DESIGNS
        <button class="info-btn" aria-label="What is adoption?" title="Adopt an artwork to receive the original high-res file.">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
        </button>
      </div>
      <h1 class="shop-title">Adopt an Artwork</h1>
      <p class="shop-desc">
        {total} pieces — digital art, illustrations &amp; more.
        Select a piece to preview, then adopt it as your own.
      </p>

      <!-- Stats pills -->
      <div class="shop-stats" aria-label="Shop statistics">
        <span class="stat-pill stat-avail">
          <span class="stat-dot" style="background:#a2e1a6"></span>
          {availableCount} available
        </span>
        <span class="stat-pill">
          <span class="stat-dot" style="background:#f46958"></span>
          {items.filter(i => i.status === 'sold').length} adopted
        </span>
        <span class="stat-pill">
          <span class="stat-dot" style="background:#ffba09"></span>
          {items.filter(i => i.status === 'reserved').length} reserved
        </span>
      </div>
    </div>

    <!-- Decorative shapes -->
    <div class="header-deco" aria-hidden="true">
      <div class="deco-sq deco-sq-1"></div>
      <div class="deco-sq deco-sq-2"></div>
      <div class="deco-sq deco-sq-3"></div>
    </div>
  </header>

  <!-- ── Main layout ── -->
  <div class="shop-layout">

    <!-- Right: Artwork grid (rendered first in DOM for mobile) -->
    <section class="artwork-grid-section" aria-label="Available artworks">
      <div class="artwork-grid">
        {#each items as item (item.gallery_id)}
          <button
            class="art-thumb"
            class:active={selected?.gallery_id === item.gallery_id}
            onclick={() => selectItem(item)}
            aria-label="Preview {item.title}"
            aria-pressed={selected?.gallery_id === item.gallery_id}
          >
            <div class="thumb-img-wrap">
              <img
                src={item.image_url}
                alt={item.title}
                class="thumb-img"
                loading="lazy"
              />
              {#if item.status !== 'available'}
                <div
                  class="thumb-status"
                  style="background:{sc(item.status).bg}; color:{sc(item.status).color}"
                  aria-hidden="true"
                >
                  {sc(item.status).label}
                </div>
              {/if}
              <div class="thumb-format" aria-hidden="true">{item.file_format}</div>
            </div>
          </button>
        {/each}
      </div>
    </section>

    <!-- Left: Preview panel (sticky sidebar) -->
    <aside class="preview-panel" aria-label="Artwork preview">
      <div class="panel-card">

        <!-- Panel header -->
        <div class="panel-header">
          <h2 class="panel-title">Preview</h2>
          {#if selected}
            <button class="view-full-btn" onclick={openViewer}>
              View Full
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            </button>
          {/if}
        </div>

        <p class="panel-sub">{selected ? selected.title : 'Click any artwork to preview'}</p>

        <!-- Image preview -->
        <div class="preview-frame" class:has-image={!!selected}>
          {#if selected}
            {#key selected.gallery_id}
              <div class="preview-img-wrap" in:fade={{ duration: 250 }}>
                <WatermarkWrapper opacity={0.28} fontSize={11} spacing={65}>
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    class="featured-img"
                    loading="lazy"
                    draggable="false"
                  />
                </WatermarkWrapper>
              </div>
            {/key}
          {:else}
            <div class="preview-empty">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#b4a6a0" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p>Click an image<br>to preview it here</p>
            </div>
          {/if}
        </div>

        {#if selected}
          <!-- Detail card -->
          <div class="detail-card" in:fade={{ duration: 200 }}>

            <!-- Format + status row -->
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">Format</span>
                <span class="detail-value badge-format">{selected.file_format}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span
                  class="detail-value badge-status"
                  style="background:{sc(selected.status).bg}; color:{sc(selected.status).color}"
                >
                  {sc(selected.status).label}
                </span>
              </div>
            </div>

            <!-- Price -->
            <div class="price-section">
              <span class="price-label-sm">Price</span>
              <span class="price-big">{selected ? formatRupiah(selected.price) : '—'}</span>
            </div>

          </div>
        {:else}
          <!-- Empty detail placeholder -->
          <div class="detail-empty">
            <div class="detail-empty-row">
              <div class="detail-skeleton"></div>
              <div class="detail-skeleton"></div>
            </div>
            <div class="detail-skeleton tall"></div>
          </div>
        {/if}

        <!-- Buy button -->
        <button
          class="btn-buy"
          class:disabled={!canBuy}
          disabled={!canBuy}
          onclick={openModal}
          aria-label="Adopt this artwork"
        >
          {#if canBuy}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          {/if}
          {buyLabel()}
        </button>

      </div>
    </aside>

  </div>
</main>

<!-- Full-screen artwork viewer -->
{#if showViewer && selected}
  <ArtworkViewer item={selected} onClose={closeViewer} />
{/if}

<!-- Purchase modal -->
{#if showModal && selected}
  <PurchaseModal
    item={selected}
    onClose={closeModal}
    onSuccess={handleSuccess}
  />
{/if}

<style>
  .shop-root {
    min-height: 100vh;
    padding-bottom: 4rem;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .shop-root.visible { opacity: 1; }

  /* ── Header ── */
  .shop-header {
    position: relative;
    overflow: hidden;
    padding: 2.5rem 2rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .shop-header-inner { position: relative; z-index: 1; }

  .shop-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #477c77;
    background: rgba(125,200,193,0.15);
    border: 1.5px solid rgba(125,200,193,0.4);
    padding: 5px 14px;
    border-radius: 999px;
    width: fit-content;
    margin-bottom: 0.75rem;
  }

  .tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #7dc8c1;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }

  .info-btn {
    background: none; border: none; cursor: pointer;
    color: #7dc8c1; display: flex; align-items: center;
    padding: 1px; border-radius: 50%;
    transition: color 0.2s ease;
  }
  .info-btn:hover { color: #2a2420; }

  .shop-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    color: #2a2420;
    margin: 0 0 0.5rem;
  }

  .shop-desc {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.92rem;
    color: #6b5f5a;
    margin: 0 0 1rem;
  }

  /* Stats pills */
  .shop-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0.5rem;
  }

  .stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    color: #5a504a;
    background: rgba(239,234,228,0.85);
    border: 1.5px solid rgba(42,36,32,0.12);
    border-radius: 999px;
    padding: 4px 12px;
  }

  .stat-dot {
    width: 7px; height: 7px; border-radius: 50%;
    flex-shrink: 0;
  }

  /* Header deco */
  .header-deco { position: absolute; top: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden; width: 220px; }
  .deco-sq {
    position: absolute;
    border-radius: 8px;
    border: 2px solid rgba(42,36,32,0.1);
  }
  .deco-sq-1 { width: 80px; height: 80px; background: rgba(162,225,219,0.3); top: 10%; right: 5%;  transform: rotate(15deg); }
  .deco-sq-2 { width: 55px; height: 55px; background: rgba(244,168,124,0.25); bottom: 10%; right: 20%; transform: rotate(-8deg); }
  .deco-sq-3 { width: 35px; height: 35px; background: rgba(180,166,213,0.2); top: 55%; right: 8%; transform: rotate(25deg); }

  /* ── Shop layout ── */
  .shop-layout {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
    align-items: start;
  }

  /* Grid first in DOM, panel second — but visually panel is on right */
  .preview-panel { order: 1; position: sticky; top: 80px; }
  .artwork-grid-section { order: 0; }

  /* ── Panel card ── */
  .panel-card {
    background: rgba(250,247,242,0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 2.5px solid #2a2420;
    border-radius: 18px;
    box-shadow: 5px 5px 0 #2a2420;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 6px;
    border-bottom: 1.5px solid rgba(42,36,32,0.08);
  }

  .panel-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    color: #2a2420;
    margin: 0;
  }

  .view-full-btn {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.75rem;
    color: #2a2420; background: transparent;
    border: 1.5px solid rgba(42,36,32,0.25); border-radius: 6px;
    padding: 4px 10px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .view-full-btn:hover { background: rgba(125,200,193,0.15); border-color: #7dc8c1; color: #2a7a74; }

  .panel-sub {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    color: #7a6f68;
    margin: 0;
    padding: 6px 16px 10px;
    font-style: italic;
  }

  /* Preview frame */
  .preview-frame {
    margin: 0 12px;
    border: 2px solid rgba(42,36,32,0.12);
    border-radius: 10px;
    background: #c5e8e5;
    aspect-ratio: 4/3;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .preview-img-wrap { width: 100%; height: 100%; position: relative; }

  .featured-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .preview-empty {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    color: #9a8e88;
  }
  .preview-empty p {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    text-align: center;
    line-height: 1.5;
    margin: 0;
  }

  /* ── Detail card ── */
  .detail-card {
    margin: 10px 12px 0;
    background: rgba(42,36,32,0.03);
    border: 1.5px solid rgba(42,36,32,0.1);
    border-radius: 12px;
    overflow: hidden;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1.5px solid rgba(42,36,32,0.08);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
  }

  .detail-item:first-child {
    border-right: 1.5px solid rgba(42,36,32,0.08);
  }

  .detail-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9a8e88;
  }

  .badge-format {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.82rem;
    color: #2a2420;
    background: rgba(125,200,193,0.2);
    border: 1.5px solid rgba(125,200,193,0.5);
    border-radius: 6px;
    padding: 2px 8px;
    width: fit-content;
    font-size: 0.75rem;
  }

  .badge-status {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1.5px solid rgba(42,36,32,0.2);
    width: fit-content;
  }

  .price-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: rgba(244,168,124,0.12);
    border-top: 1.5px solid rgba(244,168,124,0.3);
  }

  .price-label-sm {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7a6f68;
  }

  .price-big {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.1rem;
    color: #2a2420;
    letter-spacing: 0.02em;
  }

  /* Skeleton placeholders */
  .detail-empty {
    margin: 10px 12px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-empty-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .detail-skeleton {
    height: 52px;
    background: rgba(42,36,32,0.06);
    border-radius: 10px;
    animation: shimmer 1.5s ease-in-out infinite alternate;
  }

  .detail-skeleton.tall { height: 44px; grid-column: 1 / -1; }

  @keyframes shimmer { from { opacity: 0.5; } to { opacity: 1; } }

  /* Buy button */
  .btn-buy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: calc(100% - 24px);
    margin: 12px 12px 14px;
    padding: 13px;
    background: #a2e1db;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.95rem;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    box-shadow: 3px 3px 0 #2a2420;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease;
  }

  .btn-buy:hover:not(.disabled) {
    background: #7dc8c1;
    transform: translateY(-2px);
    box-shadow: 4px 5px 0 #2a2420;
  }

  .btn-buy:active:not(.disabled) {
    transform: translateY(1px);
    box-shadow: 1px 1px 0 #2a2420;
  }

  .btn-buy.disabled, .btn-buy:disabled {
    background: rgba(42,36,32,0.07);
    color: #9a8e88;
    border-color: rgba(42,36,32,0.2);
    box-shadow: none;
    cursor: not-allowed;
  }

  /* ── Artwork grid ── */
  .artwork-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .art-thumb {
    position: relative;
    aspect-ratio: 1;
    border-radius: 10px;
    overflow: hidden;
    border: 2.5px solid rgba(42,36,32,0.15);
    background: #d8d2cc;
    cursor: pointer;
    padding: 0;
    transition: border-color 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  }

  .art-thumb:hover {
    border-color: #2a2420;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 3px 3px 0 #2a2420;
    z-index: 1;
  }

  .art-thumb.active {
    border-color: #7dc8c1;
    border-width: 3px;
    box-shadow: 0 0 0 3px rgba(125,200,193,0.35), 3px 3px 0 #2a2420;
    transform: translateY(-2px);
  }

  .thumb-img-wrap { position: relative; width: 100%; height: 100%; }

  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: filter 0.2s ease;
  }

  .art-thumb:has(.thumb-status) .thumb-img { filter: brightness(0.75) saturate(0.6); }

  .thumb-status {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-10deg);
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 999px;
    border: 2px solid rgba(42,36,32,0.4);
    white-space: nowrap;
    box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
  }

  .thumb-format {
    position: absolute;
    top: 5px; left: 5px;
    background: rgba(239,234,228,0.9);
    border: 1.5px solid #2a2420;
    border-radius: 4px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 1px 5px;
    color: #2a2420;
  }

  /* ── Responsive ── */
  @media (max-width: 960px) {
    .shop-layout {
      grid-template-columns: 1fr;
    }
    .preview-panel { order: 0; position: static; }
    .artwork-grid-section { order: 1; }
    .panel-card { max-width: 540px; margin: 0 auto; }
  }

  @media (max-width: 600px) {
    .shop-layout { padding: 0 1rem; gap: 1rem; }
    .shop-header { padding: 1.5rem 1rem 1rem; }
    .artwork-grid { grid-template-columns: repeat(3, 1fr); gap: 7px; }
    .shop-title { font-size: clamp(1.7rem, 7vw, 2.4rem); }
  }

  @media (max-width: 400px) {
    .artwork-grid { grid-template-columns: repeat(2, 1fr); }
    .shop-stats { gap: 5px; }
    .stat-pill { font-size: 0.65rem; padding: 3px 9px; }
  }
</style>
