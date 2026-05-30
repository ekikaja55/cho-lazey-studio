<script>
  import { formatRupiah } from '$lib/data/galleryImages.js';
  import { fade, scale } from 'svelte/transition';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';

  let { order = null, onclose } = $props();

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onclose?.();
  }

  function handleKey(e) {
    if (e.key === 'Escape') onclose?.();
  }

  function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace('pukul', 'pukul ');
  }

  function handleDownload() {
    if (!order) return;
    const link = document.createElement('a');
    link.href = order.pathImage;
    link.download = `${order.order_id}-${order.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<svelte:window onkeydown={handleKey} />

{#if order}
  <div 
    class="modal-backdrop" 
    role="dialog" 
    aria-modal="true"
    onclick={handleBackdropClick}
    transition:fade={{ duration: 150 }}
    tabindex="0"
    onkeydown={(e)=>{if(e.key === 'Escape' || e.key === 'Enter') handleBackdropClick() ;}}
  >
    <div class="modal-card" role="document" transition:scale={{ duration: 200, start: 0.95 }}>
      <button class="modal-close" onclick={onclose} aria-label="Close details">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="modal-preview-side">
        <WatermarkWrapper text="CHO'S STUDIO" fontSize={13} spacing={55} opacity={0.45}>
          <img src={order.pathImage} alt={order.title} class="modal-full-img" />
        </WatermarkWrapper>
      </div>

      <div class="modal-info-side">
        
        <div class="modal-scroll-content">
          <div class="modal-header">
            <span class="order-id">{order.order_id}</span>
            <h2 class="order-title">{order.title}</h2>
            <span class="badge type-badge" class:commis={order.typeCommis === 'commission'}>
              ✦ {order.typeCommis.toUpperCase()}
            </span>
          </div>

          <div class="modal-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Price Amount</span>
                <span class="value price">{formatRupiah(order.price)}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Order Status</span>
                <span class="value status-text status-{order.statusOrder}">{order.statusOrder}</span>
              </div>

              <div class="info-item">
                <span class="label">Payment Status</span>
                <span class="value status-text status-{order.statusPayment}">{order.statusPayment}</span>
              </div>

              <div class="info-item">
                <span class="label">Payment Date</span>
                <span class="value">{formatDate(order.paymentDate)}</span>
              </div>

              {#if order.typeCommis === 'commission'}
                <div class="info-item">
                  <span class="label">Project Deadline</span>
                  <span class="value deadline">{formatDate(order.deadlineDate)}</span>
                </div>
              {/if}

              <div class="info-item">
                <span class="label">Completed Date</span>
                <span class="value">{formatDate(order.completeDate)}</span>
              </div>
            </div>

            {#if order.typeCommis === 'commission' && order.revision_note}
              <div class="revision-box">
                <span class="label">✦ Active Revision Note</span>
                <p>{order.revision_note}</p>
              </div>
            {/if}
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-download" onclick={handleDownload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span>Download Artwork</span>
          </button>
        </div>

      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 500;
    background: rgba(42, 36, 32, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .modal-card {
    position: relative;
    background: #f0ebe3;
    border: 3px solid #2a2420;
    border-radius: 24px;
    box-shadow: 10px 10px 0px #2a2420;
    width: 100%;
    max-width: 860px;
    height: auto;
    max-height: 85vh;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    overflow: hidden;
  }

  .modal-close {
    position: absolute;
    top: 18px; right: 18px;
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid #2a2420;
    background: #f0ebe3;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    z-index: 10;
    transition: transform 0.1s ease;
  }
  .modal-close:hover { transform: scale(1.08); background: #f4a87c; }

  .modal-preview-side {
    background: #1e1916;
    border-right: 3px solid #2a2420;
    height: 100%;
    min-height: 450px;
    display: flex;
  }

  .modal-full-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .modal-info-side {
    padding: 2.5rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
  }

  .modal-scroll-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-right: 6px;
    margin-bottom: 1rem;
  }

  .modal-scroll-content::-webkit-scrollbar {
    width: 4px;
  }
  .modal-scroll-content::-webkit-scrollbar-thumb {
    background: rgba(42, 36, 32, 0.2);
    border-radius: 999px;
  }

  .order-id {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: rgba(42, 36, 32, 0.5);
  }

  .order-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.8rem;
    color: #2a2420;
    margin: 0.2rem 0 0.6rem;
    line-height: 1.2;
  }

  .badge {
    display: inline-block;
    padding: 0.3rem 0.85rem;
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    border: 1.5px solid #2a2420;
    background: #a2e1db;
    color: #1a5c57;
  }
  .badge.commis { background: #f4a87c; color: #7a3a10; }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.6rem;
    border-bottom: 1.5px dashed rgba(42, 36, 32, 0.12);
  }

  .label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgba(42, 36, 32, 0.5);
  }

  .value {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #2a2420;
  }
  .value.price { font-family: 'HammersmithOne', serif; font-size: 1.1rem; }
  .value.deadline { color: #cc6656; }

  .status-text {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.15rem 0.5rem;
    border-radius: 6px;
  }
  .status-completed, .status-paid, .status-delivered { color: #1a7a1e; }
  .status-pending, .status-sketching, .status-coloring { color: #b07200; }
  .status-revision, .status-dp { color: #3d2800; background: rgba(255,186,9,0.12); }
  .status-cancelled, .status-invalid { color: #bc3624; }

  .revision-box {
    margin-top: 0.5rem;
    background: rgba(244,168,124,0.1);
    border: 2px dashed #f4a87c;
    padding: 0.85rem 1rem;
    border-radius: 12px;
  }
  .revision-box .label { color: #7a3a10; display: block; margin-bottom: 0.3rem; }
  .revision-box p { font-family: 'Lora', Georgia, serif; font-size: 0.88rem; line-height: 1.5; color: #4a403a; margin: 0; }

  .modal-actions {
    flex-shrink: 0;
    width: 100%;
    margin-top: auto;
  }

  .btn-download {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0.85rem 1.5rem;
    background: #2a2420;
    color: #f0ebe3;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    letter-spacing: 0.03em;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #f4a87c;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }
  .btn-download:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #f4a87c;
  }
  .btn-download:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #f4a87c;
  }

  @media (max-width: 768px) {
    .modal-card {
      grid-template-columns: 1fr;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-preview-side {
      height: 260px;
      min-height: auto;
      border-right: none;
      border-bottom: 3px solid #2a2420;
    }
    .modal-info-side {
      padding: 1.75rem 1.25rem;
      overflow-y: visible;
      height: auto;
    }
    .modal-scroll-content {
      overflow-y: visible;
      height: auto;
      margin-bottom: 1.5rem;
    }
    .modal-actions {
      margin-top: 0;
    }
  }
</style>
