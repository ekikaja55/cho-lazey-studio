<script>
  import { galleryImages } from '$lib/data/galleryImages.js';
  import HomePageHeader from '$lib/components/home/HomePageHeader.svelte';
  import HomeGalleryGrid from '$lib/components/home/HomeGalleryGrid.svelte';
  import { onMount } from 'svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Gallery — Cho's Studio</title>
</svelte:head>

<div class="gallery-page" class:visible={mounted}>
  <HomePageHeader 
    eyebrow="ALL WORKS"
    title="Gallery"
    description="{galleryImages.length} pieces — digital art, illustrations &amp; more"
  />

  <HomeGalleryGrid />
</div>

<style>
  .gallery-page {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding-bottom: 2rem;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  
  .gallery-page.visible { 
    opacity: 1; 
    transform: translateY(0); 
  }
</style>
