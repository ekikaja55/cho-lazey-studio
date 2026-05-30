<script>
  let { next, prev, togglePause, isPaused } = $props();
</script>

<div class="controls-pill-wrapper">
  <button onclick={prev} aria-label="Previous artwork" class="ctrl-btn">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  </button>

  <div class="brutal-divider" aria-hidden="true"></div>

  <button 
    onclick={togglePause} 
    aria-label="Pause/Play" 
    class="ctrl-btn pause-btn" 
    class:is-active={isPaused}
  >
    {#if isPaused}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    {:else}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
      </svg>
    {/if}
  </button>

  <div class="brutal-divider" aria-hidden="true"></div>

  <button onclick={next} aria-label="Next artwork" class="ctrl-btn">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
</div>

<style>
  .controls-pill-wrapper {
    display: inline-flex;
    align-items: center;
    background: #ffffff;     
    border: 2.5px solid #2a2420;
    border-radius: 999px;     
    padding: 6px 12px;
    box-shadow: 4px 4px 0px #2a2420;
    gap: 6px;
    pointer-events: auto; 
    transition: transform 0.2s ease;
  }

  .brutal-divider {
    width: 2.5px;
    height: 20px;
    background: #2a2420;
    opacity: 0.25;
  }

  .ctrl-btn {
    background: transparent;
    border: none;
    color: #2a2420;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    
    transition: 
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), 
      background 0.2s ease,
      color 0.2s ease;
  }

  .ctrl-btn:hover {
    background: #eaddcd; 
    transform: translateY(-3px) scale(1.05);
  }

  .ctrl-btn.pause-btn.is-active {
    background: #f4a87c;     
    color: #2a2420;
  }
  
  .ctrl-btn.pause-btn.is-active:hover {
    background: #e59363;
  }

  .ctrl-btn:active {
    transform: translateY(1px) scale(0.95);
  }
</style>
