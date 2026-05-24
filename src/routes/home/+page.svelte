<script>
  /**
   * /home/+page.svelte
   * Main home content: About + Recent Works carousel
   * Dummy data only — no API fetch
   * Improvements:
   *   - Larger max-width content card (matches Laravel reference)
   *   - Typography harmonized with HammersmithOne + Lora
   *   - Carousel: bigger featured image, better thumb sizing
   *   - Smooth interactions, keyboard nav
   */

  import { onMount } from 'svelte';
  import { getRecentWorks } from '$lib/data/galleryImages.js';

  let mounted = $state(false);

  const works = getRecentWorks(6);

  // Carousel state
  let selectedIndex = $state(0);
  let carouselOffset = $state(0);
  let carouselEl;
  let autoTimer;

  const VISIBLE = 3;
  const maxOffset = Math.max(0, works.length - 1 - VISIBLE);

  function selectWork(i) {
    selectedIndex = i;
    if (i > carouselOffset + VISIBLE - 1) {
      carouselOffset = Math.min(i - VISIBLE + 1, maxOffset);
    } else if (i < carouselOffset) {
      carouselOffset = i;
    }
    resetAuto();
  }

  function next() {
    const ni = (selectedIndex + 1) % works.length;
    selectWork(ni);
  }

  function prev() {
    const pi = (selectedIndex - 1 + works.length) % works.length;
    selectWork(pi);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  }

  onMount(() => {
    mounted = true;
    resetAuto();
    return () => clearInterval(autoTimer);
  });

  const selected = $derived(works[selectedIndex]);
  const thumbTranslate = $derived(`translateX(-${carouselOffset * (100 / VISIBLE)}%)`);
</script>

<svelte:head>
  <title>Home — Cho's Studio</title>
</svelte:head>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="home-content"
  class:visible={mounted}
  role="main"
  onkeydown={handleKeydown}
  tabindex="-1"
>

  <!-- ── About Section ── -->
  <section class="about-section animate-fade-up" aria-labelledby="about-heading">

    <!-- Decorative accent shapes (tilted, like Background.png) -->
    <div class="about-accent about-accent-1" aria-hidden="true"></div>
    <div class="about-accent about-accent-2" aria-hidden="true"></div>
    <div class="about-accent about-accent-3" aria-hidden="true"></div>

    <div class="about-eyebrow">
      <div class="eyebrow-dot" aria-hidden="true"></div>
      <span>✦ about the artist ✦</span>
    </div>

    <h1 id="about-heading" class="about-title">About The Artist</h1>
    <div class="about-underline" aria-hidden="true"></div>

    <p class="about-text">
      Heya everyone. I'm a self-taught, aspiring artist ready to be of service!
      I do digital art, merch designs, and a bit of 3D modelling.
      Come check out my artworks and shop!
    </p>
  </section>

  <!-- ── Divider ── -->
  <div class="section-divider animate-fade-up stagger-2" aria-hidden="true">
    <div class="divider-line"></div>
    <span class="divider-label">Recent Works</span>
    <div class="divider-line"></div>
  </div>

  <!-- ── Recent Works ── -->
  {#if works.length > 0}
    <section
      class="works-section animate-fade-up stagger-3"
      aria-labelledby="works-heading"
    >
      <h2 id="works-heading" class="sr-only">Recent Works</h2>

      <div class="works-layout">

        <!-- ── Featured artwork (left column) ── -->
        <div class="featured-col" aria-live="polite" aria-atomic="true">
          <div class="featured-frame">
            <div class="featured-img-wrap">
              <img
                src={selected.image_url}
                alt={selected.title}
                class="featured-img"
              />
              <span class="format-badge">{selected.file_format}</span>

              <!-- Prev/Next overlaid on image -->
              <button class="img-nav img-nav-prev" onclick={prev} aria-label="Previous">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
              </button>
              <button class="img-nav img-nav-next" onclick={next} aria-label="Next">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9,6 15,12 9,18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Info below featured image -->
          <div class="featured-info">
            <h3 class="featured-title">{selected.title}</h3>
            <p class="featured-desc">{selected.description ?? ''}</p>
          </div>

          <!-- Dot indicators -->
          <div class="dot-indicators" role="tablist" aria-label="Select artwork">
            {#each works as _, i}
              <button
                class="dot"
                class:active={i === selectedIndex}
                onclick={() => selectWork(i)}
                role="tab"
                aria-selected={i === selectedIndex}
                aria-label="Artwork {i + 1}: {works[i].title}"
              ></button>
            {/each}
          </div>
        </div>

        <!-- ── Thumbnail carousel (right column) ── -->
        <div class="carousel-col">
          <div class="carousel-viewport" aria-label="Artwork thumbnails">
            <div
              class="carousel-track"
              bind:this={carouselEl}
              style="transform: {thumbTranslate};"
            >
              {#each works as work, i}
                <button
                  class="thumb-btn"
                  class:active={i === selectedIndex}
                  onclick={() => selectWork(i)}
                  aria-label="View {work.title}"
                  aria-pressed={i === selectedIndex}
                >
                  <div class="thumb-frame">
                    <img
                      src={work.image_url}
                      alt={work.title}
                      class="thumb-img"
                      loading="lazy"
                    />
                    <div class="thumb-overlay" aria-hidden="true">
                      <span class="thumb-overlay-label">{work.title}</span>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <!-- Carousel nav below thumbnails -->
          <div class="carousel-nav">
            <button class="carousel-btn" onclick={prev} aria-label="Previous artwork">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            <span class="carousel-counter">
              {selectedIndex + 1} / {works.length}
            </span>
            <button class="carousel-btn" onclick={next} aria-label="Next artwork">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9,6 15,12 9,18"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  {:else}
    <div class="empty-state animate-fade-up stagger-3">
      <div class="empty-icon" aria-hidden="true">🎨</div>
      <p>No gallery items available at the moment.</p>
    </div>
  {/if}

</div>

<style>
  /* ── Screen reader only ── */
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }

  /* ══════════════════════════════════════
     CONTENT CARD
     Wider + more spacious than before
     Matches the Laravel reference proportions
  ══════════════════════════════════════ */
  .home-content {
    width: 100%;
    /* Larger max-width to feel less compact */
    max-width: 980px;
    background: rgba(240, 235, 227, 0.96);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 32px;
    box-shadow: 8px 8px 0px #2a2420;
    /* More generous padding */
    padding: 3rem 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }

  .home-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ══════════════════════════════════════
     ABOUT SECTION
  ══════════════════════════════════════ */
  .about-section {
    position: relative;
    overflow: hidden;
    padding-bottom: 0.5rem;
  }

  .about-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7dc8c1;
    margin-bottom: 0.6rem;
  }

  .eyebrow-dot {
    width: 8px; height: 8px;
    background: #7dc8c1;
    border: 2px solid #2a2420;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .about-title {
    font-family: 'HammersmithOne', Georgia, serif;
    /* Bigger — matches Laravel reference */
    font-size: clamp(2rem, 4.5vw, 3rem);
    color: #2a2420;
    margin: 0 0 0.55rem;
    letter-spacing: -0.01em;
    line-height: 1.1;
    position: relative;
    z-index: 1;
  }

  .about-underline {
    width: 56px; height: 4px;
    background: linear-gradient(90deg, #7dc8c1, #b4a6d5);
    border-radius: 2px;
    margin-bottom: 1.1rem;
    position: relative;
    z-index: 1;
  }

  .about-text {
    font-family: 'Lora', Georgia, serif;
    /* Slightly larger for readability */
    font-size: 1rem;
    color: #4a3f3a;
    line-height: 1.8;
    max-width: 600px;
    position: relative;
    z-index: 1;
  }

  /* Decorative tilted shapes — echo Background.png */
  .about-accent {
    position: absolute;
    border: 2px solid rgba(42, 36, 32, 0.1);
    border-radius: 10px;
    pointer-events: none;
  }
  .about-accent-1 {
    width: 70px; height: 70px;
    background: rgba(162, 225, 219, 0.28);
    top: -12px; right: 24px;
    transform: rotate(-13deg);
  }
  .about-accent-2 {
    width: 50px; height: 50px;
    background: rgba(244, 168, 124, 0.22);
    bottom: -4px; right: 80px;
    transform: rotate(18deg);
  }
  .about-accent-3 {
    width: 36px; height: 36px;
    background: rgba(180, 166, 213, 0.2);
    top: 20px; right: 110px;
    transform: rotate(6deg);
  }

  /* ══════════════════════════════════════
     SECTION DIVIDER
  ══════════════════════════════════════ */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .divider-line {
    flex: 1;
    height: 1.5px;
    background: rgba(42, 36, 32, 0.14);
    border-radius: 1px;
  }

  .divider-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: rgba(42, 36, 32, 0.4);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* ══════════════════════════════════════
     WORKS LAYOUT
     Left: large featured | Right: 3-col thumbs
  ══════════════════════════════════════ */
  .works-section { overflow: hidden; }

  .works-layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  /* ── Featured column ── */
  .featured-col {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .featured-frame { position: relative; }

  .featured-img-wrap {
    position: relative;
    border: 3px solid #2a2420;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 5px 5px 0px #2a2420;
    background: #a2e1db;
    /* Taller aspect for a more gallery-like feel */
    aspect-ratio: 4/3;
  }

  .featured-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease, opacity 0.3s ease;
  }

  .featured-img-wrap:hover .featured-img {
    transform: scale(1.04);
  }

  /* Overlaid prev/next on image */
  .img-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px; height: 36px;
    background: rgba(240, 235, 227, 0.88);
    border: 2px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 2px 2px 0px rgba(42, 36, 32, 0.5);
    transition: background 0.2s ease, transform 0.2s ease;
    z-index: 2;
  }
  .img-nav-prev { left: 10px; }
  .img-nav-next { right: 10px; }
  .img-nav:hover {
    background: #a2e1db;
    transform: translateY(-50%) scale(1.1);
  }
  .img-nav:active { transform: translateY(-50%) scale(0.93); }

  /* Format badge */
  .format-badge {
    position: absolute;
    top: 10px; right: 10px;
    background: rgba(240, 235, 227, 0.92);
    border: 1.5px solid rgba(42, 36, 32, 0.3);
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #2a2420;
    padding: 3px 9px;
    z-index: 2;
  }

  /* Featured info */
  .featured-info { min-height: 64px; }

  .featured-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.1rem;
    color: #2a2420;
    margin: 0 0 0.35rem;
    line-height: 1.25;
  }

  .featured-desc {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.875rem;
    color: #5a4f48;
    line-height: 1.65;
    margin: 0;
  }

  /* Dot indicators */
  .dot-indicators {
    display: flex;
    gap: 7px;
    height: 15px;
    flex-wrap: wrap;
  }

  .dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: rgba(42, 36, 32, 0.15);
    border: 1.5px solid rgba(42, 36, 32, 0.22);
    cursor: pointer;
    padding: 0;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .dot.active {
    background: #7dc8c1;
    border-color: #2a2420;
    transform: scale(1.35);
  }
  .dot:hover:not(.active) {
    background: rgba(42, 36, 32, 0.3);
  }

  /* ── Carousel column ── */
  .carousel-col {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    /* Align top with the featured image */
    padding-top: 0;
  }

  .carousel-viewport {
    overflow: hidden;
    border-radius: 14px;
  }

  .carousel-track {
    display: flex;
    gap: 10px;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .thumb-btn {
    flex: 0 0 calc((100% - 20px) / 3);
    min-width: 0;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .thumb-frame {
    position: relative;
    border: 2.5px solid rgba(42, 36, 32, 0.3);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 2px 2px 0px rgba(42, 36, 32, 0.18);
    aspect-ratio: 1;
    background: #d4ede9;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .thumb-btn.active .thumb-frame {
    border-color: #2a2420;
    box-shadow: 4px 4px 0px #2a2420;
    transform: scale(1.05) rotate(-0.5deg);
  }

  .thumb-btn:hover:not(.active) .thumb-frame {
    border-color: rgba(42, 36, 32, 0.55);
    transform: translateY(-3px);
    box-shadow: 3px 5px 0px rgba(42, 36, 32, 0.2);
  }

  .thumb-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.2s ease;
  }
  .thumb-btn:not(.active) .thumb-img { opacity: 0.72; }
  .thumb-btn:hover .thumb-img { opacity: 1; }

  .thumb-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(42,36,32,0.75) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: flex-end;
    padding: 7px;
    border-radius: 12px;
  }
  .thumb-btn:hover .thumb-overlay { opacity: 1; }

  .thumb-overlay-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.63rem;
    color: #efeae4;
    line-height: 1.25;
    text-align: left;
  }

  /* Carousel nav below thumbnails */
  .carousel-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .carousel-btn {
    width: 36px; height: 36px;
    background: #a2e1db;
    border: 2px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
    flex-shrink: 0;
  }
  .carousel-btn:hover {
    background: #7dc8c1;
    transform: scale(1.1);
    box-shadow: 3px 3px 0px #2a2420;
  }
  .carousel-btn:active {
    transform: scale(0.93);
    box-shadow: 1px 1px 0px #2a2420;
  }

  .carousel-counter {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: rgba(42, 36, 32, 0.45);
    letter-spacing: 0.06em;
    min-width: 40px;
    text-align: center;
  }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    border: 2px dashed rgba(42, 36, 32, 0.18);
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .empty-icon { font-size: 2.2rem; }
  .empty-state p {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.9rem;
    color: rgba(42, 36, 32, 0.45);
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */
  @media (max-width: 860px) {
    .home-content {
      padding: 2.25rem 2rem 2rem;
      max-width: 100%;
    }

    .works-layout {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .about-accent-1,
    .about-accent-2,
    .about-accent-3 { display: none; }
  }

  @media (max-width: 600px) {
    .home-content {
      padding: 1.75rem 1.35rem 1.5rem;
      border-radius: 24px;
      box-shadow: 5px 5px 0px #2a2420;
      gap: 1.5rem;
    }
    
    .carousel-col{
    height: 10px;
    }
    .about-title {
      font-size: clamp(1.6rem, 7vw, 2.2rem);
    }
    .dot-indicators{
        height: 5px;
    }
    .img-nav { display: none; }
  }

  @media (max-width: 420px) {
    .home-content {
      padding: 1.4rem 1rem 1.25rem;
      border-radius: 20px;
    }

    .carousel-btn { width: 30px; height: 30px; }
  }
</style>
