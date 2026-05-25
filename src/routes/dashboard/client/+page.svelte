<script>
  // 1. Import Store Auth dan Helper Database Prototype
  import { auth } from '$lib/stores/auth.js'; 
  import { getHistoryByUserId } from '$lib/data/mockHistory.js'; 
  import { formatRupiah } from '$lib/data/galleryImages.js';

  // 2. Ambil ID & Nama user yang sedang login secara reaktif dari store auth
  let currentUserId = $derived($auth?.id ?? null);
  let currentUserName = $derived($auth?.username ?? 'Patron');

  // 3. Tarik data secara dinamis menggunakan rune $derived
  let myHistoryData = $derived(currentUserId ? getHistoryByUserId(currentUserId) : []);

  // 4. Pengelompokan status berbasis data dinamis
  let activeCommissions = $derived(
    myHistoryData.filter(item => item.statusOrder !== 'completed' && item.statusOrder !== 'cancelled')
  );
  
  let collectedPieces = $derived(
    myHistoryData.filter(item => item.statusOrder === 'completed')
  );

  // 5. Hitung jumlah total secara dinamis untuk widget statistik atas
  let activeCount = $derived(activeCommissions.length);
  let collectedCount = $derived(collectedPieces.length);

  // Helper warna badge Soft Brutalist
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'revision': return 'badge-revision';
      case 'coloring': case 'sketching': return 'badge-processing';
      case 'pending': return 'badge-queue';
      case 'delivered': return 'badge-delivered';
      default: return 'badge-default';
    }
  }

  // Helper deskripsi status pelacakan proyek
  function getStatusDescription(item) {
    if (item.statusOrder === 'revision' && item.revision_note) {
      return `Catatan Anda: "${item.revision_note}"`;
    }
    if (item.statusOrder === 'coloring') {
      return 'Artis sedang memoles kombinasi warna dan detail bayangan.';
    }
    if (item.statusOrder === 'pending') {
      return 'Menunggu validasi berkas invoice atau antrean studio.';
    }
    return `Proyek ilustrasi berstatus [${item.statusOrder}]`;
  }
</script>

<svelte:head>
  <title>Client Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<div class="page-container">
  
  {#if !$auth}
    <div class="auth-fallback-box">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <p>Silakan login terlebih dahulu untuk mengakses area dashboard patron.</p>
    </div>
  {:else}
    
    <header class="page-header boxed-header">
      <div class="bg-shapes">
        <div class="shape shape-purple"></div>
        <div class="shape shape-green"></div>
        <div class="shape shape-peach"></div>
      </div>
      
      <div class="header-content">
        <div class="greeting-row">
          <p class="header-eyebrow">
            <span class="eyebrow-dot"></span> ✦ PATRON LOUNGE ✦
          </p>
          <p class="welcome-text">Welcome back, <strong>{currentUserName}</strong></p>
        </div>
        
        <h1 class="header-title">The Art Corner</h1>
        <div class="header-rule"></div>
        <p class="header-desc">Your personal corner of the studio. Wander through your current art orders and collected pieces.</p>
      </div>
    </header>

    <div class="dashboard-grid">
      
      <div class="stats-sidebar">
        <div class="brutal-card block-peach animated-card" style="--card-index: 0;">
          <div class="card-header">
            <span class="card-label">Active Orders</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a2420" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h2 class="card-value">{activeCount}</h2>
          <p class="card-subtext">Commissions currently handled by artist</p>
        </div>

        <div class="brutal-card block-lavender animated-card" style="--card-index: 1;">
          <div class="card-header">
            <span class="card-label">Collected Pieces</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a2420" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="card-value">{collectedCount}</h2>
          <p class="card-subtext">Artworks successfully fully completed</p>
        </div>

        <a href="/dashboard/client/commission" class="action-card-btn block-mint animated-card" style="--card-index: 2;">
          <span class="btn-text">Open New Commission</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </a>
      </div>

      <div class="main-activity-area animated-card" style="--card-index: 3;">
        <div class="brutal-container">
          <div class="container-header">
            <h3 class="container-title">Ongoing Tracker</h3>
            <span class="container-tag">User ID: {currentUserId}</span>
          </div>
          
          <div class="activity-list">
            {#if activeCommissions.length === 0}
              <div class="empty-activity">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                <p>You don't have any active orders right now.<br/>Let's create something beautiful!</p>
              </div>
            {:else}
              {#each activeCommissions as item}
                <div class="activity-item">
                  <div class="item-meta">
                    <span class="item-id">#{item.order_id}</span>
                    <span class="status-badge {getStatusBadgeClass(item.statusOrder)}">
                      {item.statusOrder}
                    </span>
                  </div>
                  
                  <div class="item-body">
                    <h4 class="item-title">{item.title}</h4>
                    <p class="item-desc">{getStatusDescription(item)}</p>
                    
                    <div class="item-price-tag">
                      Valued at <strong>{formatRupiah(item.price)}</strong>
                    </div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>

          <div class="container-footer">
            <a href="/dashboard/client/history" class="view-all-link">
              View total archive ({myHistoryData.length} items recorded) 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </div>
  {/if}
</div>

<style>
  /* ══════════════════════════════════════════
     LAYOUT & RESET STYLE
     ══════════════════════════════════════════ */
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ── Header (Boxed Style Matched - TANPA Animasi Masuk) ── */
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

  .greeting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.25rem;
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

  .welcome-text {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1.5rem;
    color: #7a706a;
    margin: 0;
  }
  .welcome-text strong { 
    color: #2a2420; 
    font-weight: 800;
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

  /* Decorative Background Shapes */
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
  .shape-purple { width: 35px; height: 35px; background: #e2dcf2; border-radius: 10px; top: 35px; right: 180px; transform: rotate(-8deg); }
  .shape-green { width: 90px; height: 90px; background: #dcf2e9; border-radius: 18px; top: -30px; right: 40px; transform: rotate(12deg); }
  .shape-peach { width: 65px; height: 65px; background: #fae0cd; border-radius: 14px; bottom: -20px; right: 100px; transform: rotate(18deg); }

  .auth-fallback-box {
    border: 2.5px dashed rgba(42, 36, 32, 0.3);
    border-radius: 20px;
    padding: 4rem;
    text-align: center;
    background-color: #fbfaf8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    color: #7a706a;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* ══════════════════════════════════════════
     GRID & ANIMATIONS
     ══════════════════════════════════════════ */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
    width: 100%;
  }

  @media (min-width: 900px) {
    .dashboard-grid {
      grid-template-columns: 320px 1fr; 
    }
  }

  /* Animasi Masuk Beruntun (Staggered) */
  @keyframes cardEntry {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animated-card {
    animation: cardEntry 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1) both;
    animation-delay: calc(var(--card-index) * 0.1s);
  }

  /* ══════════════════════════════════════════
     CARDS & THEME BLOCKS
     ══════════════════════════════════════════ */
  .stats-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .brutal-card {
    border: 2.5px solid #2a2420;
    border-radius: 20px;
    padding: 1.5rem;
    background-color: #fbfaf8;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 0px rgba(42, 36, 32, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .brutal-card:hover {
    transform: translate(-3px, -4px) !important;
    box-shadow: 7px 7px 0px rgba(42, 36, 32, 0.3);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .card-label {
    font-family: 'HammersmithOne', serif;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #2a2420;
  }

  .card-value {
    font-family: 'HammersmithOne', sans-serif;
    font-size: 3.2rem;
    margin: 0;
    line-height: 1;
    color: #2a2420;
  }

  .card-subtext {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: rgba(42, 36, 32, 0.7);
    margin: 0.6rem 0 0 0;
    font-weight: 500;
  }

  .action-card-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2.5px solid #2a2420;
    border-radius: 16px;
    padding: 1.2rem 1.5rem;
    text-decoration: none;
    color: #2a2420;
    font-family: 'HammersmithOne', serif;
    font-size: 1rem;
    box-shadow: 4px 4px 0px #2a2420;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .action-card-btn:hover {
    transform: translate(-2px, -3px) !important;
    box-shadow: 6px 6px 0px #2a2420;
  }
  .action-card-btn:active {
    transform: translate(1px, 1px) !important;
    box-shadow: 2px 2px 0px #2a2420;
  }

  /* Warna identitas DNA */
  .block-peach { background-color: #f4a87c; }
  .block-lavender { background-color: #e2dcf2; }
  .block-mint { background-color: #dcf2e9; }

  /* ══════════════════════════════════════════
     TRACKER AREA & BADGES
     ══════════════════════════════════════════ */
  .brutal-container {
    border: 2.5px solid #2a2420;
    border-radius: 20px;
    background-color: #fbfaf8;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 6px 6px 0px #2a2420;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .main-activity-area:hover .brutal-container {
    transform: translate(-2px, -2px) !important;
    box-shadow: 8px 8px 0px #2a2420;
  }

  .container-header {
    background-color: #f0ebe3;
    border-bottom: 2.5px solid #2a2420;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .container-title {
    margin: 0;
    font-family: 'HammersmithOne', serif;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #2a2420;
  }

  .container-tag {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    background-color: #2a2420;
    color: #fbfaf8;
    padding: 4px 10px;
    font-weight: 700;
    border-radius: 8px;
    letter-spacing: 0.05em;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .activity-item {
    padding: 1.5rem;
    border-bottom: 1.5px solid rgba(42, 36, 32, 0.1);
    background-color: transparent;
    transition: background 0.15s ease;
  }
  .activity-item:hover { background-color: rgba(42, 36, 32, 0.02); }
  .activity-item:last-child { border-bottom: none; }

  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
  }

  .item-id {
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: rgba(42, 36, 32, 0.5);
  }

  .status-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 0.3rem 0.8rem;
    border-radius: 8px;
    border: 2px solid #2a2420;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    box-shadow: 2px 2px 0px rgba(42, 36, 32, 0.8);
  }

  .badge-revision { background-color: #f4a87c; color: #2a2420; }
  .badge-processing { background-color: #e2dcf2; color: #2a2420; }
  .badge-delivered { background-color: #dcf2e9; color: #1a5c57; }
  .badge-queue { background-color: #f0ebe3; color: #2a2420; }
  .badge-default { background-color: #ffffff; color: #2a2420;}

  .item-title {
    font-family: 'HammersmithOne', serif;
    margin: 0 0 0.35rem 0;
    font-size: 1.2rem;
    color: #2a2420;
  }

  .item-desc {
    font-family: 'DM Sans', sans-serif;
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    color: #7a706a;
    line-height: 1.5;
  }

  .item-price-tag {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: #2a2420;
    display: inline-block;
    background: rgba(42,36,32, 0.05);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
  }

  .empty-activity {
    padding: 4rem 2rem;
    text-align: center;
    color: rgba(42, 36, 32, 0.4);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: auto;
  }

  .container-footer {
    padding: 1rem 1.5rem;
    border-top: 2.5px solid #2a2420;
    background-color: #f0ebe3;
    text-align: right;
  }

  .view-all-link {
    color: #2a2420;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-weight: 800;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    transition: opacity 0.15s ease;
  }

  .view-all-link:hover {
    opacity: 0.7;
  }

  /* Responsive Adjustments */
  @media (max-width: 600px) {
    .page-header.boxed-header { padding: 1.5rem; border-radius: 16px; }
    .bg-shapes { opacity: 0.4; }
  }
</style>
