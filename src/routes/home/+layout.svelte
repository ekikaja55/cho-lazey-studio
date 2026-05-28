<script>
  /**
   * /home/+layout.svelte
   * Layout wrapper untuk semua halaman di /home group
   * Includes: FloatingSidebar (persistent across child pages)
   */
  import FloatingSidebar from '$lib/components/FloatingSidebar.svelte';

  let { children } = $props();
  
  // State untuk menangkap status minimize dari sidebar
  let sidebarMinimized = $state(false);
</script>

<div class="home-layout">
  <FloatingSidebar bind:minimized={sidebarMinimized} />

  <main class="home-main" class:minimized={sidebarMinimized}>
    <div class="home-container">
      {@render children()}
    </div>
  </main>
</div>

<style>
  .home-layout {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
    position: relative;
    /* Bisa tambahkan background warna lain di sini jika ingin containernya lebih "pop" */
  }

  .home-main {
    flex: 1;
    /* Default padding saat sidebar TERBUKA (220px + offset 20px + gap 20px) */
    padding-left: 260px; 
    padding-right: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* Animasi padding agar smooth saat sidebar membesar/mengecil */
    transition: padding-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Padding saat sidebar KECIL / MINIMIZED (68px + offset 20px + gap 20px) */
  .home-main.minimized {
    padding-left: 108px;
  }

  /* Styling Container Senada dengan Sidebar */
  .home-container {
    flex: 1; /* Membuat container stretching memenuhi sisa tinggi layar */
    background: rgba(240, 235, 227, 0.97);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 6px 6px 0px #2a2420;
    padding: 2.5rem;
    position: relative;
    overflow: hidden; /* Menjaga konten anak tidak meluber keluar dari border-radius */
    transition: box-shadow 0.25s ease;
  }

  /* Opsi interaksi hover halus pada container */
  .home-container:hover {
    box-shadow: 8px 8px 0px #2a2420;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .home-main {
      padding-left: 260px;
      padding-right: 1.5rem;
    }
    .home-main.minimized {
      padding-left: 108px;
    }
  }

  /* Mobile: sidebar goes to bottom, content full width */
  @media (max-width: 768px) {
    .home-main,
    .home-main.minimized {
      padding-left: 1rem !important;
      padding-right: 1rem;
      padding-top: 1.5rem;
      /* Space for bottom bar ~90px */
      padding-bottom: 110px;
    }
    .home-container {
      border-radius: 24px;
      padding: 1.5rem;
    }
  }
</style>
