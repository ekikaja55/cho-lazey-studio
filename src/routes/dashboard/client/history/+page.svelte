<script>
  // Script logic akan ditambahkan di sini kedepannya
</script>

<svelte:head>
  <title>History Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<div class="page-container">
  <div class="header-section">
    <p class="subtitle">PATRONAGE HISTORY</p>
    <h1 class="title">Acquisition Vault</h1>
    <p>chronological log of your art patronage. Revisiting the stories and masterpieces you have collected over time.</p>
    <div class="divider"></div>
  </div>
  
  <div class="content-placeholder">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur aliquid officia exercitationem sapiente in vero dolores reiciendis odit hic eum veritatis nam adipisci, dolorem quam eaque iste! Delectus, sit et?</p>
  </div>
</div>

<style>
  .page-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .header-section { margin-bottom: 2rem; }

  .subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    color: #d4845a;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 2.5rem;
    color: #2a2420;
    margin: 0 0 1rem;
  }

  .divider {
    width: 60px; height: 4px;
    background: #f4a87c;
    border-radius: 2px;
  }

  .content-placeholder {
    padding: 3rem;
    border: 2px dashed rgba(42, 36, 32, 0.2);
    border-radius: 16px;
    text-align: center;
    color: rgba(42, 36, 32, 0.5);
    font-family: 'DM Sans', system-ui, sans-serif;
  }
</style>
