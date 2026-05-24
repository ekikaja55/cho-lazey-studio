<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { initArtProtection } from '$lib/utils/artProtection.js';
  import icon from '$lib/assets/the_assets/cho_asset/Deafen cho.png'
  import Toast from '$lib/components/Toast.svelte';
  import '$lib/styles/app.css';

  let { children } = $props();

  // onMount(() => {
  //   initArtProtection();
  // });
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cho's Studio</title>
  <meta name="description" content="Cho's Studio — Art Gallery & Commission" />

  <!-- Preconnect for Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="icon" href={icon} />
  <!-- Font Awesome (kept as requested) -->
  <script src="https://kit.fontawesome.com/2773bd903f.js" crossorigin="anonymous"></script>
</svelte:head>

<!-- Page content -->
{@render children()}

<!-- Global Toast Notification Layer -->
<Toast />

<style>
  :global(.page-transition-wrapper) {
    animation: fadeUp 0.35s ease both;
  }
</style>
