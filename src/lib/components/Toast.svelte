<script>
  import { toast } from '$lib/stores/toast.js';
  import { scale, fade } from 'svelte/transition';
  import { backOut } from 'svelte/easing';

  const current = $derived($toast[0] ?? null);

  const config = {
    success: {
      bg:      '#a2e1a6',
      border:  '#111111',      
      accent:  '#0d5914',
      shadow:  '#111111',
      label:   'Success',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    },
    error: {
      bg:      '#ff5e5e',
      border:  '#111111',
      accent:  '#ffffff',
      shadow:  '#111111',
      label:   'Error',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    },
    warning: {
      bg:      '#ffc900',
      border:  '#111111',
      accent:  '#111111',
      shadow:  '#111111',
      label:   'Warning',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    },
    info: {
      bg:      '#66e8ff',
      border:  '#111111',
      accent:  '#111111',
      shadow:  '#111111',
      label:   'Info',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>`,
    },
    neutral: {
      bg:      '#cdb4f3',
      border:  '#111111',
      accent:  '#111111',
      shadow:  '#111111',
      label:   'Notice',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    },
    contact: {
      bg:      '#ccff00',  
      border:  '#111111',
      accent:  '#111111',
      shadow:  '#111111',
      label:   'PAYMENT SUCCESS',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2z"></path><line x1="16" y1="8" x2="8" y2="8"></line><line x1="16" y1="12" x2="8" y2="12"></line><line x1="10" y1="16" x2="8" y2="16"></line></svg>`,
    }
  };

  function dismiss() {
    if (current) toast.remove(current.id);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' && current) dismiss();
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if current}
  <div class="backdrop" transition:fade={{ duration: 200 }} onclick={dismiss} role="presentation" aria-hidden="true"></div>

  {@const c = config[current.type]}
  <div class="popup-wrap" role="alertdialog" aria-modal="true" transition:scale={{ duration: 320, easing: backOut, start: 0.85 }}>
    <div class="popup" style="--pop-bg: {c.bg}; --pop-border: {c.border}; --pop-accent: {c.accent}; --pop-shadow: {c.shadow};">
      
      <div class="popup-stripe"></div>

      {#if $toast.length > 1}
        <div class="queue-badge" aria-label="{$toast.length - 1} more notification(s) waiting">
          +{$toast.length - 1} MORE
        </div>
      {/if}

      <div class="popup-icon" aria-hidden="true">
        {@html c.icon}
      </div>

      <p class="popup-label" id="popup-label">{c.label}</p>

      <p class="popup-message" id="popup-msg">{current.message}</p>

      <div class="popup-actions">
        {#if current.type === 'contact'}
          <button class="popup-btn secondary" onclick={dismiss}>
            Close
          </button>
          <a href="mailto:artist@domain.com" class="popup-btn primary" onclick={dismiss}>
            Contact Artist
          </a>
        {:else}
          <button class="popup-btn primary" onclick={dismiss}>
            OK
          </button>
        {/if}
      </div>

    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(17, 17, 17, 0.6); 
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 9998;
    cursor: pointer;
  }

  .popup-wrap {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    pointer-events: none;
  }

  .popup {
    position: relative;
    pointer-events: all;
    background: var(--pop-bg);
    border: 3.5px solid var(--pop-border);
    border-radius: 20px;
    box-shadow:
      8px 8px 0px var(--pop-shadow), 
      0 24px 48px rgba(0, 0, 0, 0.3);
    padding: 2.5rem 2rem 2rem;     
    width: 100%;
    max-width: 400px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem; 
    text-align: center;
    overflow: hidden;
  }

  .popup-stripe {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 6px;
    background: repeating-linear-gradient(
      90deg,
      var(--pop-border) 0px,
      var(--pop-border) 12px,
      transparent 12px,
      transparent 22px
    );
    border-radius: 16px 16px 0 0;
  }

  .queue-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    font-family: 'HammersmithOne', system-ui, sans-serif;
    font-size: 0.75rem;
    color: var(--pop-bg);
    background: var(--pop-border);    
    border-radius: 999px;
    padding: 4px 12px;
  }

  .popup-icon {
    width: 60px; 
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5); 
    border: 3px solid var(--pop-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pop-accent);
    margin-bottom: 0.25rem;
    flex-shrink: 0;
    box-shadow: 4px 4px 0 var(--pop-border);
  }

  .popup-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.3rem; 
    color: var(--pop-border);
    margin: 0;
    letter-spacing: 0.05em; 
    text-transform: uppercase;
  }

  .popup-message {
    font-family: 'DM Sans', 'Lora', sans-serif; 
    font-size: 1.05rem; 
    font-weight: 500; 
    line-height: 1.5;
    color: var(--pop-border);
    margin: 0 0 0.5rem;
    opacity: 1; 
    max-width: 320px;
  }

  .popup-actions {
    display: flex;
    gap: 1rem;     
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .popup-btn {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.05rem;    
    letter-spacing: 0.08em;
    border-radius: 999px;
    padding: 12px 24px; 
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 3px solid var(--pop-border);
    box-shadow: 4px 4px 0 var(--pop-shadow);
    transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease;
    min-width: 120px;
  }

  .popup-btn:hover {
    transform: translateY(-3px);
    box-shadow: 6px 7px 0 var(--pop-shadow);
  }

  .popup-btn:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 0 var(--pop-shadow);
  }

  .popup-btn:focus-visible {
    outline: 3px solid var(--pop-border);
    outline-offset: 4px;
  }

  .popup-btn.primary {
    color: var(--pop-bg);
    background: var(--pop-border);
    flex: 1;
  }

  .popup-btn.secondary {
    color: var(--pop-border);
    background: rgba(255, 255, 255, 0.4);
    }

  @media (max-width: 440px) {
    .popup {
      max-width: 100%;
      border-radius: 16px;
      padding: 2.25rem 1.5rem 1.75rem;
      box-shadow:
        5px 5px 0px var(--pop-shadow),
        0 16px 32px rgba(0, 0, 0, 0.25);
    }

    .popup-actions {
      flex-direction: column-reverse;
      gap: 0.75rem;
    }

    .popup-btn {
      width: 100%;
    }
  }
</style>
