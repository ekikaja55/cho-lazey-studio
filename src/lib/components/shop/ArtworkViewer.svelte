<script>
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';

  let { item, onClose } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
  }

  $effect(() => {
    document.body.style.overflow = 'hidden';
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

{#if item}
  <div
    use:portal
    class="viewer-backdrop"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label="Full artwork view: {item.title}"
    tabindex="0"
    onkeydown={(e)=>{if (e.key === 'Escape' || e.key === 'Enter') onclose(); }}
  >
    <div
      class="viewer-card"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="-1"
      onkeydown={(e) => e.stopPropagation()}
    >
      <button class="lb-close" onclick={onClose} aria-label="Close viewer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="lb-img-wrap">
        <div class="watermark-container">
          <WatermarkWrapper opacity={0.13} fontSize={13} spacing={90} text="CHO'S STUDIO · PREVIEW ONLY">
            <img src={item.image_url} alt={item.title} class="lb-img" />
          </WatermarkWrapper>
        </div>

        <span class="lb-format">{item.file_format}</span>
        
        <div class="viewer-eyebrow">
          <span class="eyebrow-dot" aria-hidden="true"></span>
          <span>Full Preview</span>
        </div>
      </div>

      <div class="lb-info">
        <div class="lb-info-top">
          <h2 class="lb-title">{item.title}</h2>
          <p class="viewer-meta">{item.file_format} &nbsp;·&nbsp; CHO.LAZEY</p>
          <p class="viewer-note">✦ Watermarked preview. Adopt this piece to receive the original high-quality file.</p>
        </div>
        
        <div class="lb-meta">
          <button class="viewer-close-btn" onclick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.viewer-backdrop) {
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

  :global(.viewer-card) {
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
    z-index: 5;
  }

  .viewer-eyebrow {
    position: absolute;
    top: 16px;
    right: 64px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #2a2420;
    background: #f4a87c;
    padding: 4px 12px;
    border: 2px solid #2a2420;
    border-radius: 999px;
    box-shadow: 2px 2px 0px #2a2420;
    z-index: 5;
  }

  .eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ffffff;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

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

  .viewer-meta {
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.75rem;
    color: rgba(42,36,32,0.6);
    margin: 0 0 0.5rem;
  }

  .viewer-note {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.9rem;
    color: #3a322e;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
  }

  :global(.lb-meta) {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .viewer-close-btn {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.9rem;
    color: #2a2420;
    background: #f4a87c;
    padding: 8px 20px;
    border-radius: 999px;
    border: 2px solid #2a2420;
    box-shadow: 3px 3px 0px #2a2420;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .viewer-close-btn:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 0px #2a2420;
  }

  .viewer-close-btn:active {
    transform: translateY(0);
    box-shadow: 1px 1px 0px #2a2420;
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

  @media (max-width: 600px) {
    :global(.viewer-card) {
      max-height: 85vh;
      border-radius: 20px;
    }
    :global(.lb-info) {
      padding: 1.25rem;
    }
    .viewer-eyebrow {
      display: none;
    }
  }
</style>
