<!-- src/lib/components/utils/FABScrollUp.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let visible = $state(false);

  function handleScroll() {
    visible = window.scrollY > 300;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if visible}
  <button
    class="fab-scroll-up"
    onclick={scrollToTop}
    aria-label="Scroll to top"
    transition:fade={{ duration: 200 }}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  </button>
{/if}

<style>
  .fab-scroll-up {
    position: fixed;
    /* base: 32px dari bawah + safe area */
    bottom: calc(32px + env(safe-area-inset-bottom, 0px));
    right: 32px;
    width: 56px;
    height: 56px;
    background-color: var(--c-lavender);
    color: var(--c-dark);
    border: 3px solid var(--c-dark);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0px var(--c-dark);
    cursor: pointer;
    z-index: 100;
    transition:
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .fab-scroll-up:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--c-dark);
    filter: brightness(1.05);
  }

  .fab-scroll-up:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px var(--c-dark);
  }

  @media (max-width: 768px) {
    .fab-scroll-up {
      /* 20px base + safe area — lebih dekat ke tepi di mobile */
      bottom: calc(20px + env(safe-area-inset-bottom, 0px));
      right: 16px;
      width: 48px;
      height: 48px;
    }
  }
</style>
