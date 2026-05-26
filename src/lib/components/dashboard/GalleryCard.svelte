<script>
  import { formatRupiah } from '$lib/data/galleryImages.js';
  
  // Svelte 5 Runes Props
  let { image, onOpenDetails } = $props();

  // Mapping teks rapi status
  const statusLabels = {
    'available': 'Available',
    'not_sold': 'Not Sold',
    'reserved': 'Reserved',
    'sold': 'Sold Out',
    'archived': 'Archived'
  };
</script>

<div class="brutal-card card-status-{image.status}">
  <div class="card-image-box">
    <img src={image.image_url} alt={image.title} loading="lazy" />
    <span class="format-badge">{image.file_format}</span>
  </div>

  <div class="card-content">
    <div class="title-row">
      <h3 class="artwork-title" title={image.title}>{image.title}</h3>
      <button class="btn-action-view" onclick={() => onOpenDetails(image)} aria-label="Manage Asset">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </div>

    <p class="artwork-desc">{image.description || 'No description provided.'}</p>
    
    <div class="card-footer">
      <span class="price-tag">{formatRupiah(image.price)}</span>
      <span class="status-badge status-{image.status}">
        {statusLabels[image.status]}
      </span>
    </div>
  </div>
</div>

<style>
  .brutal-card {
    background: #fbfaf8;
    border: 2.5px solid #2a2420;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2a2420;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .brutal-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #2a2420;
  }

  .card-image-box {
    width: 100%;
    aspect-ratio: 4/3;
    background: #1a1614;
    border-bottom: 2.5px solid #2a2420;
    position: relative;
    overflow: hidden;
  }
  .card-image-box img { width: 100%; height: 100%; object-fit: cover; }

  .format-badge {
    position: absolute; top: 10px; left: 10px;
    background: #2a2420; color: #fbfaf8;
    font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.5rem;
    border-radius: 4px; border: 1.5px solid #2a2420;
  }

  .card-content { padding: 1.2rem; display: flex; flex-direction: column; flex: 1; gap: 0.6rem; }

  .title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
  
  .artwork-title {
    font-family: 'HammersmithOne', serif; font-size: 1.15rem; color: #2a2420; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
  }

  .btn-action-view {
    background: #fbfaf8; border: 2px solid #2a2420; border-radius: 8px;
    padding: 0.4rem; cursor: pointer; color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420; display: inline-flex; align-items: center; transition: all 0.1s ease;
  }
  .btn-action-view:hover { background: #e2dcf2; transform: translate(-1px, -1px); box-shadow: 3px 3px 0px #2a2420; }
  .btn-action-view:active { transform: translate(1px, 1px); box-shadow: 1px 1px 0px #2a2420; }

  .artwork-desc {
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; color: #6a5f58; margin: 0;
    line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    flex: 1;
  }

  .card-footer {
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1.5px dashed rgba(42,36,32,0.15); padding-top: 0.6rem; margin-top: 0.2rem;
  }

  .price-tag { font-family: 'DM Sans', sans-serif; font-weight: 800; color: #c05c20; font-size: 1rem; }

  /* Status Badge Styling */
  .status-badge {
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    padding: 0.25rem 0.65rem; border-radius: 6px; border: 2px solid #2a2420;
    box-shadow: 1.5px 1.5px 0px #2a2420; letter-spacing: 0.02em;
  }

  .status-available { background: #dcf2e9; color: #1a5c57; }
  .status-not_sold { background: #fbfaf8; color: #2a2420; }
  .status-reserved { background: #fae0cd; color: #2a2420; }
  .status-sold { background: #2a2420; color: #fbfaf8; box-shadow: none; }
  .status-archived { background: #e5e5e5; color: #757575; }
</style>
