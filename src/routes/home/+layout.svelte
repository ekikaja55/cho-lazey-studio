<script>
  /**
   * /home/+layout.svelte
   * Layout wrapper untuk semua halaman di /home group
   * Includes: FloatingSidebar (persistent across child pages)
   */
  import FloatingSidebar from '$lib/components/FloatingSidebar.svelte';

  let { children } = $props();
</script>

<div class="home-layout">
  <!-- Floating sidebar — persistent -->
  <FloatingSidebar />

  <!-- Page content -->
  <main class="home-main">
    {@render children()}
  </main>
</div>

<style>
  .home-layout {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
    position: relative;
  }

  /*
    Main content:
    - Left padding clears sidebar (220px) + gap (28px)
    - Right padding generous
    - Vertically centered
    - Min-height full viewport
  */
  .home-main {
    flex: 1;
    padding-left: 250px;    /* sidebar 220px + 20px offset + 30px gap */
    padding-right: 3rem;
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .home-main {
      padding-left: 260px;
      padding-right: 2rem;
    }
  }

  /* Mobile: sidebar goes to bottom, content full width */
  @media (max-width: 768px) {
    .home-main {
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 1.5rem;
      /* Space for bottom bar ~90px */
      padding-bottom: 110px;
      align-items: flex-start;
    }
  }
</style>
