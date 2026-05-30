<script>
  import LoginForm from './LoginForm.svelte';
  import RegisterForm from './RegisterForm.svelte';
  import { onMount } from 'svelte';

  let isLogin = $state(true);
  let mounted = $state(false);

  onMount(() => { mounted = true; });

  function toggleAuth() { isLogin = !isLogin; }
</script>

<div class="auth-root">
  <div class="deco-shapes" aria-hidden="true">
    <div class="deco deco-1"></div>
    <div class="deco deco-2"></div>
    <div class="deco deco-3"></div>
    <div class="deco deco-4"></div>
  </div>

  <div class="auth-wrapper" class:visible={mounted} class:is-register={!isLogin}>

    <div class="slider-panel">
      <img src="/gallery/5.jpg" alt="Login Art" class="slider-img img-login" />
      <img src="/gallery/10.jpg" alt="Register Art" class="slider-img img-register" />
      <div class="slider-overlay"></div>
    </div>

    <div class="form-side register-side">
      <RegisterForm onSwitch={toggleAuth} />
    </div>

    <div class="form-side login-side">
      <LoginForm onSwitch={toggleAuth} />
    </div>

  </div>
</div>

<style>
  .auth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .deco-shapes { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .deco { position: absolute; border-radius: 12px; border: 2px solid rgba(42,36,32,0.14); animation: decoIn 0.9s ease both; }
  .deco-1 { width: 210px; height: 210px; background: #a2e1db; top:  1%; left:  -5%; transform: rotate(-12deg); opacity: 0.45; }
  .deco-2 { width: 165px; height: 165px; background: #f4a87c; top:  6%; right: -3%; transform: rotate(16deg);  opacity: 0.42; animation-delay: 0.2s; }
  .deco-3 { width: 140px; height: 140px; background: #b4a6d5; bottom: 5%; left:  -3%; transform: rotate(-7deg);  opacity: 0.4;  animation-delay: 0.35s; }
  .deco-4 { width: 120px; height: 120px; background: #f4a87c; bottom: 3%; right: -2%; transform: rotate(22deg); opacity: 0.35; animation-delay: 0.5s; }
  @keyframes decoIn { from { opacity: 0; transform: scale(0.8); } to { opacity: inherit; } }

  .auth-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1100px;

   height: clamp(680px, 88vh, 860px);

    background: rgba(240,235,227,0.94);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 7px 7px 0px #2a2420;
    overflow: hidden; /* ✅ tetap hidden, card tetap rapi */
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.45s ease, transform 0.45s ease;
    animation: none;
  }
  .auth-wrapper.visible { 
    opacity: 1; 
    transition:
    opacity   0.55s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
   }

  .slider-panel {
    position: absolute;
    top: 0; left: 0;
    width: 50%;
    height: 100%;
    z-index: 10;
    overflow: hidden;
    transition: transform 0.65s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 0 0 3px #2a2420;
  }
  .is-register .slider-panel { transform: translateX(100%); }

  .slider-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.6s ease; }
  .img-login   { opacity: 1; }
  .img-register{ opacity: 0; }
  .is-register .img-login   { opacity: 0; }
  .is-register .img-register{ opacity: 1; }
  .slider-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(42,36,32,0.1), rgba(42,36,32,0.3)); }

  .form-side {
    position: absolute;
    top: 0;
    width: 50%;

   height: 100%;
    overflow-y: auto;

    padding: 2.5rem;
    transition: opacity 0.5s ease, transform 0.5s ease;
    scrollbar-width: thin;
    scrollbar-color: rgba(42,36,32,0.2) transparent;
  }
  .form-side::-webkit-scrollbar { width: 4px; }
  .form-side::-webkit-scrollbar-thumb { background: rgba(42,36,32,0.18); border-radius: 4px; }

  .login-side    { left: 50%; opacity: 1; z-index: 2; }
  .register-side { left: 0;   opacity: 0; z-index: 1; pointer-events: none; transform: translateX(-12px); }
  .is-register .login-side    { opacity: 0; z-index: 1; pointer-events: none; transform: translateX(12px); }
  .is-register .register-side { opacity: 1; z-index: 2; pointer-events: auto; transform: translateX(0); }

  @media (max-width: 900px) {
    .auth-wrapper {
      display: flex;
      flex-direction: column;
      height: auto;     
    }
    .slider-panel {
      position: relative;
      width: 100%;
      height: 200px;
      transform: none !important;
      border-bottom: 3px solid #2a2420;
      box-shadow: none;
    }
    .form-side {
      position: relative;
      width: 100%;
      height: auto;         
      overflow-y: visible;
      left: 0 !important;
      padding: 1.75rem 1.5rem;
      transform: none !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    .login-side    { display: block; }
    .register-side { display: none; }
    .is-register .login-side    { display: none; }
    .is-register .register-side { display: block; }
  }

  @media (max-width: 480px) {
    .auth-root { padding: 1rem 0.75rem; }
    .auth-wrapper { border-radius: 20px; box-shadow: 4px 4px 0px #2a2420; }
    .slider-panel { height: 160px; }
    .form-side { padding: 1.5rem 1.25rem; }
  }
</style>
