<script>
  import { onMount } from 'svelte';

  let { loginLink, getStartedText, isLoggedIn } = $props();

  let mounted = $state(false);
  let btnsVis = $state(false);

  let displayText = $state('');
  let isDeleting = $state(false);
  let phraseIndex = $state(0);
  let cursorVisible = $state(true);

  const phrases = [
    'crafting unique character arts...',
    'bringing your imagination to life...',
    'open for exciting commissions...',
    "welcome to CHO'S STUDIO ✦"
  ];

  onMount(() => {
    mounted = true;
    setTimeout(() => { btnsVis = true; }, 400);

    let timeout;

    function type() {
      const current = phrases[phraseIndex % phrases.length];

      if (!isDeleting) {
        displayText = current.slice(0, displayText.length + 1);
        if (displayText === current) {
          timeout = setTimeout(() => { isDeleting = true; type(); }, 3000);
          return;
        }
      } else {
        displayText = current.slice(0, displayText.length - 1);
        if (displayText === '') {
          isDeleting = false;
          phraseIndex++;
        }
      }

      const speed = isDeleting ? 50 : 120;
      timeout = setTimeout(type, speed);
    }

    setTimeout(type, 800);

    const cursorTimer = setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 530);

    return () => {
      clearTimeout(timeout);
      clearInterval(cursorTimer);
    };
  });
</script>

<div class="hero-card" class:visible={mounted}>

  <div class="title-block">
    <h1 class="studio-typewriter">
      {displayText}<span class="tw-cursor" class:blink={cursorVisible}>|</span>
    </h1>
    <div class="title-underline"></div>
  </div>

  <div class="cta-block" class:visible={btnsVis}>
    <a href={loginLink} class="btn-letsgo">
      <span>{getStartedText}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </a>
  </div>

</div>

<style>
  .hero-card {
    position: relative;
    background: #ffffff;
    border: 2px solid #2a2420;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2a2420;
    
    padding: 1.75rem 2.5rem; 
    height: auto; 
    
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
    margin: 0 auto;
  }

  .hero-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .title-block {
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    justify-content: center;
    width: 100%;
  } 

 .studio-typewriter {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(1.6rem, 4vw, 2.8rem); 
    line-height: 1.2;
    color: #2a2420;
    margin: 0;
    letter-spacing: -0.02em;
    white-space: nowrap;   
    } 

  .tw-cursor {
    display: inline-block;
    font-weight: 300;
    color: #f4a87c;
    opacity: 0;
    margin-left: 6px;
    transition: opacity 0.1s;
  }

  .tw-cursor.blink {
    opacity: 1;
  }

  .title-underline {
    width: 120px;
    height: 6px;
    background: #2a2420;
    border-radius: 3px;
    margin-top: 0.75rem;
    margin-left: 0; 
  }

  .cta-block {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    display: flex;
    justify-content: flex-end; 
    width: 100%;
  }

  .cta-block.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-letsgo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.8rem 2rem; 
    background: #f4a87c;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.3rem; 
    border: 3px solid #2a2420;
    border-radius: 999px;
    box-shadow: 4px 4px 0px #2a2420;
    text-decoration: none;
    transition:
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.25s ease;
  }

  .btn-letsgo:hover {
    transform: translateY(-3px) rotate(2deg) scale(1.04);
    box-shadow: 6px 6px 0px #2a2420;
  }

  .btn-letsgo:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 2px 2px 0px #2a2420;
  }

  @media (max-width: 640px) {
    .hero-card {
      padding: 1.5rem 1.25rem;
      border-radius: 20px;
      box-shadow: 5px 5px 0px #2a2420;
    }

    .studio-typewriter {
      white-space: nowrap;
      font-size: clamp(1.1rem, 5.3vw, 2.2rem);
    }

    .title-underline {
      width: 80px;
      height: 5px;
    }

    .cta-block {
      justify-content: flex-start;
    }

    .btn-letsgo {
      font-size: 0.95rem;
      padding: 0.6rem 1.4rem;
      border-width: 2.5px;
      box-shadow: 3px 3px 0px #2a2420;
    }
  }
</style>
