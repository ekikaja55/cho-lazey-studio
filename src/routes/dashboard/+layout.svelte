<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isLoggedIn, userRole } from '$lib/stores/auth.js';
  import SidebarDashboard from '$lib/components/dashboard/SidebarDashboard.svelte';

  let { children } = $props();
  let mounted = $state(false);

  onMount(() => {
    mounted = true;

    if (!$isLoggedIn) {
      goto('/login');
      return;
    }

    const path = $page.url.pathname;

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
  .dashboard-container {
    display: flex;
    flex-direction: row-reverse; 
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .dashboard-main-area {
    flex: 1;
    min-width: 0; 
    display: flex;
    flex-direction: column;
    height: calc(100vh - 3rem);
  }

  .content-card {
    flex: 1;
    background-color: #fbfaf8; 
    border: 3px solid #2a2420; 
    border-radius: 24px;       
    box-shadow: 5px 5px 0px #2a2420; 
    padding: 2.5rem;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .dashboard-loading {
    min-height: 100vh;
    width: 100%;
  }

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

  @media (max-width: 600px) {
    .dashboard-container {
      flex-direction: column; 
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
      border-radius: 16px; 
      box-shadow: 4px 4px 0px #2a2420;
      margin-bottom: calc(85px + env(safe-area-inset-bottom)); 
    }
  }
</style>
