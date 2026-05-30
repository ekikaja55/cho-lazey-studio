<script>
  import WatermarkWrapper from '$lib/components/WatermarkWrapper.svelte';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let { works = [] } = $props();

  let selectedIndex = $state(0);
  let carouselOffset = $state(0);
  let autoTimer;

  const VISIBLE = 3;
  const maxOffset = $derived(Math.max(0, works.length - VISIBLE));

  function selectWork(i) {
    selectedIndex = i;
    if (i >= carouselOffset + VISIBLE) {
      carouselOffset = Math.min(i - VISIBLE + 1, maxOffset);
    } else if (i < carouselOffset) {
      carouselOffset = i;
    }
    resetAuto();
  }

  function next() {
    selectedIndex = (selectedIndex + 1) % works.length;
    selectWork(selectedIndex);
  }

  function prev() {
    selectedIndex = (selectedIndex - 1 + works.length) % works.length;
    selectWork(selectedIndex);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  onMount(() => {
    resetAuto();
    return () => clearInterval(autoTimer);
  });

  const selected = $derived(works[selectedIndex]);
  const thumbTranslate = $derived(`translateX(-${carouselOffset * (100 / VISIBLE)}%)`);
</script>

<section class="works-section">
  <div class="section-header">
    <div class="title-badge">
      <span class="star">✦</span> RECENT WORKS <span class="star">✦</span>
    </div>
    <div class="divider-line"></div>
  </div>

  <div class="works-container">
    
    <div class="featured-col">
      <div class="featured-card">
        <div class="image-viewport">
          <WatermarkWrapper opacity={0.5} fontSize={15} spacing={80}>
            {#key selected.image_url}
              <img 
                src={selected.image_url} 
                alt={selected.title} 
                class="main-img" 
                in:fade={{ duration: 400, easing: cubicOut }} 
              />
            {/key}
          </WatermarkWrapper>
          
          <div class="img-badge">{selected.file_format}</div>
          
          <div class="nav-overlay">
            <button onclick={prev} class="nav-btn" aria-label="Prev">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button onclick={next} class="nav-btn" aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="side-panel">
      
      <div class="info-box">
        {#key selected.title}
          <div in:fly={{ y: 15, duration: 400, delay: 100, easing: cubicOut }}>
            <h3 class="work-title">{selected.title}</h3>
            <p class="work-desc">{selected.description || 'A piece from the latest collection. Dive into the gallery to see more details.'}</p>
          </div>
        {/key}
      </div>

      <div class="thumbs-wrapper">
        <div class="thumbs-viewport">
          <div class="thumbs-track" style="transform: {thumbTranslate}">
            {#each works as work, i}
              <button 
                class="thumb-card" 
                class:active={i === selectedIndex}
                onclick={() => selectWork(i)}
              >
                <img src={work.image_url} alt={work.title} />
                <div class="thumb-label">{work.title}</div>
              </button>
            {/each}
          </div>
        </div>

        <div class="carousel-controls">
          <button class="ctrl-btn" onclick={prev}>Prev</button>
          <div class="dot-nav">
            {#each works as _, i}
              <button 
                class="dot" 
                class:active={i === selectedIndex}
                onclick={() => selectWork(i)}
                aria-label="Go to slide {i + 1}"
              ></button>
            {/each}
          </div>
          <button class="ctrl-btn" onclick={next}>Next</button>
        </div>
      </div>

      <div class="cta-section">
        <a href="/gallery" class="cta-button">
          <div class="cta-text">
            <span class="cta-title">Explore Gallery</span>
            <span class="cta-sub">See all my past works</span>
          </div>
          <div class="cta-icon">→</div>
        </a>
      </div>

    </div>
  </div>
</section>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(3deg); }
  }

  @keyframes spinSlow {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
  }

  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .works-section {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .title-badge {
    background: #eae4f8;
    border: 2.5px solid #1a1a1a;
    padding: 0.6rem 1.5rem;
    border-radius: 99px;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 4px 4px 0px #1a1a1a;
    white-space: nowrap;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .title-badge:hover {
    transform: translateY(-2px) scale(1.02);
  }

  .star { 
    color: #de5c23; 
    display: inline-block;
    animation: spinSlow 4s linear infinite;   
    }

  .divider-line {
    flex: 1;
    height: 3px;
    background: #1a1a1a;
    border-radius: 2px;
    opacity: 0.15;
  }

  .works-container {
    display: grid;
    grid-template-columns: 1.3fr 0.9fr;
    gap: 2.5rem;
    align-items: stretch;
  }

  .featured-col {
    display: flex;
    flex-direction: column;
  }

  .featured-card {
    background: #ffffff;
    border: 3px solid #1a1a1a;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 10px 10px 0px #1a1a1a;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.4s ease, transform 0.4s ease;
  }
  
  .featured-card:hover {
    box-shadow: 14px 14px 0px #b19ffb; 
    transform: translate(-2px, -2px);
  }

  .image-viewport {
    position: relative;
    flex: 1;
    min-height: 400px;
    background: #f4f0ea;
    overflow: hidden;
  }

  .main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .image-viewport:hover .main-img {
    transform: scale(1.04);
  }

  .img-badge {
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    background: #ff9e7d;
    border: 2px solid #1a1a1a;
    padding: 0.3rem 0.8rem;
    border-radius: 99px;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.75rem;
    color: #1a1a1a;
    box-shadow: 3px 3px 0px #1a1a1a;
    z-index: 10;
    animation: float 3.5s ease-in-out infinite; 
  }

  .nav-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .image-viewport:hover .nav-overlay { opacity: 1; }

  .nav-btn {
    pointer-events: auto;
    background: white;
    border: 3px solid #1a1a1a;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0 #1a1a1a;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nav-btn:hover { 
    transform: translate(-4px, -4px) scale(1.1); 
    box-shadow: 8px 8px 0 #1a1a1a; 
    background: #e3f7ee; 
  }
  .nav-btn:active { 
    transform: translate(2px, 2px) scale(0.95); 
    box-shadow: 0px 0px 0 #1a1a1a; 
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
    justify-content: space-between;
  }

  .info-box {
    background: #ffffff;
    border: 2.5px solid #1a1a1a;
    border-radius: 20px;
    padding: 1.5rem 1.8rem;
    box-shadow: 6px 6px 0px #1a1a1a;
    overflow: hidden;   
    }

  .work-title {
    font-family: 'HammersmithOne', sans-serif;
    font-size: 1.8rem;
    color: #1a1a1a;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .work-desc {
    font-family: 'DM Sans', sans-serif;
    color: #555;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }

  .thumbs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .thumbs-viewport {
    overflow: hidden;
    border-radius: 16px;
    padding: 0.5rem;
    margin: -0.5rem;
  }

  .thumbs-track {
    display: flex;
    gap: 1rem;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .thumb-card {
    flex: 0 0 calc((100% - 2rem) / 3);
    aspect-ratio: 1;
    border: 2.5px solid #1a1a1a;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #fff;
    padding: 0;
    box-shadow: 4px 4px 0 #1a1a1a;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .thumb-card img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    filter: grayscale(40%); 
    transition: all 0.4s ease;
  }
  
  .thumb-card.active img, .thumb-card:hover img { 
    filter: grayscale(0%); 
    transform: scale(1.15); 
  }

  .thumb-card.active {
    transform: scale(1.08) translateY(-6px);
    box-shadow: 8px 8px 0 #b19ffb;
    border-color: #1a1a1a;
    z-index: 2;
  }

  .thumb-card:not(.active):hover {
    transform: translateY(-3px);
    box-shadow: 6px 6px 0 #ff9e7d;
  }

  .thumb-label {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: white;
    border-top: 2.5px solid #1a1a1a;
    padding: 0.4rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .carousel-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 2.5px solid #1a1a1a;
    border-radius: 99px;
    padding: 0.5rem 1rem;
    box-shadow: 4px 4px 0 #1a1a1a;
  }

  .ctrl-btn {
    background: none;
    border: none;
    font-family: 'HammersmithOne', sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    color: #1a1a1a;
    text-transform: uppercase;
    transition: color 0.2s, transform 0.2s;
  }
  .ctrl-btn:hover { color: #de5c23; transform: scale(1.1); }
  .ctrl-btn:active { transform: scale(0.9); }

  .dot-nav {
    display: flex;
    gap: 0.4rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #1a1a1a;
    opacity: 0.2;
    border: none;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .dot.active {
    opacity: 1;
    background: #ff9e7d;
    transform: scale(1.6);
  }

  .cta-section {
    margin-top: auto;
  }

  .cta-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #e3f7ee;
    border: 2.5px solid #1a1a1a;
    border-radius: 20px;
    padding: 1.2rem 1.5rem;
    text-decoration: none;
    color: #1a1a1a;
    box-shadow: 6px 6px 0px #1a1a1a;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .cta-button:hover {
    transform: translate(-4px, -4px) scale(1.01);
    box-shadow: 10px 10px 0px #1a1a1a;
    background: #d4ede9;
  }

  .cta-button:active {
    transform: translate(2px, 2px) scale(0.98);
    box-shadow: 2px 2px 0px #1a1a1a;
  }

  .cta-text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .cta-title {
    font-family: 'HammersmithOne', sans-serif;
    font-size: 1.3rem;
    line-height: 1;
  }

  .cta-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .cta-icon {
    font-size: 1.8rem;
    font-family: monospace;
    font-weight: bold;
    display: inline-block;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .cta-button:hover .cta-icon {
    transform: translateX(8px) scale(1.1);
  }

  @media (max-width: 960px) {
    .works-container {
      grid-template-columns: 1fr;
    }
    .image-viewport { min-height: 350px; }
  }

  @media (max-width: 600px) {
    .title-badge { font-size: 0.8rem; padding: 0.5rem 1rem; }
    .thumb-card { flex: 0 0 calc((100% - 1rem) / 2); }
    .nav-btn { width: 38px; height: 38px; }
    .info-box, .cta-button { padding: 1.2rem; }
  }
</style>
