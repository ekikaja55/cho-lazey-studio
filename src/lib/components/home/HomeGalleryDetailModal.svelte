<script>
  import { formatRupiah } from '$lib/data/galleryImages.js';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';

  let {
    isOpen,
    item,
    currentIndex,
    totalItems,
    onClose,
    onNext,
    onPrev
  } = $props();

  function handleKeydown(e) {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }

  $effect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });

  function portal(node) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode === document.body) {
          document.body.removeChild(node);
        }
      }
    };
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && item}
  <div
    use:portal
    class="lightbox-backdrop"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label="Artwork lightbox"
    tabindex="-1"
    onkeydown={(e)=>{if (e.key === 'Escape' || e.key === 'Enter') onclose(); }}
  >
    <div
      class="lightbox-card"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="-1"
      onkeydown={(e)=> e.stopPropagation()}

    >
      <button class="lb-close" onclick={onClose} aria-label="Close lightbox">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="lb-img-wrap">
        <button class="lb-nav lb-prev" onclick={onPrev} aria-label="Previous artwork">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>

        <div class="watermark-container">
          <WatermarkWrapper opacity={0.5} fontSize={15} spacing={90}>
            <img src={item.image_url} alt={item.title} class="lb-img" />
          </WatermarkWrapper>
        </div>

        <span class="lb-format">{item.file_format}</span>

        <button class="lb-nav lb-next" onclick={onNext} aria-label="Next artwork">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9,6 15,12 9,18"/>
          </svg>
        </button>
      </div>

      <div class="lb-info">
        <div class="lb-info-top">
          <h2 class="lb-title">{item.title}</h2>
          {#if item.description}
            <p class="lb-desc">{item.description}</p>
          {/if}
        </div>
        <div class="lb-meta">
          {#if item.price != null}
            <span class="lb-price">{formatRupiah(item.price)}</span>
          {/if}
        </div>
        <span class="lb-counter">{currentIndex + 1} / {totalItems}</span>
      </div>
    </div>
  </div>
{/if}

<style>

  :global(.lightbox-backdrop) {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    animation: backdropIn 0.2s ease both;
  }

  @keyframes backdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  :global(.lightbox-card) {
    background: #ffffff;
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 12px 12px 0px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    animation: lbCardIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes lbCardIn {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);    }
  }

  :global(.lb-img-wrap) {
    flex: 1;
    min-height: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(42, 36, 32, 0.03);
    overflow: hidden;
  }

  :global(.watermark-container) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.lb-img) {
    width: 100%;
    height: 100%;
    max-height: 65vh;
    object-fit: contain;
    display: block;
  }

  :global(.lb-format) {
    position: absolute;
    top: 16px;
    left: 16px;
    background: #a2e1db;
    border: 2px solid #2a2420;
    border-radius: 999px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: #2a2420;
    padding: 4px 12px;
    box-shadow: 2px 2px 0px #2a2420;
  }

  :global(.lb-info) {
    padding: 1.5rem 2rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    background: #ffffff;
    border-top: 2.5px solid #2a2420;
    flex-shrink: 0;
  }

  :global(.lb-info-top) {
    flex: 1;
    min-width: 0;
  }

  :global(.lb-title) {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.5rem;
    color: #2a2420;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  :global(.lb-desc) {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.95rem;
    color: #3a322e;
    line-height: 1.6;
    margin: 0;
  }

  :global(.lb-meta) {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  :global(.lb-price) {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.1rem;
    color: #2a2420;
    background: #f4a87c;
    padding: 4px 12px;
    border-radius: 8px;
    border: 2px solid #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
  }

  :global(.lb-counter) {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.9rem;
    color: rgba(42, 36, 32, 0.6);
    letter-spacing: 0.06em;
    align-self: flex-end;
    flex-shrink: 0;
  }

  :global(.lb-close) {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    background: #f46958;
    border: 2.5px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 3px 3px 0px #2a2420;
    z-index: 10;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  :global(.lb-close:hover) {
    transform: scale(1.1);
    box-shadow: 4px 4px 0px #2a2420;
  }

  :global(.lb-close:active) {
    transform: scale(0.95);
    box-shadow: 1px 1px 0px #2a2420;
  }

  :global(.lb-nav) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    background: #ffffff;
    border: 2.5px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2a2420;
    box-shadow: 3px 3px 0px #2a2420;
    z-index: 10;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  :global(.lb-prev) { left: 16px; }
  :global(.lb-next) { right: 16px; }

  :global(.lb-nav:hover) {
    background: #b4a6d5;
    transform: translateY(-50%) scale(1.1);
  }

  :global(.lb-nav:active) {
    transform: translateY(-50%) scale(0.95);
    box-shadow: 1px 1px 0px #2a2420;
  }

  @media (max-width: 600px) {
    :global(.lightbox-card) {
      max-height: 85vh;
      border-radius: 20px;
    }
    :global(.lb-info) {
      padding: 1.25rem;
    }
    :global(.lb-nav) {
      width: 36px;
      height: 36px;
    }
  }
</style>
