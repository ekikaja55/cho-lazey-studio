<script>
  import OverviewHeader from '$lib/components/dashboard/OverviewHeader.svelte';
  
  // Mengambil data dari mock data yang sudah kamu siapkan
  import { galleryImages, formatRupiah } from '$lib/data/galleryImages.js';
  import { commissions } from '$lib/data/mockCommissions.js';
  import { mockAdoptions } from '$lib/data/mockAdoptions.js';

  // --- Svelte 5 Runes: State & Derivations ---
  
  // 1. Menghitung Total Karya Galeri
  let totalArtworks = $derived(galleryImages.length);
  let availableArtworks = $derived(galleryImages.filter(img => img.status === 'available' || img.status === 'not_sold').length);

  // 2. Menghitung Komisi Aktif (yang belum selesai/batal)
  let activeCommissions = $derived(
    commissions.filter(c => !['completed', 'cancelled', 'declined'].includes(c.status))
  );

  // 3. Menghitung Total Pendapatan (Komisi Paid/DP + Adopsi Paid)
  let totalRevenue = $derived(() => {
    // Pendapatan Komisi
    const commRevenue = commissions
      .filter(c => c.paymentStatus === 'paid' || c.paymentStatus === 'dp')
      .reduce((sum, c) => sum + (c.price || 0), 0);
      
    // Pendapatan Adopsi (mencocokkan harga dari galeri)
    const adoptRevenue = mockAdoptions
      .filter(a => a.paymentStatus === 'paid')
      .reduce((sum, a) => {
        const art = galleryImages.find(g => g.title === a.artTitle);
        return sum + (art?.price || 0);
      }, 0);
      
    return commRevenue + adoptRevenue;
  });

  // 4. Mengambil 3 Komisi Terbaru untuk ditampilkan
  let recentCommissions = $derived(activeCommissions.slice(0, 3));
</script>

<svelte:head>
  <title>Artist Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<div class="page-container">
  <OverviewHeader 
    eyebrow="THE CREATIVE HUB"
    title="Studio Overview"
    description="Here's the current pulse of your studio, art pieces, and creative endeavours."
    username="Cho"
  />

  <div class="stats-grid">
    
    <div class="stat-card primary">
      <div class="stat-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M6 12h.01M18 12h.01"></path>
        </svg>
      </div>
      <div class="stat-content">
        <h3>Total Revenue</h3>
        <p class="stat-value">{formatRupiah(totalRevenue())}</p>
        <span class="stat-badge">All time earnings</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon-wrapper orange">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </div>
      <div class="stat-content">
        <h3>Active Quests</h3>
        <p class="stat-value">{activeCommissions.length}</p>
        <span class="stat-desc">Commissions in progress</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon-wrapper purple">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
      <div class="stat-content">
        <h3>Gallery Archive</h3>
        <p class="stat-value">{totalArtworks}</p>
        <span class="stat-desc">{availableArtworks} ready for adoption</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon-wrapper green">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
      <div class="stat-content">
        <h3>Adoptions</h3>
        <p class="stat-value">{mockAdoptions.filter(a => a.orderStatus === 'completed').length}</p>
        <span class="stat-desc">Artworks found a home</span>
      </div>
    </div>
  </div>

  <div class="workspace-grid">
    
    <div class="workspace-card">
      <div class="card-header">
        <div class="header-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <h2>Recent Commission Queue</h2>
        </div>
        <button class="btn-ghost">View All</button>
      </div>
      
      <div class="list-container">
        {#each recentCommissions as comm}
          <div class="list-item">
            <div class="item-visual">
              <img src={comm.image_url} alt={comm.category} />
            </div>
            <div class="item-info">
              <h4>{comm.customer.name}</h4>
              <p class="item-meta">{comm.category.replace('_', ' ')} • {formatRupiah(comm.price)}</p>
            </div>
            <div class="item-status">
              <span class="status-badge {comm.status}">{comm.status.replace('_', ' ')}</span>
              <span class="due-date">Due: {comm.dueDate}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="workspace-card gallery-highlight">
      <div class="card-header">
        <div class="header-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <h2>Gallery Spotlight</h2>
        </div>
      </div>
      
      <div class="spotlight-grid">
        {#each galleryImages.slice(0, 4) as art}
          <div class="spotlight-item group">
            <img src={art.image_url} alt={art.title} loading="lazy" />
            <div class="spotlight-overlay">
              <span class="art-title">{art.title}</span>
              <span class="art-status {art.status}">{art.status.replace('_', ' ')}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

  </div>
</div>

<style>
  /* Base Variables */
  :root {
    --text-main: #1e293b;
    --text-muted: #64748b;
    --bg-card: #ffffff;
    --border-color: #e2e8f0;
    --accent-blue: #3b82f6;
    --accent-orange: #f97316;
    --accent-purple: #8b5cf6;
    --accent-green: #10b981;
    --radius-lg: 16px;
    --radius-md: 12px;
  }

  /* Page Layout */
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    color: var(--text-main);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  /* --- Stats Grid Bento --- */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05);
  }

  /* Icon Wrappers */
  .stat-icon-wrapper {
    padding: 0.8rem;
    border-radius: var(--radius-md);
    background: #eff6ff;
    color: var(--accent-blue);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stat-icon-wrapper.orange { background: #fff7ed; color: var(--accent-orange); }
  .stat-icon-wrapper.purple { background: #f5f3ff; color: var(--accent-purple); }
  .stat-icon-wrapper.green { background: #ecfdf5; color: var(--accent-green); }

  /* Stat Card Content */
  .stat-content h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .stat-value {
    margin: 0.5rem 0;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-main);
  }
  .stat-desc, .stat-badge {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .stat-card.primary {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: white;
  }
  .stat-card.primary .stat-icon-wrapper {
    background: rgba(255,255,255,0.1);
    color: white;
  }
  .stat-card.primary h3, .stat-card.primary .stat-desc {
    color: #cbd5e1;
  }
  .stat-card.primary .stat-value {
    color: white;
  }
  .stat-card.primary .stat-badge {
    background: rgba(255,255,255,0.15);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: #f8fafc;
  }

  /* --- Workspace Splir Grid --- */
  .workspace-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
  }

  .workspace-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-main);
  }
  .header-title h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-color);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: #f1f5f9; }

  /* Queue List Items */
  .list-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .list-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: background 0.2s;
  }
  .list-item:hover {
    background: #f8fafc;
  }
  .item-visual {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    overflow: hidden;
    background: #e2e8f0;
  }
  .item-visual img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .item-info {
    flex: 1;
  }
  .item-info h4 {
    margin: 0 0 0.25rem 0;
    font-size: 0.9rem;
    font-weight: 600;
  }
  .item-meta {
    margin: 0;
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: capitalize;
  }
  .item-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
  }
  
  /* Status Badges */
  .status-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .status-badge.review, .status-badge.revision { background: #fef08a; color: #854d0e; }
  .status-badge.in_progress_sketch, .status-badge.in_progress_coloring { background: #bfdbfe; color: #1e3a8a; }
  .status-badge.completed { background: #bbf7d0; color: #166534; }
  
  .due-date {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* Gallery Spotlight Grid */
  .spotlight-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .spotlight-item {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    aspect-ratio: 1;
    background: #e2e8f0;
  }
  .spotlight-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  .spotlight-item:hover img {
    transform: scale(1.05);
  }
  .spotlight-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    padding: 1.5rem 0.75rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .art-title {
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .art-status {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  .art-status.available { color: #86efac; }
  .art-status.sold { color: #f87171; }
  .art-status.reserved { color: #fcd34d; }

  /* Responsive Adjustments */
  @media (max-width: 1024px) {
    .workspace-grid {
      grid-template-columns: 1fr;
    }
    .spotlight-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 640px) {
    .spotlight-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
