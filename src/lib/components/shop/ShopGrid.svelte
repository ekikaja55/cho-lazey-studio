<script>
  /**
   * ShopGrid.svelte
   * Right-side thumbnail grid for shop page
   * Shows items with status badges, highlights selected
   */

  import WatermarkWrapper from '../WatermarkWrapper.svelte';

  let {
    items       = [],
    selectedId  = $bindable(null),
    onselect    = () => {},
  } = $props();

  const statusConfig = {
    available: { label: 'Available', bg: '#a2e1a6', color: '#1a4d1d', dot: '#22c55e' },
    sold:      { label: 'Sold',      bg: '#f46958', color: '#fff',     dot: '#ef4444' },
    reserved:  { label: 'Reserved',  bg: '#ffba09', color: '#3d2800',  dot: '#f59e0b' },
  };

  function getStatus(s) {
    return statusConfig[s] ?? statusConfig.available;
  }
</script>

<div class="shop-grid" role="list" aria-label="Available artworks">
  {#each items as item, i}
    {@const st = getStatus(item.status)}
    {@const isSelected = selectedId === item.gallery_id}

    <button
      class="grid-thumb"
      class:selected={isSelected}
      class:sold={item.status === 'sold'}
      onclick={() => onselect(item)}
      role="listitem"
      aria-label="{item.title} — {st.label}"
      aria-pressed={isSelected}
      style="--anim-delay: {i * 0.04}s;"
      title={item.title}
    >
      <!-- Image with watermark -->
      <div class="thumb-img-wrap">
        <WatermarkWrapper opacity={0.14} fontSize={11} spacing={72}>
          <img
            src={item.image_url}
            alt={item.title}
            class="thumb-img"
            loading="lazy"
          />
        </WatermarkWrapper>

        <!-- Sold/Reserved stamp -->
        {#if item.status === 'sold' || item.status === 'reserved'}
          <div class="stamp" style="background: {st.bg}; color: {st.color};" aria-label={st.label}>
            {st.label}
          </div>
        {/if}
      </div>

      <!-- Selected indicator ring -->
      {#if isSelected}
        <div class="selected-ring" aria-hidden="true"></div>
      {/if}
    </button>
  {/each}
</div>

<style>
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .grid-thumb {
    position: relative;
    background: rgba(240,235,227,0.6);
    border: 2.5px solid rgba(42,36,32,0.22);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    aspect-ratio: 1;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: thumbIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: var(--anim-delay);
  }

  @keyframes thumbIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1);    }
  }

  .grid-thumb:hover:not(.sold) {
    border-color: #2a2420;
    box-shadow: 3px 3px 0px #2a2420;
    transform: translateY(-3px) scale(1.03);
  }

  .grid-thumb.selected {
    border-color: #2a2420;
    box-shadow: 4px 4px 0px #2a2420;
    transform: scale(1.04);
  }

  .grid-thumb.sold {
    cursor: not-allowed;
    opacity: 0.75;
  }

  /* Image */
  .thumb-img-wrap {
    position: relative;
    width: 100%; height: 100%;
  }

  .thumb-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Stamp badge — rotated pill */
  .stamp {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-18deg);
    padding: 5px 14px;
    border-radius: 999px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    border: 2px solid rgba(42,36,32,0.3);
    box-shadow: 2px 2px 0px rgba(42,36,32,0.3);
    white-space: nowrap;
    z-index: 6;
    pointer-events: none;
  }

  /* Selected ring */
  .selected-ring {
    position: absolute;
    inset: -3px;
    border: 3px solid #7dc8c1;
    border-radius: 16px;
    pointer-events: none;
    z-index: 7;
    animation: ringPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes ringPop {
    from { opacity: 0; transform: scale(1.15); }
    to   { opacity: 1; transform: scale(1);    }
  }

  /* Tablet: 2-col */
  @media (max-width: 860px) {
    .shop-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
  }

  /* Mobile: horizontal scroll row */
  @media (max-width: 600px) {
    .shop-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
  }
</style>
