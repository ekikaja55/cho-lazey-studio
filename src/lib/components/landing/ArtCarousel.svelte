<script>
  let { items = [], currentIndex = 0 } = $props();
  import WatermarkWrapper from "../WatermarkWrapper.svelte"; 
  let innerWidth = $state(1024); // Default fallback

  // Definisi dimensi kartu secara dinamis agar JS dan CSS selalu sinkron
  let isMobile = $derived(innerWidth <= 640);
  let itemW    = $derived(isMobile ? 240 : 380);
  let gap      = $derived(isMobile ? 24 : 48);
  let step     = $derived(itemW + gap);

  // Kalkulasi presisi: (Setengah layar) dikurangi (Setengah ukuran kartu) dikurangi (Posisi Index * Jarak Step)
  let trackOffset = $derived((innerWidth / 2) - (itemW / 2) - (currentIndex * step));
</script>

<svelte:window bind:innerWidth />

<div class="carousel-root" aria-hidden="true">
  <div 
    class="carousel-track" 
    style="transform: translateX({trackOffset}px); gap: {gap}px;"
  >
    {#each items as item, i}
      <div 
        class="carousel-item {i === currentIndex ? 'active' : ''}" 
        style="width: {itemW}px;"
      >
        {#if item.src}
        <WatermarkWrapper opacity={0.5} fontSize={15} spacing={80}>
          <img src={item.src} alt={item.alt ?? ''} loading="lazy" draggable="false" />
        </WatermarkWrapper>   
        {:else}
          <div class="item-placeholder"></div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  /* ── Root Container ── */
  .carousel-root {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: transparent;
    display: flex;
    align-items: center; /* Di desktop posisi vertikal tepat di tengah */
  }

  /* ── Track Wrapper ── */
  .carousel-track {
    display: flex;
    align-items: center;
    /* Transisi sangat mulus ala Apple / editorial */
    transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: transform;
  }

  /* ── Carousel Item ── */
  .carousel-item {
    flex-shrink: 0;
    height: 520px; 
    border-radius: 12px;
    overflow: hidden;
    background: #f0ebe3; 
    
    border: 2px solid #2a2420;
    box-shadow: 4px 4px 0px rgba(42, 36, 32, 0.8);
    
    /* Ukuran bawaan diperkecil sedikit, TIDAK ADA OPACITY */
    transform: scale(0.9);
    transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.7s;
    will-change: transform;
  }

  /* ── Active (Centered) State ── */
  .carousel-item.active {
    /* Hanya gambar di tengah yang membesar dan shadow-nya menebal */
    transform: scale(1.15);
    box-shadow: 8px 8px 0px rgba(42, 36, 32, 1);
    z-index: 10;
  }

  .carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
  }

  .item-placeholder {
    width: 100%;
    height: 100%;
    background: #ccc;
  }

  /* ── Mobile Overrides ── */
  @media (max-width: 640px) {
    .carousel-root {
      /* Di mobile arah tetap Kanan-Kiri, hanya saja digeser ke atas */
      align-items: flex-start;
      padding-top: 15vh; 
    }
    .carousel-item {
      height: 320px; 
    }
    .carousel-item.active {
      transform: scale(1.1); /* Di mobile perbesaran tidak usah terlalu drastis */
    }
  }
</style>
