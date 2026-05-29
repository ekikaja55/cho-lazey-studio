<script>
  import { toast } from '$lib/stores/toast.js';

  let { onSwitch } = $props();

  let username = $state('');
  let password = $state('');
  let loading  = $state(false);
  let showPass = $state(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) { toast.error('Please fill in all fields.'); return; }
    loading = true;
    setTimeout(() => {
      toast.success('[PROTOTYPE] Login successful!');
      loading = false;
    }, 800);
  }
</script>

<div class="inner-form">

  <a href="/home" class="back-btn">
    <i class="fa-solid fa-arrow-left"></i> Back to Home
  </a>

  <div class="auth-header">
    <p class="auth-eyebrow">✦ welcome back ✦</p>
    <h1 class="auth-title">LOGIN</h1>
    <div class="auth-underline"></div>
  </div>

  <form class="auth-form" onsubmit={handleLogin} novalidate>
    <div class="field-wrap">
      <label for="login-user" class="field-label">Username</label>
      <div class="field-inner">
        <i class="fa-solid fa-user field-icon" aria-hidden="true"></i>
        <input id="login-user" type="text" placeholder="Enter your username" bind:value={username} disabled={loading} class="field-input" />
      </div>
    </div>

    <div class="field-wrap">
      <label for="login-pass" class="field-label">Password</label>
      <div class="field-inner">
        <i class="fa-solid fa-lock field-icon" aria-hidden="true"></i>
        <input id="login-pass" type={showPass ? 'text' : 'password'} placeholder="Enter your password" bind:value={password} disabled={loading} class="field-input" />
        <button type="button" class="toggle-pass" onclick={() => showPass = !showPass} aria-label="Toggle password visibility">
          <i class="fa-solid {showPass ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <button type="submit" class="btn-submit" disabled={loading}>
      {#if loading}
        <span class="spinner" aria-hidden="true"></span> Logging in…
      {:else}
        <i class="fa-solid fa-right-to-bracket"></i> Login
      {/if}
    </button>
  </form>

  <!-- ③ Switch ke Register — prominent pill card -->
  <div class="auth-switch-wrap">
    <p class="auth-switch-text">Don't have an account?</p>
    <button type="button" class="switch-btn" onclick={onSwitch}>
      <i class="fa-solid fa-user-plus"></i> Register here
    </button>
  </div>

</div>

<style>
  .inner-form { width: 100%; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; }

  .back-btn { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'HammersmithOne', Georgia, serif; font-size: 0.8rem; color: #2a2420; background: #a2e1db; border: 2px solid #2a2420; border-radius: 999px; padding: 5px 14px; text-decoration: none; margin-bottom: 1.25rem; transition: background 0.2s, transform 0.2s; box-shadow: 2px 2px 0 #2a2420; }
  .back-btn:hover { background: #7dc8c1; transform: translateX(-3px); }

  .auth-header { text-align: center; margin-bottom: 2rem; }
  .auth-eyebrow { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7dc8c1; margin: 0 0 0.5rem; font-weight: 500; }
  .auth-title { font-family: 'HammersmithOne', Georgia, serif; font-size: clamp(1.9rem, 4vw, 2.6rem); color: #2a2420; margin: 0; }
  .auth-underline { width: 40px; height: 3px; background: #7dc8c1; border-radius: 2px; margin: 0.7rem auto 0; }

  .auth-form { display: flex; flex-direction: column; gap: 1rem; }
  .field-wrap { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.82rem; color: #4a3f3a; }
  .field-inner { position: relative; display: flex; align-items: center; }
  .field-icon { position: absolute; left: 14px; color: #477c77; font-size: 0.9rem; z-index: 1; }
  .field-input { width: 100%; background: #a2e1db; border: 2px solid transparent; border-radius: 14px; padding: 14px 48px 14px 42px; font-family: 'HammersmithOne', Georgia, serif; font-size: 0.95rem; color: #2a2420; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }
  .field-input::placeholder { color: #477c77; opacity: 0.8; }
  .field-input:focus { outline: none; border-color: #477c77; box-shadow: 0 0 0 4px rgba(125,200,193,0.25); }
  .toggle-pass { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: #477c77; padding: 4px; font-size: 0.9rem; }

  .btn-submit { width: 100%; padding: 14px; margin-top: 0.5rem; background: #b4a6d5; color: #2a2420; font-family: 'HammersmithOne', Georgia, serif; font-size: 1.05rem; border: 2.5px solid #2a2420; border-radius: 14px; box-shadow: 3px 3px 0px #2a2420; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, transform 0.15s, box-shadow 0.15s; }
  .btn-submit:hover:not(:disabled) { background: #9b8bc4; transform: translateY(-2px); box-shadow: 5px 5px 0px #2a2420; }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ③ Switch card */
  .auth-switch-wrap { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 1.25rem; padding: 10px 16px; background: rgba(42,36,32,0.05); border: 1.5px solid rgba(42,36,32,0.12); border-radius: 14px; flex-wrap: wrap; }
  .auth-switch-text { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.87rem; color: #4a3f3a; margin: 0; }
  .switch-btn { display: inline-flex; align-items: center; gap: 6px; background: #2a2420; color: #f0ebe3; border: none; border-radius: 999px; padding: 6px 16px; font-family: 'HammersmithOne', serif; font-size: 0.85rem; cursor: pointer; transition: background 0.2s, transform 0.15s; }
  .switch-btn:hover { background: #477c77; transform: translateY(-1px); }

  .spinner { width: 16px; height: 16px; border: 2.5px solid rgba(42,36,32,0.2); border-top-color: #2a2420; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
