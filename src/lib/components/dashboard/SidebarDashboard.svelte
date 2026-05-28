<script>
  /**
   * SidebarDashboard.svelte
   * Cho's Studio — Dashboard Sidebar
   * Sticky floating sidebar, minimizable (desktop), bottom bar (mobile)
   * DNA: brutalist warm, cream + dark brown + accent teal/peach/lavender
   */

  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth.js';
  import { toast } from '$lib/stores/toast.js';
  import ProfilePopup from '$lib/components/dashboard/ProfilePopup.svelte';

  let { role = 'client', currentPath = '' } = $props();

  // ── State ─────────────────────────────────────────
  let minimized   = $state(false);
  let showProfile = $state(false);

  // ── Nav config per role ───────────────────────────
  const artistNav = [
    {
      label: 'Overview',
      href: '/dashboard/artist',
      icon: 'overview',
    },
    {
      label: 'Commission',
      href: '/dashboard/artist/commission',
      icon: 'palette',
    },
    {
      label: 'Adoption',
      href: '/dashboard/artist/adoption',
      icon: 'heart',
    },
    {
      label: 'Gallery',
      href: '/dashboard/artist/gallery',
      icon: 'image',
    },
    {
      label:'Portofolio',
      href:'/dashboard/artist/porto',
      icon: 'porto',
    }
  ];

  const clientNav = [
    {
      label: 'Overview',
      href: '/dashboard/client',
      icon: 'overview',
    },
    {
      label: 'Commission',
      href: '/dashboard/client/commission',
      icon: 'palette',
    },
    {
      label: 'My Orders',
      href: '/dashboard/client/history',
      icon: 'receipt',
    },
  ];

  const navItems = $derived(role === 'artist' ? artistNav : clientNav);

function isActive(href) {
  // Jika href adalah rute utama dashboard (Overview), pastikan jalurnya sama persis
  if (href === '/dashboard/artist' || href === '/dashboard/client') {
    return currentPath === href;
  }
  
  // Untuk menu lainnya, tetap gunakan startsWith agar sub-halaman tetap memicu highlight
  return currentPath.startsWith(href);
}  

function navigate(href) {
    goto(href);
  }

  function handleLogout() {
    auth.logout();
    toast.success('[PROTOTYPE] Logged out. See you next time! ✦');
    goto('/');
  }

  function toggleMinimize() {
    minimized = !minimized;
  }

  function openProfile() {
    showProfile = true;
  }

  function closeProfile() {
    showProfile = false;
  }
</script>

<!-- ══════════════════════════════════════
     DESKTOP SIDEBAR
══════════════════════════════════════ -->
<aside class="sidebar" class:minimized aria-label="Dashboard navigation">

  <!-- Sidebar inner card -->
  <div class="sidebar-card">

    <!-- ── Top: Brand + Minimize ── -->
    <div class="sidebar-top">
      {#if !minimized}
        <div class="sidebar-brand">
          <span class="brand-dot" aria-hidden="true"></span>
          <span class="brand-name">Cho's<br/>Studio</span>
        </div>
      {/if}

      <button
        class="btn-icon minimize-btn"
        onclick={toggleMinimize}
        aria-label={minimized ? 'Expand sidebar' : 'Collapse sidebar'}
        title={minimized ? 'Expand' : 'Collapse'}
      >
        <!-- Chevron SVG flips with CSS -->
        <svg
          class="chevron-icon"
          class:flipped={minimized}
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>
    </div>

    <!-- ── Role badge ── -->
    {#if !minimized}
      <div class="role-badge" data-role={role}>
        <span class="role-dot" aria-hidden="true"></span>
        {role === 'artist' ? '✦ Artist' : '✦ Client'}
      </div>
    {/if}

    <!-- ── Nav ── -->
    <nav class="sidebar-nav" aria-label="Main navigation">
      <ul role="list">
        {#each navItems as item}
          <li>
            <button
              class="nav-item"
              class:active={isActive(item.href)}
              onclick={() => navigate(item.href)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              title={minimized ? item.label : undefined}
            >
              <!-- SVG Icon -->
              <span class="nav-icon" aria-hidden="true">
                {@render NavIcon(item.icon)}
              </span>
              {#if !minimized}
                <span class="nav-label">{item.label}</span>
              {/if}
              {#if !minimized && isActive(item.href)}
                <span class="nav-active-pip" aria-hidden="true"></span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- ── Spacer ── -->
    <div class="sidebar-spacer"></div>

    <!-- ── Profile button (bottom) ── -->
    <button
      class="profile-btn"
      onclick={openProfile}
      aria-label="View profile and account options"
      title="Profile"
    >
      <span class="profile-avatar" aria-hidden="true">
        <!-- Default SVG avatar -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      </span>
      {#if !minimized}
        <span class="profile-info">
          <span class="profile-name">{$auth?.display_name ?? 'User'}</span>
          <span class="profile-handle">@{$auth?.username ?? '—'}</span>
        </span>
        <span class="profile-caret" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </span>
      {/if}
    </button>

  </div>
</aside>

<!-- ══════════════════════════════════════
     MOBILE BOTTOM BAR
══════════════════════════════════════ -->
<nav class="mobile-bar" aria-label="Mobile navigation">
  <!-- Profile trigger (left) -->
  <button class="mobile-item mobile-profile" onclick={openProfile} aria-label="Profile">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  </button>

  {#each navItems as item}
    <button
      class="mobile-item"
      class:active={isActive(item.href)}
      onclick={() => navigate(item.href)}
      aria-label={item.label}
      aria-current={isActive(item.href) ? 'page' : undefined}
    >
      <span class="mobile-icon" aria-hidden="true">
        {@render NavIcon(item.icon)}
      </span>
    </button>
  {/each}
</nav>

<!-- ══════════════════════════════════════
     PROFILE POPUP
══════════════════════════════════════ -->
{#if showProfile}
  <ProfilePopup
    user={$auth}
    onclose={closeProfile}
    onlogout={handleLogout}
  />
{/if}

<!-- ══════════════════════════════════════
     ICON COMPONENT (inline)
══════════════════════════════════════ -->
{#snippet NavIcon(name)}
  {#if name === 'overview'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"/>
      <rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/>
      <rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  {:else if name === 'palette'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  {:else if name === 'heart'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  {:else if name === 'image'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
  {:else if name === 'porto'} 
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  <polyline points="9,12 12,15 16,11"/>
</svg>

  {/if}
{/snippet}

<style>
  /* ══════════════════════════════════════
     CSS TOKENS — inherits Cho's Studio DNA
  ══════════════════════════════════════ */
  :root {
    --sidebar-bg:        #f0ebe3;
    --sidebar-border:    #2a2420;
    --sidebar-shadow:    6px 0 0 0 #2a2420;
    --sidebar-w:         220px;
    --sidebar-w-min:     64px;
    --sidebar-radius:    24px;
    --sidebar-accent-1:  #a2e1db; /* teal  */
    --sidebar-accent-2:  #f4a87c; /* peach */
    --sidebar-accent-3:  #b4a6d5; /* lavender */
    --sidebar-text:      #2a2420;
    --sidebar-muted:     rgba(42, 36, 32, 0.45);
    --sidebar-active-bg: #2a2420;
    --sidebar-active-fg: #f0ebe3;
    --sidebar-hover-bg:  rgba(42, 36, 32, 0.07);
    --transition:        0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ══════════════════════════════════════
     DESKTOP SIDEBAR
  ══════════════════════════════════════ */
  .sidebar {
    /* Sticky, floats on the right edge of the left column */
    position: sticky;
    top: 1.5rem;
    height: calc(100vh - 3rem);
    width: var(--sidebar-w);
    flex-shrink: 0;
    transition: width var(--transition);
    display: flex;
    flex-direction: column;
    /* Mobile: hidden by default, shown via media query override */
  }

  .sidebar.minimized {
    width: var(--sidebar-w-min);
  }

  .sidebar-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--sidebar-bg);
    border: 3px solid var(--sidebar-border);
    border-radius: var(--sidebar-radius);
    box-shadow: 5px 5px 0px var(--sidebar-border);
    overflow: hidden;
    transition: width var(--transition);
  }

  /* ── Top ── */
  .sidebar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1rem 0.75rem;
    gap: 0.5rem;
    border-bottom: 2px solid rgba(42,36,32,0.1);
    flex-shrink: 0;
  }

  .sidebar.minimized .sidebar-top {
    justify-content: center;
    padding: 1.1rem 0.5rem 0.75rem;
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;
  }

  .brand-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--sidebar-accent-2);
    border: 2px solid var(--sidebar-border);
    flex-shrink: 0;
  }

  .brand-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    line-height: 1.25;
    color: var(--sidebar-text);
    letter-spacing: 0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Minimize button */
  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: 8px;
    width: 28px; height: 28px;
    cursor: pointer;
    color: var(--sidebar-muted);
    transition: background var(--transition), color var(--transition), border-color var(--transition);
    flex-shrink: 0;
  }
  .btn-icon:hover {
    background: var(--sidebar-hover-bg);
    color: var(--sidebar-text);
    border-color: rgba(42,36,32,0.15);
  }

  .chevron-icon {
    transition: transform var(--transition);
  }
  .chevron-icon.flipped {
    transform: rotate(180deg);
  }

  /* ── Role badge ── */
  .role-badge {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0.6rem 1rem 0.4rem;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    width: fit-content;
  }

  .role-badge[data-role="artist"] {
    background: rgba(162, 225, 219, 0.35);
    color: #1a5c57;
    border: 1.5px solid rgba(162, 225, 219, 0.6);
  }
  .role-badge[data-role="client"] {
    background: rgba(244, 168, 124, 0.3);
    color: #7a3a10;
    border: 1.5px solid rgba(244, 168, 124, 0.5);
  }

  .role-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.7;
  }

  /* ── Nav ── */
  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0.65rem;
    scrollbar-width: none;
  }
  .sidebar-nav::-webkit-scrollbar { display: none; }

  .sidebar-nav ul {
    list-style: none;
    margin: 0; padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: none;
    border-radius: 14px;
    background: transparent;
    color: var(--sidebar-muted);
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: background var(--transition), color var(--transition), transform 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
  }

  .sidebar.minimized .nav-item {
    justify-content: center;
    padding: 0.7rem;
    gap: 0;
  }

  .nav-item:hover {
    background: var(--sidebar-hover-bg);
    color: var(--sidebar-text);
    transform: translateX(2px);
  }

  .nav-item.active {
    background: var(--sidebar-active-bg);
    color: var(--sidebar-active-fg);
    font-weight: 600;
    transform: none;
    box-shadow: 3px 3px 0px rgba(42,36,32,0.4);
  }

  .sidebar.minimized .nav-item.active {
    box-shadow: 2px 2px 0px rgba(42,36,32,0.4);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  .nav-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-active-pip {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--sidebar-accent-1);
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(162, 225, 219, 0.8);
  }

  /* ── Spacer ── */
  .sidebar-spacer { flex: 1; }

  /* ── Profile button ── */
  .profile-btn {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin: 0 0.65rem 0.85rem;
    padding: 0.65rem 0.75rem;
    background: rgba(42, 36, 32, 0.05);
    border: 2px solid rgba(42, 36, 32, 0.12);
    border-radius: 16px;
    cursor: pointer;
    text-align: left;
    transition: background var(--transition), border-color var(--transition), transform 0.15s ease;
    flex-shrink: 0;
    overflow: hidden;
  }

  .sidebar.minimized .profile-btn {
    justify-content: center;
    padding: 0.65rem;
    gap: 0;
    margin: 0 0.5rem 0.85rem;
  }

  .profile-btn:hover {
    background: rgba(42, 36, 32, 0.09);
    border-color: rgba(42, 36, 32, 0.25);
    transform: translateY(-1px);
  }

  .profile-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: var(--sidebar-accent-3);
    border: 2px solid var(--sidebar-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--sidebar-border);
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-width: 0;
    flex: 1;
    overflow: hidden;
  }

  .profile-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.78rem;
    color: var(--sidebar-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .profile-handle {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.65rem;
    color: var(--sidebar-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile-caret {
    display: flex;
    align-items: center;
    color: var(--sidebar-muted);
    flex-shrink: 0;
  }

  /* ══════════════════════════════════════
     MOBILE BOTTOM BAR — Floating pill
  ══════════════════════════════════════ */
  .mobile-bar {
    display: none; /* shown via media query */
    position: fixed;

    /* Floating: tidak nempel ke tepi, ada margin kiri-kanan */
    bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
    left: 50%;
    transform: translateX(-50%);

    /* Lebar auto menyesuaikan konten, dibatasi agar tidak terlalu lebar */
    width: auto;
    max-width: calc(100vw - 2rem);
    min-width: 0;
    overflow: hidden;

    z-index: 200;

    /* DNA brutalist: border tebal + offset shadow */
    background: var(--sidebar-bg);
    border: 2.5px solid var(--sidebar-border);
    border-radius: 999px;   /* full pill */
    box-shadow:
      4px 4px 0px var(--sidebar-border),
      0 8px 24px rgba(42, 36, 32, 0.18),
      0 2px 8px rgba(42, 36, 32, 0.12);

    padding: 0.35rem 0.5rem;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;
  }

  /* Profile trigger — bulat di kiri, sedikit terpisah */
  .mobile-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 0.75rem;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: var(--sidebar-muted);
    cursor: pointer;
    transition:
      background var(--transition),
      color var(--transition),
      transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    min-width: 44px;
  }

  .mobile-item:hover {
    color: var(--sidebar-text);
    background: rgba(42, 36, 32, 0.06);
    transform: translateY(-1px);
  }

  /* Active state: pill background dark → teks terang, offset shadow kecil */
  .mobile-item.active {
    background: var(--sidebar-active-bg);
    color: var(--sidebar-active-fg);
    font-weight: 700;
    box-shadow: 2px 2px 0px rgba(42, 36, 32, 0.5);
    transform: translateY(-1px);
  }

  /* Profile button — border lingkaran tipis sebagai pemisah visual */
  .mobile-item.mobile-profile {
    color: var(--sidebar-muted);
    border-right: 1.5px solid rgba(42, 36, 32, 0.12);
    border-radius: 999px 0 0 999px;  /* setengah pill kiri */
    padding-right: 0.85rem;
    margin-right: 0.15rem;
  }

  .mobile-item.mobile-profile:hover {
    background: rgba(180, 166, 213, 0.15);
    color: #3d2b6b;
    border-right-color: rgba(42, 36, 32, 0.12);
    border-radius: 999px 0 0 999px;
  }

  .mobile-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ══════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════ */

  /* Tablet: sidebar still shown but narrower */
  @media (max-width: 900px) {
    .sidebar {
      width: var(--sidebar-w-min);
    }
    .sidebar-brand,
    .role-badge,
    .nav-label,
    .nav-active-pip,
    .profile-info,
    .profile-caret {
      display: none !important;
    }
    .sidebar-top { justify-content: center; }
    .minimize-btn { display: none; }
    .nav-item { justify-content: center; padding: 0.7rem; gap: 0; }
    .profile-btn { justify-content: center; padding: 0.65rem; gap: 0; margin: 0 0.5rem 0.85rem; }
  }

  /* Mobile: hide sidebar entirely, show floating bottom bar */
  @media (max-width: 600px) {
    .sidebar { display: none; }
    .mobile-bar { display: flex; }
  }

  /* Narrow phone — kompreskan padding sedikit */
  @media (max-width: 360px) {
    .mobile-bar {
      max-width: calc(100vw - 1.5rem);
      padding: 0.3rem 0.35rem;
      gap: 0.05rem;
    }
    .mobile-item {
      padding: 0.45rem 0.5rem;
      min-width: 38px;
      font-size: 0.5rem;
    }
    .mobile-item.mobile-profile {
      padding-right: 0.65rem;
    }
  }
</style>
