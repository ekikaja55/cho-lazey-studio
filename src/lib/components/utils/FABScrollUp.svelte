<!-- src/lib/components/utils/FABScrollUp.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let visible = $state(false);

  function handleScroll() {
    visible = window.scrollY > 300;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  </button>
{/if}

<style>
  /* Import fade for transition */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fab-scroll-up {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 64px;
    height: 64px;
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
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), 
                box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: fadeIn 0.3s ease-out forwards;
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
      bottom: 24px;
      right: 16px;
      width: 52px;
      height: 52px;
    }
  }
</style>
