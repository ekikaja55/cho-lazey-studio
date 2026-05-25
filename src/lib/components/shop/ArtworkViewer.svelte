<!-- lib/components/shop/ArtworkViewer.svelte -->
<!-- Full-screen artwork viewer with watermark — safe replacement for window.open -->
<script>
  import { scale, fade } from 'svelte/transition';
  import { backOut }     from 'svelte/easing';
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';

  let { item, onClose } = $props();

  function onKeydown(e) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!-- Backdrop -->
<div
  class="viewer-backdrop"
  transition:fade={{ duration: 200 }}
  onclick={onClose}
  role="presentation"
  aria-hidden="true"
></div>

<!-- Viewer -->
<div
  class="viewer-wrap"
  role="dialog"
  aria-modal="true"
  aria-label="Full artwork view"
  transition:scale={{ duration: 300, easing: backOut, start: 0.93 }}
>
  <!-- Header bar -->
  <div class="viewer-header">
    <div class="viewer-title-wrap">
      <span class="viewer-tag">
        <span class="tag-dot" aria-hidden="true"></span>
        Full Preview
      </span>
      <h2 class="viewer-title">{item.title}</h2>
      <p class="viewer-meta">
        {item.file_format} &nbsp;·&nbsp; CHO.LAZEY
      </p>
    </div>
    <div class="viewer-actions">
      <span class="viewer-wm-note">Preview only — watermarked</span>
      <button class="viewer-close" onclick={onClose} aria-label="Close viewer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Image area -->
  <div class="viewer-body">
    <div class="viewer-img-card">
      <WatermarkWrapper opacity={0.32} fontSize={15} spacing={70} text="CHO'S STUDIO · PREVIEW ONLY">
        <img
          src={item.image_url}
          alt={item.title}
          class="viewer-img"
          draggable="false"
        />
      </WatermarkWrapper>
    </div>
  </div>

  <!-- Footer -->
  <div class="viewer-footer">
    <p class="viewer-footer-note">
      ✦ This is a watermarked preview. Purchase to receive the original high-quality file.
    </p>
    <button class="viewer-close-btn" onclick={onClose}>
      Close Preview
    </button>
  </div>
</div>

<style>
  /* Backdrop */
  .viewer-backdrop {
    position: fixed; inset: 0;
    background: rgba(10, 8, 6, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 300;
    cursor: pointer;
  }

  /* Wrap */
  .viewer-wrap {
    position: fixed; inset: 0;
    z-index: 301;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    pointer-events: none;
  }

  /* Card container */
  .viewer-wrap > * { pointer-events: all; }

  .viewer-header {
    width: 100%;
    max-width: 860px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .viewer-title-wrap { display: flex; flex-direction: column; gap: 2px; }

  .viewer-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7dc8c1;
    margin-bottom: 2px;
  }

  .tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #7dc8c1;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  .viewer-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(1.1rem, 3vw, 1.6rem);
    color: #f0ebe3;
    margin: 0;
    line-height: 1.1;
  }

  .viewer-meta {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem;
    color: rgba(240,235,227,0.55);
    margin: 0;
  }

  .viewer-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .viewer-wm-note {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: rgba(244,168,124,0.8);
    background: rgba(244,168,124,0.1);
    border: 1px dashed rgba(244,168,124,0.4);
    border-radius: 6px;
    padding: 4px 10px;
    white-space: nowrap;
  }

  .viewer-close {
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(240,235,227,0.1);
    border: 2px solid rgba(240,235,227,0.25);
    border-radius: 50%;
    cursor: pointer;
    color: #f0ebe3;
    transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s;
    flex-shrink: 0;
  }

  .viewer-close:hover { background: rgba(244,105,88,0.25); border-color: #f46958; transform: rotate(90deg); }

  /* Body */
  .viewer-body {
    width: 100%;
    max-width: 860px;
    display: flex;
    justify-content: center;
  }

  .viewer-img-card {
    position: relative;
    width: 100%;
    max-height: calc(100vh - 220px);
    border: 3px solid rgba(240,235,227,0.2);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 6px 6px 0 rgba(125,200,193,0.15);
    background: #1a1613;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .viewer-img {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 220px);
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
  }

  /* Footer */
  .viewer-footer {
    width: 100%;
    max-width: 860px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }

  .viewer-footer-note {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.8rem;
    color: rgba(240,235,227,0.5);
    margin: 0;
    font-style: italic;
  }

  .viewer-close-btn {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.82rem;
    color: #f0ebe3;
    background: transparent;
    border: 2px solid rgba(240,235,227,0.3);
    border-radius: 999px;
    padding: 6px 18px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    white-space: nowrap;
  }

  .viewer-close-btn:hover { background: rgba(240,235,227,0.1); border-color: rgba(240,235,227,0.6); }

  /* Responsive */
  @media (max-width: 600px) {
    .viewer-wm-note { display: none; }
    .viewer-header { flex-direction: row; }
    .viewer-footer { flex-direction: column; align-items: flex-start; }
    .viewer-img-card { max-height: calc(100vh - 260px); }
    .viewer-img { max-height: calc(100vh - 260px); }
  }
</style>
