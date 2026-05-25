<!-- lib/components/shop/PurchaseModal.svelte -->
<script>
  import { scale, fade } from 'svelte/transition';
  import { backOut }     from 'svelte/easing';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import { formatRupiah } from '$lib/data/galleryImages.js';
  import { toast }        from '$lib/stores/toast.js';

  let { item, onClose, onSuccess } = $props();

  let email      = $state('');
  let proofFile  = $state(null);
  let proofName  = $state('');
  let submitting = $state(false);

  const QRIS_URL = '/assets/qris.png';

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }
    proofFile = file;
    proofName = file.name;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email address.'); return; }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) { toast.error('Please enter a valid email address.'); return; }
    if (!proofFile) { toast.error('Please upload your payment proof.'); return; }

    submitting = true;
    setTimeout(() => {
      submitting = false;
      onSuccess({ item, email: email.trim(), proofName });
    }, 800);
  }

  function handleBackdrop() { onClose(); }
  function onKeydown(e) { if (e.key === 'Escape') onClose(); }

  // Download QRIS image
  function downloadQris() {
    const a = document.createElement('a');
    a.href = QRIS_URL;
    a.download = 'QRIS-CHO-LAZEY.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const statusCfg = {
    available: { bg: '#a2e1a6', color: '#1a4d1d', label: 'AVAILABLE' },
    reserved:  { bg: '#ffba09', color: '#3d2800', label: 'RESERVED'  },
    sold:      { bg: '#f46958', color: '#fff',     label: 'SOLD'      },
    not_sold:  { bg: '#b4a6d5', color: '#2d1a5c',  label: 'NOT SOLD'  },
    archived:  { bg: '#ccc',    color: '#555',     label: 'ARCHIVED'  },
  };

  const sc = $derived(statusCfg[item.status] ?? statusCfg.archived);
</script>

<svelte:window onkeydown={onKeydown} />

<!-- Backdrop -->
<div
  class="modal-backdrop"
  transition:fade={{ duration: 200 }}
  onclick={handleBackdrop}
  role="presentation"
  aria-hidden="true"
></div>

<!-- Modal -->
<div
  class="modal-wrap"
  role="dialog"
  aria-modal="true"
  aria-label="Complete Your Purchase"
  transition:scale={{ duration: 340, easing: backOut, start: 0.9 }}
>
  <div class="modal">

    <!-- Header -->
    <div class="modal-header">
      <div class="modal-header-left">
        <h2 class="modal-title">Complete Your Purchase</h2>
        <p class="modal-subtitle">
          You are adopting: <strong class="item-name">{item.title}</strong>
        </p>
      </div>
      <div class="modal-header-right">
        <span class="badge-format">{item.file_format}</span>
        <span class="badge-status" style="background:{sc.bg}; color:{sc.color}">{sc.label}</span>
        <button class="modal-close" onclick={onClose} aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="modal-body">

      <!-- ── Left: Artwork + Price ── -->
      <div class="modal-left">

        <!-- Preview -->
        <div class="preview-frame">
          <WatermarkWrapper opacity={0.22} fontSize={10} spacing={55}>
            <img src={item.image_url} alt={item.title} class="preview-img" loading="lazy" draggable="false" />
          </WatermarkWrapper>
        </div>

        <!-- Price card -->
        <div class="price-card">
          <div class="price-card-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4-2-4 2"/></svg>
            Transfer exact amount
          </div>
          <div class="price-card-amount">{formatRupiah(item.price)}</div>
          <div class="price-card-hint">via QRIS / Bank Transfer</div>
        </div>

      </div>

      <!-- ── Right: QRIS + Form ── -->
      <div class="modal-right">

        <!-- QRIS section -->
        <div class="qris-section">
          <div class="qris-header">
            <p class="qris-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Scan to Pay
            </p>
            <button class="qris-download-btn" onclick={downloadQris} type="button" title="Download QRIS image">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Save QRIS
            </button>
          </div>

          <div class="qris-frame">
            <img
              src={QRIS_URL}
              alt="QRIS payment code — CHO.LAZEY"
              class="qris-img"
              onerror={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div class="qris-placeholder" style="display:none">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9a8e88" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              <span>QRIS unavailable</span>
            </div>
          </div>

          <p class="qris-note">QRIS berlaku untuk semua bank & e-wallet Indonesia</p>
        </div>

        <!-- Divider -->
        <div class="modal-divider"></div>

        <!-- Form -->
        <form class="pay-form" onsubmit={handleSubmit} novalidate>

          <div class="pay-field">
            <label for="buyer-email" class="pay-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Your Email
            </label>
            <input
              id="buyer-email"
              type="email"
              placeholder="your.email@example.com"
              bind:value={email}
              disabled={submitting}
              class="pay-input"
              autocomplete="email"
            />
            <p class="pay-hint">Confirmation & downloadable file will be sent here after verification.</p>
          </div>

          <div class="pay-field">
            <label class="pay-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Payment Proof
            </label>
            <label class="file-upload-area" class:has-file={!!proofName} class:disabled={submitting}>
              {#if proofName}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a7a6e" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span class="file-name-display">{proofName}</span>
                <span class="file-change-hint">Click to change</span>
              {:else}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a6f68" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span class="file-upload-text">Click to upload payment proof</span>
                <span class="file-upload-hint">PNG, JPG · max 5MB</span>
              {/if}
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onchange={handleFileChange}
                disabled={submitting}
                class="file-input-hidden"
                aria-label="Upload payment proof"
              />
            </label>
          </div>

          <div class="pay-actions">
            <button type="submit" class="btn-submit" disabled={submitting}>
              {#if submitting}
                <span class="spinner" aria-hidden="true"></span>
                Processing…
              {:else}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Submit Payment
              {/if}
            </button>
            <button type="button" class="btn-cancel" onclick={onClose} disabled={submitting}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(42, 36, 32, 0.55);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 200;
    cursor: pointer;
  }

  .modal-wrap {
    position: fixed; inset: 0;
    z-index: 201;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    pointer-events: none;
  }

  .modal {
    pointer-events: all;
    background: #f5f0e8;
    border: 3px solid #2a2420;
    border-radius: 22px;
    box-shadow: 7px 7px 0 #2a2420, 0 32px 72px rgba(42,36,32,0.22);
    width: 100%;
    max-width: 820px;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(125,200,193,0.5) transparent;
  }

  .modal::-webkit-scrollbar { width: 5px; }
  .modal::-webkit-scrollbar-thumb { background: rgba(125,200,193,0.5); border-radius: 4px; }

  /* Header */
  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem 1rem;
    background: linear-gradient(135deg, #a2e1db 0%, #b4d4e0 100%);
    border-bottom: 3px solid #2a2420;
    border-radius: 19px 19px 0 0;
    flex-wrap: wrap;
  }

  .modal-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.2rem;
    color: #2a2420;
    margin: 0 0 4px;
  }

  .modal-subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.85rem;
    color: #2a2420;
    margin: 0;
    opacity: 0.8;
  }

  .item-name { font-weight: 700; }

  .modal-header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .badge-format {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
    background: rgba(250,247,242,0.9); color: #2a2420;
    border: 2px solid #2a2420; border-radius: 6px; padding: 3px 10px;
  }

  .badge-status {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
    border: 2px solid rgba(42,36,32,0.3); border-radius: 6px; padding: 3px 10px;
  }

  .modal-close {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(42,36,32,0.1);
    border: 2px solid #2a2420; border-radius: 50%;
    cursor: pointer; color: #2a2420;
    transition: background 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .modal-close:hover { background: rgba(244,105,88,0.2); transform: rotate(90deg); }

  /* Body */
  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* Left */
  .modal-left {
    padding: 1.5rem;
    border-right: 2px solid rgba(42,36,32,0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .preview-frame {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    border: 2.5px solid #2a2420;
    background: #c5e8e5;
    aspect-ratio: 4/3;
    box-shadow: 3px 3px 0 #2a2420;
  }

  .preview-img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Price card */
  .price-card {
    background: #2a2420;
    border-radius: 14px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    box-shadow: 3px 3px 0 rgba(42,36,32,0.3);
  }

  .price-card-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(240,235,227,0.6);
  }

  .price-card-amount {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.8rem;
    color: #f4a87c;
    letter-spacing: 0.02em;
    line-height: 1.1;
  }

  .price-card-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(240,235,227,0.45);
  }

  /* Right */
  .modal-right {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* QRIS */
  .qris-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .qris-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .qris-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.9rem;
    color: #2a2420;
    margin: 0;
  }

  .qris-download-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    color: #2a7a6e;
    background: rgba(125,200,193,0.15);
    border: 1.5px solid rgba(125,200,193,0.5);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
  }
  .qris-download-btn:hover { background: rgba(125,200,193,0.3); transform: translateY(-1px); }

  .qris-frame {
    border: 3px solid #2a2420;
    border-radius: 16px;
    overflow: hidden;
    width: min(220px, 100%);
    height: min(220px, 100%);
    aspect-ratio: 1;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0 #2a2420;
  }

  .qris-img { width: 100%; height: 100%; object-fit: contain; display: block; }

  .qris-placeholder {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #9a8e88;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    padding: 1rem;
    text-align: center;
  }

  .qris-note {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    color: #9a8e88;
    margin: 0;
    text-align: center;
    font-style: italic;
  }

  .modal-divider {
    height: 1.5px;
    background: rgba(42,36,32,0.1);
    border-radius: 1px;
    margin: 0 -0.25rem;
  }

  /* Form */
  .pay-form { display: flex; flex-direction: column; gap: 0.9rem; }
  .pay-field { display: flex; flex-direction: column; gap: 6px; }

  .pay-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.82rem;
    color: #2a2420;
  }

  .pay-input {
    padding: 10px 14px;
    background: #fff;
    border: 2px solid rgba(42,36,32,0.2);
    border-radius: 10px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.9rem;
    color: #2a2420;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-user-select: text;
    user-select: text;
  }

  .pay-input:focus {
    outline: none;
    border-color: #7dc8c1;
    box-shadow: 0 0 0 3px rgba(125,200,193,0.25);
  }

  .pay-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    color: #9a8e88;
    margin: 0;
    line-height: 1.4;
  }

  /* File upload area */
  .file-upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 12px;
    background: rgba(42,36,32,0.03);
    border: 2px dashed rgba(42,36,32,0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    text-align: center;
    min-height: 90px;
  }

  .file-upload-area:hover:not(.disabled) {
    background: rgba(125,200,193,0.08);
    border-color: #7dc8c1;
  }

  .file-upload-area.has-file {
    background: rgba(125,200,193,0.1);
    border-color: #7dc8c1;
    border-style: solid;
  }

  .file-upload-area.disabled { opacity: 0.55; cursor: not-allowed; }

  .file-upload-text {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #5a504a;
  }

  .file-upload-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    color: #9a8e88;
  }

  .file-name-display {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2a7a6e;
    word-break: break-all;
  }

  .file-change-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    color: #7a6f68;
  }

  .file-input-hidden { display: none; }

  /* Actions */
  .pay-actions { display: flex; gap: 10px; margin-top: 0.25rem; }

  .btn-submit {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 12px 16px;
    background: #2a2420; color: #f0ebe3;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 0.9rem;
    border: 2.5px solid #2a2420; border-radius: 10px;
    box-shadow: 3px 3px 0 rgba(42,36,32,0.25);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    min-width: 130px;
  }

  .btn-submit:hover:not(:disabled) { background: #f4a87c; color: #2a2420; transform: translateY(-1px); box-shadow: 4px 4px 0 rgba(42,36,32,0.25); }
  .btn-submit:active:not(:disabled) { transform: translateY(1px); box-shadow: 1px 1px 0 rgba(42,36,32,0.25); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-cancel {
    padding: 12px 18px;
    background: transparent; color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 0.9rem;
    border: 2.5px solid #2a2420; border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-cancel:hover:not(:disabled) { background: rgba(42,36,32,0.06); transform: translateY(-1px); }
  .btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(240,235,227,0.3);
    border-top-color: #f0ebe3;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Responsive */
  @media (max-width: 680px) {
    .modal { border-radius: 18px; }
    .modal-body { grid-template-columns: 1fr; }
    .modal-left { border-right: none; border-bottom: 2px solid rgba(42,36,32,0.1); }
    .preview-frame { max-height: 200px; }
    .modal-header { border-radius: 15px 15px 0 0; }
    .qris-frame { width: min(200px, 80%); height: min(200px, 80%); }
  }

  @media (max-width: 400px) {
    .modal-header { flex-direction: column; }
    .modal-header-right { align-self: flex-end; }
    .pay-actions { flex-direction: column; }
    .btn-submit, .btn-cancel { width: 100%; }
    .price-card-amount { font-size: 1.5rem; }
  }
</style>
