<script>
import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { isLoggedIn, userRole } from '$lib/stores/auth.js'; 

 let { minimized = $bindable(false) } = $props();
  let personaOpen = $state(false);
  let isMobile = $state(false);

  const SIDEBAR_LEFT   = 20;
  const SIDEBAR_W_FULL = 220;
  const SIDEBAR_W_MIN  = 68;
  const SIDEBAR_GAP    = 14;

  const popupLeft = $derived(
    isMobile
      ? null   
      : `${SIDEBAR_LEFT + (minimized ? SIDEBAR_W_MIN : SIDEBAR_W_FULL) + SIDEBAR_GAP}px`
  );

  onMount(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  function handleOutsideClick(e) {
    if (personaOpen && !e.target.closest('.persona-popup') && !e.target.closest('.persona-trigger')) {
      personaOpen = false;
    }
  }


 const navItems = $derived([
  {
    label: 'Home',
    href: '/home',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    color: '#ebdcb9',
  },
  {
    label: 'Gallery',
    href: '/home/gallery',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`,
    color: '#a2e1db',
  },
  {
    label: 'Shop',
    href: '/home/shop',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
    color: '#f4a87c',
  },
  {
    label: 'Porto',
    href: 'https://www.figma.com/deck/LbxzO8apkfs4yxjoxagN33',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    color: '#e9b7c8',
    external: true,
  },
  {
    label: $isLoggedIn ? 'Dashboard' : 'Login',
    href: $isLoggedIn ? `/dashboard/${$userRole || ''}` : '/auth',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    color: '#b4a6d5', 
  },
]);
  
function isActive(href) {
    if (href.startsWith('http')) return false;
    if (href === '/home') {
      return $page.url.pathname === '/home' || $page.url.pathname === '/home/';
    }
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }
</script>

<svelte:document onclick={handleOutsideClick} />

{#if personaOpen}
  <div
    class="persona-popup"
    class:mobile={isMobile}
    style={popupLeft ? `left: ${popupLeft};` : ''}
    role="dialog"
    aria-label="Artist persona"
    aria-modal="false"
  >
    <button class="popup-close" onclick={() => personaOpen = false} aria-label="Close">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <div class="popup-header">
      <div class="popup-avatar">
        <img src="/assets/Talking cho.png" alt="Cho's OC" />
      </div>
      <div class="popup-identity">
        <span class="popup-name">CHO.LAZEY</span>
        <span class="popup-tag">Digital Artist</span>
      </div>
    </div>

    <div class="popup-divider" aria-hidden="true"></div>

    <p class="popup-bio">
      self taught aspiring artist illustrator, fanmerch artist and graphic designer, and also pin, poca, and handfan vendor!
    </p>

    <div class="popup-socials">
      <a
        href="https://www.instagram.com/cho.lazey/"
        target="_blank"
        rel="noopener noreferrer"
        class="popup-social popup-ig"
        aria-label="Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
        </svg>
        Instagram
      </a>

      <a
        href="https://line.me/ti/p/7mifiGmjzn"
        target="_blank"
        rel="noopener noreferrer"
        class="popup-social popup-line"
        aria-label="LINE"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 0c4.411 0 8 2.912 8 6.492 0 1.433-.555 2.723-1.715 3.994-1.678 1.932-5.431 4.285-6.285 4.645-.83.35-.734-.197-.696-.413l.003-.018.114-.685c.027-.204.055-.521-.026-.723-.09-.223-.444-.339-.704-.395C2.846 12.39 0 9.701 0 6.492 0 2.912 3.59 0 8 0M5.022 7.686H3.497V4.918a.156.156 0 0 0-.155-.156H2.78a.156.156 0 0 0-.156.156v3.486c0 .041.017.08.044.107v.001l.002.002.002.002a.15.15 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157m.791-2.924a.156.156 0 0 0-.156.156v3.486c0 .086.07.155.156.155h.562c.086 0 .155-.07.155-.155V4.918a.156.156 0 0 0-.155-.156zm3.863 0a.156.156 0 0 0-.156.156v2.07L7.923 4.832l-.013-.015v-.001l-.01-.01-.003-.003-.011-.009h-.001L7.88 4.79l-.003-.002-.005-.003-.008-.005h-.002l-.003-.002-.01-.004-.004-.002-.01-.003h-.002l-.003-.001-.009-.002h-.006l-.003-.001h-.004l-.002-.001h-.574a.156.156 0 0 0-.156.155v3.486c0 .086.07.155.156.155h.56c.087 0 .157-.07.157-.155v-2.07l1.6 2.16a.2.2 0 0 0 .039.038l.001.001.01.006.004.002.008.004.007.003.005.002.01.003h.003a.2.2 0 0 0 .04.006h.56c.087 0 .157-.07.157-.155V4.918a.156.156 0 0 0-.156-.156zm3.815.717v-.56a.156.156 0 0 0-.155-.157h-2.242a.16.16 0 0 0-.108.044h-.001l-.001.002-.002.003a.16.16 0 0 0-.044.107v3.486c0 .041.017.08.044.107l.002.003.002.002a.16.16 0 0 0 .108.043h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157H11.81v-.589h1.525c.086 0 .155-.07.155-.156Z"/>
        </svg>
        LINE
      </a>

      <a 
        href="https://www.linkedin.com/in/brenda-violint"
        target="_blank"
        rel="noopener noreferrer"
        class="popup-social popup-linkedin"
        aria-label="LinkedIn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
        </svg>
        LinkedIn
      </a>
    </div>

  </div>
{/if}

<aside
  class="floating-sidebar"
  class:minimized
  aria-label="Main navigation"
>
  <button
    class="minimize-btn"
    onclick={() => { minimized = !minimized; if (personaOpen) personaOpen = false; }}
    aria-label={minimized ? 'Expand sidebar' : 'Minimize sidebar'}
    title={minimized ? 'Expand' : 'Minimize'}
  >
    <svg
      width="11" height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="transform: rotate({minimized ? '180deg' : '0deg'}); transition: transform 0.3s ease;"
    >
      <polyline points="15,18 9,12 15,6"/>
    </svg>
  </button>

  <button
    class="persona-trigger"
    class:active={personaOpen}
    onclick={() => personaOpen = !personaOpen}
    aria-label="View artist persona"
    aria-expanded={personaOpen}
    title="Meet Cho"
  >
    <div class="persona-img-wrap">
      <img src="/assets/Talking cho.png" alt="Cho's OC" />
      <div class="persona-ring" aria-hidden="true"></div>
    </div>
  </button>

  <div class="sidebar-divider" aria-hidden="true">
    <span class="divider-star">{minimized ? '' : '✦'}</span>
  </div>

  <nav class="sidebar-nav" aria-label="Site navigation">
    <ul>
      {#each navItems as item}
        {@const active = isActive(item.href)}
        <li>
          <a
            href={item.href}
            class="nav-link"
            class:active
            style="--item-color: {item.color};"
            aria-current={active ? 'page' : undefined}
            title={minimized ? item.label : ''}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
          >
            <span class="nav-icon" aria-hidden="true">
              {@html item.icon}
            </span>
            {#if !minimized}
              <span class="nav-label">{item.label}</span>
            {/if}
            {#if active && minimized}
              <span class="active-dot" aria-hidden="true"></span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  .floating-sidebar {
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    width: 220px;
    min-height: 340px;
    background: rgba(240, 235, 227, 0.97);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 6px 6px 0px #2a2420;
    padding: 1.2rem 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 0.65rem;
    transition:
      width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      min-height 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.25s ease;
  }

  .floating-sidebar.minimized {
    width: 68px;
    min-height: 0;
    padding: 1.1rem 0.7rem 1.15rem;
    align-items: center;
  }

  .floating-sidebar:hover {
    box-shadow: 8px 8px 0px #2a2420;
  }

  .minimize-btn {
    position: absolute;
    top: 14px;
    right: -14px;
    width: 28px;
    height: 28px;
    background: #f4a87c;
    border: 2.5px solid #2a2420;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2a2420;
    box-shadow: 2px 2px 0px #2a2420;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
    z-index: 10;
    flex-shrink: 0;
  }
  .minimize-btn:hover {
    background: #f0976a;
    transform: scale(1.12);
    box-shadow: 3px 3px 0px #2a2420;
  }
  .minimize-btn:active {
    transform: scale(0.94);
    box-shadow: 1px 1px 0px #2a2420;
  }

  .persona-trigger {
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: 2px solid transparent;
    border-radius: 18px;
    cursor: pointer;
    padding: 0.3rem;
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .persona-trigger:hover,
  .persona-trigger.active {
    background: rgba(162, 225, 219, 0.3);
    border-color: rgba(125, 200, 193, 0.5);
  }

  .persona-img-wrap {
    position: relative;
    width: 64px;
    height: 64px;
    background: #a2e1db;
    border: 2.5px solid #2a2420;
    border-radius: 16px;
    overflow: visible;
    flex-shrink: 0;
    box-shadow: 3px 3px 0px #2a2420;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .persona-trigger:hover .persona-img-wrap,
  .persona-trigger.active .persona-img-wrap {
    transform: translateY(-2px);
    box-shadow: 4px 5px 0px #2a2420;
  }
  .persona-img-wrap img {
    width: 100%; height: 100%;
    object-fit: contain;
    border-radius: 13px;
  }

  .persona-ring {
    position: absolute;
    inset: -5px;
    border-radius: 20px;
    border: 2px solid transparent;
    pointer-events: none;
    transition: border-color 0.2s ease;
  }
  .persona-trigger:hover .persona-ring {
    border-color: rgba(125, 200, 193, 0.5);
    animation: ringPulse 1.4s ease infinite;
  }
  @keyframes ringPulse {
    0%   { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.3); }
  }

  .sidebar-divider {
    height: 1px;
    background: rgba(42, 36, 32, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.1rem;
    position: relative;
  }
  .divider-star {
    background: rgba(240, 235, 227, 0.97);
    padding: 0 6px;
    font-size: 0.6rem;
    color: rgba(42, 36, 32, 0.4);
    position: relative;
    top: -0.5px;
    line-height: 1;
  }

  .sidebar-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 12px;
    border-radius: 16px;
    border: 2px solid transparent;
    text-decoration: none;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.9rem;
    position: relative;
    overflow: hidden;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
    white-space: nowrap;
  }

  .minimized .nav-link {
    justify-content: center;
    padding: 11px 8px;
    gap: 0;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--item-color);
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 14px;
    z-index: 0;
  }
  .nav-link:hover::before  { opacity: 0.28; }
  .nav-link.active::before { opacity: 0.48; }

  .nav-link:hover {
    border-color: rgba(42, 36, 32, 0.28);
    transform: translateX(3px);
    box-shadow: 2px 2px 0px rgba(42, 36, 32, 0.15);
  }
  .minimized .nav-link:hover {
    transform: translateY(-2px) translateX(0);
  }

  .nav-link.active {
    border-color: #2a2420;
    box-shadow: 3px 3px 0px #2a2420;
  }

  .nav-icon {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .nav-label {
    position: relative;
    z-index: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
    transition: max-width 0.3s ease, opacity 0.3s ease;
  }

  .active-dot {
    position: absolute;
    right: 6px; top: 6px;
    width: 6px; height: 6px;
    background: #2a2420;
    border-radius: 50%;
    z-index: 2;
  }

  .persona-popup {
    position: fixed;
    top: 50%;
    transform: translateY(-60%);
    z-index: 200;
    width: 252px;
    background: rgba(240, 235, 227, 0.98);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 24px;
    box-shadow: 6px 6px 0px #2a2420;
    padding: 1.1rem 1rem 1rem;

    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    animation: popupIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .persona-popup.mobile {
    left: 50% !important;
    top: auto;
    bottom: calc(16px + 72px + 12px);
    transform: translateX(-50%);
    width: calc(100vw - 48px);
    max-width: 340px;
  }

  @keyframes popupIn {
    from { opacity: 0; transform: translateY(-58%) scale(0.92); }
    to   { opacity: 1; transform: translateY(-60%) scale(1); }
  }

  .persona-popup.mobile {
    animation: popupInMobile 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes popupInMobile {
    from { opacity: 0; transform: translateX(-50%) scale(0.92); }
    to   { opacity: 1; transform: translateX(-50%) scale(1); }
  }

  .popup-close {
    position: absolute;
    top: 10px; right: 10px;
    width: 24px; height: 24px;
    background: rgba(42, 36, 32, 0.08);
    border: 1.5px solid rgba(42, 36, 32, 0.2);
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #2a2420;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .popup-close:hover {
    background: rgba(42, 36, 32, 0.15);
    transform: scale(1.1);
  }

  .popup-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-right: 1.5rem;
  }

  .popup-avatar {
    width: 52px; height: 52px;
    background: #a2e1db;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 3px 3px 0px #2a2420;
  }
  .popup-avatar img {
    width: 100%; height: 100%;
    object-fit: contain;
  }

  .popup-identity {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .popup-name {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    color: #2a2420;
    letter-spacing: 0.04em;
  }

  .popup-tag {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    color: #1a5c58;
    background: #a2e1db;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1.5px solid rgba(42, 36, 32, 0.2);
    display: inline-block;
    width: fit-content;
  }

  .popup-divider {
    height: 1.5px;
    background: rgba(42, 36, 32, 0.12);
    border-radius: 1px;
  }

  .popup-bio {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.82rem;
    color: #4a3f3a;
    line-height: 1.6;
    margin: 0;
  }

  .popup-socials {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
  }

  .popup-linkedin {
    grid-column: 1 / -1;
  }

  .popup-social {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 7px 10px;
    border-radius: 10px;
    border: 2px solid #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.75rem;
    color: #2a2420;
    text-decoration: none;
    box-shadow: 2px 2px 0px #2a2420;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .popup-social:hover {
    transform: translateY(-2px);
    box-shadow: 3px 4px 0px #2a2420;
  }
  .popup-ig       { background: #f4a87c; }
  .popup-line     { background: #a2e1db; }
  .popup-linkedin { background: #b4a6d5; color: #2d1a5c; }

  @media (max-width: 768px) {
    .floating-sidebar {
      left: 50%;
      top: auto;
      bottom: 16px;
      transform: translateX(-50%);
      width: calc(100vw - 32px);
      max-width: 420px;
      min-height: 0;
      flex-direction: row;
      align-items: center;
      padding: 0.65rem 0.9rem;
      border-radius: 22px;
      gap: 0.5rem;
    }

    .floating-sidebar:hover {
      box-shadow: 6px 6px 0px #2a2420;
    }

    .floating-sidebar.minimized {
      width: auto;
      padding: 0.6rem 0.75rem;
      border-radius: 999px;
      align-items: center;
      justify-content: center;
    }

    .minimize-btn {
      top: -13px;
      right: 50%;
      transform: translateX(50%) rotate(-90deg);
    }
    .minimize-btn:hover {
      transform: translateX(50%) rotate(-90deg) scale(1.12);
    }

    .persona-trigger { flex-shrink: 0; }
    .persona-img-wrap { width: 44px; height: 44px; }

    .sidebar-divider { display: none; }

    .sidebar-nav ul {
      flex-direction: row;
      gap: 4px;
      flex: 1;
    }

    .minimized .nav-link { justify-content: center; }

    .nav-link {
      flex-direction: column;
      gap: 3px;
      padding: 7px 10px;
      font-size: 0.68rem;
      text-align: center;
      border-radius: 14px;
    }
    .nav-link:hover { transform: translateY(-2px) translateX(0); }
  }

  @media (max-width: 420px) {
    .nav-link {
      padding: 6px 7px;
      font-size: 0.62rem;
    }
    .persona-img-wrap {
      width: 38px; height: 38px;
    }
  }
</style>
