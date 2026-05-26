<script>
  import { formatRupiah } from '$lib/data/mockCommissions.js';

  // Props Svelte 5 Runes untuk menerima data dan fungsi dari parent
  let { data = [], onView } = $props();

  // State Kontrol Tabel
  let searchQuery = $state('');
  let statusFilter = $state('all');
  let paymentFilter = $state('all');
  let currentPage = $state(1);
  let itemsPerPage = 10;

  // Derivasi Komparasi Multi-Filtering & Search ($derived)
  let filteredData = $derived(
    data.filter((item) => {
      const query = searchQuery.toLowerCase();
      
      // Pencarian berdasarkan ID, Nama Pelanggan, Email, Kategori, atau Detail Pesanan
      const matchSearch = 
        item.id?.toLowerCase().includes(query) ||
        item.customer?.name?.toLowerCase().includes(query) ||
        item.customer?.email?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.details?.toLowerCase().includes(query);
          
      // Filter berdasarkan Progress / Order Status
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      
      // Filter berdasarkan Status Pembayaran
      const matchPayment = paymentFilter === 'all' || item.paymentStatus === paymentFilter;
      
      return matchSearch && matchStatus && matchPayment;
    })
  );

  // Derivasi Akumulasi Pagination
  let totalPages = $derived(Math.max(1, Math.ceil(filteredData.length / itemsPerPage)));
  let paginatedData = $derived(
    filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  // Reset otomatis ke halaman 1 jika input filter berubah
  $effect(() => {
    if (searchQuery || statusFilter || paymentFilter) {
      currentPage = 1;
    }
  });

  // Navigasi Halaman
  function prevPage() { if (currentPage > 1) currentPage--; }
  function nextPage() { if (currentPage < totalPages) currentPage++; }

  // Helper Formatter Tanggal Lokal (ISO ke format ringkas)
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  // Helper untuk membersihkan string underscore status menjadi teks normal
  const formatStatusText = (statusStr) => {
    return statusStr.replace(/_/g, ' ');
  };
</script>

<div class="table-container">
  
  <div class="table-controls">
    <div class="search-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" bind:value={searchQuery} placeholder="Search customer, category, details, or ID..." />
    </div>

    <div class="filter-group">
      <div class="filter-box">
        <select bind:value={statusFilter}>
          <option value="all">All Progress Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="in_progress_sketch">In Progress (Sketch)</option>
          <option value="in_progress_coloring">In Progress (Coloring)</option>
          <option value="review">Review</option>
          <option value="revision">Revision</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="filter-box">
        <select bind:value={paymentFilter}>
          <option value="all">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="dp">Down Payment (DP)</option>
          <option value="paid">Paid Full</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
    </div>
  </div>

  <div class="table-responsive-wrapper">
    <table class="brutal-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Category</th>
          <th>Details</th>
          <th>Price</th>
          <th>Order Date</th>
          <th>Due Date</th>
          <th>Status</th>
          <th class="action-cell">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if paginatedData.length === 0}
          <tr>
            <td colspan="8" class="empty-state">No commission records found matching your criteria.</td>
          </tr>
        {:else}
          {#each paginatedData as item (item.id)}
            <tr>
              <td>
                <div class="customer-cell">
                  <span class="cust-name">{item.customer.name}</span>
                  <span class="cust-email">{item.customer.email}</span>
                  <span class="cust-id">#{item.id}</span>
                </div>
              </td>
              
              <td>
                <span class="category-tag">{item.category}</span>
              </td>

              <td>
                <div class="details-cell">
                  <p class="details-text" title={item.details}>{item.details}</p>
                </div>
              </td>

              <td class="font-bold price-text">
                {formatRupiah(item.price)}
              </td>

              <td class="text-gray">{formatDate(item.orderDate)}</td>

              <td class="text-gray font-bold">{formatDate(item.dueDate)}</td>
              
              <td>
                <div class="status-container">
                  <span class="status-badge status-{item.status}">
                    {formatStatusText(item.status)}
                  </span>
                  <span class="pay-badge pay-{item.paymentStatus}">
                    {item.paymentStatus}
                  </span>
                </div>
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
    <span class="page-info">
      Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
    </span>
    <div class="page-controls">
      <button class="btn-page" onclick={prevPage} disabled={currentPage === 1}>Prev</button>
      <span class="current-page">{currentPage} / {totalPages}</span>
      <button class="btn-page" onclick={nextPage} disabled={currentPage === totalPages}>Next</button>
    </div>
  </div>
</div>

<style>
  /* ── Container & Controls Layout ── */
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
    align-items: center;
  }

  .filter-group {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
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
    min-width: 300px;
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
    padding: 0.8rem 1.5rem 0.8rem 1.2rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    color: #2a2420;
    cursor: pointer;
    outline: none;
  }

  /* ── Scrollable Table Box Wrapper ── */
  .table-responsive-wrapper {
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 16px;
    box-shadow: 6px 6px 0px #2a2420;
    max-height: 620px;
    overflow-y: auto;
    overflow-x: auto;
    position: relative;
  }

  /* Custom Aesthetic Minimalist Scrollbar */
  .table-responsive-wrapper::-webkit-scrollbar { width: 8px; height: 8px; }
  .table-responsive-wrapper::-webkit-scrollbar-track { background: #f0ebe3; }
  .table-responsive-wrapper::-webkit-scrollbar-thumb {
    background-color: #2a2420;
    border-radius: 10px;
    border: 2px solid #f0ebe3;
  }

  /* ── Brutalist Table Base Styling ── */
  .brutal-table {
    width: 100%;
    min-width: 1100px; 
    border-collapse: separate;
    border-spacing: 0;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
  }

  .brutal-table th, .brutal-table td {
    padding: 1.1rem 1.25rem;
    color: #2a2420;
    border-bottom: 2px solid rgba(42, 36, 32, 0.1);
    vertical-align: middle;
  }

  .brutal-table th {
    font-family: 'HammersmithOne', serif;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    background: #f0ebe3;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 10; 
    border-bottom: 2.5px solid #2a2420;
  }

  .brutal-table tbody tr:hover { background: rgba(42, 36, 32, 0.02); }
  .brutal-table tr:last-child td { border-bottom: none; }

  /* ── Cells Specific Layouts ── */
  .customer-cell {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .cust-name { font-weight: 800; font-size: 1rem; color: #2a2420; }
  .cust-email { font-size: 0.8rem; color: #7a706a; word-break: break-all; }
  .cust-id { font-size: 0.75rem; font-weight: 700; color: #c05c20; margin-top: 0.1rem; }

  .category-tag {
    background: #e2dcf2;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    border: 1.5px solid #2a2420;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .details-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 320px;
  }

  .art-thumb {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    border: 2px solid #2a2420;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 2px 2px 0px rgba(42,36,32,0.15);
  }
  .art-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .details-text {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.4;
    color: #4a403a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .price-text { font-size: 1.05rem; color: #2a2420; white-space: nowrap; }
  .font-bold { font-weight: 700; }
  .text-gray { color: #7a706a; font-size: 0.88rem; white-space: nowrap; }

  /* ── Multi-status Badges Stack Layout ── */
  .status-container {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .status-badge, .pay-badge {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    border: 2px solid #2a2420;
    letter-spacing: 0.04em;
    display: inline-flex;
    align-items: center;
    box-shadow: 2px 2px 0px #2a2420;
  }

  /* Variasi Warna Progress Status (Sesuai dengan Foto & Opsi Baru) */
  .status-pending { background: #ffeb3b; color: #2a2420; } /* Yellow */
  .status-accepted { background: #448aff; color: #ffffff; } /* Blue */
  .status-declined { background: #ff5252; color: #ffffff; } /* Red */
  .status-in_progress_sketch { background: #e040fb; color: #ffffff; } /* Purple/Sketching */
  .status-in_progress_coloring { background: #ff4081; color: #ffffff; } /* Pink/Coloring */
  .status-review { background: #00e5ff; color: #2a2420; } /* Cyan In Review */
  .status-revision { background: #ff6d00; color: #ffffff; } /* Orange Revision */
  .status-completed { background: #00e676; color: #1a5c57; } /* Mint Green */
  .status-cancelled { background: #b0bec5; color: #2a2420; } /* Grey */

  /* Variasi Warna Payment Status Badges */
  .pay-pending { background: #fbfaf8; color: #2a2420; border-style: dashed; box-shadow: none; }
  .pay-dp { background: #ff9100; color: #2a2420; font-weight: 900; } /* Bulatan DP Oranye */
  .pay-paid { background: #2a2420; color: #fbfaf8; box-shadow: none; }
  .pay-refunded { background: #b2dfdb; color: #004d40; border-color: #2a2420; }

  /* ── Action Cell Layout ── */
  .action-cell { text-align: right; width: 100px; white-space: nowrap; }

  .btn-icon-only {
    background: #fbfaf8;
    border: 2px solid #2a2420;
    border-radius: 8px;
    padding: 0.45rem 0.8rem;
    cursor: pointer;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: all 0.1s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-text { font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.85rem; }

  .btn-icon-only:hover {
    background: #f4a87c;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #2a2420;
  }
  .btn-icon-only:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  /* ── Pagination Elements ── */
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.2rem 0;
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
  .btn-page:not(:disabled):hover { background: #2a2420; color: #fbfaf8; }
  .btn-page:disabled { opacity: 0.3; cursor: not-allowed; }

  .empty-state {
    text-align: center;
    padding: 5rem 2rem !important;
    color: #7a706a;
    font-weight: 600;
    font-size: 1.05rem;
  }

  /* Responsive Breakpoints */
  @media (max-width: 768px) {
    .table-controls { flex-direction: column; align-items: stretch; }
    .filter-group { flex-direction: column; }
    .search-box { min-width: 100%; }
  }
</style>
