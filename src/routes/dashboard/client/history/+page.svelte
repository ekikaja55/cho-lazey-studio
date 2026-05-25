<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth.js';
  import { getHistoryByUserId, getAllHistory } from '$lib/data/mockHistory.js';
  import { formatRupiah } from '$lib/data/galleryImages.js';
  
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import HistoryDetailModal from '$lib/components/dashboard/HistoryDetailModal.svelte';

  // ── States ─────────────────────────────────────────
  let loadedOrders = $state([]);
  let filterType    = $state('all');     // 'all' | 'adoption' | 'commission'
  let filterStatus  = $state('all');     // 'all' | 'active' | 'completed' | 'cancelled'
  let selectedOrder = $state(null);      // Menyimpan order yang aktif dibuka di modal

  onMount(() => {
    let currentUser = null;
    const unsubscribe = auth.subscribe(u => currentUser = u);
    unsubscribe();

    if (!currentUser) return;

    if (currentUser.role === 'artist') {
      loadedOrders = getAllHistory();
    } else {
      loadedOrders = getHistoryByUserId(currentUser.id);
    }
  });

  // ── Filter Reaktif ─────────────────────────────────
  const filteredOrders = $derived(
    loadedOrders.filter(order => {
      if (filterType !== 'all' && order.typeCommis !== filterType) return false;

      if (filterStatus !== 'all') {
        if (filterStatus === 'completed' && order.statusOrder !== 'completed' && order.statusOrder !== 'delivered') return false;
        if (filterStatus === 'cancelled' && order.statusOrder !== 'cancelled') return false;
        if (filterStatus === 'active') {
          if (['completed', 'delivered', 'cancelled'].includes(order.statusOrder)) return false;
        }
      }
      return true;
    })
  );

  function openDetail(order) {
    selectedOrder = order; // Membuka modal tanpa memicu pemberitahuan toast
  }

  function closeDetail() {
    selectedOrder = null;
  }
</script>

<svelte:head>
  <title>Order Archive | Cho's Studio</title>
</svelte:head>

<div class="page">
 <!-- ── Header Section (DNA Matched) ── -->
  <header class="page-header boxed-header">
    <!-- Ornamen Geometris Background -->
    <div class="bg-shapes">
      <div class="shape shape-purple"></div>
      <div class="shape shape-green"></div>
      <div class="shape shape-peach"></div>
    </div>
    
    <div class="header-content">
      <p class="header-eyebrow">
        <span class="eyebrow-dot"></span> ✦ OWNED PIECES ✦
      </p>
      <h1 class="header-title">Order Archive</h1>
      <div class="header-rule"></div>
      <p class="header-desc">A quiet look back at your history with the studio. Revisiting the illustrations and stories you have gathered over time.</p>
    </div>
  </header>  

  <div class="filter-panel">
    <div class="filter-group">
      <span class="filter-label">Type</span>
      <div class="btn-tabs">
        <button class:active={filterType === 'all'} onclick={() => filterType = 'all'}>All</button>
        <button class:active={filterType === 'adoption'} onclick={() => filterType = 'adoption'}>Adoption</button>
        <button class:active={filterType === 'commission'} onclick={() => filterType = 'commission'}>Commission</button>
      </div>
    </div>

    <div class="filter-group">
      <span class="filter-label">Progress</span>
      <div class="btn-tabs">
        <button class:active={filterStatus === 'all'} onclick={() => filterStatus = 'all'}>All Time</button>
        <button class:active={filterStatus === 'active'} onclick={() => filterStatus = 'active'}>In Progress</button>
        <button class:active={filterStatus === 'completed'} onclick={() => filterStatus = 'completed'}>Completed</button>
        <button class:active={filterStatus === 'cancelled'} onclick={() => filterStatus = 'cancelled'}>Cancelled</button>
      </div>
    </div>
  </div>

  {#if filteredOrders.length === 0}
    <div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      <p>No transactions found matching these criteria.</p>
    </div>
  {:else}
    <div class="history-grid">
     {#each filteredOrders as order, index (order.order_id)}
        <div class="history-card" style="--card-index: {index};">
          
          <div class="card-preview">
            <WatermarkWrapper text="CHO'S STUDIO" fontSize={11} spacing={45} opacity={0.5}>
              <img src={order.pathImage} alt={order.title} class="art-img" />
            </WatermarkWrapper>
            <div class="card-img-overlay"></div>
            
            <span class="card-badge" class:commis={order.typeCommis === 'commission'}>
              {order.typeCommis}
            </span>
          </div>

          <div class="card-details">
            <div class="card-meta">
              <span class="order-id">#{order.order_id}</span>
              <span class="order-status status-{order.statusOrder}">{order.statusOrder}</span>
            </div>
            
            <h3 class="art-title">{order.title}</h3>
            <p class="art-price">{formatRupiah(order.price)}</p>
            
            <button class="btn-view" onclick={() => openDetail(order)}>
              <span>View Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

        </div>
      {/each}
    </div>
  {/if}
</div>

<HistoryDetailModal order={selectedOrder} onclose={closeDetail} />

<style>
  /* ── Page Shell ── */
  .page {
    width: 100%;
    /* max-width dihapus agar merenggang penuh mengikuti kontainer luar */
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ── Header (Boxed Style Matched) ── */
  .page-header.boxed-header {
    position: relative;
    background: #f3eee6; /* Warna krem hangat menyesuaikan gambar */
    border: 2.5px solid #2a2420;
    border-radius: 20px;
    padding: 2.5rem 3rem;
    box-shadow: 6px 6px 0px #2a2420;
    overflow: hidden; /* Memastikan ornamen tidak keluar kotak */
    z-index: 1;
  }

  .header-content {
    position: relative;
    z-index: 2; /* Menjaga teks tetap di atas ornamen dekorasi */
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

  /* Ikon donat kecil di teks eyebrow */
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

  /* Garis gradasi peach ke ungu */
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

  /* ── Decorative Background Shapes ── */
  .bg-shapes {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none; /* Agar tidak menghalangi seleksi teks */
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

  /* Responsive penyesuaian khusus header */
  @media (max-width: 600px) {
    .page-header.boxed-header {
      padding: 1.5rem;
      border-radius: 16px;
    }
    .bg-shapes { opacity: 0.4; } /* Diredam di layar kecil agar teks tidak bertabrakan */
  }
  /* ── Filter Panel (Matching Configuration Panels) ── */
  .filter-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem 2.5rem;
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    padding: 1.25rem 1.5rem;
    border-radius: 16px;
    align-items: center;
    box-shadow: 4px 4px 0px rgba(42, 36, 32, 0.15);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .filter-label {
    font-family: 'HammersmithOne', serif;
    font-size: 0.95rem;
    color: #2a2420;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Brutalist Tabs */
  .btn-tabs {
    display: flex;
    background: #fbfaf8;
    border: 2px solid #2a2420;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 2px 2px 0px #2a2420;
  }

  .btn-tabs button {
    background: transparent;
    border: none;
    border-right: 2px solid #2a2420;
    padding: 0.45rem 1.1rem;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #2a2420;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .btn-tabs button:last-child { border-right: none; }
  .btn-tabs button:hover:not(.active) { background: rgba(42,36,32,0.06); }
  
  .btn-tabs button.active { 
    background: #2a2420; 
    color: #fbfaf8; 
  }


@keyframes cardEntry {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  } 

  /* ── History Grid (Responsive auto-fit) ── */
.history-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Ubah bagian auto-fit menjadi auto-fill di sini */
    gap: 1.6rem;
  }
  /* ── History Card (Matching Tier Card DNA) ── */
  .history-card {
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 6px 6px 0px #2a2420;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
    
    animation: cardEntry 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1) both;
    animation-delay: calc(var(--card-index) * 0.08s);
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
  }

  .history-card:hover {
    transform: translate(-3px, -4px) !important;
    box-shadow: 9px 9px 0px #2a2420;  
    }

  .card-preview {
    position: relative;
    width: 100%;
    height: 200px;
    background: #1a1614;
    border-bottom: 2.5px solid #2a2420;
    overflow: hidden;
  }

  .card-img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.2s ease;
  }
  .history-card:hover .card-img-overlay { background: rgba(0,0,0,0.08); }

  .art-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }
  .history-card:hover .art-img { transform: scale(1.04); }

  /* Tags/Badge styles updated for DM Sans */
  .card-badge {
    position: absolute;
    top: 12px; left: 12px;
    background: #d4e8ff;
    color: #1a4d8a;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0.3rem 0.8rem;
    border-radius: 8px;
    border: 2px solid #2a2420;
    letter-spacing: 0.04em;
    box-shadow: 2px 2px 0px rgba(42,36,32, 0.8);
  }
  .card-badge.commis { background: #f4a87c; color: #2a2420; }

  /* ── Card Details ── */
  .card-details {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-id {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    color: #8c7e75;
  }

  .order-status {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .order-status.status-completed, .order-status.status-delivered { color: #2a8a30; }
  .order-status.status-pending { color: #c05c20; }
  .order-status.status-cancelled { color: #bc3624; }

  .art-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.3rem;
    color: #2a2420;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .art-price {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: #4a403a;
    margin: 0 0 0.8rem 0;
  }

  /* ── Action Button (Matching back/submit buttons) ── */
  .btn-view {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0.65rem 1rem;
    background: #fbfaf8;
    color: #2a2420;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    border: 2px solid #2a2420;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 2px 2px 0px #2a2420;
    transition: all 0.15s ease;
  }
  .btn-view:hover {
    background: #f4a87c;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #2a2420;
  }
  .btn-view:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  /* ── Empty State ── */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border: 2.5px dashed rgba(42, 36, 32, 0.25);
    background: rgba(42, 36, 32, 0.02);
    border-radius: 20px;
    color: #5a504a;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
  }
  .empty-state svg {
    margin-bottom: 0.75rem;
    color: rgba(42, 36, 32, 0.4);
  }


  /* ── Responsive adjustments ── */
  @media (max-width: 600px) {
    .filter-panel { flex-direction: column; align-items: stretch; gap: 1rem; }
    .filter-group { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .btn-tabs { width: 100%; }
    .btn-tabs button { flex: 1; text-align: center; }
  }
</style>
