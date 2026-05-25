<script>
  import { toast } from '$lib/stores/toast.js';
  import { scale, fade } from 'svelte/transition';
  import { backOut } from 'svelte/easing';

  // Hanya tampilkan pop-up paling depan dari antrian
  const current = $derived($toast[0] ?? null);

  // Config per tipe
  const config = {
    success: {
      bg:      '#a2e1a6',
      border:  '#2a2420',
      accent:  '#1a7a1e',
      shadow:  '#2a2420',
      label:   'Success',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    },
    error: {
      bg:      '#f46958',
      border:  '#2a2420',
      accent:  '#fff',
      shadow:  '#2a2420',
      label:   'Error',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    },
    warning: {
      bg:      '#ffba09',
      border:  '#2a2420',
      accent:  '#2a2420',
      shadow:  '#2a2420',
      label:   'Warning',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    },
    info: {
      bg:      '#91fff5',
      border:  '#2a2420',
      accent:  '#004d47',
      shadow:  '#2a2420',
      label:   'Info',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>`,
    },
    neutral: {
      bg:      '#b4a6d5',
      border:  '#2a2420',
      accent:  '#2d1a5c',
      shadow:  '#2a2420',
      label:   'Notice',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    },
  };

  function dismiss() {
    if (current) toast.remove(current.id);
  }

  // ESC key to dismiss
  function onKeydown(e) {
    if (e.key === 'Escape' && current) dismiss();
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if current}
  <!-- Backdrop -->
  <div
    class="backdrop"
    transition:fade={{ duration: 200 }}
    onclick={dismiss}
    role="presentation"
    aria-hidden="true"
  ></div>

  <!-- Pop-up -->
  {@const c = config[current.type]}
  <div
    class="popup-wrap"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="popup-label"
    aria-describedby="popup-msg"
    transition:scale={{ duration: 320, easing: backOut, start: 0.85 }}
  >
    <div
      class="popup"
      style="
        --pop-bg:     {c.bg};
        --pop-border: {c.border};
        --pop-accent: {c.accent};
        --pop-shadow: {c.shadow};
      "
    >
      <!-- Top stripe -->
      <div class="popup-stripe"></div>

      <!-- Queue indicator (jika ada lebih dari 1 notif antri) -->
      {#if $toast.length > 1}
        <div class="queue-badge" aria-label="{$toast.length - 1} more notification(s) waiting">
          +{$toast.length - 1} more
        </div>
      {/if}

      <!-- Icon -->
      <div class="popup-icon" aria-hidden="true">
        {@html c.icon}
      </div>

      <!-- Label -->
      <p class="popup-label" id="popup-label">{c.label}</p>

      <!-- Message -->
      <p class="popup-message" id="popup-msg">{current.message}</p>

      <!-- OK button -->
      <button class="popup-ok" onclick={dismiss} autofocus>
        OK
      </button>
    </div>
  </div>
{/if}

<style>
  /* ── Backdrop ── */
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(42, 36, 32, 0.45);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    z-index: 9998;
    cursor: pointer;
  }

  /* ── Pop-up wrapper (centering) ── */
  .popup-wrap {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    pointer-events: none; /* clicks pass through to backdrop except the card */
  }

  /* ── Pop-up card ── */
  .popup {
    position: relative;
    pointer-events: all;
    background: var(--pop-bg);
    border: 3px solid var(--pop-border);
    border-radius: 20px;
    box-shadow:
      6px 6px 0px var(--pop-shadow),
      0 24px 48px rgba(42, 36, 32, 0.22);
    padding: 2.25rem 2rem 2rem;
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
    text-align: center;
    overflow: hidden;
  }

  /* Decorative top stripe */
  .popup-stripe {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: repeating-linear-gradient(
      90deg,
      var(--pop-border) 0px,
      var(--pop-border) 10px,
      transparent 10px,
      transparent 18px
    );
    border-radius: 17px 17px 0 0;
  }

  /* Queue badge */
  .queue-badge {
    position: absolute;
    top: 12px;
    right: 14px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: rgba(42, 36, 32, 0.15);
    color: var(--pop-border);
    border: 1.5px solid rgba(42, 36, 32, 0.25);
    border-radius: 999px;
    padding: 2px 9px;
    text-transform: uppercase;
  }

  /* Icon */
  .popup-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(42, 36, 32, 0.12);
    border: 2.5px solid var(--pop-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pop-accent);
    margin-bottom: 0.25rem;
    flex-shrink: 0;
    box-shadow: 3px 3px 0 var(--pop-border);
  }

  /* Label */
  .popup-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.15rem;
    color: var(--pop-border);
    margin: 0;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  /* Message */
  .popup-message {
    font-family: 'Lora', Georgia, serif;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--pop-border);
    margin: 0.15rem 0 0.75rem;
    opacity: 0.88;
    max-width: 300px;
  }

  /* OK button */
  .popup-ok {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: var(--pop-bg);
    background: var(--pop-border);
    border: 2.5px solid var(--pop-border);
    border-radius: 999px;
    padding: 10px 48px;
    cursor: pointer;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.25);
    transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease;
    min-width: 140px;
  }

  .popup-ok:hover {
    transform: translateY(-2px);
    box-shadow: 4px 5px 0 rgba(0, 0, 0, 0.3);
  }

  .popup-ok:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  }

  .popup-ok:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.7);
    outline-offset: 3px;
  }

  /* ── Responsive ── */
  @media (max-width: 440px) {
    .popup {
      max-width: 100%;
      border-radius: 16px;
      padding: 2rem 1.5rem 1.75rem;
      box-shadow:
        4px 4px 0px var(--pop-shadow),
        0 16px 32px rgba(42, 36, 32, 0.2);
    }

    .popup-ok {
      width: 100%;
      padding: 12px;
    }

    .popup-icon {
      width: 48px;
      height: 48px;
    }

    .popup-icon :global(svg) {
      width: 22px;
      height: 22px;
    }
  }
</style>
