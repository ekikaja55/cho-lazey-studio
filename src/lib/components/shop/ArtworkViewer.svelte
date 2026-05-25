<!-- lib/components/shop/ArtworkViewer.svelte -->
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

<!-- Backdrop — same blur/dark as gallery lightbox -->
<div
  class="viewer-backdrop"
  transition:fade={{ duration: 200 }}
  onclick={onClose}
  role="presentation"
  aria-hidden="true"
></div>

<!-- Viewer card — same border+shadow DNA, peach nuance -->
<div
  class="viewer-card"
  role="dialog"
  aria-modal="true"
  aria-label="Full artwork view: {item.title}"
  transition:scale={{ duration: 300, easing: backOut, start: 0.93 }}
>
  <!-- Folder-tab style header -->
  <div class="viewer-header">
    <!-- Decorative tab strip -->
    <div class="viewer-tab-strip" aria-hidden="true">
      <span class="vtab vtab-peach"></span>
      <span class="vtab vtab-lavender"></span>
      <span class="vtab vtab-turquoise"></span>
    </div>

    <div class="viewer-header-inner">
      <div class="viewer-title-col">
        <div class="viewer-eyebrow">
          <span class="eyebrow-dot" aria-hidden="true"></span>
          <span>Full Preview</span>
        </div>
        <h2 class="viewer-title">{item.title}</h2>
        <p class="viewer-meta">{item.file_format} &nbsp;·&nbsp; CHO.LAZEY</p>
      </div>

      <div class="viewer-actions">
        <span class="wm-note" aria-label="Watermarked preview">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Preview only — watermarked
        </span>
        <button
          class="viewer-close"
          onclick={onClose}
          aria-label="Close viewer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Image — same border+shadow as lightbox card -->
  <div class="viewer-body">
    <div class="viewer-img-card">
      <WatermarkWrapper opacity={0.3} fontSize={14} spacing={70} text="CHO'S STUDIO · PREVIEW ONLY">
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
    <p class="viewer-note">✦ Watermarked preview. Adopt this piece to receive the original high-quality file.</p>
    <button class="viewer-close-btn" onclick={onClose}>
      Close Preview
    </button>
  </div>
</div>

<style>
  /* Backdrop */
  .viewer-backdrop {
    position: fixed; inset: 0;
    background: rgba(42,36,32,0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 400;
    cursor: pointer;
  }

  /* Card — same spec as gallery lightbox-card */
  .viewer-card {
    position: fixed;
    inset: 0;
    z-index: 401;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    pointer-events: none;
  }

  .viewer-card > * { pointer-events: all; }

  /* ── Header ── */
  .viewer-header {
    width: 100%;
    max-width: 860px;
    background: rgba(240,235,227,0.97);
    border: 3px solid #2a2420;
    border-bottom: none;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
  }

  /* Colored tab strip — same palette as folder tabs */
  .viewer-tab-strip {
    display: flex;
    height: 5px;
  }

  .vtab { flex: 1; }
  .vtab-peach     { background: #f4a87c; }
  .vtab-lavender  { background: #b4a6d5; }
  .vtab-turquoise { background: #a2e1db; }

  .viewer-header-inner {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem 0.9rem;
    flex-wrap: wrap;
  }

  .viewer-title-col { display: flex; flex-direction: column; gap: 2px; }

  .viewer-eyebrow {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #d4845a;
  }

  .eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #f4a87c;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

  .viewer-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: #2a2420;
    margin: 0;
    line-height: 1.1;
  }

  .viewer-meta {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    color: rgba(42,36,32,0.45);
    margin: 0;
  }

  .viewer-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .wm-note {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    color: #d4845a;
    background: rgba(244,168,124,0.15);
    border: 1.5px dashed rgba(244,168,124,0.5);
    border-radius: 6px;
    padding: 4px 10px;
    white-space: nowrap;
  }

  .viewer-close {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(42,36,32,0.07);
    border: 2px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.2s ease;
    flex-shrink: 0;
  }

  .viewer-close:hover {
    background: #f4a87c;
    transform: rotate(90deg) scale(1.08);
  }

  /* ── Body ── */
  .viewer-body {
    width: 100%;
    max-width: 860px;
  }

  .viewer-img-card {
    position: relative;
    max-height: calc(100vh - 240px);
    border: 3px solid #2a2420;
    border-top: none;
    overflow: hidden;
    background: #1a1613;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 6px 6px 0px #2a2420;
  }

  .viewer-img {
    width: 100%;
    max-height: calc(100vh - 240px);
    object-fit: contain;
    display: block;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
  }

  /* ── Footer ── */
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

  .viewer-note {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.78rem;
    color: rgba(240,235,227,0.6);
    margin: 0;
    font-style: italic;
  }

  .viewer-close-btn {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: #2a2420;
    background: rgba(240,235,227,0.9);
    border: 2px solid #2a2420;
    border-radius: 999px;
    padding: 7px 18px;
    cursor: pointer;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
    white-space: nowrap;
  }

  .viewer-close-btn:hover {
    background: #f4a87c;
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .wm-note { display: none; }
    .viewer-footer { flex-direction: column; align-items: flex-start; }
    .viewer-img-card { max-height: calc(100vh - 280px); }
    .viewer-img { max-height: calc(100vh - 280px); }
  }
</style>
