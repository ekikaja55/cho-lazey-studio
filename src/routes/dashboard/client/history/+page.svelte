<script>
  // Script logic akan ditambahkan di sini kedepannya
</script>

<svelte:head>
  <title>History Dashboard | Cho's Lazey Studio</title>
</svelte:head>

<div class="page-container">
  <div class="header-section">
    <p class="subtitle">OWNED PIECES</p>
    <h1 class="title">Order Archive</h1>
    <p>A quiet look back at your history with the studio. Revisiting the illustrations and stories you have gathered over time.</p>
    <div class="divider"></div>
  </div>
  
  <div class="content-placeholder">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur aliquid officia exercitationem sapiente in vero dolores reiciendis odit hic eum veritatis nam adipisci, dolorem quam eaque iste! Delectus, sit et?</p>
  </div>
</div>

<style>
 .page-container {
    width: 100%;
    max-width: 1200px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2.5rem; /* Memberikan jarak vertikal yang lega antar seksi */
  }

  .header-section { 
    margin-bottom: 0; 
    display: flex;
    flex-direction: column;
    gap: 0.75rem; /* Jarak antar teks di header lebih konsisten */
  }

  .subtitle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.85rem; /* Diperbesar sedikit agar terbaca jelas */
    letter-spacing: 0.25em; /* Jarak antar huruf diperlebar */
    color: #d4845a;
    font-weight: 800;
    margin: 0;
  }

  .title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 3.2rem; /* Diperbesar dari 2.5rem agar tampak tegas dan berani */
    color: #2a2420;
    margin: 0;
    line-height: 1.1;
  }

  /* Seksi deskripsi baru agar teks tidak melar sepanjang layar */
  .header-section p {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 1.15rem; /* Diperbesar agar terasa jauh lebih lega */
    line-height: 1.75;  /* Ditambah kontras vertikalnya agar tidak menumpuk */
    color: #4a403a;     /* Warna cokelat gelap yang lebih lembut di mata */
    max-width: 680px;   /* PENTING: Membatasi panjang bacaan ideal mata (Golden Ratio) */
    margin: 0 0 0.5rem 0;
  }

  .divider {
    width: 80px; /* Diperlebar agar seimbang dengan judul yang membesar */
    height: 5px;
    background: #f4a87c;
    border-radius: 999px;
    margin-top: 0.5rem;
  }

  .content-placeholder {
    padding: 5rem 3rem; /* Padding vertikal diperbesar untuk ruang napas */
    border: 3px dashed rgba(42, 36, 32, 0.25); /* Ketebalan border disesuaikan */
    border-radius: 20px;
    text-align: center;
    color: rgba(42, 36, 32, 0.6);
    font-family: 'DM Sans', system-ui, sans-serif;
    background: rgba(42, 36, 32, 0.02); /* Sentuhan warna latar tipis di dalam placeholder */
  }

  .content-placeholder p {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }</style>
