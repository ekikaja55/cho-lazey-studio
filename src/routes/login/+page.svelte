<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast.js';
  import { auth } from '$lib/stores/auth.js';
  import { authenticate } from '$lib/data/mockUsers.js';

  let username = $state('');
  let password = $state('');
  let loading  = $state(false);
  let showPass = $state(false);
  let mounted  = $state(false);

  onMount(() => { mounted = true; });

  function handleLogin(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in both username and password.');
      return;
    }

    loading = true;

    // Simulate a tiny delay so it feels like a real request
    setTimeout(() => {
      const user = authenticate(username, password);

      if (user) {
        auth.login(user);
        toast.success(`[PROTOTYPE]Welcome back, ${user.display_name}! `);

        setTimeout(() => goto(`/dashboard/${user.role}`), 700);
      } else {
        toast.error('Invalid username or password.');
      }

      loading = false;
    }, 500);
  }
</script>

<svelte:head>
  <title>Login — Cho's Studio</title>
</svelte:head>

<div class="auth-root">
  <!-- Decorative shapes -->
  <div class="deco-shapes" aria-hidden="true">
    <div class="deco deco-1"></div>
    <div class="deco deco-2"></div>
    <div class="deco deco-3"></div>
  </div>

  <div class="auth-card" class:visible={mounted}>

    <!-- Back button -->
    <a href="/home" class="back-btn" aria-label="Back to home">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      <span>Back to Home</span>
    </a>

    <!-- Header -->
    <div class="auth-header">
      <p class="auth-eyebrow">✦ welcome back ✦</p>
      <h1 class="auth-title">LOGIN</h1>
      <div class="auth-underline"></div>
    </div>

    <!-- Form -->
    <form class="auth-form" onsubmit={handleLogin} novalidate>

      <!-- Username -->
      <div class="field-wrap">
        <label for="username" class="field-label">Username</label>
        <div class="field-inner">
          <i class="fa-solid fa-user field-icon" aria-hidden="true"></i>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your username"
            autocomplete="username"
            bind:value={username}
            disabled={loading}
            class="field-input"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="field-wrap">
        <label for="password" class="field-label">Password</label>
        <div class="field-inner">
          <i class="fa-solid fa-lock field-icon" aria-hidden="true"></i>
          <input
            id="password"
            type={showPass ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            bind:value={password}
            disabled={loading}
            class="field-input"
          />
          <button
            type="button"
            class="toggle-pass"
            onclick={() => showPass = !showPass}
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            <i class="fa-solid {showPass ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn-submit" disabled={loading}>
        {#if loading}
          <span class="spinner" aria-hidden="true"></span>
          Logging in…
        {:else}
          Login
        {/if}
      </button>
    </form>

    <!-- Switch to register -->
    <p class="auth-switch">
      Don't have an account?
      <a href="/register" class="switch-link">Register here</a>
    </p>

  </div>
</div>

<style>
  /* ── Root ── */
  .auth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* ── Decorative shapes ── */
  .deco-shapes { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

  .deco {
    position: absolute;
    border-radius: 12px;
    border: 2px solid rgba(42, 36, 32, 0.14);
    animation: decoIn 0.9s ease both;
  }

  .deco-1 { width: 200px; height: 200px; background: #a2e1db; top: 2%;  left: -5%;  transform: rotate(-14deg); opacity: 0.5; }
  .deco-2 { width: 170px; height: 170px; background: #f4a87c; bottom: 4%; right: -4%; transform: rotate(18deg);  opacity: 0.45; animation-delay: 0.2s; }
  .deco-3 { width: 130px; height: 130px; background: #b4a6d5; top: 35%; right: -3%; transform: rotate(-8deg);  opacity: 0.4;  animation-delay: 0.35s; }

  @keyframes decoIn {
    from { opacity: 0; transform: scale(0.8) rotate(var(--r, 0deg)); }
    to   { opacity: inherit; }
  }

  /* ── Auth card ── */
  .auth-card {
    position: relative;
    z-index: 1;
    background: rgba(240, 235, 227, 0.94);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 3px solid #2a2420;
    border-radius: 28px;
    box-shadow: 7px 7px 0px #2a2420;
    padding: 3rem 2.75rem;
    width: 100%;
    max-width: 460px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }

  .auth-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Back button ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.85rem;
    color: #2a2420;
    background: #a2e1db;
    border: 2px solid #2a2420;
    border-radius: 999px;
    padding: 6px 14px;
    text-decoration: none;
    margin-bottom: 1.5rem;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .back-btn:hover {
    background: #7dc8c1;
    transform: translateX(-3px);
  }

  /* ── Header ── */
  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .auth-eyebrow {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7dc8c1;
    margin: 0 0 0.6rem;
    font-weight: 500;
  }

  .auth-title {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: clamp(2.2rem, 6vw, 3rem);
    color: #2a2420;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .auth-underline {
    width: 40px;
    height: 3px;
    background: #7dc8c1;
    border-radius: 2px;
    margin: 0.8rem auto 0;
  }

  /* ── Form fields ── */
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.85rem;
    color: #4a3f3a;
    letter-spacing: 0.03em;
  }

  .field-inner {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field-icon {
    position: absolute;
    left: 14px;
    color: #477c77;
    font-size: 0.9rem;
    pointer-events: none;
    z-index: 1;
  }

  .field-input {
    width: 100%;
    background: #a2e1db;
    border: 2px solid transparent;
    border-radius: 14px;
    padding: 14px 48px 14px 42px;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.95rem;
    color: #2a2420;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
  }

  .field-input::placeholder { color: #477c77; }

  .field-input:focus {
    outline: none;
    border-color: #477c77;
    box-shadow: 0 0 0 4px rgba(125, 200, 193, 0.3);
  }

  .field-input:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Autofill fix */
  .field-input:-webkit-autofill,
  .field-input:-webkit-autofill:hover,
  .field-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px #a2e1db inset !important;
    -webkit-text-fill-color: #2a2420 !important;
  }

  /* Toggle password button */
  .toggle-pass {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: #477c77;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
    font-size: 0.9rem;
  }

  .toggle-pass:hover { color: #2a2420; }

  /* ── Submit button ── */
  .btn-submit {
    width: 100%;
    padding: 14px;
    margin-top: 0.5rem;
    background: #b4a6d5;
    color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 1.1rem;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2a2420;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .btn-submit:hover:not(:disabled) {
    background: #9b8bc4;
    transform: translateY(-2px);
    box-shadow: 5px 5px 0px #2a2420;
  }

  .btn-submit:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 1px 1px 0px #2a2420;
  }

  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

  /* Spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid rgba(42, 36, 32, 0.25);
    border-top-color: #2a2420;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Switch link ── */
  .auth-switch {
    text-align: center;
    margin: 1.25rem 0 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.9rem;
    color: #4a3f3a;
  }

  .switch-link {
    font-weight: 600;
    color: #2a2420;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.2s ease;
  }

  .switch-link:hover { color: #f4a87c; }

  /* ── Responsive ── */
  @media (max-width: 520px) {
    .auth-card {
      padding: 2.25rem 1.5rem;
      border-radius: 20px;
      box-shadow: 5px 5px 0px #2a2420;
    }
  }
</style>
