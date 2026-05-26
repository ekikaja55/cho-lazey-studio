<script>
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import { galleryImages, formatRupiah } from '$lib/data/galleryImages.js';
  import { toast } from '$lib/stores/toast.js';
  
  // Import Sub-Komponen
  import GalleryCard from '$lib/components/dashboard/GalleryCard.svelte';
  import GalleryDetailModal from '$lib/components/dashboard/GalleryDetailModal.svelte';

  // State Utama (Reactive array untuk simulasi CRUD di prototype)
  let items = $state([...galleryImages]);
  
  // State Filter & Kontrol Konten
  let searchQuery = $state('');
  let statusFilter = $state('all');
  let selectedImage = $state(null); // Menyimpan item yang sedang diedit/dilihat

  // Derivasi Komparasi Data Filtering ($derived)
  let filteredImages = $derived(
    items.filter((img) => {
      const query = searchQuery.toLowerCase();
      const matchSearch = img.title?.toLowerCase().includes(query) || 
                          img.description?.toLowerCase().includes(query) ||
                          img.file_format?.toLowerCase().includes(query);
      
      const matchStatus = statusFilter === 'all' || img.status === statusFilter;
      
      return matchSearch && matchStatus && img.deleted_at === null;
    })
  );

  // --- HANDLERS FOR CRUD (PROTOTYPE) ---
  
  // CREATE: Tambah Artwork Baru Muted Item
  function handleCreateImage() {
    const newId = items.length + 1;
    const newArtwork = {
      gallery_id: newId,
      title: `Untitled Masterpiece #${newId}`,
      description: "Write your artwork description here...",
      image_url: "/gallery/placeholder.jpg", // static default placeholder
      file_format: "JPG",
      status: "not_sold",
      price: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    };

    items = [newArtwork, ...items];
    toast.success("New artwork draft initialized!");
    selectedImage = items[0]; // Langsung buka modal untuk diisi
  }

  // UPDATE: Simpan Perubahan Form dari Modal
  function handleUpdateImage(updatedItem) {
    items = items.map(img => img.gallery_id === updatedItem.gallery_id ? updatedItem : img);
    selectedImage = null;
  }

  // DELETE: Soft Delete Data Gambar
  function handleDeleteImage(id) {
    items = items.filter(img => img.gallery_id !== id);
    selectedImage = null;
  }
</script>

<svelte:head>
  <title>Gallery Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<div class="page-container">
  <div class="header-action-wrapper">
    <PageHeader 
      eyebrow="GALLERY MANIFEST"
      title="Visual Archive"
      description="Exhibit, manage, and arrange your digital masterpiece collection."
    />
    
    <button class="btn-create" onclick={handleCreateImage}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add Artwork
    </button>
  </div>

  <div class="controls-container">
    <div class="search-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input type="text" bind:value={searchQuery} placeholder="Search title, description..." />
    </div>

    <div class="filter-box">
      <select bind:value={statusFilter}>
        <option value="all">All Status</option>
        <option value="available">Available</option>
        <option value="not_sold">Not Sold Yet</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold Out</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  </div>

  {#if filteredImages.length === 0}
    <div class="empty-state">
      <p>No masterpieces found matching your current filters.</p>
    </div>
  {:else}
    <div class="gallery-grid">
      {#each filteredImages as image (image.gallery_id)}
        <GalleryCard 
          {image} 
          onOpenDetails={(img) => selectedImage = img} 
        />
      {/each}
    </div>
  {/if}
</div>

{#if selectedImage}
  <GalleryDetailModal 
    image={selectedImage} 
    onClose={() => selectedImage = null} 
    onUpdate={handleUpdateImage}
    onDelete={handleDeleteImage}
  />
{/if}

<style>
  .page-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .header-action-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .btn-create {
    background: #2a2420;
    color: #fbfaf8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    padding: 0.8rem 1.8rem;
    border: 2.5px solid #2a2420;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 4px 4px 0px #f4a87c;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.1s ease;
  }
  .btn-create:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #f4a87c; }
  .btn-create:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #f4a87c; }

  /* ── Filter Controls Layout ── */
  .controls-container {
    display: flex;
    gap: 1rem;
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

  .search-box { flex: 1; min-width: 280px; padding-left: 1rem; }
  .search-box input {
    border: none; background: transparent; padding: 0.8rem; width: 100%;
    font-family: 'DM Sans', sans-serif; font-weight: 600; color: #2a2420; outline: none;
  }

  .filter-box select {
    border: none; background: transparent; padding: 0.8rem 1.5rem;
    font-family: 'DM Sans', sans-serif; font-weight: 700; color: #2a2420; cursor: pointer; outline: none;
  }

  /* ── Gallery Card Grid ── */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 6rem 2rem;
    background: #fbfaf8;
    border: 2.5px dashed #2a2420;
    border-radius: 16px;
    color: #7a706a;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
  }
</style>
