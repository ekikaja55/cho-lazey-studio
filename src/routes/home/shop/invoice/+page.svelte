<!-- home/shop/invoice/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto }    from '$app/navigation';
  import { formatRupiah } from '$lib/data/galleryImages.js';

  let invoice = $state(null);
  let mounted = $state(false);

  const QRIS_URL = '/assets/qris.png';

  onMount(() => {
    mounted = true;
    try {
      const raw = sessionStorage.getItem('cho_invoice');
      if (raw) invoice = JSON.parse(raw);
    } catch {}
  });

  function handlePrint() { window.print(); }

  function goBack() {
    sessionStorage.removeItem('cho_invoice');
    goto('/home/shop');
  }

  const invoiceNo = $derived(
    invoice
      ? `INV-${String(invoice.itemId).padStart(3, '0')}-${Date.now().toString().slice(-6)}`
      : '—'
  );

  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
</script>

<svelte:head>
  <title>Invoice — Cho's Studio</title>
</svelte:head>

<div class="invoice-root" class:visible={mounted}>

  <!-- Action bar — hidden on print -->
  <div class="action-bar no-print">
    <button class="btn-back" onclick={goBack}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Back to Shop
    </button>
    <div class="action-right">
      <span class="prototype-badge">⚠ PROTOTYPE — Not a real invoice</span>
      <button class="btn-print" onclick={handlePrint}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print / Save PDF
      </button>
    </div>
  </div>

  {#if invoice}
    <!-- ── Invoice Card ── -->
    <div class="invoice-card">

      <!-- Left color strip -->
      <div class="invoice-strip" aria-hidden="true">
        <div class="strip-seg" style="background:#b4a6d5; flex:2"></div>
        <div class="strip-seg" style="background:#f4a87c; flex:1"></div>
        <div class="strip-seg" style="background:#a2e1db; flex:1.5"></div>
        <div class="strip-seg" style="background:#f4a87c; flex:1"></div>
        <div class="strip-seg" style="background:#b4a6d5; flex:2"></div>
      </div>

      <!-- Content -->
      <div class="invoice-content">

        <!-- Top: title + studio -->
        <div class="inv-top">
          <div>
            <h1 class="inv-title">Invoice</h1>
            <p class="inv-number">Invoice No. {invoiceNo}</p>
          </div>
          <div class="inv-studio-wrap">
            <span class="inv-studio">CHO.LAZEY</span>
            <span class="inv-studio-sub">Digital Art Studio</span>
          </div>
        </div>

        <div class="inv-divider"></div>

        <!-- Buyer + total -->
        <div class="inv-meta-row">
          <div class="inv-buyer-block">
            <p class="inv-to-label">Invoice To:</p>
            <p class="inv-buyer">{invoice.buyerEmail?.split('@')[0] ?? 'Customer'}</p>
            <p class="inv-contact">{invoice.buyerEmail}</p>
          </div>
          <div class="inv-total-block">
            <p class="inv-total-label">TOTAL</p>
            <p class="inv-total-value">Rp{formatRupiah(invoice.itemPrice ?? 0).replace('Rp\u00a0','')}</p>
            <span class="inv-paid-badge">PENDING VERIFICATION</span>
          </div>
        </div>

        <!-- Items table -->
        <div class="inv-table-wrap">
          <table class="inv-table">
            <thead>
              <tr>
                <th class="col-item">ITEM</th>
                <th class="col-qty">QTY</th>
                <th class="col-price">PRICE</th>
                <th class="col-total">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="col-item">
                  <span class="item-title">{invoice.itemTitle}</span>
                  <span class="item-sub">Digital artwork — {invoice.itemFormat}</span>
                </td>
                <td class="col-qty">1</td>
                <td class="col-price">Rp{formatRupiah(invoice.itemPrice).replace('Rp\u00a0','')}</td>
                <td class="col-total">Rp{formatRupiah(invoice.itemPrice).replace('Rp\u00a0','')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Subtotals -->
        <div class="inv-subtotals">
          <div class="sub-row">
            <span class="sub-label">Sub-total</span>
            <span class="sub-value">Rp{formatRupiah(invoice.itemPrice).replace('Rp\u00a0','')}</span>
          </div>
          <div class="sub-row">
            <span class="sub-label">Shipping</span>
            <span class="sub-value">—</span>
          </div>
          <div class="sub-row total-row">
            <span class="sub-label total-label">Total</span>
            <span class="sub-value total-value">Rp{formatRupiah(invoice.itemPrice).replace('Rp\u00a0','')}</span>
          </div>
        </div>

        <div class="inv-divider"></div>

        <!-- Payment + QRIS row -->
        <div class="inv-payment-qris-row">

          <!-- Payment info -->
          <div class="inv-payment-info">
            <p class="pay-section-title">Payment Method</p>

            <div class="pay-detail-card">
              <div class="pay-method-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                <span class="pay-method-name">QRIS / Bank Transfer</span>
              </div>
              <div class="pay-detail-rows">
                <div class="pay-detail-item">
                  <span class="pay-detail-label">Status</span>
                  <span class="pay-detail-val status-pending">Awaiting Verification</span>
                </div>
                <div class="pay-detail-item">
                  <span class="pay-detail-label">Proof</span>
                  <span class="pay-detail-val">{invoice.proofName ?? 'Uploaded'}</span>
                </div>
                <div class="pay-detail-item">
                  <span class="pay-detail-label">Date</span>
                  <span class="pay-detail-val">{today}</span>
                </div>
              </div>
            </div>

            <p class="pay-note">
              ✦ File will be sent to your email after payment is verified by the artist.
            </p>
          </div>

          <!-- QRIS image -->
          <div class="inv-qris-wrap">
            <p class="qris-label-sm">Scan to Pay</p>
            <div class="inv-qris-frame">
              <img
                src={QRIS_URL}
                alt="QRIS payment code"
                class="inv-qris-img"
                onerror={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }}
              />
              <div class="inv-qris-fallback" style="display:none">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="inv-footer-row">
          <p class="inv-thankyou">Thank you for your purchase! ✦</p>
          <p class="inv-date">{today}</p>
        </div>

      </div>
    </div>

  {:else}
    <div class="no-invoice">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c4b8b2" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
      <p>No invoice data found.</p>
      <button class="btn-back" onclick={goBack}>← Back to Shop</button>
    </div>
  {/if}
</div>

<style>
  /* ── Root ── */
  .invoice-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem 4rem;
    gap: 1.5rem;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .invoice-root.visible { opacity: 1; }

  /* ── Action bar ── */
  .action-bar {
    width: 100%;
    max-width: 700px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .prototype-badge {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem; font-weight: 700;
    color: #f46958;
    background: rgba(244,105,88,0.1);
    border: 1.5px dashed #f46958;
    border-radius: 6px;
    padding: 4px 10px;
    letter-spacing: 0.04em;
  }

  .btn-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 0.85rem;
    color: #2a2420; background: rgba(239,234,228,0.85);
    border: 2px solid #2a2420; border-radius: 999px;
    padding: 7px 16px; cursor: pointer;
    box-shadow: 2px 2px 0 #2a2420;
    transition: transform 0.15s, box-shadow 0.15s;
    text-decoration: none;
  }
  .btn-back:hover { transform: translateY(-1px) translateX(-2px); box-shadow: 3px 3px 0 #2a2420; }

  .btn-print {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 0.85rem;
    color: #f0ebe3; background: #2a2420;
    border: 2px solid #2a2420; border-radius: 999px;
    padding: 7px 16px; cursor: pointer;
    box-shadow: 2px 2px 0 rgba(42,36,32,0.3);
    transition: transform 0.15s, background 0.2s;
  }
  .btn-print:hover { background: #f4a87c; color: #2a2420; transform: translateY(-1px); }

  /* ── Invoice card ── */
  .invoice-card {
    width: 100%;
    max-width: 680px;
    background: #faf7f2;
    border: 2px solid rgba(42,36,32,0.15);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(42,36,32,0.1), 4px 4px 0 rgba(42,36,32,0.08);
    overflow: hidden;
    display: flex;
  }

  /* Strip */
  .invoice-strip {
    width: 10px; flex-shrink: 0;
    display: flex; flex-direction: column;
  }
  .strip-seg { min-height: 20px; }

  /* Content */
  .invoice-content {
    flex: 1;
    padding: 1.75rem 1.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Top */
  .inv-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }

  .inv-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 2.4rem; color: #f4a87c; margin: 0; line-height: 1;
  }

  .inv-number {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem; color: #9a8e88; margin: 4px 0 0;
  }

  .inv-studio-wrap { text-align: right; }

  .inv-studio {
    display: block;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.05rem; color: #2a2420; letter-spacing: 0.1em;
  }

  .inv-studio-sub {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem; color: #9a8e88; letter-spacing: 0.06em;
  }

  .inv-divider { height: 1.5px; background: rgba(42,36,32,0.12); border-radius: 1px; }

  /* Buyer + total */
  .inv-meta-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }

  .inv-buyer-block {}
  .inv-to-label { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.75rem; color: #9a8e88; margin: 0 0 4px; }
  .inv-buyer { font-family: 'HammersmithOne', Georgia, serif; font-size: 1.4rem; color: #2a2420; margin: 0 0 2px; text-transform: capitalize; }
  .inv-contact { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.8rem; color: #7a6f68; margin: 0; }

  .inv-total-block { text-align: right; }
  .inv-total-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem; color: #9a8e88; margin: 0 0 4px;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .inv-total-value { font-family: 'HammersmithOne', Georgia, serif; font-size: 1.5rem; color: #2a2420; margin: 0 0 6px; }

  .inv-paid-badge {
    display: inline-block;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em;
    background: rgba(255,186,9,0.15); color: #7a5500;
    border: 1.5px solid rgba(255,186,9,0.4);
    border-radius: 4px; padding: 2px 7px;
  }

  /* Table */
  .inv-table-wrap { border-radius: 10px; overflow: hidden; border: 1.5px solid rgba(42,36,32,0.12); }

  .inv-table { width: 100%; border-collapse: collapse; font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.82rem; }
  .inv-table thead tr { background: #f4a87c; }
  .inv-table th {
    padding: 9px 12px; text-align: left;
    font-weight: 700; letter-spacing: 0.06em;
    font-size: 0.7rem; color: #2a2420; text-transform: uppercase;
  }
  .inv-table td { padding: 10px 12px; color: #2a2420; border-top: 1px solid rgba(42,36,32,0.07); vertical-align: top; }

  .item-title { display: block; font-weight: 600; }
  .item-sub { display: block; font-size: 0.72rem; color: #9a8e88; margin-top: 2px; }

  .col-item  { width: 50%; }
  .col-qty   { width: 12%; text-align: center; }
  .col-price { width: 19%; text-align: right; }
  .col-total { width: 19%; text-align: right; }
  .inv-table th.col-qty, .inv-table th.col-price, .inv-table th.col-total { text-align: right; }

  /* Subtotals */
  .inv-subtotals { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
  .sub-row { display: flex; gap: 1.5rem; font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.82rem; color: #2a2420; }
  .sub-label { color: #9a8e88; min-width: 80px; text-align: right; }
  .sub-value { min-width: 90px; text-align: right; }

  .total-row {
    background: #f4a87c; padding: 7px 14px;
    border-radius: 8px; margin-top: 4px;
  }
  .total-label { color: #2a2420; font-weight: 700; }
  .total-value { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.95rem; color: #2a2420; }

  /* Payment + QRIS row */
  .inv-payment-qris-row {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .inv-payment-info { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.6rem; }

  .pay-section-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.88rem; color: #2a2420; margin: 0;
  }

  .pay-detail-card {
    background: rgba(42,36,32,0.04);
    border: 1.5px solid rgba(42,36,32,0.1);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pay-method-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.82rem;
    color: #2a2420;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(42,36,32,0.08);
  }

  .pay-detail-rows { display: flex; flex-direction: column; gap: 5px; }

  .pay-detail-item {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
  }

  .pay-detail-label { color: #9a8e88; }
  .pay-detail-val { color: #2a2420; font-weight: 500; text-align: right; word-break: break-word; max-width: 60%; }

  .status-pending {
    color: #7a5500;
    background: rgba(255,186,9,0.12);
    border: 1px solid rgba(255,186,9,0.3);
    border-radius: 4px;
    padding: 1px 6px;
  }

  .pay-note {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem; color: #9a8e88; margin: 0;
    font-style: italic; line-height: 1.5;
  }

  /* QRIS */
  .inv-qris-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }

  .qris-label-sm {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #9a8e88; margin: 0;
  }

  .inv-qris-frame {
    width: 160px; height: 160px;
    border: 2px solid rgba(42,36,32,0.15);
    border-radius: 12px; overflow: hidden;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 2px 2px 0 rgba(42,36,32,0.1);
  }

  .inv-qris-img { width: 100%; height: 100%; object-fit: contain; display: block; }

  .inv-qris-fallback {
    display: none;
    flex-direction: column; align-items: center; justify-content: center;
    width: 100%; height: 100%;
  }

  /* Footer row */
  .inv-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.25rem;
  }

  .inv-thankyou {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.88rem; color: #7a6f68; margin: 0; font-style: italic;
  }

  .inv-date {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem; color: #9a8f88; margin: 0;
  }

  /* No invoice */
  .no-invoice {
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    font-family: 'DM Sans', system-ui, sans-serif; color: #7a6f68;
    padding: 4rem;
  }

  /* ═══════════════════════════════════════
     PRINT STYLES — hanya invoice card yang muncul
  ═══════════════════════════════════════ */
  @media print {
    /* Sembunyikan SEMUA elemen di luar invoice */
    :global(body) > *:not(.invoice-root) { display: none !important; }

    /* Sembunyikan navbar & elemen non-print */
    :global(nav),
    :global(aside),
    :global(header:not(.invoice-card *)),
    :global([data-navbar]),
    :global([class*="sidebar"]),
    :global([class*="nav-"]),
    .no-print { display: none !important; }

    .invoice-root {
      padding: 0;
      margin: 0;
      background: white;
      min-height: unset;
      gap: 0;
    }

    .invoice-card {
      box-shadow: none;
      border: 1px solid #ddd;
      border-radius: 0;
      max-width: 100%;
      width: 100%;
    }

    .invoice-content { padding: 1.5rem; }

    .inv-qris-frame { width: 130px; height: 130px; }
  }

  /* ── Responsive ── */
  @media (max-width: 560px) {
    .invoice-content { padding: 1.25rem; }
    .inv-title { font-size: 1.8rem; }
    .inv-total-value { font-size: 1.2rem; }
    .action-bar { flex-direction: column; align-items: flex-start; }
    .action-right { width: 100%; justify-content: space-between; }
    .inv-payment-qris-row { flex-direction: column; align-items: stretch; }
    .inv-qris-wrap { flex-direction: row; align-items: center; gap: 1rem; }
    .inv-qris-frame { width: 100px; height: 100px; }
  }
</style>
