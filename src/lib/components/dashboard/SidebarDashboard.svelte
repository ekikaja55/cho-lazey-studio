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
      label: 'Commission',
      href: '/dashboard/artist/commission',
      icon: 'palette',
    },
    {
      label: 'Gallery',
      href: '/dashboard/artist/gallery',
      icon: 'image',
    },
    {
      label: 'Adoption',
      href: '/dashboard/artist/adoption',
      icon: 'palette',
    },  
  ];

  const clientNav = [
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
    return currentPath.startsWith(href);
  }

  function navigate(href) {
    goto(href);
  }

  function handleLogout() {
    auth.logout();
    toast.success('Logged out. See you next time! ✦');
    goto('/login');
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
                {@render NavIcon({ name: item.icon })}
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
        {@render NavIcon({ name: item.icon })}
      </span>
      <span class="mobile-label">{item.label}</span>
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
{#snippet NavIcon({ name })}
  {#if name === 'palette'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  {:else if name === 'image'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
  {:else if name === 'users'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  {:else if name === 'message'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  {:else if name === 'settings'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  {:else if name === 'receipt'}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9,11 12,14 22,4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
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
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--sidebar-accent-2);
    border: 2px solid var(--sidebar-border);
    flex-shrink: 0;
  }

  .brand-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.78rem;
    line-height: 1.2;
    color: var(--sidebar-text);
    letter-spacing: 0.03em;
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
     MOBILE BOTTOM BAR
  ══════════════════════════════════════ */
  .mobile-bar {
    display: none; /* shown via media query */
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 200;
    background: var(--sidebar-bg);
    border-top: 3px solid var(--sidebar-border);
    box-shadow: 0 -4px 0 0 var(--sidebar-border);
    padding: 0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom));
    align-items: center;
    justify-content: space-around;
    gap: 0.25rem;
  }

  .mobile-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.6rem;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: var(--sidebar-muted);
    cursor: pointer;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.58rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: background var(--transition), color var(--transition);
    min-width: 48px;
  }

  .mobile-item.active {
    color: var(--sidebar-text);
    background: rgba(42,36,32,0.07);
    font-weight: 700;
  }

  .mobile-item.mobile-profile {
    color: var(--sidebar-muted);
  }

  .mobile-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-label {
    display: block;
  }

  /* Active pip on mobile icon */
  .mobile-item.active .mobile-icon::after {
    display: none; /* keep it simple on mobile */
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

  /* Mobile: hide sidebar entirely, show bottom bar */
  @media (max-width: 600px) {
    .sidebar { display: none; }
    .mobile-bar { display: flex; }
  }
</style>
