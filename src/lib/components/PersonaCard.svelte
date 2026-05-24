<script>
  /**
   * PersonaCard.svelte
   * Floating persona popup — triggered dari sidebar
   * Props: open (boolean), onClose (function)
   */

  /** @type {boolean} */
  let { open = $bindable(false) } = $props();

  function close() {
    open = false;
  }

  // Close on Escape key
  function handleKeydown(e) {
    if (e.key === 'Escape' && open) close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="persona-backdrop" onclick={close} aria-hidden="true"></div>

  <!-- Card -->
  <div
    class="persona-card"
    role="dialog"
    aria-modal="true"
    aria-label="Cho's persona profile"
  >
    <!-- Close button -->
    <button class="persona-close" onclick={close} aria-label="Close persona card">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- Avatar image -->
    <div class="persona-avatar">
      <img src="/assets/cho_asset/Talking cho.png" alt="Cho's OC — Talking" />
    </div>

    <!-- Info -->
    <div class="persona-info">
      <p class="persona-eyebrow">✦ the artist ✦</p>
      <h2 class="persona-name">CHO.LAZEY</h2>
      <div class="persona-divider"></div>
      <p class="persona-bio">
        Heya! I'm a self-taught, aspiring artist ready to be of service.
        I do digital art, merch designs, and a bit of 3D modelling. 🎨
      </p>
    </div>

    <!-- Socials -->
    <div class="persona-socials">
      <a
        href="https://www.instagram.com/cho.lazey/"
        target="_blank"
        rel="noopener noreferrer"
        class="social-btn social-ig"
        aria-label="Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
        </svg>
        Instagram
      </a>
      <a
        href="https://line.me/ti/p/7mifiGmjzn"
        target="_blank"
        rel="noopener noreferrer"
        class="social-btn social-line"
        aria-label="LINE"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 0c4.411 0 8 2.912 8 6.492 0 1.433-.555 2.723-1.715 3.994-1.678 1.932-5.431 4.285-6.285 4.645-.83.35-.734-.197-.696-.413l.003-.018.114-.685c.027-.204.055-.521-.026-.723-.09-.223-.444-.339-.704-.395C2.846 12.39 0 9.701 0 6.492 0 2.912 3.59 0 8 0M5.022 7.686H3.497V4.918a.156.156 0 0 0-.155-.156H2.78a.156.156 0 0 0-.156.156v3.486c0 .041.017.08.044.107v.001l.002.002.002.002a.15.15 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157m.791-2.924a.156.156 0 0 0-.156.156v3.486c0 .086.07.155.156.155h.562c.086 0 .155-.07.155-.155V4.918a.156.156 0 0 0-.155-.156zm3.863 0a.156.156 0 0 0-.156.156v2.07L7.923 4.832l-.013-.015v-.001l-.01-.01-.003-.003-.011-.009h-.001L7.88 4.79l-.003-.002-.005-.003-.008-.005h-.002l-.003-.002-.01-.004-.004-.002-.01-.003h-.002l-.003-.001-.009-.002h-.006l-.003-.001h-.004l-.002-.001h-.574a.156.156 0 0 0-.156.155v3.486c0 .086.07.155.156.155h.56c.087 0 .157-.07.157-.155v-2.07l1.6 2.16a.2.2 0 0 0 .039.038l.001.001.01.006.004.002.008.004.007.003.005.002.01.003h.003a.2.2 0 0 0 .04.006h.56c.087 0 .157-.07.157-.155V4.918a.156.156 0 0 0-.156-.156zm3.815.717v-.56a.156.156 0 0 0-.155-.157h-2.242a.16.16 0 0 0-.108.044h-.001l-.001.002-.002.003a.16.16 0 0 0-.044.107v3.486c0 .041.017.08.044.107l.002.003.002.002a.16.16 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156Z"/>
        </svg>
        LINE
      </a>
    </div>

    <!-- Decorative corner -->
    <div class="persona-corner-tl" aria-hidden="true"></div>
    <div class="persona-corner-br" aria-hidden="true"></div>
  </div>
{/if}

<style>
  /* Backdrop */
  .persona-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(42, 36, 32, 0.18);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Card */
  .persona-card {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 201;
    width: min(340px, 90vw);
    background: rgba(240, 235, 227, 0.97);
    border: 3px solid #2a2420;
    border-radius: 24px;
    box-shadow: 8px 8px 0px #2a2420;
    padding: 1.75rem 1.75rem 1.5rem;
    animation: cardPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    overflow: hidden;
  }

  @keyframes cardPop {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  /* Close button */
  .persona-close {
    position: absolute;
    top: 14px; right: 14px;
    width: 28px; height: 28px;
    background: rgba(42, 36, 32, 0.08);
    border: 1.5px solid rgba(42, 36, 32, 0.2);
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .persona-close:hover {
    background: #f46958;
    color: #fff;
    border-color: #f46958;
    transform: rotate(90deg);
  }

  /* Avatar */
  .persona-avatar {
    width: 120px; height: 120px;
    background: #a2e1db;
    border: 3px solid #2a2420;
    border-radius: 18px;
    box-shadow: 4px 4px 0px #2a2420;
    overflow: hidden;
    margin: 0 auto 1.1rem;
  }
  .persona-avatar img {
    width: 100%; height: 100%;
    object-fit: contain;
  }

  /* Info */
  .persona-info { text-align: center; }

  .persona-eyebrow {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7dc8c1;
    margin: 0 0 0.4rem;
  }

  .persona-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.75rem;
    color: #2a2420;
    margin: 0;
    letter-spacing: 0.02em;
  }

  .persona-divider {
    width: 36px; height: 3px;
    background: linear-gradient(90deg, #7dc8c1, #f4a87c);
    border-radius: 2px;
    margin: 0.65rem auto 0.75rem;
  }

  .persona-bio {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.85rem;
    color: #4a3f3a;
    line-height: 1.65;
    margin: 0;
  }

  /* Socials */
  .persona-socials {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 1.15rem;
  }

  .social-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 999px;
    border: 2px solid #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: #2a2420;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 2px 2px 0px #2a2420;
  }
  .social-btn:hover {
    transform: translateY(-2px);
    box-shadow: 3px 4px 0px #2a2420;
  }

  .social-ig   { background: #f4a87c; }
  .social-line { background: #a2e1db; }

  /* Decorative corners */
  .persona-corner-tl {
    position: absolute;
    top: -14px; left: -14px;
    width: 40px; height: 40px;
    background: #b4a6d5;
    border: 2px solid #2a2420;
    border-radius: 6px;
    transform: rotate(-15deg);
    opacity: 0.5;
  }
  .persona-corner-br {
    position: absolute;
    bottom: -12px; right: -12px;
    width: 36px; height: 36px;
    background: #f4a87c;
    border: 2px solid #2a2420;
    border-radius: 6px;
    transform: rotate(18deg);
    opacity: 0.45;
  }
</style>
