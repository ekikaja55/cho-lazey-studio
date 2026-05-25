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

<svelte:head><title>Invoice — Cho's Studio</title></svelte:head>

<div class="invoice-root" class:visible={mounted}>

  <!-- Action bar — no-print -->
  <div class="action-bar no-print animate-fade-up">
    <button class="btn-back" onclick={goBack}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Back to Shop
    </button>
    <div class="action-right">
      <span class="prototype-badge">⚠ PROTOTYPE — Not a real invoice</span>
      <button class="btn-print" onclick={handlePrint}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print / Save PDF
      </button>
    </div>
  </div>

  {#if invoice}

    <!-- Invoice card — same border/shadow/radius DNA as gallery-header/panel-card -->
    <div class="invoice-card animate-fade-up stagger-1">

      <!-- Tab strip — same 3-color folder identity -->
      <div class="inv-tab-strip" aria-hidden="true">
        <span class="itab itab-peach"></span>
        <span class="itab itab-lavender"></span>
        <span class="itab itab-turquoise"></span>
      </div>

      <div class="invoice-body">

        <!-- ── Top: title + studio ── -->
        <div class="inv-top">
          <div class="inv-top-left">
            <div class="inv-eyebrow">
              <span class="eyebrow-dot" aria-hidden="true"></span>
              <span>adoption receipt</span>
            </div>
            <h1 class="inv-title">Invoice</h1>
            <p class="inv-number">{invoiceNo}</p>
          </div>

          <div class="inv-studio-block">
            <div class="inv-studio-badge">CHO.LAZEY</div>
            <span class="inv-studio-sub">Digital Art Studio</span>
            <span class="inv-date-sub">{today}</span>
          </div>
        </div>

        <div class="inv-divider" aria-hidden="true"></div>

        <!-- ── Buyer + total ── -->
        <div class="inv-meta-row">
          <div class="inv-buyer-block">
            <p class="inv-to-label">Invoice To:</p>
            <p class="inv-buyer">{invoice.buyerEmail?.split('@')[0] ?? 'Customer'}</p>
            <p class="inv-contact">{invoice.buyerEmail}</p>
          </div>

          <div class="inv-total-block">
            <p class="inv-total-label">TOTAL</p>
            <p class="inv-total-value">{formatRupiah(invoice.itemPrice ?? 0)}</p>
            <span class="inv-status-badge">PENDING VERIFICATION</span>
          </div>
        </div>

        <!-- ── Table ── -->
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
                <td class="col-price">{formatRupiah(invoice.itemPrice)}</td>
                <td class="col-total">{formatRupiah(invoice.itemPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── Subtotals ── -->
        <div class="inv-subtotals">
          <div class="sub-row">
            <span class="sub-label">Sub-total</span>
            <span class="sub-value">{formatRupiah(invoice.itemPrice)}</span>
          </div>
          <div class="sub-row">
            <span class="sub-label">Shipping</span>
            <span class="sub-value">—</span>
          </div>
          <div class="sub-row total-row">
            <span class="sub-label total-label">Total</span>
            <span class="sub-value total-value">{formatRupiah(invoice.itemPrice)}</span>
          </div>
        </div>

        <div class="inv-divider" aria-hidden="true"></div>

        <!-- ── Payment + QRIS ── -->
        <div class="inv-bottom-row">

          <!-- Payment info -->
          <div class="inv-payment">
            <p class="pay-section-title">Payment Method</p>

            <div class="pay-detail-card">
              <div class="pay-method-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                QRIS / Bank Transfer
              </div>
              <div class="pay-rows">
                <div class="pay-row">
                  <span class="pay-key">Status</span>
                  <span class="pay-val status-pending">Awaiting Verification</span>
                </div>
                <div class="pay-row">
                  <span class="pay-key">Proof</span>
                  <span class="pay-val">{invoice.proofName ?? 'Uploaded'}</span>
                </div>
                <div class="pay-row">
                  <span class="pay-key">Date</span>
                  <span class="pay-val">{today}</span>
                </div>
              </div>
            </div>

            <p class="pay-note">✦ File will be sent to your email after payment is verified by the artist.</p>
          </div>

          <!-- QRIS -->
          <div class="inv-qris">
            <p class="qris-label">Scan to Pay</p>
            <div class="qris-frame">
              <img
                src={QRIS_URL}
                alt="QRIS payment code"
                class="qris-img"
                onerror={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }}
              />
              <div class="qris-fallback" style="display:none">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c4b0a8" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="inv-footer">
          <p class="inv-thankyou">Thank you for your purchase! ✦</p>
          <p class="inv-footer-date">{today}</p>
        </div>

      </div>
    </div>

  {:else}
    <div class="no-invoice animate-fade-up stagger-1">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c4b8b2" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <p>No invoice data found.</p>
      <button class="btn-back" onclick={goBack}>← Back to Shop</button>
    </div>
  {/if}

</div>

<style>
  /* ── Root ── */
  .invoice-root {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-bottom: 3rem;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .invoice-root.visible { opacity: 1; }

  /* ── Action bar ── */
  .action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    background: rgba(240,235,227,0.95);
    border: 2px solid #2a2420;
    border-radius: 999px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: #2a2420;
    cursor: pointer;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .btn-back:hover {
    background: #f4a87c;
    transform: translateY(-1px);
  }

  .action-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .prototype-badge {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    color: #7a5500;
    background: rgba(255,186,9,0.15);
    border: 1.5px solid rgba(255,186,9,0.4);
    border-radius: 6px;
    padding: 4px 10px;
  }

  .btn-print {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #2a2420;
    color: #efeae4;
    border: 2px solid #2a2420;
    border-radius: 999px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    cursor: pointer;
    box-shadow: 2px 2px 0px rgba(42,36,32,0.4);
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .btn-print:hover { background: #3d2f28; transform: translateY(-1px); }

  /* ══════════════════════════════════════
     INVOICE CARD — same DNA as gallery-header
     (border 3px, border-radius 28px, box-shadow 6px 6px)
     Nuance: color-tab strip top, peach accents
  ══════════════════════════════════════ */
  .invoice-card {
    background: rgba(240,235,227,0.98);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 8px 8px 0px #2a2420;
    overflow: hidden;
  }

  /* Tab strip — folder identity */
  .inv-tab-strip {
    display: flex;
    height: 6px;
  }

  .itab { flex: 1; }
  .itab-peach     { flex: 2; background: #f4a87c; }
  .itab-lavender  { flex: 1; background: #b4a6d5; }
  .itab-turquoise { flex: 1.5; background: #a2e1db; }

  .invoice-body { padding: 2rem 2.25rem; display: flex; flex-direction: column; gap: 1.35rem; }

  /* ── Top ── */
  .inv-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .inv-top-left { display: flex; flex-direction: column; gap: 4px; }

  .inv-eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #d4845a;
    margin-bottom: 2px;
  }

  .eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #f4a87c;
    border: 1.5px solid #2a2420;
    flex-shrink: 0;
  }

  .inv-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2rem, 5vw, 2.8rem);
    color: #2a2420;
    margin: 0;
    line-height: 1;
  }

  .inv-number {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem;
    color: rgba(42,36,32,0.45);
    margin: 0;
    letter-spacing: 0.04em;
  }

  /* Studio block */
  .inv-studio-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .inv-studio-badge {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.15rem;
    color: #2a2420;
    letter-spacing: 0.06em;
    background: rgba(244,168,124,0.2);
    border: 2px solid #2a2420;
    border-radius: 10px;
    padding: 4px 14px;
    box-shadow: 3px 3px 0px #2a2420;
  }

  .inv-studio-sub {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(42,36,32,0.45);
  }

  .inv-date-sub {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    color: rgba(42,36,32,0.35);
  }

  /* Divider */
  .inv-divider {
    height: 1.5px;
    background: rgba(42,36,32,0.12);
    border-radius: 1px;
  }

  /* Buyer + total */
  .inv-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .inv-to-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem; color: #9a8e88; margin: 0 0 4px;
  }

  .inv-buyer {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.3rem; color: #2a2420; margin: 0 0 2px; text-transform: capitalize;
  }

  .inv-contact {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem; color: #7a6f68; margin: 0;
  }

  .inv-total-block { text-align: right; }

  .inv-total-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem; color: #9a8e88; margin: 0 0 3px;
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  .inv-total-value {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.6rem; color: #d4845a; margin: 0 0 5px;
  }

  .inv-status-badge {
    display: inline-block;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em;
    background: rgba(255,186,9,0.15); color: #7a5500;
    border: 1.5px solid rgba(255,186,9,0.4);
    border-radius: 5px; padding: 2px 8px;
  }

  /* Table */
  .inv-table-wrap {
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid rgba(42,36,32,0.12);
  }

  .inv-table { width: 100%; border-collapse: collapse; font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.82rem; }

  .inv-table thead tr { background: #f4a87c; }

  .inv-table th {
    padding: 9px 13px; text-align: left;
    font-weight: 700; letter-spacing: 0.06em;
    font-size: 0.68rem; color: #2a2420; text-transform: uppercase;
  }

  .inv-table td { padding: 11px 13px; color: #2a2420; border-top: 1px solid rgba(42,36,32,0.07); vertical-align: top; }

  .item-title { display: block; font-weight: 600; }
  .item-sub   { display: block; font-size: 0.7rem; color: #9a8e88; margin-top: 2px; }

  .col-item { width: 50%; }
  .col-qty  { width: 12%; text-align: center; }
  .col-price { width: 19%; text-align: right; }
  .col-total { width: 19%; text-align: right; }
  .inv-table th.col-qty, .inv-table th.col-price, .inv-table th.col-total { text-align: right; }

  /* Subtotals */
  .inv-subtotals { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }

  .sub-row {
    display: flex; gap: 1.5rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.82rem; color: #2a2420;
  }

  .sub-label { color: #9a8e88; min-width: 80px; text-align: right; }
  .sub-value { min-width: 90px; text-align: right; }

  .total-row {
    background: rgba(244,168,124,0.2);
    border: 1.5px solid rgba(244,168,124,0.4);
    padding: 7px 14px;
    border-radius: 9px;
    margin-top: 4px;
  }

  .total-label { color: #2a2420; font-weight: 700; }
  .total-value { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.95rem; color: #d4845a; }

  /* Bottom row: payment + QRIS */
  .inv-bottom-row {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .inv-payment { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 0.55rem; }

  .pay-section-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.85rem; color: #2a2420; margin: 0;
  }

  .pay-detail-card {
    background: rgba(42,36,32,0.04);
    border: 1.5px solid rgba(42,36,32,0.1);
    border-radius: 12px;
    padding: 10px 13px;
    display: flex; flex-direction: column; gap: 8px;
  }

  .pay-method-row {
    display: flex; align-items: center; gap: 7px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem; color: #2a2420;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(42,36,32,0.07);
  }

  .pay-rows { display: flex; flex-direction: column; gap: 5px; }

  .pay-row {
    display: flex; justify-content: space-between; gap: 0.5rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
  }

  .pay-key { color: #9a8e88; }
  .pay-val { color: #2a2420; font-weight: 500; text-align: right; word-break: break-word; max-width: 55%; }

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
  .inv-qris {
    display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0;
  }

  .qris-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #9a8e88; margin: 0;
  }

  .qris-frame {
    width: 150px; height: 150px;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 3px 3px 0px #2a2420;
  }

  .qris-img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .qris-fallback { display: none; align-items: center; justify-content: center; width: 100%; height: 100%; }

  /* Footer */
  .inv-footer {
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

  .inv-footer-date {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem; color: #9a8e88; margin: 0;
  }

  /* No invoice */
  .no-invoice {
    text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    font-family: 'DM Sans', system-ui, sans-serif; color: #7a6f68;
    padding: 4rem 2rem;
    background: rgba(240,235,227,0.96);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 6px 6px 0px #2a2420;
  }

  .no-invoice p { font-size: 0.88rem; margin: 0; }

  /* ═══════════════════
     PRINT
  ═══════════════════ */
  @media print {
    :global(body) > *:not(.invoice-root) { display: none !important; }
    :global(nav), :global(aside), :global([class*="sidebar"]), :global([class*="nav-"]), .no-print { display: none !important; }

    .invoice-root { padding: 0; margin: 0; background: white; opacity: 1; }
    .invoice-card { box-shadow: none; border: 1.5px solid #ddd; border-radius: 0; max-width: 100%; }
    .invoice-body { padding: 1.25rem; }
    .inv-tab-strip { display: none; }
    .qris-frame { width: 120px; height: 120px; }
  }

  /* ═══════════════════
     RESPONSIVE
  ═══════════════════ */
  @media (max-width: 640px) {
    .invoice-body { padding: 1.5rem 1.25rem; }
    .inv-title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
    .inv-total-value { font-size: 1.25rem; }
    .action-bar { flex-direction: column; align-items: flex-start; }
    .action-right { width: 100%; justify-content: space-between; }
    .inv-bottom-row { flex-direction: column; }
    .inv-qris { flex-direction: row; align-items: center; gap: 1rem; }
    .qris-frame { width: 90px; height: 90px; }
  }

  @media (max-width: 400px) {
    .inv-table th, .inv-table td { padding: 8px 9px; }
    .col-price { display: none; }
    .inv-table th.col-price { display: none; }
  }
</style>
