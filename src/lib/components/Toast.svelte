<script>
  import { toast } from '$lib/stores/toast.js';
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  // Icon per type
  const icons = {
    success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    neutral: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  };

  const styles = {
    success: { bg: '#a2e1a6', color: '#1a4d1d', accent: '#4caf50' },
    error:   { bg: '#f46958', color: '#fff',    accent: '#d32f2f' },
    warning: { bg: '#ffba09', color: '#3d2800', accent: '#f57c00' },
    info:    { bg: '#91fff5', color: '#004d47', accent: '#00acc1' },
    neutral: { bg: '#b4a6d5', color: '#2d1a5c', accent: '#7e57c2' },
  };
</script>

<div class="toast-container" aria-live="polite" aria-atomic="false">
  {#each $toast as t (t.id)}
    <div
      class="toast toast-{t.type}"
      style="
        --toast-bg: {styles[t.type].bg};
        --toast-color: {styles[t.type].color};
        --toast-accent: {styles[t.type].accent};
      "
      in:fly={{ y: 16, duration: 250, opacity: 0 }}
      out:fade={{ duration: 200 }}
      animate:flip={{ duration: 250 }}
      role="alert"
    >
      <span class="toast-icon" aria-hidden="true">
        {@html icons[t.type]}
      </span>
      <span class="toast-message">{t.message}</span>
      <button
        class="toast-close"
        onclick={() => toast.remove(t.id)}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 360px;
    width: calc(100vw - 48px);
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    background: var(--toast-bg);
    color: var(--toast-color);
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.12),
      0 1px 4px rgba(0, 0, 0, 0.08);
    pointer-events: all;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1.4;
    position: relative;
    overflow: hidden;
  }

  /* Left accent bar */
  .toast::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--toast-accent);
    border-radius: 10px 0 0 10px;
  }

  .toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    opacity: 0.9;
  }

  .toast-message {
    flex: 1;
    font-weight: 500;
  }

  .toast-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    background: rgba(0, 0, 0, 0.08);
    color: var(--toast-color);
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    transition: background 150ms ease;
  }

  .toast-close:hover {
    background: rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 480px) {
    .toast-container {
      bottom: 16px;
      right: 16px;
      left: 16px;
      width: auto;
      max-width: none;
    }
  }
</style>
