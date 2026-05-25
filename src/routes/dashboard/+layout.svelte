<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isLoggedIn, userRole } from '$lib/stores/auth.js';
  import SidebarDashboard from '$lib/components/dashboard/SidebarDashboard.svelte';

  // Mengambil komponen anak (children) menggunakan Svelte 5 Runes
  let { children } = $props();
  let mounted = $state(false);

  // Client-side Middleware untuk proteksi halaman dashboard
  onMount(() => {
    mounted = true;

    // 1. Validasi Auth
    if (!$isLoggedIn) {
      goto('/login');
      return;
    }

    const path = $page.url.pathname;

    // 2. Proteksi Cross-Role Access
    if ($userRole === 'artist' && path.includes('/dashboard/client')) {
      goto('/dashboard/artist');
    } else if ($userRole === 'client' && path.includes('/dashboard/artist')) {
      goto('/dashboard/client');
    }
  });
</script>

{#if mounted && $isLoggedIn}
  <div class="dashboard-container">
    
    <main class="dashboard-main-area">
      <div class="content-card">
        {@render children()}
      </div>
    </main>

    <SidebarDashboard role={$userRole} currentPath={$page.url.pathname} />

  </div>
{:else}
  <div class="dashboard-loading"></div>
{/if}

<style>
  /* ══════════════════════════════════════
     LAYOUT UTAMA DASHBOARD
     ══════════════════════════════════════ */
  .dashboard-container {
    display: flex;
    /* row-reverse memindahkan Sidebar ke Kanan & Main Content ke Kiri secara natural */
    flex-direction: row-reverse; 
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  /* Container luar area konten utama */
  .dashboard-main-area {
    flex: 1;
    min-width: 0; /* Mencegah elemen flex pecah atau overflow */
    display: flex;
    flex-direction: column;
    height: calc(100vh - 3rem);
  }

  /* Card Konten Utama senada dengan DNA Cho's Studio */
  .content-card {
    flex: 1;
    background-color: #fbfaf8; /* Warna cream bersih senada dengan #f0ebe3 */
    border: 3px solid #2a2420; /* Garis tepi cokelat tua tegas */
    border-radius: 24px;       /* Radius rounded melengkung halus */
    box-shadow: 5px 5px 0px #2a2420; /* Bayangan pop brutalist */
    padding: 2.5rem;
    box-sizing: border-box;
    overflow-y: auto;
  }

  /* Gaya penampung loading */
  .dashboard-loading {
    min-height: 100vh;
    width: 100%;
  }

  /* ══════════════════════════════════════
     RESPONSIVE BREAKPOINTS 
     ══════════════════════════════════════ */

  /* Penyesuaian jarak pad pada layar ukuran Tablet */
  @media (max-width: 900px) {
    .dashboard-container {
      padding: 1rem;
      gap: 1rem;
    }
    .dashboard-main-area {
      height: calc(100vh - 2rem);
    }
    .content-card {
      padding: 2rem;
    }
  }

  /* Penyesuaian penuh untuk device mobile */
  @media (max-width: 600px) {
    .dashboard-container {
      flex-direction: column; /* Kembali ke susunan vertikal atas-bawah */
      padding: 0.75rem;
      gap: 0;
      min-height: 100vh;
    }

    .dashboard-main-area {
      width: 100%;
      height: auto;
    }

    .content-card {
      padding: 1.25rem;
      border-radius: 16px; /* Melunakkan lengkungan sudut di mobile */
      box-shadow: 4px 4px 0px #2a2420;
      
      /* PENTING: Jarak aman ekstra di bawah agar konten halaman dalam card 
         bisa di-scroll penuh tanpa terhalang atau tertutup oleh mobile-bar */
      margin-bottom: calc(85px + env(safe-area-inset-bottom)); 
    }
  }
</style>
