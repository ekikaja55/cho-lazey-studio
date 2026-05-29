<!-- src/lib/components/utils/FABGroup.svelte -->
<script>
  import { onMount } from 'svelte';

  let { 
    phone = "6281234567890", 
    message = "Halo Cho's Studio, saya ingin bertanya tentang komisi..." 
  } = $props();

  const waUrl = $derived(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);

  let showScrollUp = $state(false);
  let waHidden = $state(false);
  let lastScrollY = 0;
  let scrollTimer;

  function handleScroll() {
    const currentY = window.scrollY;
    showScrollUp = currentY > 300;
    waHidden = currentY > lastScrollY && currentY > 200;
    lastScrollY = currentY;

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { waHidden = false; }, 1200);
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  });
</script>

<div class="fab-group">
  <button
    class="fab fab--scroll"
    class:fab--hidden={!showScrollUp}
    onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    aria-label="Scroll to top"
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  </button>

<a  
    href={waUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="fab fab--wa"
    class:fab--hidden={waHidden}
    aria-label="Chat on WhatsApp"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>
</div>

<style>
  /* ===================== */
  /* DESKTOP               */
  /* ===================== */
  .fab-group {
    position: fixed;
    bottom: calc(36px + env(safe-area-inset-bottom, 0px));
    right: 32px;
    z-index: 100;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 12px;
  }

  .fab {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    border: 3px solid var(--c-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0px var(--c-dark);
    cursor: pointer;
    text-decoration: none;
    /* opacity transition untuk anti-flicker */
    opacity: 1;
    transform: translate(0, 0);
    pointer-events: auto;
    transition:
      opacity 0.2s ease,
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .fab--hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateY(6px);
  }

  .fab--scroll {
    background-color: var(--c-lavender);
    color: var(--c-dark);
  }

  .fab--wa {
    background-color: var(--c-turquoise);
    color: var(--c-dark);
  }

  .fab:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--c-dark);
  }

  .fab--hidden:hover {
    transform: translateY(6px);
    box-shadow: 4px 4px 0px var(--c-dark);
  }

  .fab:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px var(--c-dark);
  }

  /* ===================== */
  /* MOBILE                */
  /* ===================== */
  @media (max-width: 768px) {
    .fab-group {
      /* Pindah ke kanan, vertikal ~65% dari atas layar */
      bottom: auto;
      top: 75%;
      right: 14px;
      transform: translateY(-50%);
      gap: 10px;
    }

    .fab {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      box-shadow: 3px 3px 0px var(--c-dark);
    }

    .fab--hidden {
      transform: translateY(6px);
    }
  }
</style>
