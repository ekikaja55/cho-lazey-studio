<script>
  /**
   * /shop/+page.svelte
   * Cho's Studio — Shop Page
   * "Adoption" concept: buy existing artworks
   *
   * Layout:
   *   Top: section label with info tooltip
   *   Main: left = ShopPreview | right = ShopGrid
   *   Modal: AdoptionModal (when "Adopt" is clicked)
   *   Toast: success message after submit
   *
   * Data: only status available | reserved | sold (not not_sold/archived)
   */

  import { galleryImages } from '$lib/data/galleryImages.js';
  import ShopGrid      from '$lib/components/shop/ShopGrid.svelte';
  import ShopPreview   from '$lib/components/shop/ShopPreview.svelte';
  import AdoptionModal from '$lib/components/shop/AdoptionModal.svelte';
  import { onMount }   from 'svelte';

  let mounted = $state(false);

  // Filter: shop shows available, reserved, sold only
  const shopItems = galleryImages.filter(
    (img) => ['available', 'reserved', 'sold'].includes(img.status)
  );

  // Selected item (preview panel)
  let selectedItem = $state(shopItems[0] ?? null);

  // Modal
  let modalOpen = $state(false);

  // Toast
  let toastVisible  = $state(false);
  let toastMsg      = $state('');
  let toastTimer;

  // Info tooltip toggle
  let infoOpen = $state(false);

  function selectItem(item) {
    selectedItem = item;
  }

  function openAdopt(item) {
    if (item?.status !== 'available') return;
    selectedItem = item;
    modalOpen = true;
  }

  function handleAdoptSubmit({ item, email }) {
    showToast(`✨ Adoption request sent for "${item.title}"! (Prototype — no actual transaction processed)`);
  }

  function showToast(msg) {
    clearTimeout(toastTimer);
    toastMsg = msg;
    toastVisible = true;
    toastTimer = setTimeout(() => { toastVisible = false; }, 5500);
  }

  onMount(() => {
    mounted = true;
    return () => clearTimeout(toastTimer);
  });
</script>

<svelte:head>
  <title>Shop — Cho's Studio</title>
</svelte:head>

<div class="shop-page" class:visible={mounted}>

  <!-- ══ Section header ══ -->
  <div class="shop-section-label animate-fade-up">
    <div class="section-line"></div>
    <div class="section-title-wrap">
      <span class="section-title">READY-TO-BUY DESIGNS</span>
      <!-- Info tooltip -->
      <button
        class="info-btn"
        onclick={() => infoOpen = !infoOpen}
        aria-label="What is adoption?"
        aria-expanded={infoOpen}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="8"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
        </svg>
      </button>
    </div>
    <div class="section-line"></div>
  </div>

  <!-- Info panel -->
  {#if infoOpen}
    <div class="info-panel animate-fade-up" role="note">
      <button class="info-close" onclick={() => infoOpen = false} aria-label="Close info">✕</button>
      <p>
        <strong>What is adoption?</strong><br/>
        "Adopting" a piece means purchasing the right to own and use this artwork.
        You'll receive the full-resolution file directly to your email after payment is verified.
        Each piece can only be adopted once.
      </p>
    </div>
  {/if}

  <!-- ══ Main layout: preview + grid ══ -->
  <div class="shop-layout animate-fade-up stagger-2">

    <!-- Left: selected artwork preview -->
    <div class="preview-col">
      <ShopPreview
        item={selectedItem}
        onadopt={openAdopt}
      />
    </div>

    <!-- Right: thumbnail grid -->
    <div class="grid-col">
      <ShopGrid
        items={shopItems}
        bind:selectedId={selectedItem.gallery_id}
        onselect={selectItem}
      />
    </div>

  </div>

</div>

<!-- ══ Adoption Modal ══ -->
{#if modalOpen && selectedItem}
  <AdoptionModal
    item={selectedItem}
    onclose={() => modalOpen = false}
    onsubmit={handleAdoptSubmit}
  />
{/if}

<!-- ══ Toast ══ -->
{#if toastVisible}
  <div class="toast" role="status" aria-live="polite">
    <span class="toast-icon" aria-hidden="true">🎉</span>
    <span class="toast-msg">{toastMsg}</span>
    <button class="toast-close" onclick={() => toastVisible = false} aria-label="Dismiss">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
{/if}

<style>
  .shop-page {
    width: 100%;
    max-width: 1020px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-bottom: 2rem;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }

  .shop-page.visible { opacity: 1; transform: translateY(0); }

  /* Section label */
  .shop-section-label {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .section-line {
    flex: 1;
    height: 1.5px;
    background: rgba(42,36,32,0.14);
    border-radius: 1px;
  }

  .section-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .section-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: rgba(42,36,32,0.42);
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .info-btn {
    width: 24px; height: 24px;
    background: rgba(162,225,219,0.5);
    border: 1.5px solid rgba(42,36,32,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .info-btn:hover { background: #a2e1db; transform: scale(1.1); }

  /* Info panel */
  .info-panel {
    background: rgba(240,235,227,0.98);
    border: 2px solid rgba(42,36,32,0.2);
    border-radius: 16px;
    padding: 1rem 1.25rem;
    position: relative;
    box-shadow: 4px 4px 0px rgba(42,36,32,0.12);
  }

  .info-close {
    position: absolute;
    top: 10px; right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    color: rgba(42,36,32,0.4);
    padding: 2px 4px;
  }

  .info-panel p {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.82rem;
    color: #4a3f3a;
    line-height: 1.65;
    margin: 0;
    padding-right: 1.5rem;
  }

  /* Main layout */
  .shop-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 1.25rem;
    align-items: start;
  }

  .preview-col { min-width: 0; }
  .grid-col    { min-width: 0; }

  /* Toast */
  .toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 900;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 18px;
    background: rgba(240,235,227,0.99);
    border: 2.5px solid #2a2420;
    border-radius: 18px;
    box-shadow: 6px 6px 0px #2a2420;
    max-width: calc(100vw - 3rem);
    animation: toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.92); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1);   }
  }

  .toast-icon { font-size: 1.2rem; flex-shrink: 0; }

  .toast-msg {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.85rem;
    color: #2a2420;
    line-height: 1.5;
    flex: 1;
  }

  .toast-close {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(42,36,32,0.45);
    padding: 2px;
    flex-shrink: 0;
    margin-top: 2px;
    transition: color 0.15s ease;
  }
  .toast-close:hover { color: #2a2420; }

  /* Responsive */
  @media (max-width: 900px) {
    .shop-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .grid-col { order: -1; }
  }

  @media (max-width: 600px) {
    .shop-page { gap: 1rem; }
    .toast { bottom: 100px; }
  }
</style>
