<script>
  import { onMount } from 'svelte';
  import { getRecentWorks } from '$lib/data/galleryImages.js';
  import HomePageHeader from '$lib/components/home/HomePageHeader.svelte';
  import RecentWorks from '$lib/components/home/RecentWorks.svelte';

  let mounted = $state(false);
  const works = getRecentWorks(6);

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Home — Cho's Studio</title>
</svelte:head>

<div class="home-page" class:visible={mounted}>
  <HomePageHeader 
    eyebrow="THE ARTIST"
    title="About Me"
    description="Heya everyone. I'm a self-taught, aspiring artist ready to be of service! I do digital art, merch designs, and a bit of 3D modelling. Come check out my artworks and shop!"
  />

  {#if works.length > 0}
    <RecentWorks {works} />
  {:else}
    <div class="empty-state">
      <p>No gallery items available at the moment.</p>
    </div>
  {/if}
</div>

<style>
  .home-page {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding-bottom: 4rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .home-page.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .empty-state {
    text-align: center;
    padding: 4rem;
    border: 3px dashed #1a1a1a;
    border-radius: 24px;
    color: #999;
  }

  /* Memastikan tidak ada padding berlebih di mobile agar tidak overflow */
  @media (max-width: 600px) {
    .home-page {
      gap: 2rem;
    }
  }
</style>
