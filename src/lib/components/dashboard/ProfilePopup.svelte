<script>
  /**
   * ProfilePopup.svelte
   * Cho's Studio — Profile Popup
   * Shows user data, logout & back to home buttons
   * Brutalist warm aesthetic
   */

  import { goto } from '$app/navigation';

  let { user = null, onclose, onlogout } = $props();

  function goHome() {
    onclose?.();
    goto('/home');
  }

  function handleLogout() {
    onclose?.();
    onlogout?.();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onclose?.();
  }

  function handleKey(e) {
    if (e.key === 'Escape') onclose?.();
  }

  // Map role to accent color
  const roleColor = {
    artist: { bg: 'rgba(162,225,219,0.35)', fg: '#1a5c57', border: 'rgba(162,225,219,0.6)', label: '✦ Artist' },
    client: { bg: 'rgba(244,168,124,0.3)',  fg: '#7a3a10', border: 'rgba(244,168,124,0.5)', label: '✦ Client' },
  };
  const rc = $derived(roleColor[user?.role] ?? roleColor.client);
</script>

<svelte:window onkeydown={handleKey} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="popup-backdrop"
  role="dialog"
  aria-modal="true"
  aria-label="Profile popup"
  onclick={handleBackdropClick}
  onkeydown={handleKey}
  tabindex="-1"
>
  <div class="popup-card" role="document">

    <!-- Close button -->
    <button class="popup-close" onclick={onclose} aria-label="Close profile">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- ── Avatar area ── -->
    <div class="popup-avatar-wrap">
      <div class="popup-avatar">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </div>
      <!-- Decorative ring -->
      <div class="popup-avatar-ring" aria-hidden="true"></div>
    </div>

    <!-- ── Name & role ── -->
    <div class="popup-identity">
      <h2 class="popup-name">{user?.display_name ?? 'User'}</h2>
      <span
        class="popup-role"
        style="background: {rc.bg}; color: {rc.fg}; border-color: {rc.border};"
      >
        {rc.label}
      </span>
    </div>

    <!-- ── Info rows ── -->
    <div class="popup-info">

      {#if user?.username}
        <div class="info-row">
          <span class="info-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <span class="info-label">Username</span>
          <span class="info-val">@{user.username}</span>
        </div>
      {/if}

      {#if user?.email}
        <div class="info-row">
          <span class="info-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <span class="info-label">Email</span>
          <span class="info-val">{user.email}</span>
        </div>
      {/if}

      {#if user?.instagram}
        <div class="info-row">
          <span class="info-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </span>
          <span class="info-label">Instagram</span>
          <span class="info-val">{user.instagram}</span>
        </div>
      {/if}

      {#if user?.line_id}
        <div class="info-row">
          <span class="info-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span class="info-label">LINE</span>
          <span class="info-val">{user.line_id}</span>
        </div>
      {/if}

      {#if user?.phone_number}
        <div class="info-row">
          <span class="info-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          <span class="info-label">Phone</span>
          <span class="info-val">{user.phone_number}</span>
        </div>
      {/if}

    </div>

    <!-- Divider -->
    <div class="popup-divider" aria-hidden="true"></div>

    <!-- ── Actions ── -->
    <div class="popup-actions">
      <button class="btn-home" onclick={goHome}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        Back to Home
      </button>
      <button class="btn-logout" onclick={handleLogout}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </div>

    <!-- Decorative corner accent -->
    <div class="popup-accent" aria-hidden="true"></div>

  </div>
</div>

<style>
  .popup-backdrop {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: rgba(42, 36, 32, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: backdropIn 0.2s ease both;
  }

  @keyframes backdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .popup-card {
    position: relative;
    background: #f0ebe3;
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 8px 8px 0px #2a2420;
    width: 100%;
    max-width: 360px;
    padding: 2rem 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.1rem;
    animation: cardIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    overflow: hidden;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: scale(0.88) translateY(20px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);     }
  }

  /* Close */
  .popup-close {
    position: absolute;
    top: 14px; right: 14px;
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 2px solid #2a2420;
    background: rgba(240,235,227,0.9);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
    z-index: 1;
  }
  .popup-close:hover {
    background: #f4a87c;
    transform: scale(1.1);
  }

  /* Avatar */
 .popup-avatar-wrap {
    position: relative;
    margin-top: 0.5rem;
    
    /* 1. Menerapkan drop-shadow 60% agar lingkaran dalam & ring putus-putus kebagian shadow */
    filter: drop-shadow(4px 4px 0px rgba(42, 36, 32, 0.6));
  }
 .popup-avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: #b4a6d5;
    border: 3px solid #2a2420;
    
    /* 2. Hapus box-shadow bawaan agar tidak double dengan drop-shadow pembungkusnya */
    box-shadow: none; 
    
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2a2420;
    position: relative;
    z-index: 1;
  }
 

.popup-avatar-ring {
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    
    /* 4. Mengubah warna ring putus-putus menjadi warna tegas/solid agar bayangannya jatuh lebih cantik */
    border: 2px dashed #2a2420; 
    
    animation: spin 18s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Identity */
  .popup-identity {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .popup-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.3rem;
    color: #2a2420;
    margin: 0;
    letter-spacing: 0.02em;
  }

  .popup-role {
    padding: 0.25rem 0.85rem;
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    border: 1.5px solid;
  }

  /* Info rows */
  .popup-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 0.7rem;
    border-radius: 12px;
    background: rgba(42,36,32,0.04);
    border: 1.5px solid rgba(42,36,32,0.08);
    transition: background 0.15s ease;
  }
  .info-row:hover {
    background: rgba(42,36,32,0.08);
  }

  .info-icon {
    display: flex;
    color: rgba(42,36,32,0.45);
    flex-shrink: 0;
  }

  .info-label {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(42,36,32,0.4);
    min-width: 62px;
    flex-shrink: 0;
  }

  .info-val {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.78rem;
    color: #2a2420;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  /* Divider */
  .popup-divider {
    width: 100%;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      rgba(42,36,32,0.15) 0px,
      rgba(42,36,32,0.15) 6px,
      transparent 6px,
      transparent 12px
    );
    border-radius: 1px;
  }

  /* Actions */
  .popup-actions {
    display: flex;
    gap: 0.65rem;
    width: 100%;
  }

  .btn-home,
  .btn-logout {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.7rem 1rem;
    border-radius: 14px;
    border: 2.5px solid #2a2420;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
    letter-spacing: 0.02em;
  }

  .btn-home {
    background: #a2e1db;
    color: #1a5c57;
    box-shadow: 3px 3px 0px #2a2420;
  }
  .btn-home:hover {
    transform: translateY(-2px);
    box-shadow: 5px 5px 0px #2a2420;
  }
  .btn-home:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  .btn-logout {
    background: #f0ebe3;
    color: #2a2420;
    box-shadow: 3px 3px 0px #2a2420;
  }
  .btn-logout:hover {
    background: #f46958;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 5px 5px 0px #2a2420;
  }
  .btn-logout:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  /* Decorative corner */
  .popup-accent {
    position: absolute;
    bottom: -18px; right: -18px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(180, 166, 213, 0.25);
    pointer-events: none;
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    .popup-card {
      padding: 1.75rem 1.25rem 1.25rem;
      border-radius: 22px;
    }
    .popup-actions {
      flex-direction: column;
    }
  }
</style>
