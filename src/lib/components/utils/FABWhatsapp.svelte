<!-- src/lib/components/utils/FABWhatsapp.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let { 
    phone = "6281234567890", 
    message = "Halo Cho's Studio, saya ingin bertanya tentang komisi..." 
  } = $props();

  const waUrl = $derived(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);

  // Auto-hide saat scroll ke bawah, muncul saat scroll naik/berhenti
  let hidden = $state(false);
  let lastScrollY = 0;
  let scrollTimer;

  function handleScroll() {
    const currentY = window.scrollY;
    hidden = currentY > lastScrollY && currentY > 200;
    lastScrollY = currentY;

    // Muncul lagi 1.2 detik setelah scroll berhenti
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => { hidden = false; }, 1200);
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  });
</script>

{#if !hidden}
 <a 
    href={waUrl}
    target="_blank"
    rel="noopener noreferrer"
    class="fab-whatsapp"
    aria-label="Chat on WhatsApp"
    transition:fade={{ duration: 200 }}
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>
{/if}

<style>
  .fab-whatsapp {
    position: fixed;
    /*
      scroll-up FAB: bottom = 20px (base) + 48px (ukuran tombol) + 12px (gap) + safe-area
      = calc(80px + env(safe-area-inset-bottom, 0px))
    */
    bottom: calc(80px + env(safe-area-inset-bottom, 0px));
    right: 32px;
    width: 56px;
    height: 56px;
    background-color: var(--c-turquoise);
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
    text-decoration: none;
  }

  .fab-whatsapp:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--c-dark);
    background-color: var(--c-turquoise-light);
  }

  .fab-whatsapp:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px var(--c-dark);
  }

  @media (max-width: 768px) {
    .fab-whatsapp {
      /*
        scroll-up FAB mobile: 20px + 48px + 12px = 80px → sama, hanya right berubah
        stack dari bawah: safe-area + 20px base + 48px tombol scroll + 12px gap = 80px
      */
      bottom: calc(80px + env(safe-area-inset-bottom, 0px));
      right: 16px;
      width: 48px;
      height: 48px;
    }
  }
</style>
