<script>
  /**
   * WatermarkWrapper.svelte
   * Reusable watermark overlay component
   * - Canvas-based tiled diagonal "CHO'S STUDIO" text
   * - Blocks right-click, drag, long-press (mobile)
   * - Transparent to pointer events for child interactivity
   * 
   * Usage:
   *   <WatermarkWrapper>
   *     <img src="..." alt="..." />
   *   </WatermarkWrapper>
   * 
   * Props:
   *   text      — watermark string (default: "CHO'S STUDIO")
   *   opacity   — overlay opacity 0–1 (default: 0.18)
   *   fontSize  — canvas font size px (default: 13)
   *   spacing   — tile spacing px (default: 90)
   *   angle     — rotation degrees (default: -32)
   */

  let {
    text    = "CHO'S STUDIO",
    opacity = 0.18,
    fontSize = 13,
    spacing  = 90,
    angle    = -32,
    children,
  } = $props();

  import { onMount } from 'svelte';

  let canvasEl;
  let wrapperEl;
  let canvasUrl = $state('');

  function drawWatermark(w, h) {
    if (!w || !h) return;
    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    const rad = (angle * Math.PI) / 180;
    const fontStyle = `bold ${fontSize}px "HammersmithOne", Georgia, serif`;
    ctx.font = fontStyle;
    ctx.fillStyle = `rgba(42, 36, 32, ${opacity})`;
    ctx.textAlign  = 'center';
    ctx.textBaseline = 'middle';

    // Tile across rotated grid
    const diag = Math.sqrt(w * w + h * h);
    const cols = Math.ceil(diag / spacing) + 2;
    const rows = Math.ceil(diag / spacing) + 2;
    const cx = w / 2;
    const cy = h / 2;

    ctx.translate(cx, cy);
    ctx.rotate(rad);

    for (let r = -rows; r <= rows; r++) {
      for (let c = -cols; c <= cols; c++) {
        ctx.fillText(text, c * spacing, r * spacing);
      }
    }

    ctx.restore();
    canvasUrl = canvas.toDataURL();
  }

  // ResizeObserver to redraw on size change
  let ro;
  onMount(() => {
    if (!wrapperEl) return;
    ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        drawWatermark(Math.round(width), Math.round(height));
      }
    });
    ro.observe(wrapperEl);
    return () => ro?.disconnect();
  });

  // Block right-click
  function blockContext(e) { e.preventDefault(); return false; }
  // Block drag
  function blockDrag(e) { e.preventDefault(); return false; }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="wm-wrapper"
  bind:this={wrapperEl}
  oncontextmenu={blockContext}
  ondragstart={blockDrag}
>
  <!-- Slot: actual content (image, etc.) -->
  {@render children?.()}

  <!-- Canvas watermark overlay — pointer-events: none so children stay clickable -->
  {#if canvasUrl}
    <div
      class="wm-overlay"
      style="background-image: url('{canvasUrl}');"
      aria-hidden="true"
    ></div>
  {/if}

  <!-- Invisible shield layer to catch any stray pointer on the image itself -->
  <div class="wm-shield" aria-hidden="true"></div>
</div>

<style>
  .wm-wrapper {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
   /* Prevent iOS long-press save */
  -webkit-touch-callout: none;
  user-select: none;
  }

  /* Fills parent exactly */
  .wm-overlay {
    position: absolute;
    inset: 0;
    background-repeat: repeat;
    background-size: 100% 100%;
    pointer-events: none;
    z-index: 5;
  }

  /* Thin transparent shield over image only — stops right-click on the img element */
  .wm-shield {
    position: absolute;
    inset: 0;
    z-index: 4;
    background: transparent;
    /* Allow clicks to pass through to buttons/links inside */
    pointer-events: none;
  }
</style>
