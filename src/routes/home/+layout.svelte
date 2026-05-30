<script>
  import FloatingSidebar from '$lib/components/home/FloatingSidebar.svelte';
  import FABGroup from '$lib/components/utils/FABGroup.svelte';
  
  let { children } = $props();
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

<FABGroup />

<style>
  .home-layout {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
    position: relative;
  }

  .home-main {
    flex: 1;
    padding-left: 260px; 
    padding-right: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: padding-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .home-main.minimized {
    padding-left: 108px;
  }

  .home-container {
    flex: 1; 
    background: rgba(240, 235, 227, 1);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 6px 6px 0px #2a2420;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;    
    transition: box-shadow 0.25s ease;
  }

  .home-container:hover {
    box-shadow: 8px 8px 0px #2a2420;
  }

  @media (max-width: 1024px) {
    .home-main {
      padding-left: 260px;
      padding-right: 1.5rem;
    }
    .home-main.minimized {
      padding-left: 108px;
    }
  }

  @media (max-width: 768px) {
    .home-main,
    .home-main.minimized {
      padding-left: 1rem !important;
      padding-right: 1rem;
      padding-top: 1.5rem;
      padding-bottom: 110px;
    }
    .home-container {
      border-radius: 24px;
      padding: 1.5rem;
    }
  }
</style>
