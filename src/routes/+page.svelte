<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let mounted = $state(false);
  let titleVisible = $state(false);
  let buttonsVisible = $state(false);

  onMount(() => {
    mounted = true;
    setTimeout(() => titleVisible = true, 100);
    setTimeout(() => buttonsVisible = true, 400);
  });

  // Floating shapes data
  const shapes = [
    { color: '#a2e1db', rotate: -12, top: '8%',  left: '-4%',  size: 220, delay: 0 },
    { color: '#f4a87c', rotate: 15,  top: '5%',  right: '-2%', size: 180, delay: 0.3 },
    { color: '#b4a6d5', rotate: -6,  bottom: '10%', left: '2%', size: 200, delay: 0.15 },
    { color: '#a2e1db', rotate: 20,  bottom: '5%',  right: '-3%', size: 160, delay: 0.45 },
    { color: '#f4a87c', rotate: -18, top: '42%', left: '-6%',  size: 140, delay: 0.6 },
    { color: '#b4a6d5', rotate: 8,   top: '30%', right: '-5%', size: 170, delay: 0.2 },
  ];
</script>

<svelte:head>
  <title>Cho's Studio</title>
</svelte:head>

<main class="landing-root">
  <!-- Decorative background shapes (echo of Background.png) -->
  <div class="shapes-layer" aria-hidden="true">
    {#each shapes as s, i}
      <div
        class="bg-shape"
        style="
          background: {s.color};
          width: {s.size}px;
          height: {s.size}px;
          transform: rotate({s.rotate}deg);
          {s.top    ? `top: ${s.top};`    : ''}
          {s.bottom ? `bottom: ${s.bottom};` : ''}
          {s.left   ? `left: ${s.left};`  : ''}
          {s.right  ? `right: ${s.right};` : ''}
          animation-delay: {s.delay}s;
        "
      ></div>
    {/each}
  </div>

  <!-- Main card -->
  <div class="center-wrap">
    <div class="hero-card" class:visible={mounted}>

      <!-- Title block -->
      <div class="title-block" class:visible={titleVisible}>
        <p class="studio-eyebrow">✦ art gallery & commission ✦</p>
        <h1 class="studio-title">
          <span class="title-line">CHO'S</span>
          <span class="title-line accent">STUDIO</span>
        </h1>
        <div class="title-underline"></div>
      </div>

      <!-- CTA buttons -->
      <div class="cta-block" class:visible={buttonsVisible}>
        <a href="/home" class="btn-letsgo">
          <span>Let's Go</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>

      <!-- Login link — bottom right of card -->
      <div class="login-corner">
        <a href="/login" class="btn-login">
          Login
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>

      <!-- Decorative corner stamp -->
      <div class="corner-stamp" aria-hidden="true">
        <div class="stamp-inner">
          <span>EST.</span>
          <span class="stamp-year">2026</span>
        </div>
      </div>

    </div>
  </div>
</main>

<style>
  /* ── Root ── */
  .landing-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* ── Background shapes ── */
  .shapes-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .bg-shape {
    position: absolute;
    border-radius: 12px;
    border: 2px solid rgba(42, 36, 32, 0.18);
    opacity: 0;
    animation: shapeFloat 0.8s ease forwards;
  }

  @keyframes shapeFloat {
    from { opacity: 0; transform: rotate(var(--rot, 0deg)) scale(0.85); }
    to   { opacity: 0.55; transform: rotate(var(--rot, 0deg)) scale(1); }
  }

  /* ── Center wrap ── */
  .center-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 860px;
  }

  /* ── Hero card ── */
  .hero-card {
    position: relative;
    background: rgba(240, 235, 227, 0.92);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 8px 8px 0px #2a2420;
    padding: 4rem 3.5rem 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    min-height: 480px;
    justify-content: center;
  }

  .hero-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Title ── */
  .title-block {
    text-align: center;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
    margin-bottom: 2.5rem;
  }

  .title-block.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .studio-eyebrow {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #2a2420;
    margin: 0 0 1rem;
    font-weight: 800;
  }

  .studio-title {
    font-family: 'HammersmithOne', Georgia, serif;
    line-height: 0.95;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1em;
  }

  .title-line {
    display: block;
    font-size: clamp(3.5rem, 10vw, 7.5rem);
    color: #2a2420;
    letter-spacing: -0.02em;
  }

  .title-line.accent {
    color: transparent;
    -webkit-text-stroke: 3px #2a2420;
    font-size: clamp(3.5rem, 10vw, 7.5rem);
  }

  .title-underline {
    width: 60px;
    height: 4px;
    background:#2a2420;
    border-radius: 2px;
    margin: 1.2rem auto 0;
  }

  /* ── CTA buttons ── */
  .cta-block {
    display: flex;
    gap: 1rem;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
  }

  .cta-block.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-letsgo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 1rem 2.5rem;
    background: #f4a87c;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.4rem;
    border: 3px solid #2a2420;
    border-radius: 999px;
    box-shadow: 4px 4px 0px #2a2420;
    text-decoration: none;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
    cursor: pointer;
  }

  .btn-letsgo:hover {
    transform: translateY(-3px) rotate(-3deg) scale(1.06);
    box-shadow: 6px 8px 0px #2a2420;
  }

  .btn-letsgo:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 2px 2px 0px #2a2420;
  }

  /* ── Login corner ── */
  .login-corner {
    position: absolute;
    bottom: 1.75rem;
    right: 2rem;
  }

  .btn-login {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.5rem 1.4rem;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    color: #2a2420;
    border: 2px solid #2a2420;
    border-radius: 999px;
    background: transparent;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }

  .btn-login:hover {
    background: #2a2420;
    color: #f0ebe3;
    transform: translateX(3px);
  }

  /* ── Corner stamp ── */
  .corner-stamp {
    position: absolute;
    top: 1.5rem;
    right: 2rem;
    width: 56px;
    height: 56px;
    border: 2px solid rgba(42, 36, 32, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stamp-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'DM Sans', system-ui, sans-serif;
    line-height: 1;
    color: rgba(42, 36, 32, 0.4);
  }

  .stamp-inner span { font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; }
  .stamp-year       { font-size: 0.75rem; font-weight: 600; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .hero-card {
      padding: 3rem 1.75rem 3rem;
      border-radius: 20px;
      box-shadow: 5px 5px 0px #2a2420;
      min-height: 380px;
    }

    .title-line,
    .title-line.accent {
      font-size: clamp(3rem, 14vw, 4.5rem);
    }

    .title-line.accent {
      -webkit-text-stroke: 2px #2a2420;
    }

    .btn-letsgo {
      font-size: 1.1rem;
      padding: 0.85rem 2rem;
    }

    .login-corner {
      bottom: 1.25rem;
      right: 1.25rem;
    }

    .corner-stamp {
      top: 1rem;
      right: 1.25rem;
      width: 44px;
      height: 44px;
    }
  }
</style>
