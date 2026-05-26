<script>
  // Props untuk menerima data dan fungsi dari parent
  let { data = [], onView } = $props();

  // State untuk kontrol tabel
  let searchQuery = $state('');
  let statusFilter = $state('all');
  let currentPage = $state(1);
  let itemsPerPage = 10;

  // Derivasi untuk Filtering & Search
  let filteredData = $derived(
    data.filter((item) => {
      // Pencarian berdasarkan ID, Title, atau Email Pembeli
      const query = searchQuery.toLowerCase();
      const matchSearch = item.artTitle?.toLowerCase().includes(query) || 
                          item.id?.toLowerCase().includes(query) ||
                          item.buyer?.toLowerCase().includes(query);
                          
      // Filter berdasarkan orderStatus
      const matchStatus = statusFilter === 'all' || item.orderStatus === statusFilter;
      
      return matchSearch && matchStatus;
    })
  );

  // Derivasi untuk Pagination
  let totalPages = $derived(Math.max(1, Math.ceil(filteredData.length / itemsPerPage)));
  let paginatedData = $derived(
    filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  // Reset ke halaman 1 jika user melakukan pencarian/filter
  $effect(() => {
    if (searchQuery || statusFilter) {
      currentPage = 1;
    }
  });

  // Fungsi navigasi page
  function prevPage() { if (currentPage > 1) currentPage--; }
  function nextPage() { if (currentPage < totalPages) currentPage++; }

  // Helper untuk memformat tanggal (ISO String ke tanggal bacaan)
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };
</script>

<div class="table-container">
  
  <div class="table-controls">
    <div class="search-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" bind:value={searchQuery} placeholder="Search ID, Artwork, or Buyer..." />
    </div>

    <div class="filter-box">
      <select bind:value={statusFilter}>
        <option value="all">All Orders</option>
        <option value="placed">Placed</option>
        <option value="processing">Processing</option>
        <option value="delivered">Delivered</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>

  <div class="table-responsive-wrapper">
    <table class="brutal-table">
      <thead>
        <tr>
          <th>Artwork</th>
          <th>Adoption ID</th>
          <th>Patron / Buyer</th>
          <th>Order Date</th>
          <th>Status</th>
          <th>Payment</th>
          <th class="action-cell">Action</th>
        </tr>
      </thead>
      <tbody>
        {#if paginatedData.length === 0}
          <tr>
            <td colspan="7" class="empty-state">No adoption records found matching your criteria.</td>
          </tr>
        {:else}
          {#each paginatedData as item}
            <tr>
              <td>
                <div class="artwork-cell">
                  <!-- <div class="art-thumb"> -->
                  <!--   <img src={item.imgUrl} alt={item.artTitle} loading="lazy" /> -->
                  <!-- </div> -->
                  <span class="font-heading">{item.artTitle}</span>
                </div>
              </td>
              
              <td class="font-bold text-gray">#{item.id}</td>
              <td>{item.buyer}</td>
              <td class="text-gray">{formatDate(item.orderDate)}</td>
              
              <td>
                <span class="status-badge status-{item.orderStatus}">
                  {item.orderStatus}
                </span>
              </td>
              
              <td>
                <span class="status-badge pay-{item.paymentStatus}">
                  {item.paymentStatus}
                </span>
              </td>
              
              <td class="action-cell">
                <button class="btn-icon-only" onclick={() => onView(item)} aria-label="View Details">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  <div class="pagination">
    <span class="page-info">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
    <div class="page-controls">
      <button class="btn-page" onclick={prevPage} disabled={currentPage === 1}>Prev</button>
      <span class="current-page">{currentPage} / {totalPages}</span>
      <button class="btn-page" onclick={nextPage} disabled={currentPage === totalPages}>Next</button>
    </div>
  </div>
</div>

<style>
  /* ── Container & Controls ── */
  .table-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .table-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
  }

  .search-box, .filter-box {
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    box-shadow: 3px 3px 0px #2a2420;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .search-box {
    flex: 1;
    min-width: 280px;
    padding-left: 1rem;
    color: #2a2420;
  }

  .search-box input {
    border: none;
    background: transparent;
    padding: 0.8rem;
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    color: #2a2420;
    outline: none;
  }

  .filter-box select {
    border: none;
    background: transparent;
    padding: 0.8rem 1.2rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    color: #2a2420;
    cursor: pointer;
    outline: none;
  }

  /* ── Scrollable Table Wrapper (VERTICAL & HORIZONTAL) ── */
  .table-responsive-wrapper {
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 16px;
    box-shadow: 6px 6px 0px #2a2420;
    
    /* Inti dari scrollable box: */
    max-height: 500px;  /* Batas tinggi tabel (bisa disesuaikan) */
    overflow-y: auto;   /* Scroll Vertikal jika data panjang */
    overflow-x: auto;   /* Scroll Horizontal untuk mobile */
    position: relative; /* Penting untuk sticky header */
  }

  /* Custom Scrollbar untuk Wrapper Tabel */
  .table-responsive-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .table-responsive-wrapper::-webkit-scrollbar-track {
    background: #f0ebe3;
    border-radius: 0 16px 16px 0;
  }
  .table-responsive-wrapper::-webkit-scrollbar-thumb {
    background-color: #2a2420;
    border-radius: 10px;
    border: 2px solid #f0ebe3;
  }

  /* ── Table Styling ── */
  .brutal-table {
    width: 100%;
    min-width: 900px; /* Memaksa scroll horizontal jika layar HP kecil */
    border-collapse: separate; /* Diganti ke separate agar sticky background tidak bocor */
    border-spacing: 0;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
  }

  .brutal-table th, .brutal-table td {
    padding: 1rem 1.25rem;
    color: #2a2420;
    border-bottom: 2px solid rgba(42, 36, 32, 0.1);
  }

  /* Membuat Header Sticky / Menempel saat di scroll ke bawah */
  .brutal-table th {
    font-family: 'HammersmithOne', serif;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    background: #f0ebe3;
    white-space: nowrap;
    
    /* Sticky magic */
    position: sticky;
    top: 0;
    z-index: 10; 
    border-bottom: 2.5px solid #2a2420;
    box-shadow: 0 2px 0px rgba(0,0,0,0.05); /* Soft divider */
  }

  .brutal-table tbody tr {
    transition: background 0.15s ease;
  }

  .brutal-table tbody tr:hover {
    background: rgba(42, 36, 32, 0.03);
  }

  .brutal-table tr:last-child td {
    border-bottom: none;
  }

  /* ── Sel Konten Khusus (Thumbnail, Badge) ── */
  .artwork-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .art-thumb {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    border: 2px solid #2a2420;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .art-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .font-heading { font-family: 'HammersmithOne', serif; font-size: 1rem; }
  .font-bold { font-weight: 700; }
  .text-gray { color: #7a706a; font-size: 0.85rem; }

  /* Badge Order Status */
  .status-badge {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0.35rem 0.8rem;
    border-radius: 8px;
    border: 2px solid #2a2420;
    letter-spacing: 0.04em;
    box-shadow: 2px 2px 0px rgba(42,36,32, 0.8);
    display: inline-block;
  }
  
  .status-placed { background: #fae0cd; color: #2a2420; }
  .status-processing { background: #e2dcf2; color: #2a2420; }
  .status-delivered { background: #d4e8ff; color: #1a4d8a; }
  .status-completed { background: #dcf2e9; color: #1a5c57; }
  
  /* Badge Payment Status */
  .pay-paid { background: #2a2420; color: #fbfaf8; border-color: #2a2420; box-shadow: none; }
  .pay-pending { background: #fbfaf8; color: #2a2420; border-color: #2a2420; border-style: dashed; }

  /* ── Action Cell ── */
  .action-cell {
    text-align: right;
    width: 80px;
  }

  .btn-icon-only {
    background: #fbfaf8;
    border: 2px solid #2a2420;
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: all 0.1s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-icon-only:hover {
    background: #f4a87c;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #2a2420;
  }
  .btn-icon-only:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  /* ── Pagination ── */
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .page-info {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    color: #7a706a;
    font-size: 0.9rem;
  }

  .page-controls {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    padding: 0.3rem;
    box-shadow: 3px 3px 0px #2a2420;
  }

  .current-page {
    font-family: 'HammersmithOne', serif;
    font-size: 0.95rem;
    color: #2a2420;
    min-width: 45px;
    text-align: center;
  }

  .btn-page {
    background: transparent;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 0.4rem 0.8rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 800;
    color: #2a2420;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-page:not(:disabled):hover {
    background: #2a2420;
    color: #fbfaf8;
  }

  .btn-page:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem !important;
    color: #7a706a;
    font-weight: 600;
  }
</style>
