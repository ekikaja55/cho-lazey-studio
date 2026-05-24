<script>
  /**
   * ShopPreview.svelte
   * Left panel: shows selected artwork with watermark,
   * file format, price, and "Adopt" CTA
   */

  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import { formatRupiah } from '$lib/data/galleryImages.js';

  let {
    item     = null,
    onadopt  = () => {},
  } = $props();

  const statusConfig = {
    available: { label: 'Available', bg: '#a2e1a6', color: '#1a4d1d' },
    sold:      { label: 'Sold',      bg: '#f46958', color: '#fff'     },
    reserved:  { label: 'Reserved',  bg: '#ffba09', color: '#3d2800'  },
  };

  const status = $derived(item ? (statusConfig[item.status] ?? statusConfig.available) : null);
  const canAdopt = $derived(item?.status === 'available');
</script>

<div class="preview-panel" class:empty={!item}>

  {#if item}
    <!-- ── Header bar ── -->
    <div class="preview-header">
      <div class="preview-header-left">
        <span class="preview-label">Preview</span>
        <span class="preview-name">{item.title}</span>
      </div>
      <div class="preview-header-right">
        <span class="format-pill">{item.file_format}</span>
        {#if status}
          <span
            class="status-pill"
            style="background: {status.bg}; color: {status.color};"
          >
            {status.label}
          </span>
        {/if}
      </div>
    </div>

    <!-- ── Image with watermark ── -->
    <div class="preview-img-frame">
      <WatermarkWrapper opacity={0.16} fontSize={14} spacing={88}>
        <img
          src={item.image_url}
          alt={item.title}
          class="preview-img"
        />
      </WatermarkWrapper>
    </div>

    <!-- ── Meta strip ── -->
    <div class="preview-meta">
      <div class="meta-row">
        <span class="meta-key">FILE FORMAT:</span>
        <span class="meta-val format-badge">{item.file_format}</span>
      </div>
      <div class="meta-row">
        <span class="meta-key">Price:</span>
        <span class="meta-val price-val">
          {formatRupiah(item.price)}
        </span>
      </div>
      {#if item.description}
        <p class="preview-desc">{item.description}</p>
      {/if}
    </div>

    <!-- ── CTA ── -->
    <div class="preview-cta">
      {#if canAdopt}
        <button
          class="btn-adopt"
          onclick={() => onadopt(item)}
          aria-label="Adopt {item.title}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Adopt This Piece
        </button>
      {:else}
        <div class="unavailable-msg">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
          This piece is no longer available for adoption.
        </div>
      {/if}
    </div>

  {:else}
    <!-- Empty state -->
    <div class="empty-hint" aria-live="polite">
      <div class="empty-icon" aria-hidden="true">🎨</div>
      <p>Select an artwork from the grid to preview it here.</p>
    </div>
  {/if}

</div>

<style>
  /* ══════════════════════════════════════
     PANEL SHELL
  ══════════════════════════════════════ */
  .preview-panel {
    background: rgba(240, 235, 227, 0.97);
    border: 2.5px solid rgba(42, 36, 32, 0.2);
    border-radius: 22px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .preview-panel.empty {
    justify-content: center;
    align-items: center;
    min-height: 340px;
  }

  /* ── Header bar ── */
  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem 1.1rem;
    border-bottom: 2px solid rgba(42,36,32,0.1);
    flex-shrink: 0;
  }

  .preview-header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .preview-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(42,36,32,0.42);
  }

  .preview-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.9rem;
    color: #2a2420;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .preview-header-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .format-pill {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 3px 9px;
    background: rgba(42,36,32,0.1);
    color: #2a2420;
    border-radius: 999px;
    border: 1.5px solid rgba(42,36,32,0.2);
  }

  .status-pill {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1.5px solid rgba(42,36,32,0.2);
  }

  /* ── Image ── */
  .preview-img-frame {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    position: relative;
    background: #c8e9e6;
  }

  .preview-img {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
    max-height: 360px;
  }

  /* ── Meta strip ── */
  .preview-meta {
    padding: 0.85rem 1.1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    flex-shrink: 0;
  }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(42,36,32,0.04);
    border: 1.5px solid rgba(42,36,32,0.1);
    border-radius: 10px;
  }

  .meta-key {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(42,36,32,0.5);
  }

  .format-badge {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    color: #2a2420;
    background: rgba(162,225,219,0.5);
    padding: 2px 9px;
    border-radius: 999px;
    border: 1.5px solid rgba(42,36,32,0.15);
  }

  .price-val {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    color: #c0392b;
    letter-spacing: 0.02em;
  }

  .preview-desc {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.78rem;
    color: #5a4f48;
    line-height: 1.6;
    margin: 0.2rem 0 0;
    font-style: italic;
  }

  /* ── CTA ── */
  .preview-cta {
    padding: 0.9rem 1.1rem 1rem;
    flex-shrink: 0;
  }

  .btn-adopt {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background: #2a2420;
    color: #efeae4;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 4px 4px 0px rgba(42,36,32,0.4);
    transition:
      background 0.2s ease,
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.2s ease;
  }

  .btn-adopt:hover {
    background: #3d2f28;
    transform: translateY(-2px);
    box-shadow: 5px 6px 0px rgba(42,36,32,0.4);
  }

  .btn-adopt:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 0px rgba(42,36,32,0.4);
  }

  /* Unavailable */
  .unavailable-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px 16px;
    background: rgba(42,36,32,0.06);
    border: 1.5px dashed rgba(42,36,32,0.25);
    border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    color: rgba(42,36,32,0.5);
  }

  /* Empty state */
  .empty-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem;
    text-align: center;
  }

  .empty-icon { font-size: 2.5rem; }

  .empty-hint p {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.85rem;
    color: rgba(42,36,32,0.4);
    line-height: 1.5;
  }
</style>
