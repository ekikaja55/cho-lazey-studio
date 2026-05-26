<script>
  import { fade, fly } from 'svelte/transition';
  import { toast } from '$lib/stores/toast.js';

  // Props Svelte 5 Runes
  let { image, onClose, onUpdate, onDelete } = $props();

  // Local Editable Form States
  let localTitle = $state('');
  let localDesc = $state('');
  let localPrice = $state(0);
  let localStatus = $state('not_sold');
  let localFormat = $state('JPG');

  // Sinkronisasi data awal modal dibuka
  $effect(() => {
    if (image) {
      localTitle = image.title;
      localDesc = image.description || '';
      localPrice = image.price || 0;
      localStatus = image.status;
      localFormat = image.file_format;
    }
  });

  // Submit Update Asset
  function handleSubmit(e) {
    e.preventDefault();
    if (onUpdate) {
      onUpdate({
        ...image,
        title: localTitle,
        description: localDesc,
        price: Number(localPrice),
        status: localStatus,
        file_format: localFormat,
        updated_at: new Date().toISOString()
      });
    }
    toast.success("[PROTOTYPE] Artwork registry configuration saved!");
  }

  // Submit soft delete / permanent delete mock
  function triggerDelete() {
    if (confirm(`Are you sure you want to drop "${image.title}" from the active manifest?`)) {
      if (onDelete) {
        onDelete(image.gallery_id);
      }
      toast.success("[PROTOTYPE] Asset removed from studio collection.");
    }
  }

  // Lock body window scroll context
  $effect(() => {
    if (image) document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  });
</script>

{#if image}
  <div class="modal-backdrop" transition:fade={{ duration: 200 }} onclick={onClose}>
    <div 
      class="modal-content" 
      transition:fly={{ y: 30, duration: 300, opacity: 0 }} 
      onclick={(e) => e.stopPropagation()}
    >
      <div class="modal-header">
        <div>
          <span class="modal-eyebrow">✦ CONFIGURE MANIFEST ARTWORK ✦</span>
          <h2 class="modal-title">Registry ID #{image.gallery_id}</h2>
        </div>
        <button class="btn-close" onclick={onClose} aria-label="Close Asset Profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        
        <div class="display-column">
          <div class="image-preview-frame">
            <img src={image.image_url} alt="Masterpiece display render" class="preview-img" />
          </div>
          <div class="meta-brutal-info">
            <div class="info-tag-box"><span class="lbl">Asset Extension:</span> <span class="val">{localFormat}</span></div>
            <div class="info-tag-box"><span class="lbl">Created:</span> <span class="val">{new Date(image.created_at).toLocaleDateString('en-GB')}</span></div>
          </div>
        </div>

        <form id="galleryEditorForm" class="form-column" onsubmit={handleSubmit}>
          <div class="form-group">
            <label for="artTitle" class="input-label">Artwork Collection Title</label>
            <input id="artTitle" type="text" bind:value={localTitle} class="brutal-input text-field" required />
          </div>

          <div class="form-group">
            <label for="artDesc" class="input-label">Exhibition Description</label>
            <textarea id="artDesc" bind:value={localDesc} rows="3" class="brutal-input text-field text-area-field"></textarea>
          </div>

          <div class="form-grid-row">
            <div class="form-group">
              <label for="artPrice" class="input-label">Value Price (IDR)</label>
              <input id="artPrice" type="number" bind:value={localPrice} min="0" class="brutal-input text-field" />
            </div>

            <div class="form-group">
              <label for="artFormat" class="input-label">File Type Format</label>
              <div class="select-wrapper">
                <select id="artFormat" bind:value={localFormat} class="brutal-input select-field">
                  <option value="JPG">JPG</option>
                  <option value="JPEG">JPEG</option>
                  <option value="PNG">PNG</option>
                  <option value="GIF">GIF</option>
                </select>
                <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="artStatus" class="input-label">Collection Availability Status</label>
            <div class="select-wrapper">
              <select id="artStatus" bind:value={localStatus} class="brutal-input select-field">
                <option value="not_sold">Not Sold Yet</option>
                <option value="available">Available for Exhibition / Acquisition</option>
                <option value="reserved">Reserved by Patron</option>
                <option value="sold">Sold Out Legally</option>
                <option value="archived">Archived Asset</option>
              </select>
              <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-danger" onclick={triggerDelete}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Purge Asset
        </button>

        <div class="right-buttons">
          <button type="button" class="btn-secondary" onclick={onClose}>Discard</button>
          <button type="submit" form="galleryEditorForm" class="btn-primary">Commit Registry</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(26, 22, 20, 0.5); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1.5rem;
  }

  .modal-content {
    background: #fbfaf8; width: 100%; max-width: 880px; max-height: 92vh;
    border: 3px solid #2a2420; border-radius: 20px; box-shadow: 8px 8px 0px #2a2420;
    display: flex; flex-direction: column; overflow: hidden;
  }

  .modal-header {
    background: #f3eee6; border-bottom: 3px solid #2a2420; padding: 1.25rem 2rem;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .modal-eyebrow {
    font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 800;
    letter-spacing: 0.12em; color: #c05c20; margin-bottom: 0.2rem; display: block;
  }
  .modal-title { font-family: 'HammersmithOne', serif; font-size: 1.4rem; color: #2a2420; margin: 0; }

  .btn-close {
    background: transparent; border: 2px solid transparent; border-radius: 50%;
    padding: 0.5rem; color: #2a2420; cursor: pointer; transition: all 0.2s ease;
  }
  .btn-close:hover { background: #e2dcf2; border-color: #2a2420; transform: rotate(90deg); }

  .modal-body { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; padding: 2rem; overflow-y: auto; }

  /* Display Frame Column Left */
  .display-column { display: flex; flex-direction: column; gap: 1rem; }
  .image-preview-frame {
    border: 3px solid #2a2420; border-radius: 12px; background: #1a1614;
    overflow: hidden; aspect-ratio: 1; box-shadow: 4px 4px 0px rgba(42,36,32,0.1);
  }
  .preview-img { width: 100%; height: 100%; object-fit: cover; }
  
  .meta-brutal-info {
    background: #f0ebe3; border: 2px solid #2a2420; border-radius: 8px; padding: 0.8rem;
    display: flex; flex-direction: column; gap: 0.4rem;
  }
  .info-tag-box { display: flex; justify-content: space-between; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; }
  .info-tag-box .lbl { font-weight: 700; color: #7a706a; }
  .info-tag-box .val { font-weight: 800; color: #2a2420; }

  /* Input fields layout Right */
  .form-column { display: flex; flex-direction: column; gap: 1rem; }
  .form-grid-row { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  
  .input-label {
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 800;
    text-transform: uppercase; color: #2a2420; letter-spacing: 0.04em;
  }

  .brutal-input {
    width: 100%; background: #fbfaf8; border: 2.5px solid #2a2420; border-radius: 8px;
    padding: 0.75rem 1rem; font-family: 'DM Sans', sans-serif; font-weight: 700;
    color: #2a2420; box-shadow: 3px 3px 0px #2a2420; box-sizing: border-box; outline: none;
    transition: all 0.15s ease;
  }
  .brutal-input:focus { transform: translate(-2px, -2px); box-shadow: 5px 5px 0px #2a2420; }
  .text-area-field { resize: none; font-weight: 600; line-height: 1.5; }
  
  .select-wrapper { position: relative; display: flex; align-items: center; }
  .select-field { appearance: none; padding-right: 2.5rem; cursor: pointer; }
  .dropdown-icon { position: absolute; right: 12px; pointer-events: none; color: #2a2420; }

  /* Modal Actions Footer Layout */
  .modal-footer {
    border-top: 3px solid #2a2420; padding: 1.25rem 2rem; background: #fbfaf8;
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  }
  .right-buttons { display: flex; gap: 0.75rem; }

  .btn-secondary {
    background: transparent; color: #2a2420; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700;
    padding: 0.65rem 1.4rem; border: 2.5px solid transparent; border-radius: 10px; cursor: pointer; transition: all 0.15s ease;
  }
  .btn-secondary:hover { background: rgba(42, 36, 32, 0.05); border-color: #2a2420; }

  .btn-primary {
    background: #2a2420; color: #fbfaf8; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 700;
    padding: 0.65rem 1.8rem; border: 2.5px solid #2a2420; border-radius: 10px; cursor: pointer;
    box-shadow: 4px 4px 0px #f4a87c; transition: all 0.15s ease;
  }
  .btn-primary:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #f4a87c; }
  .btn-primary:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #f4a87c; }

  .btn-danger {
    background: #ff5252; color: #fbfaf8; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700;
    padding: 0.65rem 1.2rem; border: 2.5px solid #2a2420; border-radius: 10px; cursor: pointer;
    box-shadow: 3px 3px 0px #2a2420; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;
  }
  .btn-danger:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0px #2a2420; background: #ff3333; }
  .btn-danger:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #2a2420; }

  @media (max-width: 768px) {
    .modal-body { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.25rem; }
    .modal-header, .modal-footer { padding: 1rem 1.25rem; }
    .modal-footer { flex-direction: column; align-items: stretch; }
    .right-buttons { flex-direction: column; }
    .right-buttons button, .btn-danger { width: 100%; justify-content: center; }
  }
</style>
