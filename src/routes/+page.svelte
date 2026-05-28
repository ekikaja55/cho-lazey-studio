<script>
  import { isLoggedIn, userRole } from '$lib/stores/auth.js';
  import ArtCarousel from '$lib/components/landing/ArtCarousel.svelte';
  import HeroCard from '$lib/components/landing/HeroCard.svelte';
  import CarouselControls from '$lib/components/landing/CarouselControls.svelte';

  const loginLink       = $derived($isLoggedIn ? `/dashboard/${$userRole || ''}` : '/home');
  const getStartedText  = $derived($isLoggedIn ? 'Dashboard' : 'Get Started');

  // Hanya 5 gambar persis seperti permintaanmu
  const baseArtworks = [
    { src: '/gallery/3.jpeg', alt: 'Artwork 1' },
    { src: '/gallery/10.jpg', alt: 'Artwork 2' },
    { src: '/gallery/11.png', alt: 'Artwork 3' },
    { src: '/gallery/12.png', alt: 'Artwork 4' },
    { src: '/gallery/4.jpg',  alt: 'Artwork 5' }
  ];

  // Gandakan array 100 lap (500 item) agar terasa "infinite" & bebas bug
  const artworks = Array(100).fill(baseArtworks).flat();

  // ── CAROUSEL STATE ──
  // Kita mulai persis di titik tengah dari 500 iterasi tersebut
  let currentIndex = $state(Math.floor(artworks.length / 2));
  let isPaused     = $state(false);

  // Fungsi pengontrol
  function next() { currentIndex++; }
  function prev() { currentIndex--; }
  function togglePause() { isPaused = !isPaused; }

  // Autoplay Effect (Jeda 3 detik antar pergantian gambar)
  $effect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      currentIndex++;
    }, 3000); // 3000ms = 3 detik
    
    return () => clearInterval(timer);
  });

  // Background floating shapes (Tetap Sama)
  const shapes = [
    { color: '#a2e1db', rotate: -12, top: '8%',    left: '-4%',   size: 220, delay: 0     },
    { color: '#f4a87c', rotate:  15, top: '5%',    right: '-2%',  size: 180, delay: 0.3   },
    { color: '#b4a6d5', rotate:  -6, bottom: '10%',left: '2%',    size: 200, delay: 0.15  },
    { color: '#a2e1db', rotate:  20, bottom: '5%', right: '-3%',  size: 160, delay: 0.45  },
    { color: '#f4a87c', rotate: -18, top: '42%',   left: '-6%',   size: 140, delay: 0.6   },
    { color: '#b4a6d5', rotate:   8, top: '30%',   right: '-5%',  size: 170, delay: 0.2   },
  ];
</script>

<svelte:head>
  <title>Cho's Lazey Studio</title>
</svelte:head>

<main class="landing-root">

  <div class="shapes-layer" aria-hidden="true">
    {#each shapes as s}
      <div
        class="bg-shape"
        style="
          background: {s.color};
          width: {s.size}px; height: {s.size}px;
          transform: rotate({s.rotate}deg);
          {s.top    ? `top: ${s.top};`       : ''}
          {s.bottom ? `bottom: ${s.bottom};` : ''}
          {s.left   ? `left: ${s.left};`     : ''}
          {s.right  ? `right: ${s.right};`   : ''}
          animation-delay: {s.delay}s;
        "
      ></div>
    {/each}
  </div>

  <ArtCarousel items={artworks} {currentIndex} />

  <div class="center-wrap">
    <HeroCard
      {loginLink}
      {getStartedText}
      isLoggedIn={$isLoggedIn}
    />
    
    <div class="controls-container">
      <CarouselControls 
        {next} {prev} {togglePause} {isPaused} 
      />
    </div>
  </div>

</main>

<style>
  .landing-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

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
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 0.55; transform: scale(1); }
  }

  /* Wrapper Tengah Pembungkus Hero Card */
 .center-wrap {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 760px; /* Dinaikkan dari 620px agar teks panjang muat 1 baris */
    display: flex;
    flex-direction: column;
  }  
  /* Positioning Controls */
  .controls-container {
    margin-top: 24px;
    /* Sesuai referensi: Di desktop controls berada di sisi kanan bawah */
    display: flex;
    justify-content: flex-end; 
    width: 100%;
  }

  /* Mobile Layout Adjustment */
  @media (max-width: 640px) {
    .landing-root {
      /* Dorong Hero Card agak ke bawah di mobile agar Carousel di atasnya terekspos */
      align-items: flex-end; 
      padding-bottom: 15vh;
    }

    .controls-container {
      /* Sesuai referensi: Di mobile controls berada di tengah bawah */
      justify-content: center;
    }
  }
</style>
