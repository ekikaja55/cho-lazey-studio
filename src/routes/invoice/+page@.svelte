<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { formatRupiah } from '$lib/data/galleryImages.js';

  let { fallbackUrl = '/home' } = $props();
  
  // State Reaktif Svelte 5
  let invoiceData = $state(null);
  let isLoading = $state(true);

  onMount(() => {
    const rawData = sessionStorage.getItem('cho_invoice');

    if (!rawData) {
      goto(fallbackUrl, { replaceState: true });
      return;
    }

    try {
      const parsed = JSON.parse(rawData);
      if (!parsed.itemId || !parsed.itemTitle || !parsed.itemPrice) {
        throw new Error("Struktur data invoice tidak valid");
      }
      
      invoiceData = parsed;
      isLoading = false;

      // --- IMPLEMENTASI HISTORY TRAPPING ---
      history.pushState(null, '', location.href);

      const handlePopState = () => {
        sessionStorage.removeItem('cho_invoice');
        goto(fallbackUrl, { replaceState: true });
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };

    } catch (error) {
      sessionStorage.removeItem('cho_invoice');
      goto(fallbackUrl, { replaceState: true });
    }
  });

  function handlePrint() {
    window.print();
  }

  function handleBack() {
    sessionStorage.removeItem('cho_invoice');
    goto(fallbackUrl);
  }
</script>

<svelte:head>
  <title>Invoice No. {invoiceData?.itemId || 'Loading'}</title>
</svelte:head>

{#if isLoading}
  <div class="loading-overlay">
    <div class="soft-spinner"></div>
    <p class="loading-text">Memuat Nota Transaksi...</p>
  </div>
{:else}
  <div class="invoice-page-container">
    
    <div class="action-bar no-print animated-entry" style="--delay: 0s;">
      <button class="btn-brutal btn-back" onclick={handleBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Kembali
      </button>
      <button class="btn-brutal btn-print" onclick={handlePrint}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Cetak / Simpan PDF
      </button>
    </div>

    <div class="invoice-card-wrapper animated-entry" style="--delay: 0.1s;">
      
      <div class="brutal-sidebar-pattern">
        <div class="geo-block block-purple"></div>
        <div class="geo-block block-mint"></div>
        <div class="geo-block block-peach"></div>
        <div class="geo-block block-purple"></div>
        <div class="geo-block block-mint"></div>
        <div class="geo-block block-peach"></div>
        <div class="geo-block block-purple"></div>
        <div class="geo-block block-mint"></div>
      </div>

      <div class="invoice-main-content">
        
        <header class="main-header">
          <div class="title-area">
            <h1 class="invoice-title-text">INVOICE</h1>
            <p class="invoice-sub-id">No. {invoiceData.itemId}-0117</p>
          </div>
          <div class="brand-logo">
            <span class="logo-dot"></span> CHO'S LAZEY
          </div>
        </header>

        <div class="horizontal-divider-thick"></div>

        <section class="summary-section">
          <div class="client-info">
            <span class="label-muted">Invoice To:</span>
            <h2 class="client-name">{invoiceData.buyerEmail.split('@')[0]}</h2>
            <p class="client-sub-detail">{invoiceData.buyerEmail}</p>
          </div>
          <div class="top-total-display">
            <span class="label-muted-right">TOTAL AMOUNT:</span>
            <h3 class="total-bold-amount">{formatRupiah(invoiceData.itemPrice)}</h3>
          </div>
        </section>

        <div class="table-container">
          <table class="soft-brutal-table">
            <thead>
              <tr>
                <th style="width: 55%;">ITEM DESCRIPTION</th>
                <th style="width: 10%; text-align: center;">QTY</th>
                <th style="width: 15%; text-align: right;">PRICE</th>
                <th style="width: 20%; text-align: right;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="table-item-main">{invoiceData.itemTitle}</span>
                  <span class="table-item-sub">Custom digital art illustration development</span>
                </td>
                <td style="text-align: center; font-weight: 700;">1</td>
                <td style="text-align: right;">{formatRupiah(invoiceData.itemPrice)}</td>
                <td style="text-align: right; font-weight: 800;">{formatRupiah(invoiceData.itemPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section class="calculation-block">
          <div class="calc-row">
            <span class="calc-label">Sub-total :</span>
            <span class="calc-val">{formatRupiah(invoiceData.itemPrice)}</span>
          </div>
          <div class="calc-row">
            <span class="calc-label">Ongkir :</span>
            <span class="calc-val">Rp0</span>
          </div>
          <div class="calc-row final-total-row">
            <span class="final-label">TOTAL :</span>
            <span class="final-val">{formatRupiah(invoiceData.itemPrice)}</span>
          </div>
        </section>

        <section class="payment-footer-area">
          <div class="payment-method-box">
            <span class="label-muted">Payment Method :</span>
            <p class="method-name">QRIS Barcode / Automated Dynamic Gate</p>
            <div class="proof-reference">
              <span>Attached Proof:</span> <br class="mobile-break"/>
              <code>{invoiceData.proofName}</code>
            </div>
          </div>
          
          <div class="qr-code-wrapper">
            <img class="brutal-qr-img" src="/assets/qris.png" alt="QRIS Barcode" />
            <p class="thanks-caption">Thank you for your purchase!</p>
          </div>
        </section>

      </div>
    </div>

  </div>
{/if}

<style>
  /* ══════════════════════════════════════════
     PENGATURAN DASAR & VARIABEL WARNA (DNA MATCHED)
     ══════════════════════════════════════════ */
  :global(body) {
    background-color: #f3eee6 !important; /* Latar belakang krem hangat */
    color: #2a2420 !important;
    font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
  }

  /* Animasi Masuk */
  @keyframes pageEntry {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animated-entry {
    animation: pageEntry 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1) both;
    animation-delay: var(--delay);
  }

  /* ── Loader ── */
  .loading-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #fbfaf8;
    gap: 1.25rem;
  }
  .soft-spinner {
    width: 44px; height: 44px;
    border: 4px solid #e2dcf2;
    border-top: 4px solid #2a2420;
    border-radius: 50%;
    animation: smooth-spin 0.8s linear infinite;
  }
  @keyframes smooth-spin { to { transform: rotate(360deg); } }
  .loading-text { font-family: 'HammersmithOne', serif; font-size: 1.1rem; color: #2a2420; }

  /* ── Container Utama ── */
  .invoice-page-container {
    max-width: 820px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* ── Action Control Top Bar ── */
  .action-bar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .btn-brutal {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.75rem 1.25rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2a2420;
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #2a2420;
    transition: all 0.15s ease;
  }
  .btn-brutal:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #2a2420; }
  .btn-brutal:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #2a2420; }

  .btn-back:hover { background-color: #e2dcf2; }
  .btn-print { background-color: #f4a87c; }
  .btn-print:hover { background-color: #e08454; }

  /* ── STRUKTUR INVOICE CARD WRAPPER ── */
  .invoice-card-wrapper {
    background-color: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 20px;
    display: flex;
    position: relative;
    overflow: hidden;
    min-height: 800px;
    box-shadow: 8px 8px 0px #2a2420;
  }

  /* ── BANNER GEOMETRIS SISI KIRI ── */
  .brutal-sidebar-pattern {
    width: 40px;
    border-right: 2.5px solid #2a2420;
    display: flex;
    flex-direction: column;
    background-color: #2a2420;
  }
  .geo-block {
    width: 100%;
    flex-grow: 1;
    border-bottom: 2.5px solid #2a2420;
    transform: skewY(-8deg) scale(1.1);
    margin-bottom: 2px;
  }
  .block-peach { background-color: #f4a87c; }
  .block-purple { background-color: #e2dcf2; }
  .block-mint   { background-color: #dcf2e9; }

  /* ── AREA KONTEN UTAMA NOTA (KANAN) ── */
  .invoice-main-content {
    flex: 1;
    padding: 3rem 3.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ── Header Seksi ── */
  /* ── Header Seksi (Perbaikan Mobile) ── */
  .main-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    gap: 1rem; /* Tambah gap biar tidak mepet */
  }

  .invoice-title-text {
    font-family: 'HammersmithOne', Georgia, serif;
    /* Menggunakan clamp agar font otomatis menyesuaikan lebar layar */
    font-size: clamp(2.2rem, 8vw, 3.5rem); 
    margin: 0;
    line-height: 0.95;
    color: #fbfaf8;
    -webkit-text-stroke: 2.5px #2a2420;
    letter-spacing: 0.02em;
    text-shadow: 4px 4px 0px #2a2420;
  }

  .invoice-sub-id {
    margin: 0.8rem 0 0 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: #7a706a;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'HammersmithOne', serif;
    font-size: 1.1rem;
    color: #2a2420;
    padding-top: 0.5rem;
  }
  .logo-dot { width: 12px; height: 12px; background: #f4a87c; border: 2px solid #2a2420; border-radius: 50%; }

  .horizontal-divider-thick {
    width: 100%; height: 3px;
    background-color: #2a2420;
    margin: -0.5rem 0;
  }

  /* ── Section Detail Client & Harga Atas ── */
  .summary-section { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; }

  .label-muted {
    display: block;
    font-family: 'HammersmithOne', serif;
    font-size: 0.85rem;
    color: #8c7e75;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.4rem;
  }

  .label-muted-right {
    display: block;
    font-family: 'HammersmithOne', serif;
    font-size: 0.85rem;
    color: #8c7e75;
    text-align: right;
    letter-spacing: 0.05em;
    margin-bottom: 0.4rem;
  }

  .client-name {
    font-family: 'HammersmithOne', serif;
    font-size: 1.8rem;
    margin: 0;
    line-height: 1.1;
    color: #2a2420;
  }

  .client-sub-detail { margin: 0.3rem 0 0 0; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: #5a504a; font-weight: 500;}

  .total-bold-amount {
    font-family: 'HammersmithOne', serif;
    font-size: 2rem;
    margin: 0;
    color: #2a2420;
  }

  /* ── DATA TABEL RAPI ── */
  .table-container { width: 100%; overflow-x: auto; }

  .soft-brutal-table { width: 100%; border-collapse: collapse; }

  .soft-brutal-table th {
    background-color: #f4a87c;
    color: #2a2420;
    padding: 0.6rem 0.8rem;
    font-family: 'HammersmithOne', serif;
    font-size: 0.85rem;
    border-top: 2.5px solid #2a2420;
    border-bottom: 2.5px solid #2a2420;
    text-align: left;
    letter-spacing: 0.05em;
  }

  .soft-brutal-table td {
    padding: 1.25rem 0.8rem;
    border-bottom: 2.5px solid rgba(42, 36, 32, 0.15);
    font-size: 0.95rem;
    color: #2a2420;
  }

  .table-item-main { display: block; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.3rem; }
  .table-item-sub { display: block; font-size: 0.85rem; color: #7a706a; }

  /* ── PERHITUNGAN SUB-TOTAL ── */
  .calculation-block { display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem; width: 100%; margin-top: -0.5rem; }

  .calc-row { display: flex; justify-content: flex-end; width: 280px; font-size: 0.95rem; color: #2a2420; }
  .calc-label { width: 50%; text-align: right; color: #7a706a; font-weight: 600; padding-right: 0.8rem; }
  .calc-val { width: 50%; text-align: right; font-weight: 700; font-family: 'HammersmithOne', serif; }

  /* Total Akhir Highlight */
  .final-total-row { margin-top: 0.5rem; align-items: center; }

  .final-label {
    font-family: 'HammersmithOne', serif; font-size: 1.1rem;
    text-align: right; width: 40%; padding-right: 0.8rem; color: #2a2420;
  }

  .final-val {
    background-color: #dcf2e9;
    color: #2a2420;
    font-family: 'HammersmithOne', serif;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    border: 2.5px solid #2a2420;
    border-radius: 10px;
    width: 60%;
    text-align: right;
    box-shadow: 3px 3px 0px #2a2420;
  }

  /* ── BLOK FOOTER & ASSET QRIS ── */
  .payment-footer-area {
    display: flex; justify-content: space-between; align-items: flex-end;
    gap: 2rem; margin-top: auto; padding-top: 2rem; border-top: 2.5px dashed rgba(42,36,32,0.2);
  }

  .payment-method-box { width: 100%; text-align: left; }

  .method-name { margin: 0 0 0.8rem 0; font-family: 'HammersmithOne', serif; font-size: 1.1rem; color: #2a2420; text-transform: capitalize; }

  .proof-reference { font-size: 0.85rem; color: #7a706a; line-height: 1.6; }
  .mobile-break { display: none; }

  .proof-reference code {
    font-family: monospace; font-weight: bold; background-color: rgba(42,36,32,0.06);
    padding: 3px 6px; border: 1.5px solid rgba(42,36,32,0.2); border-radius: 6px; color: #2a2420;
  }

  /* Style Image Asset QRIS */
  .qr-code-wrapper { display: flex; flex-direction: column; align-items: center; gap: 0.8rem; }

  .brutal-qr-img {
    width: 130px; height: 130px; border: 2.5px solid #2a2420; border-radius: 12px;
    padding: 0.5rem; background-color: #ffffff; object-fit: contain; box-shadow: 4px 4px 0px #2a2420;
  }

  .thanks-caption { margin: 0; font-family: 'HammersmithOne', serif; font-size: 0.95rem; color: #2a2420; }

  /* ══════════════════════════════════════════
     MEDIA RESPONSIVE (MOBILE OPTIMIZATION)
     ══════════════════════════════════════════ */
  @media (max-width: 650px) {
    
    .main-header {
      flex-direction: column; /* Ubah ke kolom biar tidak saling tabrak */
      align-items: flex-start;
      gap: 0.5rem;
    }

    .brand-logo {
      padding-top: 0; /* Hilangkan padding atas biar lebih rapat ke title-area */
      order: -1;      /* Pindah ke paling atas kalau mau */
    }

.invoice-sub-id { margin: 0.2rem 0 0 0; }

.invoice-main-content { padding: 1.5rem; gap: 1.5rem; }


    .invoice-card-wrapper { border-radius: 16px; min-height: auto; flex-direction: column;}
    .brutal-sidebar-pattern { width: 100%; height: 20px; flex-direction: row; border-right: none; border-bottom: 2.5px solid #2a2420; }
    .geo-block { border-bottom: none; border-right: 2.5px solid #2a2420; transform: skewX(-15deg) scale(1.1); margin-bottom: 0; margin-right: 2px;}
    .invoice-main-content { padding: 2rem 1.5rem; gap: 1.5rem; }
    
    .summary-section { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
    .top-total-display { align-self: flex-start; }
    .label-muted-right { text-align: left; }
    /* .invoice-title-text { font-size: 2.6rem; text-shadow: 3px 3px 0px #2a2420; -webkit-text-stroke: 1.5px #2a2420;} */

    .payment-footer-area { flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; }
    .payment-method-box { text-align: center; }
    .mobile-break { display: block; }
  }

  /* ══════════════════════════════════════════
     MEDIA PRINT (WINDOW PRINT / PDF)
     ══════════════════════════════════════════ */
  @media print {
    :global(body) { background-color: #ffffff !important; }
    .no-print { display: none !important; }
    
    .invoice-page-container { max-width: 100%; margin: 0; padding: 0; }
    .invoice-card-wrapper { border: 2px solid #000000; box-shadow: none !important; border-radius: 0; }
    .brutal-sidebar-pattern { border-right: 2px solid #000000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .brutal-qr-img { box-shadow: none !important; }
    .final-val { box-shadow: none !important; }
    
    .soft-brutal-table th, .final-val {
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
  }
</style>
