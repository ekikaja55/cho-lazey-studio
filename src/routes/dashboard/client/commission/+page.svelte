<script>
  import { toast } from '$lib/stores/toast.js';
  import { goto } from '$app/navigation';
  import { formatRupiah } from '$lib/data/galleryImages.js';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import PurchaseModal from '$lib/components/shop/PurchaseModal.svelte';
 
  let mounted = $state(false);
  let currentView = $state('selection');
  let selectedTier = $state(null);
  let showPaymentModal = $state(false);
  let hoveredId = $state(null);
 
  let selectedBg = $state('none');
  let commercialUse = $state(false);
  let additionalChars = $state(0);
  let deadlineDate = $state('');
  let descriptionText = $state('');
  let uploadedRefName = $state('');
 
  const commissionTiers = [
    { id: 'headshot',  title: 'Head Shot',  basePrice: 40000,  img: '/samples/HeadShot_Sample.png',  tabColor: '#a2e1db' },
    { id: 'bustup',    title: 'Bust Up',    basePrice: 50000,  img: '/samples/BustUp_Sample.jpg',    tabColor: '#f4a87c' },
    { id: 'halfbody',  title: 'Half Body',  basePrice: 65000,  img: '/samples/HalfBody_Sample.png',  tabColor: '#b4a6d5' },
    { id: 'fullbody',  title: 'Full Body',  basePrice: 125000, img: '/samples/FullBody_Sample.png',  tabColor: '#a2e1db' }
  ];
 
  const tilts = [-2.1, 1.8, -1.3, 2.4];
 
  const bgPrices = { none: 0, simple: 15000, detailed: 35000 };
  const getCommercialSurcharge = (base) => commercialUse ? Math.round(base * 0.5) : 0;
  const getExtraCharCost = (base) => additionalChars * Math.round(base * 0.75);
 
  const calculatedPrices = $derived.by(() => {
    if (!selectedTier) return { base: 0, bg: 0, commercial: 0, chars: 0, total: 0 };
    const base = selectedTier.basePrice;
    const bg = bgPrices[selectedBg];
    const commercial = getCommercialSurcharge(base);
    const chars = getExtraCharCost(base);
    return { base, bg, commercial, chars, total: base + bg + commercial + chars };
  });
 
  const purchaseItemData = $derived({
    title: selectedTier ? `${selectedTier.title} Custom Commission` : '',
    price: calculatedPrices.total,
    file_format: 'PNG/PSD High-Res',
    image_url: selectedTier ? selectedTier.img : '',
    status: 'available'
  });
 
  function selectTier(tier) {
    selectedTier = tier;
    currentView = 'configure';
    selectedBg = 'none';
    commercialUse = false;
    additionalChars = 0;
  }
 
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) uploadedRefName = file.name;
  }
 
  function triggerPayment() {
    if (!deadlineDate) { toast.error('Please specify a valid completion deadline.'); return; }
    if (!descriptionText.trim()) { toast.error('Please describe your commission requirement details.'); return; }
    showPaymentModal = true;
  }
 
  function handlePaymentSuccess(payload) {
    showPaymentModal = false;
    toast.contact('[PROTOTYPE] Payment submitted! Redirecting to your invoice…');
    const invoicePayload = {
      itemId: Math.floor(Math.random() * 900) + 100,
      itemTitle: purchaseItemData.title,
      itemPrice: purchaseItemData.price,
      itemFormat: purchaseItemData.file_format,
      buyerEmail: payload.email,
      proofName: payload.proofName
    };
    sessionStorage.setItem('cho_invoice', JSON.stringify(invoicePayload));
    goto('/invoice?back=/home/dashboard');
  }
 
  onMount(() => { mounted = true; });
</script>
 
<svelte:head>
  <title>Commission Studio | Cho's Lazey Studio</title>
</svelte:head>
 
<div class="page" class:visible={mounted}>
 
<header class="page-header boxed-header">
  <div class="bg-shapes">
    <div class="shape shape-purple"></div>
    <div class="shape shape-green"></div>
    <div class="shape shape-peach"></div>
  </div>
  
  <div class="header-content">
    <p class="header-eyebrow">
      <span class="eyebrow-dot"></span> ✦ OPEN COMMISSIONS ✦
    </p>
    <h1 class="header-title">Personal Commissions</h1>
    <div class="header-rule"></div>
    <p class="header-desc">Request a unique illustration customized to capture your own personal story.</p>
  </div>
</header>  

{#if currentView === 'selection'}
    <div class="tier-grid" transition:fade={{ duration: 180 }}>
      {#each commissionTiers as tier, i}
        {@const tilt = tilts[i]}
        <div
          class="folder-card"
          class:hovered={hoveredId === tier.id}
          style="--tilt: {tilt}deg; --tab-color: {tier.tabColor}; --anim-delay: {i * 0.07}s;"
          onmouseenter={() => hoveredId = tier.id}
          onmouseleave={() => hoveredId = null}
          role="presentation"
        >
          <div class="folder-tab" aria-hidden="true">
            <span class="folder-tab-label">
              {i === 0 ? 'STARTER' : i === 1 ? 'POPULAR' : i === 2 ? 'DETAIL' : 'PREMIUM'}
            </span>
          </div>
 
          <button
            class="folder-body"
            onclick={() => selectTier(tier)}
            aria-label="Select {tier.title} commission"
          >
            <div class="folder-img-wrap">
              <WatermarkWrapper text="CHO'S LAZEY" fontSize={15} spacing={45} opacity={0.5}>
                <img src={tier.img} alt={tier.title} class="folder-img" loading={i < 2 ? 'eager' : 'lazy'} />
              </WatermarkWrapper>
              <div class="folder-overlay" aria-hidden="true">
                <div class="overlay-inner">
                  <span class="overlay-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </span>
                  <span class="overlay-cta">Select Tier</span>
                </div>
              </div>
            </div>
 
            <div class="folder-footer">
              <span class="folder-name">{tier.title}</span>
              <span class="folder-price">from {formatRupiah(tier.basePrice)}</span>
            </div>
          </button>
        </div>
      {/each}
    </div>
 
    <div class="info-note">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <span>Click any artwork type to customise your commission and see the price breakdown.</span>
    </div>
 
  {:else if currentView === 'configure'}
    <div class="config-root" transition:fade={{ duration: 180 }}>
 
      <button class="btn-back" onclick={() => currentView = 'selection'}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Tier Selection
      </button>
 
      <div class="config-top-grid">
 
        <!-- Preview Panel — folder style -->
        <div class="config-preview-wrap">
          <div class="folder-tab-preview" aria-hidden="true" style="--tab-color: {selectedTier.tabColor};">
            <span class="folder-tab-label">{selectedTier.title.toUpperCase()}</span>
          </div>
          <div class="panel panel-preview">
            <div class="preview-frame">
              <WatermarkWrapper text="CONFIDENTIAL" fontSize={15} spacing={60} opacity={0.5}>
                <img src={selectedTier.img} alt={selectedTier.title} class="preview-img" />
              </WatermarkWrapper>
            </div>
            <div class="preview-label">
              <span class="preview-title-text">{selectedTier.title} — Example</span>
              <span class="preview-hint">Final artwork quality may vary based on options</span>
            </div>
          </div>
        </div>
 
        <!-- Options Panel -->
        <div class="panel panel-options">
          <h3 class="panel-title">Commission Options</h3>
 
          <div class="options-list">
 
            <!-- Style badge -->
            <div class="opt-row">
              <span class="opt-key">Style</span>
              <span class="badge-style">Normal Style</span>
            </div>
 
            <!-- Background -->
            <div class="opt-row opt-col">
              <span class="opt-key">Background Theme</span>
              <div class="radio-group">
                {#each [['none','None','Rp 0'], ['simple','Simple','+ Rp 15.000'], ['detailed','Detailed','+ Rp 35.000']] as [val, label, hint]}
                  <label class="radio-label" class:checked={selectedBg === val}>
                    <input type="radio" name="bgGroup" value={val} bind:group={selectedBg} />
                    <span class="radio-dot"></span>
                    <span class="radio-text">{label}</span>
                    <span class="radio-hint">{hint}</span>
                  </label>
                {/each}
              </div>
            </div>
 
            <!-- Commercial Use -->
            <div class="opt-row opt-between">
              <div class="opt-key-group">
                <span class="opt-key">Commercial Use License</span>
                <span class="opt-sub">+50% of base price</span>
              </div>
              <label class="toggle-wrap">
                <input type="checkbox" bind:checked={commercialUse} class="toggle-input" />
                <span class="toggle-track" class:on={commercialUse}>
                  <span class="toggle-thumb"></span>
                </span>
              </label>
            </div>
 
            <!-- Additional Characters -->
            <div class="opt-row opt-between">
              <div class="opt-key-group">
                <span class="opt-key">Additional Characters</span>
                <span class="opt-sub">+75% of base price each</span>
              </div>
              <div class="num-stepper">
                <button type="button" class="stepper-btn"
                  onclick={() => additionalChars = Math.max(0, additionalChars - 1)}
                  disabled={additionalChars <= 0}>−</button>
                <span class="stepper-val">{additionalChars}</span>
                <button type="button" class="stepper-btn"
                  onclick={() => additionalChars = Math.min(5, additionalChars + 1)}
                  disabled={additionalChars >= 5}>+</button>
              </div>
            </div>
 
            <!-- Price Breakdown -->
            <div class="breakdown-box">
              <div class="breakdown-head">Price Breakdown</div>
              <div class="breakdown-body">
                <div class="b-row"><span>Base tier price</span><span>{formatRupiah(calculatedPrices.base)}</span></div>
                <div class="b-row"><span>Background fee</span><span>{formatRupiah(calculatedPrices.bg)}</span></div>
                <div class="b-row"><span>Commercial surcharge</span><span>{formatRupiah(calculatedPrices.commercial)}</span></div>
                <div class="b-row"><span>Extra characters</span><span>{formatRupiah(calculatedPrices.chars)}</span></div>
                <div class="b-row b-total">
                  <span>Total due</span>
                  <span>{formatRupiah(calculatedPrices.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <!-- Details Panel -->
      <div class="panel panel-full">
        <h3 class="panel-title">Commission Details</h3>
 
        <form class="details-form" onsubmit={(e) => e.preventDefault()}>
          <div class="form-row">
            <div class="form-field">
              <label class="field-label" for="deadline">Target Deadline</label>
              <input type="date" id="deadline" bind:value={deadlineDate} class="field-input date-input" />
              <p class="field-hint">✦ Requesting at least 2–3 weeks from today is recommended.</p>
            </div>
 
            <div class="form-field">
              <span class="field-label">Reference Image</span>
              <label class="file-drop">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span class="file-label-text">
                  {uploadedRefName ? `✓ ${uploadedRefName}` : 'Browse character reference…'}
                </span>
                <input type="file" accept=".png,.jpg,.jpeg" onchange={handleFileChange} class="file-hidden" />
              </label>
            </div>
          </div>
 
          <div class="form-field">
            <label class="field-label" for="desc">Brief Description & Requirements</label>
            <textarea
              id="desc"
              placeholder="Describe pose preferences, clothing, facial expressions, colour palette, and any key specifications…"
              bind:value={descriptionText}
              class="field-textarea"
              rows="4"
            ></textarea>
          </div>
 
          <div class="form-submit-row">
            <button type="button" onclick={triggerPayment} class="btn-submit">
              Submit & Proceed to Payment
            </button>
          </div>
        </form>
      </div>
 
    </div>
  {/if}
</div>
 
{#if showPaymentModal}
  <PurchaseModal
    item={purchaseItemData}
    onClose={() => showPaymentModal = false}
    onSuccess={handlePaymentSuccess}
  />
{/if}
 
<style>
  .page {
    width: 100%;
    /* max-width: 1020px; */
    /* margin: 0; */
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 2rem;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  .page.visible { opacity: 1; transform: translateY(0); }
 
.page-header.boxed-header {
  position: relative;
  background: #f3eee6;
  border: 2.5px solid #2a2420;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: 6px 6px 0px #2a2420;
  overflow: hidden; 
  z-index: 1;
}

.header-content {
  position: relative;
  z-index: 2; 
  display: flex; 
  flex-direction: column; 
  gap: 0.6rem;
}

.header-eyebrow {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c05c20;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.eyebrow-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2.5px solid #2a2420;
}

.header-title {
  font-family: 'HammersmithOne', Georgia, serif;
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  color: #2a2420;
  margin: 0;
  line-height: 1.1;
}

.header-rule {
  width: 72px;
  height: 5px;
  background: linear-gradient(90deg, #f4a87c, #bda6d6); 
  border-radius: 999px;
  margin-top: 0.2rem;
  margin-bottom: 0.4rem;
}

.header-desc {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 1.05rem;
  line-height: 1.65;
  color: #7a706a;
  max-width: 680px;
  margin: 0;
}

.bg-shapes {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border: 2px solid rgba(42, 36, 32, 0.1);
}

.shape-purple {
  width: 35px; height: 35px;
  background: #e2dcf2;
  border-radius: 10px;
  top: 35px; right: 180px;
  transform: rotate(-8deg);
}

.shape-green {
  width: 90px; height: 90px;
  background: #dcf2e9;
  border-radius: 18px;
  top: -30px; right: 40px;
  transform: rotate(12deg);
}

.shape-peach {
  width: 65px; height: 65px;
  background: #fae0cd;
  border-radius: 14px;
  bottom: -20px; right: 100px;
  transform: rotate(18deg);
}

  .tier-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    padding-top: 20px;
  }
 
  .folder-card {
    position: relative;
    transform: rotate(var(--tilt));
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease;
    animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: var(--anim-delay);
    margin-top: 18px;
    height: 300px;
  }
 
  @keyframes cardIn {
    from { opacity: 0; transform: rotate(var(--tilt)) translateY(24px) scale(0.9); }
    to   { opacity: 1; transform: rotate(var(--tilt)) translateY(0)     scale(1);   }
  }
 
  .folder-card.hovered {
    transform: rotate(0deg) translateY(-6px) scale(1.03);
    z-index: 10;
    filter: drop-shadow(6px 8px 0px rgba(42, 36, 32, 0.35));
  }
 
  .folder-tab {
    position: absolute;
    top: -18px;
    left: 14px;
    height: 22px;
    padding: 0 12px;
    background: var(--tab-color);
    border: 2.5px solid #2a2420;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    z-index: 1;
    box-shadow: 2px -2px 0px rgba(42, 36, 32, 0.1);
  }
 
  .folder-tab-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    color: #2a2420;
  }
 
  .folder-body {
    width: 100%;
    height: 100%;
    background: rgba(240, 235, 227, 0.97);
    border: 2.5px solid #2a2420;
    border-radius: 4px 18px 18px 18px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 0px #2a2420;
    transition: box-shadow 0.2s ease;
    position: absolute;
    inset: 0;
  }
 
  .folder-card.hovered .folder-body {
    box-shadow: 6px 8px 0px #2a2420;
  }
 
  .folder-img-wrap {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
  }
 
  .folder-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }
 
  .folder-card.hovered .folder-img { transform: scale(1.07); }
 
  .folder-overlay {
    position: absolute;
    inset: 0;
    background: rgba(42, 36, 32, 0.52);
    opacity: 0;
    transition: opacity 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  .folder-card.hovered .folder-overlay { opacity: 1; }
 
  .overlay-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #efeae4;
    text-align: center;
  }
 
  .overlay-icon {
    width: 48px; height: 48px;
    background: rgba(244, 168, 124, 0.9);
    border: 2px solid #2a2420;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 3px 3px 0px rgba(42, 36, 32, 0.5);
    transform: scale(0.8);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
 
  .folder-card.hovered .overlay-icon { transform: scale(1); }
 
  .overlay-cta {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
 
  .folder-footer {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px 12px;
    background: rgba(240, 235, 227, 0.97);
    border-top: 2.5px solid #2a2420;
    flex-shrink: 0;
  }
 
  .folder-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    color: #2a2420;
    letter-spacing: 0.01em;
  }
 
  .folder-price {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.8rem;
    color: #7a6a62;
    font-weight: 500;
  }
 
  .info-note {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    color: #5a504a;
    background: rgba(42, 36, 32, 0.04);
    border: 1.5px solid rgba(42, 36, 32, 0.12);
    padding: 0.75rem 1.2rem;
    border-radius: 12px;
  }
 
  .config-root {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
 
  .btn-back {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.55rem 1.1rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    background: rgba(240, 235, 227, 0.97);
    border: 2px solid #2a2420;
    color: #2a2420;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 2px 2px 0px #2a2420;
    transition: all 0.15s ease;
  }
 
  .btn-back:hover {
    background: #a2e1db;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #2a2420;
  }
 
  .config-top-grid {
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 1.4rem;
    align-items: start;
  }
 
  .config-preview-wrap {
    position: relative;
    padding-top: 20px;
  }
 
  .folder-tab-preview {
    position: absolute;
    top: 2px;
    left: 14px;
    height: 22px;
    padding: 0 12px;
    background: var(--tab-color, #a2e1db);
    border: 2.5px solid #2a2420;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    z-index: 1;
  }
 
  .panel {
    background: rgba(240, 235, 227, 0.97);
    border: 2.5px solid #2a2420;
    border-radius: 4px 20px 20px 20px;
    padding: 1.5rem;
    box-shadow: 4px 4px 0px rgba(42, 36, 32, 0.18);
  }
 
  .panel-preview {
    padding: 0;
    overflow: hidden;
  }
 
  .panel-full {
    border-radius: 20px;
    width: 100%;
  }
 
  .panel-options {
    border-radius: 20px;
  }
 
  .preview-frame {
    width: 100%;
    aspect-ratio: 1;
    background: #1a1614;
    overflow: hidden;
  }
 
  .preview-img {
    width: 100%; height: 100%;
    object-fit: contain;
  }
 
  .preview-label {
    padding: 10px 14px 12px;
    border-top: 2px solid rgba(42, 36, 32, 0.12);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
 
  .preview-title-text {
    font-family: 'HammersmithOne', serif;
    font-size: 0.9rem;
    color: #2a2420;
  }
 
  .preview-hint {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    color: #8c7e75;
  }
 
  .panel-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.9rem;
    color: #2a2420;
    text-align: left;
    margin: 0 0 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-bottom: 0.75rem;
    border-bottom: 2px dashed rgba(42, 36, 32, 0.15);
  }
 
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }
 
  .opt-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 1.1rem;
    border-bottom: 1.5px solid rgba(42, 36, 32, 0.08);
  }
  .opt-row:last-child { border-bottom: none; padding-bottom: 0; }
  .opt-col { flex-direction: column; align-items: flex-start; }
  .opt-between { justify-content: space-between; }
 
  .opt-key {
    font-family: 'HammersmithOne', serif;
    font-size: 0.92rem;
    color: #2a2420;
  }
 
  .opt-key-group { display: flex; flex-direction: column; gap: 2px; }
 
  .opt-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.77rem;
    color: #8c7e75;
  }
 
  .badge-style {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    background: #a2e1db;
    color: #1a4d4a;
    border: 2px solid #2a2420;
    padding: 0.28rem 0.85rem;
    border-radius: 8px;
    letter-spacing: 0.02em;
  }
 
  .radio-group {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    width: 100%;
  }
 
  .radio-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.4rem 0.85rem;
    border: 2px solid rgba(42, 36, 32, 0.2);
    border-radius: 10px;
    cursor: pointer;
    background: rgba(42,36,32,0.03);
    transition: all 0.14s ease;
  }
 
  .radio-label:hover { border-color: #2a2420; }
 
  .radio-label.checked {
    background: #2a2420;
    border-color: #2a2420;
    box-shadow: 2px 2px 0 rgba(42,36,32,0.4);
  }
 
  .radio-label input { display: none; }
 
  .radio-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    border: 2px solid rgba(42,36,32,0.35);
    flex-shrink: 0;
    transition: all 0.12s ease;
  }
 
  .radio-label.checked .radio-dot {
    background: #a2e1db;
    border-color: #a2e1db;
  }
 
  .radio-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.86rem;
    font-weight: 600;
    color: #2a2420;
    transition: color 0.12s ease;
  }
 
  .radio-label.checked .radio-text { color: #fbfaf8; }
 
  .radio-hint {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.76rem;
    color: #8c7e75;
    transition: color 0.12s ease;
  }
 
  .radio-label.checked .radio-hint { color: rgba(251,250,248,0.65); }
 
  .toggle-wrap { display: inline-flex; align-items: center; cursor: pointer; }
  .toggle-input { display: none; }
 
  .toggle-track {
    width: 44px; height: 24px;
    border-radius: 999px;
    border: 2px solid #2a2420;
    background: rgba(42,36,32,0.1);
    position: relative;
    transition: background 0.2s ease;
    box-shadow: 2px 2px 0 rgba(42,36,32,0.2);
  }
 
  .toggle-track.on { background: #a2e1db; }
 
  .toggle-thumb {
    position: absolute;
    top: 2px; left: 2px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #2a2420;
    transition: transform 0.2s ease;
  }
 
  .toggle-track.on .toggle-thumb { transform: translateX(20px); }
 
  .num-stepper {
    display: flex;
    align-items: center;
    border: 2px solid #2a2420;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 2px 2px 0 rgba(42,36,32,0.2);
  }
 
  .stepper-btn {
    width: 34px; height: 34px;
    background: rgba(240,235,227,0.9);
    border: none;
    font-size: 1.1rem;
    font-weight: 700;
    color: #2a2420;
    cursor: pointer;
    transition: background 0.12s ease;
    display: flex; align-items: center; justify-content: center;
  }
 
  .stepper-btn:hover:not(:disabled) { background: #a2e1db; }
  .stepper-btn:disabled { opacity: 0.32; cursor: not-allowed; }
 
  .stepper-val {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'HammersmithOne', serif;
    font-size: 0.95rem;
    color: #2a2420;
    background: rgba(240,235,227,0.97);
    border-left: 2px solid rgba(42,36,32,0.15);
    border-right: 2px solid rgba(42,36,32,0.15);
  }
 
  .breakdown-box {
    border: 2px solid #2a2420;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 3px 3px 0 rgba(42,36,32,0.12);
  }
 
  .breakdown-head {
    background: #e8e2d8;
    font-family: 'HammersmithOne', serif;
    font-size: 0.82rem;
    text-align: center;
    padding: 0.5rem;
    border-bottom: 2px solid #2a2420;
    color: #2a2420;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
 
  .breakdown-body { display: flex; flex-direction: column; background: rgba(255,255,255,0.8); }
 
  .b-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0.8rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: #4a403a;
    border-bottom: 1px solid rgba(42, 36, 32, 0.07);
  }
 
  .b-row:last-child { border-bottom: none; }
 
  .b-total {
    background: #2a2420;
    color: #fbfaf8;
    font-family: 'HammersmithOne', serif;
    font-size: 0.98rem;
    padding: 0.6rem 0.8rem;
  }
 
  .details-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
 
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
 
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
 
  .field-label {
    font-family: 'HammersmithOne', serif;
    font-size: 0.92rem;
    color: #2a2420;
    letter-spacing: 0.01em;
  }
 
  .field-input {
    padding: 0.6rem 0.8rem;
    border: 2px solid #2a2420;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    color: #2a2420;
    background: rgba(255,255,255,0.8);
    transition: box-shadow 0.15s ease;
  }
 
  .field-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(162, 225, 219, 0.4);
  }
 
  .date-input { max-width: 240px; }
 
  .field-hint {
    margin: 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.76rem;
    color: #8c7e75;
  }
 
  .file-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    border: 2px dashed rgba(42, 36, 32, 0.28);
    background: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    padding: 1.1rem;
    cursor: pointer;
    color: #5a504a;
    transition: border-color 0.15s ease, background 0.15s ease;
    min-height: 90px;
  }
 
  .file-drop:hover {
    border-color: #a2e1db;
    background: rgba(162, 225, 219, 0.08);
  }
 
  .file-label-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.86rem;
    font-weight: 600;
    text-align: center;
  }
 
  .file-hidden { display: none; }
 
  .field-textarea {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 2px solid #2a2420;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    line-height: 1.6;
    color: #2a2420;
    resize: vertical;
    background: rgba(255,255,255,0.8);
    transition: box-shadow 0.15s ease;
    box-sizing: border-box;
  }
 
  .field-textarea:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(162, 225, 219, 0.4);
  }
 
  .form-submit-row {
    display: flex;
    justify-content: flex-end;
  }
 
  .btn-submit {
    padding: 0.85rem 2rem;
    font-family: 'HammersmithOne', serif;
    font-size: 1rem;
    background: #a2e1db;
    color: #2a2420;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #2a2420;
    transition: all 0.12s ease;
    letter-spacing: 0.02em;
  }
 
  .btn-submit:hover {
    background: #7dc8c1;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #2a2420;
  }
 
  .btn-submit:active {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0px #2a2420;
  }
 
  @media (max-width: 900px) {
    .tier-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .folder-card { height: 280px; }
    .config-top-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .date-input { max-width: 100%; }
  }
 
  @media (max-width: 600px) {
    .page-header.boxed-header {
      padding: 1.5rem;
      border-radius: 16px;
    }
    .bg-shapes { opacity: 0.4; }
    
    .tier-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .folder-card {
      height: 240px;
      transform: rotate(0deg) !important;
    }
    .folder-card.hovered {
      transform: translateY(-4px) scale(1.015) !important;
    }
    .info-note { width: 100%; }
    .panel { padding: 1.1rem; }
    .radio-group { flex-direction: column; }
    .form-submit-row { justify-content: stretch; }
    .btn-submit { width: 100%; }
    .shape-purple, .shape-green, .shape-peach { display: none; }
  }
 
  @media (max-width: 420px) {
    .tier-grid {
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }
    .folder-card { height: 210px; }
  }
</style>
 
