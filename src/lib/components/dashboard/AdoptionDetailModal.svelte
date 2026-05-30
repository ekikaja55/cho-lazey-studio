<script>
  import { fade, fly } from 'svelte/transition';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  
  import { toast } from '$lib/stores/toast.js';
  let { adoption, onClose, onUpdate } = $props();
  let localOrderStatus = $state('');
  let localPaymentStatus = $state('');

  $effect(() => {
    if (adoption) {
      localOrderStatus = adoption.orderStatus;
      localPaymentStatus = adoption.paymentStatus;
    }
  });

  function handleUpdate(e) {
    e.preventDefault();
    
    if (onUpdate) {
      onUpdate({
        ...adoption,
        orderStatus: localOrderStatus,
        paymentStatus: localPaymentStatus
      });
    }

    toast.success(`[PROTOTYPE] Adoption #${adoption.id} updated successfully!`);
    
    onClose();
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  $effect(() => {
    if (adoption) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  });
</script>

{#if adoption}
 <div 
    class="modal-backdrop" 
    transition:fade={{ duration: 200 }} 
    onclick={onClose}
    role="button"
    tabindex="0"
    onkeydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') onClose(); }}
  >
    
    <div 
      class="modal-content" 
      transition:fly={{ y: 30, duration: 300, opacity: 0 }} 
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="modal-header">
        <div>
          <span class="modal-eyebrow">✦ MANAGE ADOPTION ✦</span>
          <h2 class="modal-title">#{adoption.id}</h2>
        </div>
        <button class="btn-close" onclick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        
        <div class="info-column">
          <div class="artwork-preview">
            <WatermarkWrapper text="CHO'S STUDIO" opacity={0.6} fontSize={14} spacing={55}>
              <img src={adoption.imgUrl} alt={adoption.artTitle} class="art-img" />
            </WatermarkWrapper>
          </div>

          <div class="detail-group">
            <h3 class="art-title">{adoption.artTitle}</h3>
            <p class="art-desc">{adoption.artDesc}</p>
          </div>

          <div class="divider"></div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Patron / Buyer</span>
              <span class="info-value email-text">{adoption.buyer}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Order Date</span>
              <span class="info-value">{formatDate(adoption.orderDate)}</span>
            </div>
          </div>
        </div>

        <form id="updateForm" class="editor-column" onsubmit={handleUpdate}>
          
          <div class="editor-card">
            <h4 class="card-title">Order & Payment Control</h4>
            
            <div class="form-group">
              <label for="orderStatus" class="info-label">Current Phase</label>
              <div class="select-wrapper">
                <select id="orderStatus" bind:value={localOrderStatus} class="brutal-input">
                  <option value="placed">Placed</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <svg class="dropdown-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div class="form-group">
              <label for="paymentStatus" class="info-label">Payment Status</label>
              <div class="select-wrapper">
                <select id="paymentStatus" bind:value={localPaymentStatus} class="brutal-input">
                  <option value="pending">Pending</option>
                  <option value="invalid">Invalid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
                <svg class="dropdown-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <div class="editor-card invoice-card">
            <h4 class="card-title">Payment Proof</h4>
            <div class="invoice-preview">
              <img src="/assets/invoice.png" alt="Invoice Document" class="invoice-img" />
              <div class="invoice-overlay">
                <a href="/assets/invoice.png" target="_blank" class="btn-view-invoice">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View Full
                </a>
              </div>
            </div>
          </div>

        </form>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn-secondary" onclick={onClose}>Cancel</button>
        <button type="submit" form="updateForm" class="btn-primary">Update Status</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(26, 22, 20, 0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 1.5rem;
  }

  .modal-content {
    background: #fbfaf8; width: 100%; max-width: 900px; max-height: 95vh;
    border: 3px solid #2a2420; border-radius: 20px;
    box-shadow: 8px 8px 0px #2a2420;
    display: flex; flex-direction: column; overflow: hidden;
  }

  .modal-header {
    background: #f3eee6; border-bottom: 3px solid #2a2420;
    padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: flex-start;
  }

  .modal-eyebrow {
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 800;
    letter-spacing: 0.15em; color: #c05c20; margin-bottom: 0.25rem; display: block;
  }

  .modal-title {
    font-family: 'HammersmithOne', serif; font-size: 1.5rem; color: #2a2420; margin: 0;
  }

  .btn-close {
    background: transparent; border: 2px solid transparent; border-radius: 50%;
    padding: 0.5rem; color: #2a2420; cursor: pointer; transition: all 0.2s ease;
  }
  .btn-close:hover { background: #e2dcf2; border-color: #2a2420; transform: rotate(90deg); }

  .modal-body {
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 2rem;
    padding: 2rem; overflow-y: auto;
  }

  .info-column { display: flex; flex-direction: column; gap: 1.5rem; }

  .artwork-preview {
    border: 3px solid #2a2420; border-radius: 12px; background: #1a1614;
    overflow: hidden; position: relative; aspect-ratio: 16/10;
    box-shadow: 4px 4px 0px rgba(42,36,32, 0.15);
  }

  .art-img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .art-title { font-family: 'HammersmithOne', serif; font-size: 1.6rem; color: #2a2420; margin: 0 0 0.5rem 0; line-height: 1.2; }
  .art-desc { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; line-height: 1.6; color: #5a504a; margin: 0; }
  .divider { height: 3px; background: rgba(42, 36, 32, 0.1); border-radius: 2px; }

  .info-grid { display: grid; gap: 1rem; }
  .info-item { display: flex; flex-direction: column; gap: 0.25rem; }
  .info-label {
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em; color: #8c7e75;
  }
  .info-value { font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 600; color: #2a2420; }
  .email-text { word-break: break-all; }

  .editor-column { display: flex; flex-direction: column; gap: 1.5rem; }

  .editor-card {
    background: #f0ebe3; border: 2.5px solid #2a2420; border-radius: 12px;
    padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem;
  }

  .card-title {
    font-family: 'HammersmithOne', serif; font-size: 1.1rem; color: #2a2420;
    margin: 0; padding-bottom: 0.8rem; border-bottom: 2px dashed rgba(42,36,32, 0.2);
  }

  .form-group { display: flex; flex-direction: column; gap: 0.5rem; }

  .select-wrapper { position: relative; display: flex; align-items: center; }

  .brutal-input {
    width: 100%; appearance: none;
    background: #fbfaf8; border: 2.5px solid #2a2420; border-radius: 8px;
    padding: 0.8rem 2.5rem 0.8rem 1rem; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 1rem; color: #2a2420; cursor: pointer;
    box-shadow: 3px 3px 0px rgba(42,36,32, 1); transition: all 0.15s ease;
  }
  .brutal-input:focus { outline: none; box-shadow: 5px 5px 0px rgba(42,36,32, 1); transform: translate(-2px, -2px); }

  .dropdown-icon {
    position: absolute; right: 12px; pointer-events: none; color: #2a2420;
  }

  .invoice-preview {
    position: relative; border: 2.5px solid #2a2420; border-radius: 8px;
    background: #e2dcf2; height: 140px; overflow: hidden;
  }

  .invoice-img {
    width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: opacity 0.3s ease;
  }

  .invoice-overlay {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    background: rgba(42, 36, 32, 0.1); opacity: 0; transition: all 0.3s ease;
  }

  .invoice-preview:hover .invoice-overlay { opacity: 1; background: rgba(42, 36, 32, 0.4); }
  .invoice-preview:hover .invoice-img { opacity: 0.4; }

  .btn-view-invoice {
    background: #fbfaf8; color: #2a2420; font-family: 'DM Sans', sans-serif;
    font-weight: 800; text-decoration: none; padding: 0.6rem 1.2rem;
    border: 2px solid #2a2420; border-radius: 8px; box-shadow: 3px 3px 0px #2a2420;
    display: flex; align-items: center; gap: 0.5rem; transform: translateY(10px); transition: all 0.2s ease;
  }
  .invoice-preview:hover .btn-view-invoice { transform: translateY(0); }
  .btn-view-invoice:hover { background: #f4a87c; }

  .modal-footer {
    border-top: 3px solid #2a2420; padding: 1.25rem 2rem;
    display: flex; justify-content: flex-end; gap: 1rem; background: #fbfaf8;
  }

  .btn-secondary {
    background: transparent; color: #2a2420; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700;
    padding: 0.65rem 1.5rem; border: 2.5px solid transparent; border-radius: 10px; cursor: pointer; transition: all 0.15s ease;
  }
  .btn-secondary:hover { background: rgba(42, 36, 32, 0.05); border-color: #2a2420; }

  .btn-primary {
    background: #2a2420; color: #fbfaf8; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700;
    padding: 0.65rem 2rem; border: 2.5px solid #2a2420; border-radius: 10px; cursor: pointer;
    box-shadow: 4px 4px 0px #f4a87c; transition: all 0.15s ease;
  }
  .btn-primary:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #f4a87c; }
  .btn-primary:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #f4a87c; }

  @media (max-width: 768px) {
    .modal-body { grid-template-columns: 1fr; padding: 1.25rem; gap: 1.5rem; }
    .modal-header, .modal-footer { padding: 1rem 1.25rem; }
    .invoice-preview { height: 120px; }
    
    .modal-footer { flex-direction: column-reverse; }
    .modal-footer button { width: 100%; }
  }
</style>
