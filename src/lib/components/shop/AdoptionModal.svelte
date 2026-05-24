<script>
  /**
   * AdoptionModal.svelte
   * Adoption/purchase modal
   * - Shows artwork (watermarked), QRIS, email input, proof upload
   * - On submit: fires onsubmit callback (parent shows toast)
   * - Prototype: no real API, just form validation + callback
   */

  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import { formatRupiah } from '$lib/data/galleryImages.js';

  let {
    item      = null,
    onclose   = () => {},
    onsubmit  = () => {},
  } = $props();

  // Form state
  let email       = $state('');
  let proofFile   = $state(null);
  let proofName   = $state('');
  let submitting  = $state(false);
  let errors      = $state({ email: '', proof: '' });

  const statusConfig = {
    available: { label: 'Available', bg: '#a2e1a6', color: '#1a4d1d' },
    sold:      { label: 'Sold',      bg: '#f46958', color: '#fff'     },
    reserved:  { label: 'Reserved',  bg: '#ffba09', color: '#3d2800'  },
  };

  const statusInfo = $derived(item ? (statusConfig[item.status] ?? statusConfig.available) : null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate type + size
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errors.proof = 'Only PNG or JPG files are accepted.';
      proofFile = null; proofName = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errors.proof = 'File must be under 5MB.';
      proofFile = null; proofName = '';
      return;
    }
    errors.proof = '';
    proofFile = file;
    proofName = file.name;
  }

  function validate() {
    let valid = true;
    // Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
      valid = false;
    } else { errors.email = ''; }
    // Proof
    if (!proofFile) {
      errors.proof = 'Please upload your payment proof.';
      valid = false;
    } else { errors.proof = ''; }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    submitting = true;
    // Simulate network delay (prototype)
    await new Promise(r => setTimeout(r, 900));
    submitting = false;
    onsubmit({ item, email });
    onclose();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onclose();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="modal-backdrop"
  onclick={handleBackdropClick}
  role="dialog"
  aria-modal="true"
  aria-label="Adoption form for {item?.title}"
  tabindex="-1"
>
  <div class="modal-card">

    <!-- ── Modal Header ── -->
    <div class="modal-header">
      <div class="modal-header-text">
        <h2 class="modal-title">Complete Your Purchase</h2>
        <p class="modal-subtitle">
          You are adopting: <strong>{item?.title}</strong>
        </p>
      </div>
      <div class="modal-header-badges">
        {#if item}
          <span class="hbadge hbadge-format">{item.file_format}</span>
          {#if statusInfo}
            <span
              class="hbadge"
              style="background: {statusInfo.bg}; color: {statusInfo.color};"
            >{statusInfo.label}</span>
          {/if}
        {/if}
      </div>
      <button class="modal-close" onclick={onclose} aria-label="Close">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- ── Modal Body ── -->
    <div class="modal-body">

      <!-- Left: artwork preview -->
      <div class="modal-artwork-col">
        <div class="modal-img-frame">
          {#if item}
            <WatermarkWrapper opacity={0.18} fontSize={13} spacing={85}>
              <img
                src={item.image_url}
                alt={item.title}
                class="modal-img"
              />
            </WatermarkWrapper>
          {/if}
        </div>
        <div class="modal-price-strip">
          <p class="price-label">Please transfer the exact amount shown above.</p>
          <span class="price-big">{formatRupiah(item?.price)}</span>
        </div>
      </div>

      <!-- Right: payment + form -->
      <div class="modal-form-col">

        <!-- QRIS block -->
        <div class="qris-block">
          <p class="qris-label">Scan to Pay</p>
          <div class="qris-img-wrap">
            <img
              src="/assets/qris.png"
              alt="QRIS payment code for CHO.LAZEY FANMERCH"
              class="qris-img"
              draggable="false"
            />
          </div>
        </div>

        <!-- Form -->
        <div class="form-fields">

          <!-- Email -->
          <div class="field" class:has-error={!!errors.email}>
            <label class="field-label" for="adopt-email">Your Email</label>
            <input
              id="adopt-email"
              type="email"
              class="field-input"
              placeholder="your.email@example.com"
              bind:value={email}
              autocomplete="email"
              aria-describedby={errors.email ? 'email-err' : undefined}
              aria-invalid={!!errors.email}
            />
            {#if errors.email}
              <span class="field-error" id="email-err" role="alert">{errors.email}</span>
            {:else}
              <span class="field-hint">We'll send confirmation and downloadable files after verification.</span>
            {/if}
          </div>

          <!-- Proof upload -->
          <div class="field" class:has-error={!!errors.proof}>
            <label class="field-label" for="adopt-proof">Upload Payment Proof</label>
            <div class="file-input-wrap">
              <label class="file-btn" for="adopt-proof" aria-label="Choose payment proof file">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                Choose file
              </label>
              <input
                id="adopt-proof"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                class="file-input-hidden"
                onchange={handleFileChange}
                aria-describedby={errors.proof ? 'proof-err' : 'proof-hint'}
                aria-invalid={!!errors.proof}
              />
              <span class="file-name">{proofName || 'No file chosen'}</span>
            </div>
            {#if errors.proof}
              <span class="field-error" id="proof-err" role="alert">{errors.proof}</span>
            {:else}
              <span class="field-hint" id="proof-hint">Accepted: PNG, JPG. Please keep file under 5MB.</span>
            {/if}
          </div>

        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            class="btn-submit"
            onclick={handleSubmit}
            disabled={submitting}
            aria-busy={submitting}
          >
            {#if submitting}
              <span class="spinner" aria-hidden="true"></span>
              Submitting…
            {:else}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="22,2 11,13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
              Submit Payment
            {/if}
          </button>
          <button class="btn-cancel" onclick={onclose} disabled={submitting}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  /* ══════════════════════════════════════
     BACKDROP
  ══════════════════════════════════════ */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(42, 36, 32, 0.65);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    animation: bdIn 0.2s ease both;
  }

  @keyframes bdIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ══════════════════════════════════════
     CARD
  ══════════════════════════════════════ */
  .modal-card {
    background: rgba(240, 235, 227, 0.99);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 10px 10px 0px #2a2420;
    width: 100%;
    max-width: 880px;
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: cardIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: scale(0.92) translateY(24px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);     }
  }

  /* ── Header ── */
  .modal-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.5rem;
    background: #a2e1db;
    border-bottom: 3px solid #2a2420;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .modal-header-text { flex: 1; min-width: 0; }

  .modal-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.15rem;
    color: #2a2420;
    margin: 0 0 2px;
  }

  .modal-subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    color: rgba(42,36,32,0.65);
    margin: 0;
  }

  .modal-header-badges {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .hbadge {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    border: 2px solid rgba(42,36,32,0.3);
  }

  .hbadge-format {
    background: rgba(240,235,227,0.85);
    color: #2a2420;
  }

  .modal-close {
    width: 30px; height: 30px;
    background: rgba(240,235,227,0.85);
    border: 2px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    flex-shrink: 0;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .modal-close:hover {
    background: #f4a87c;
    transform: scale(1.1);
  }

  /* ── Body ── */
  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }

  /* ── Left col: artwork ── */
  .modal-artwork-col {
    border-right: 2px solid rgba(42,36,32,0.12);
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    gap: 0.85rem;
  }

  .modal-img-frame {
    flex: 1;
    min-height: 0;
    border: 2.5px solid rgba(42,36,32,0.2);
    border-radius: 16px;
    overflow: hidden;
    background: #c8e9e6;
    max-height: 380px;
  }

  .modal-img {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
  }

  .modal-price-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    text-align: center;
  }

  .price-big {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.6rem;
    color: #c0392b;
    letter-spacing: 0.02em;
  }

  .price-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(42,36,32,0.45);
    margin: 0;
  }

  /* ── Right col: form ── */
  .modal-form-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    overflow-y: auto;
  }

  /* QRIS */
  .qris-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  .qris-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.85rem;
    color: #2a2420;
    letter-spacing: 0.06em;
    margin: 0;
  }

  .qris-img-wrap {
    border: 2.5px solid #2a2420;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 4px 4px 0px #2a2420;
    width: 100%;
    max-width: 240px;
  }

  .qris-img {
    width: 100%;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  /* Form fields */
  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .field-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2a2420;
  }

  .field-input {
    padding: 10px 14px;
    background: rgba(255,255,255,0.7);
    border: 2px solid rgba(42,36,32,0.25);
    border-radius: 12px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    color: #2a2420;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    /* Allow typing */
    user-select: text;
    -webkit-user-select: text;
  }

  .field-input:focus {
    border-color: #7dc8c1;
    box-shadow: 0 0 0 3px rgba(125,200,193,0.2);
  }

  .has-error .field-input {
    border-color: #f46958;
  }

  .field-hint {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(42,36,32,0.45);
    line-height: 1.4;
  }

  .field-error {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: #c0392b;
    font-weight: 500;
  }

  /* File input */
  .file-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .file-input-hidden {
    display: none;
  }

  .file-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #a2e1db;
    border: 2px solid #2a2420;
    border-radius: 10px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.78rem;
    color: #2a2420;
    cursor: pointer;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
    flex-shrink: 0;
    user-select: none;
  }

  .file-btn:hover {
    background: #7dc8c1;
    transform: translateY(-1px);
  }

  .file-name {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem;
    color: rgba(42,36,32,0.5);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Actions */
  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  .btn-submit {
    flex: 1;
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
    font-size: 0.92rem;
    cursor: pointer;
    box-shadow: 4px 4px 0px rgba(42,36,32,0.35);
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-submit:hover:not(:disabled) {
    background: #3d2f28;
    transform: translateY(-2px);
    box-shadow: 5px 6px 0px rgba(42,36,32,0.35);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-cancel {
    padding: 12px 20px;
    background: rgba(42,36,32,0.07);
    border: 2px solid rgba(42,36,32,0.22);
    border-radius: 14px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.92rem;
    color: #2a2420;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn-cancel:hover:not(:disabled) { background: rgba(42,36,32,0.12); }
  .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Spinner */
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(239,234,228,0.4);
    border-top-color: #efeae4;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */
  @media (max-width: 680px) {
    .modal-body {
      grid-template-columns: 1fr;
    }

    .modal-artwork-col {
      border-right: none;
      border-bottom: 2px solid rgba(42,36,32,0.12);
      padding-bottom: 1rem;
    }

    .modal-img-frame {
      max-height: 240px;
    }

    .modal-card {
      border-radius: 20px;
      max-height: 95vh;
    }

    .qris-img-wrap {
      max-width: 180px;
    }
  }

  @media (max-width: 420px) {
    .modal-header { padding: 0.9rem 1rem; }
    .modal-artwork-col, .modal-form-col { padding: 1rem; }
    .price-big { font-size: 1.3rem; }
  }
</style>
