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
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return; }
    proofFile = file;
    proofName = file.name;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim())                                    { toast.error('Please enter your email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast.error('Please enter a valid email.'); return; }
    if (!proofFile)                                        { toast.error('Please upload your payment proof.'); return; }
    submitting = true;
    setTimeout(() => { submitting = false; onSuccess({ item, email: email.trim(), proofName }); }, 800);
  }

  function downloadQris() {
    const a = document.createElement('a');
    a.href = QRIS_URL; a.download = 'QRIS-CHO-LAZEY.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function onKeydown(e) { if (e.key === 'Escape') onClose(); }

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

<!-- Backdrop — same as gallery lightbox -->
<div
  class="modal-backdrop"
  transition:fade={{ duration: 200 }}
  onclick={onClose}
  role="presentation"
  aria-hidden="true"
></div>

<!-- Modal — lightbox-card DNA -->
<div
  class="modal-wrap"
  role="dialog"
  aria-modal="true"
  aria-label="Complete Your Purchase — {item.title}"
  transition:scale={{ duration: 320, easing: backOut, start: 0.92 }}
>
  <div class="modal">

    <!-- Header — folder-tab palette strip + peach bg -->
    <div class="modal-header">
      <!-- Tab strip -->
      <div class="modal-tab-strip" aria-hidden="true">
        <span class="mtab mtab-peach"></span>
        <span class="mtab mtab-lavender"></span>
        <span class="mtab mtab-turquoise"></span>
      </div>

      <div class="modal-header-inner">
        <div class="modal-header-left">
          <div class="modal-eyebrow">
            <span class="eyebrow-dot" aria-hidden="true"></span>
            payment form
          </div>
          <h2 class="modal-title">Complete Your Purchase</h2>
          <p class="modal-subtitle">You are adopting: <strong class="item-name">{item.title}</strong></p>
        </div>

        <div class="modal-header-right">
          <span class="badge-format">{item.file_format}</span>
          <span class="badge-status" style="background:{sc.bg}; color:{sc.color};">{sc.label}</span>
          <button class="modal-close" onclick={onClose} aria-label="Close">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Body: 2-col grid — same as gallery lightbox layout -->
    <div class="modal-body">

      <!-- Left: artwork + price -->
      <div class="modal-left">
        <!-- Preview frame — same border/radius as lb-img-wrap -->
        <div class="preview-frame">
          <WatermarkWrapper opacity={0.22} fontSize={10} spacing={55}>
            <img src={item.image_url} alt={item.title} class="preview-img" loading="lazy" draggable="false" />
          </WatermarkWrapper>
          <!-- Bottom gradient accent -->
          <div class="frame-accent" aria-hidden="true"></div>
        </div>

        <!-- Price card -->
        <div class="price-card">
          <div class="price-card-row">
            <span class="price-card-label">Transfer exact amount</span>
            <span class="price-card-amount">{formatRupiah(item.price)}</span>
          </div>
          <span class="price-card-hint">via QRIS / Bank Transfer</span>
        </div>
      </div>

      <!-- Right: QRIS + form -->
      <div class="modal-right">

        <!-- QRIS -->
        <div class="qris-block">
          <div class="qris-header">
            <p class="qris-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Scan to Pay
            </p>
            <button class="qris-save-btn" onclick={downloadQris} type="button">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Save QRIS
            </button>
          </div>

          <div class="qris-frame">
            <img
              src={QRIS_URL}
              alt="QRIS payment code — CHO.LAZEY"
              class="qris-img"
              onerror={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }}
            />
            <div class="qris-fallback" style="display:none">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c4b0a8" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              <span>QRIS unavailable</span>
            </div>
          </div>

          <p class="qris-note">Berlaku untuk semua bank &amp; e-wallet Indonesia</p>
        </div>

        <!-- Divider -->
        <div class="modal-divider" aria-hidden="true"></div>

        <!-- Form -->
        <form class="pay-form" onsubmit={handleSubmit} novalidate>

          <div class="pay-field">
            <label for="buyer-email" class="pay-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
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
            <p class="pay-hint">Confirmation &amp; file sent after verification.</p>
          </div>

          <div class="pay-field">
            <label class="pay-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Payment Proof
            </label>

            <label class="file-drop" class:has-file={!!proofName} class:disabled={submitting}>
              {#if proofName}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2a7a6e" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span class="file-name">{proofName}</span>
                <span class="file-change">Click to change</span>
              {:else}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a8e88" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span class="file-prompt">Click to upload payment proof</span>
                <span class="file-hint">PNG, JPG · max 5MB</span>
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
                <span class="spinner" aria-hidden="true"></span>Processing…
              {:else}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
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
  /* ── Backdrop ── */
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(42,36,32,0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 500;
    cursor: pointer;
  }

  /* ── Modal wrap (center) ── */
  .modal-wrap {
    position: fixed; inset: 0;
    z-index: 501;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    pointer-events: none;
  }

  .modal-wrap > * { pointer-events: all; }

  /* ── Modal card — lightbox-card DNA ── */
  .modal {
    background: rgba(240,235,227,0.99);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 10px 10px 0px #2a2420;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── Header ── */
  .modal-header {
    background: rgba(244,168,124,0.18);
    border-bottom: 3px solid #2a2420;
    overflow: hidden;
    flex-shrink: 0;
  }

  /* Same tab-strip as viewer */
  .modal-tab-strip {
    display: flex;
    height: 5px;
  }

  .mtab { flex: 1; }
  .mtab-peach     { background: #f4a87c; }
  .mtab-lavender  { background: #b4a6d5; }
  .mtab-turquoise { background: #a2e1db; }

  .modal-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1.25rem;
    flex-wrap: wrap;
  }

  .modal-header-left { display: flex; flex-direction: column; gap: 2px; }

  .modal-eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #d4845a;
  }

  .eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #f4a87c;
    border: 1.5px solid #2a2420;
    flex-shrink: 0;
  }

  .modal-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.05rem;
    color: #2a2420;
    margin: 0 0 1px;
    line-height: 1.15;
  }

  .modal-subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem;
    color: rgba(42,36,32,0.6);
    margin: 0;
  }

  .item-name { color: #2a2420; }

  .modal-header-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .badge-format {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
    padding: 3px 9px;
    background: rgba(240,235,227,0.85);
    color: #2a2420;
    border: 1.5px solid rgba(42,36,32,0.25);
    border-radius: 999px;
  }

  .badge-status {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 999px;
    border: 1.5px solid rgba(42,36,32,0.2);
  }

  .modal-close {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(240,235,227,0.85);
    border: 2px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
    flex-shrink: 0;
  }

  .modal-close:hover {
    background: #f46958;
    color: #fff;
    transform: rotate(90deg) scale(1.08);
  }

  /* ── Body ── */
  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  /* ── Left col ── */
  .modal-left {
    border-right: 2px solid rgba(42,36,32,0.1);
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow: hidden;
  }

  /* Same bg/structure as lb-img-wrap */
  .preview-frame {
    flex: 1;
    min-height: 0;
    position: relative;
    overflow: hidden;
    background: #c8e3e0;
    max-height: 320px;
  }

  .preview-img {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
  }

  .frame-accent {
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #f4a87c, #b4a6d5, #a2e1db);
    z-index: 6;
    pointer-events: none;
  }

  /* Price card */
  .price-card {
    padding: 0.85rem 1rem;
    background: rgba(244,168,124,0.1);
    border-top: 2px solid rgba(244,168,124,0.25);
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex-shrink: 0;
  }

  .price-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .price-card-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(42,36,32,0.45);
  }

  .price-card-amount {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.25rem;
    color: #d4845a;
    letter-spacing: 0.02em;
  }

  .price-card-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    color: rgba(42,36,32,0.38);
  }

  /* ── Right col ── */
  .modal-right {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1rem 1.1rem;
    overflow-y: auto;
  }

  /* QRIS */
  .qris-block { display: flex; flex-direction: column; align-items: center; gap: 0.55rem; }

  .qris-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .qris-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.85rem;
    color: #2a2420;
    margin: 0;
  }

  .qris-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    color: #2a7a6e;
    background: rgba(125,200,193,0.15);
    border: 1.5px solid rgba(125,200,193,0.5);
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .qris-save-btn:hover { background: rgba(125,200,193,0.3); transform: translateY(-1px); }

  .qris-frame {
    border: 3px solid #2a2420;
    border-radius: 16px;
    overflow: hidden;
    width: min(200px, 100%);
    aspect-ratio: 1;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 4px 4px 0px #2a2420;
  }

  .qris-img { width: 100%; height: 100%; object-fit: contain; display: block; }

  .qris-fallback {
    display: none;
    flex-direction: column; align-items: center; gap: 8px;
    color: #9a8e88;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    padding: 1rem; text-align: center;
  }

  .qris-note {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    color: #9a8e88;
    margin: 0;
    text-align: center;
    font-style: italic;
  }

  .modal-divider {
    height: 1.5px;
    background: rgba(42,36,32,0.1);
    border-radius: 1px;
    margin: 0;
  }

  /* Form */
  .pay-form { display: flex; flex-direction: column; gap: 0.85rem; }
  .pay-field { display: flex; flex-direction: column; gap: 5px; }

  .pay-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: #2a2420;
  }

  .pay-input {
    padding: 10px 13px;
    background: rgba(255,255,255,0.75);
    border: 2px solid rgba(42,36,32,0.2);
    border-radius: 10px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    color: #2a2420;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-user-select: text;
    user-select: text;
  }

  .pay-input:focus {
    outline: none;
    border-color: #f4a87c;
    box-shadow: 0 0 0 3px rgba(244,168,124,0.22);
  }

  .pay-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    color: #9a8e88;
    margin: 0;
    line-height: 1.4;
  }

  /* File drop */
  .file-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 14px 12px;
    background: rgba(42,36,32,0.03);
    border: 2px dashed rgba(42,36,32,0.18);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
    text-align: center;
    min-height: 80px;
  }

  .file-drop:hover:not(.disabled) {
    background: rgba(244,168,124,0.08);
    border-color: #f4a87c;
  }

  .file-drop.has-file {
    background: rgba(162,225,219,0.1);
    border-color: #7dc8c1;
    border-style: solid;
  }

  .file-drop.disabled { opacity: 0.55; cursor: not-allowed; }

  .file-prompt { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.78rem; font-weight: 600; color: #5a504a; }
  .file-hint   { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.66rem; color: #9a8e88; }
  .file-name   { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.78rem; font-weight: 600; color: #2a7a6e; word-break: break-all; }
  .file-change { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.66rem; color: #7a6f68; }
  .file-input-hidden { display: none; }

  /* Actions */
  .pay-actions { display: flex; gap: 8px; margin-top: 0.15rem; }

  .btn-submit {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 14px;
    background: #f4a87c;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.88rem;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    box-shadow: 3px 3px 0px #2a2420;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .btn-submit:hover:not(:disabled) {
    background: #e89060;
    transform: translateY(-1px);
    box-shadow: 4px 4px 0px #2a2420;
  }

  .btn-submit:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-cancel {
    padding: 11px 16px;
    background: transparent;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.88rem;
    border: 2.5px solid rgba(42,36,32,0.25);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .btn-cancel:hover:not(:disabled) {
    background: rgba(42,36,32,0.06);
    transform: translateY(-1px);
  }

  .btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

  .spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(42,36,32,0.25);
    border-top-color: #2a2420;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .modal { border-radius: 20px; max-height: 92vh; }
    .modal-body { grid-template-columns: 1fr; }
    .modal-left { border-right: none; border-bottom: 2px solid rgba(42,36,32,0.1); max-height: none; }
    .preview-frame { max-height: 200px; }
    .qris-frame { width: min(170px, 70%); }
  }

  @media (max-width: 400px) {
    .modal-header-inner { flex-direction: column; align-items: flex-start; }
    .modal-header-right { align-self: flex-end; }
    .pay-actions { flex-direction: column; }
    .btn-submit, .btn-cancel { width: 100%; }
  }
</style>
