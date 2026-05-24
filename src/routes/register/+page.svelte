<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast.js';

  /* ── Form state ── */
  let username     = $state('');
  let email        = $state('');
  let password     = $state('');
  let passwordConf = $state('');
  let agreeTerms   = $state(false);
  let loading      = $state(false);
  let mounted      = $state(false);
  let showPass     = $state(false);
  let showPassConf = $state(false);

  /* Contact toggles */
  let hasLine      = $state(false);
  let hasPhone     = $state(false);
  let hasInstagram = $state(false);
  let lineId       = $state('');
  let phone        = $state('');
  let instagram    = $state('');

  /* Password strength */
  let pwStrength = $derived.by(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)                    s++;
    if (/[A-Z]/.test(password))                  s++;
    if (/[0-9]/.test(password))                  s++;
    if (/[^A-Za-z0-9]/.test(password))           s++;
    return s;
  });

  const strengthLabel = $derived(
    ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength]
  );
  const strengthColor = $derived(
    ['', '#f46958', '#ffba09', '#7dc8c1', '#a2e1a6'][pwStrength]
  );

  /* ── Session storage (auto-save) ── */
  const SS_KEY = 'cho_register_';

  function saveToSession() {
    if (typeof sessionStorage === 'undefined') return;
    const data = { username, email, agreeTerms, hasLine, hasPhone, hasInstagram, lineId, phone, instagram };
    sessionStorage.setItem(SS_KEY + 'data', JSON.stringify(data));
  }

  function loadFromSession() {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(SS_KEY + 'data');
      if (!raw) return;
      const d = JSON.parse(raw);
      username = d.username    ?? '';
      email    = d.email       ?? '';
      agreeTerms  = d.agreeTerms  ?? false;
      hasLine     = d.hasLine     ?? false;
      hasPhone    = d.hasPhone    ?? false;
      hasInstagram = d.hasInstagram ?? false;
      lineId   = d.lineId    ?? '';
      phone    = d.phone     ?? '';
      instagram = d.instagram ?? '';
    } catch {}
  }

  function clearSession() {
    if (typeof sessionStorage !== 'undefined')
      sessionStorage.removeItem(SS_KEY + 'data');
  }

  /* Watch for changes and auto-save */
  $effect(() => {
    username; email; agreeTerms;
    hasLine; hasPhone; hasInstagram;
    lineId; phone; instagram;
    saveToSession();
  });

  /* ── Mount ── */
  onMount(() => {
    mounted = true;
    loadFromSession();

    // Check ?accepted=1 from T&C redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('accepted') === '1') {
      agreeTerms = true;
    }
  });

  /* ── Submit ── */
  async function handleRegister(e) {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password || !passwordConf) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!agreeTerms) {
      toast.error('You must accept the Terms & Conditions.');
      return;
    }

    if (password !== passwordConf) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    const hasContact =
      (hasLine     && lineId.trim())    ||
      (hasPhone    && phone.trim())     ||
      (hasInstagram && instagram.trim());

    if (!hasContact) {
      toast.error('Please provide at least one contact method.');
      return;
    }

    loading = true;

    // Prototype: simulasi delay, tampil pesan, redirect ke login
    setTimeout(() => {
      clearSession();
      toast.success('[PROTOTYPE] Registration noted! In production your account would be created. Redirecting to login…');
      setTimeout(() => goto('/login'), 2500);
      loading = false;
    }, 600);
  }
</script>

<svelte:head>
  <title>Register — Cho's Studio</title>
</svelte:head>

<div class="auth-root">
  <!-- Decorative shapes -->
  <div class="deco-shapes" aria-hidden="true">
    <div class="deco deco-1"></div>
    <div class="deco deco-2"></div>
    <div class="deco deco-3"></div>
    <div class="deco deco-4"></div>
  </div>

  <div class="auth-card wide" class:visible={mounted}>

    <!-- Back button -->
    <a href="/home" class="back-btn" aria-label="Back to home">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      <span>Back to Home</span>
    </a>

    <!-- Header -->
    <div class="auth-header">
      <p class="auth-eyebrow">✦ join the studio ✦</p>
      <h1 class="auth-title">REGISTER</h1>
      <div class="auth-underline"></div>
    </div>

    <form onsubmit={handleRegister} novalidate id="registerForm">
      <div class="form-grid">

        <!-- ── Left: Basic Info ── -->
        <section class="form-section">
          <div class="section-header">
            <div class="section-dot" style="background:#a2e1db"></div>
            <h2 class="section-title">Basic Information</h2>
          </div>
          <p class="section-sub">Your account credentials</p>

          <div class="fields">
            <!-- Username -->
            <div class="field-wrap">
              <label for="username" class="field-label">Username</label>
              <div class="field-inner">
                <i class="fa-solid fa-user field-icon" aria-hidden="true"></i>
                <input id="username" type="text" name="username" placeholder="Choose a username"
                  autocomplete="username" bind:value={username} disabled={loading} class="field-input" />
              </div>
            </div>

            <!-- Email -->
            <div class="field-wrap">
              <label for="email" class="field-label">Email Address</label>
              <div class="field-inner">
                <i class="fa-solid fa-envelope field-icon" aria-hidden="true"></i>
                <input id="email" type="email" name="email" placeholder="your@email.com"
                  autocomplete="email" bind:value={email} disabled={loading} class="field-input" />
              </div>
            </div>

            <!-- Password -->
            <div class="field-wrap">
              <label for="password" class="field-label">Password</label>
              <div class="field-inner">
                <i class="fa-solid fa-lock field-icon" aria-hidden="true"></i>
                <input id="password" type={showPass ? 'text' : 'password'} name="password"
                  placeholder="Min. 8 characters" autocomplete="new-password"
                  bind:value={password} disabled={loading} class="field-input" />
                <button type="button" class="toggle-pass"
                  onclick={() => showPass = !showPass}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  <i class="fa-solid {showPass ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>
                </button>
              </div>
              <!-- Strength bar -->
              {#if password}
                <div class="strength-bar">
                  {#each [1,2,3,4] as n}
                    <div class="strength-seg" style="background: {n <= pwStrength ? strengthColor : 'rgba(42,36,32,0.1)'}"></div>
                  {/each}
                  <span class="strength-label" style="color:{strengthColor}">{strengthLabel}</span>
                </div>
              {/if}
            </div>

            <!-- Confirm Password -->
            <div class="field-wrap">
              <label for="password_confirmation" class="field-label">Confirm Password</label>
              <div class="field-inner">
                <i class="fa-solid fa-lock field-icon" aria-hidden="true"></i>
                <input id="password_confirmation" type={showPassConf ? 'text' : 'password'}
                  name="password_confirmation" placeholder="Repeat password"
                  autocomplete="new-password" bind:value={passwordConf}
                  disabled={loading} class="field-input"
                  class:mismatch={passwordConf && password !== passwordConf} />
                <button type="button" class="toggle-pass"
                  onclick={() => showPassConf = !showPassConf}
                  aria-label={showPassConf ? 'Hide password' : 'Show password'}>
                  <i class="fa-solid {showPassConf ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>
                </button>
              </div>
              {#if passwordConf && password !== passwordConf}
                <p class="field-error">Passwords don't match</p>
              {/if}
            </div>
          </div>
        </section>

        <!-- ── Right: Contact Info ── -->
        <section class="form-section">
          <div class="section-header">
            <div class="section-dot" style="background:#b4a6d5"></div>
            <h2 class="section-title">Contact Information</h2>
          </div>
          <p class="section-sub">Provide at least one contact method</p>

          <div class="fields">

            <!-- Line ID -->
            <div class="contact-block">
              <label class="contact-toggle" class:active={hasLine}>
                <input type="checkbox" bind:checked={hasLine} disabled={loading} />
                <span class="toggle-track">
                  <span class="toggle-thumb"></span>
                </span>
                <div class="contact-info">
                  <span class="contact-name">
                    <i class="fa-brands fa-line" aria-hidden="true"></i>
                    Line ID
                  </span>
                  <span class="contact-hint">LINE messaging app</span>
                </div>
              </label>
              {#if hasLine}
                <div class="contact-input-wrap" class:show={hasLine}>
                  <div class="field-inner">
                    <i class="fa-brands fa-line field-icon" aria-hidden="true"></i>
                    <input type="text" name="line_id" placeholder="Your Line ID"
                      bind:value={lineId} disabled={loading} class="field-input" />
                  </div>
                </div>
              {/if}
            </div>

            <!-- Phone -->
            <div class="contact-block">
              <label class="contact-toggle" class:active={hasPhone}>
                <input type="checkbox" bind:checked={hasPhone} disabled={loading} />
                <span class="toggle-track">
                  <span class="toggle-thumb"></span>
                </span>
                <div class="contact-info">
                  <span class="contact-name">
                    <i class="fa-solid fa-phone" aria-hidden="true"></i>
                    Phone Number
                  </span>
                  <span class="contact-hint">WhatsApp / SMS</span>
                </div>
              </label>
              {#if hasPhone}
                <div class="contact-input-wrap" class:show={hasPhone}>
                  <div class="field-inner">
                    <i class="fa-solid fa-phone field-icon" aria-hidden="true"></i>
                    <input type="tel" name="phone_number" placeholder="e.g. 08123456789"
                      bind:value={phone} disabled={loading} class="field-input" />
                  </div>
                </div>
              {/if}
            </div>

            <!-- Instagram -->
            <div class="contact-block">
              <label class="contact-toggle" class:active={hasInstagram}>
                <input type="checkbox" bind:checked={hasInstagram} disabled={loading} />
                <span class="toggle-track">
                  <span class="toggle-thumb"></span>
                </span>
                <div class="contact-info">
                  <span class="contact-name">
                    <i class="fa-brands fa-instagram" aria-hidden="true"></i>
                    Instagram
                  </span>
                  <span class="contact-hint">@handle</span>
                </div>
              </label>
              {#if hasInstagram}
                <div class="contact-input-wrap" class:show={hasInstagram}>
                  <div class="field-inner">
                    <i class="fa-brands fa-instagram field-icon" aria-hidden="true"></i>
                    <input type="text" name="instagram" placeholder="@yourusername"
                      bind:value={instagram} disabled={loading} class="field-input" />
                  </div>
                </div>
              {/if}
            </div>

          </div>
        </section>
      </div>

      <!-- Terms & Conditions -->
      <div class="terms-row">
        <label class="terms-label">
          <input type="checkbox" bind:checked={agreeTerms} disabled={loading} class="terms-check" />
          <span class="terms-box" class:checked={agreeTerms} aria-hidden="true">
            {#if agreeTerms}<i class="fa-solid fa-check" style="font-size:11px;"></i>{/if}
          </span>
          <span class="terms-text">
            I agree to the
            <a href="/terms" class="terms-link">Terms & Conditions</a>
          </span>
        </label>
      </div>

      <!-- Submit -->
      <div class="submit-row">
        <button type="submit" class="btn-submit" disabled={loading}>
          {#if loading}
            <span class="spinner" aria-hidden="true"></span>
            Creating account…
          {:else}
            Create Account
          {/if}
        </button>
      </div>
    </form>

    <!-- Switch to login -->
    <p class="auth-switch">
      Already have an account?
      <a href="/login" class="switch-link">Login here</a>
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

  /* ── Deco shapes ── */
  .deco-shapes { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .deco { position: absolute; border-radius: 12px; border: 2px solid rgba(42,36,32,0.14); animation: decoIn 0.9s ease both; }
  .deco-1 { width: 210px; height: 210px; background: #a2e1db; top: 1%;  left: -5%;  transform: rotate(-12deg); opacity: 0.45; }
  .deco-2 { width: 165px; height: 165px; background: #f4a87c; top: 6%;  right: -3%; transform: rotate(16deg);  opacity: 0.42; animation-delay: 0.2s; }
  .deco-3 { width: 140px; height: 140px; background: #b4a6d5; bottom: 5%; left: -3%; transform: rotate(-7deg);  opacity: 0.4;  animation-delay: 0.35s; }
  .deco-4 { width: 120px; height: 120px; background: #f4a87c; bottom: 3%; right: -2%; transform: rotate(22deg); opacity: 0.35; animation-delay: 0.5s; }

  @keyframes decoIn {
    from { opacity: 0; transform: scale(0.8); }
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
    padding: 2.75rem 2.75rem 2.25rem;
    width: 100%;
    max-width: 480px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }

  .auth-card.wide { max-width: 860px; }

  .auth-card.visible { opacity: 1; transform: translateY(0); }

  /* ── Back button ── */
  .back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 0.85rem;
    color: #2a2420; background: #a2e1db;
    border: 2px solid #2a2420; border-radius: 999px;
    padding: 6px 14px; text-decoration: none; margin-bottom: 1.5rem;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .back-btn:hover { background: #7dc8c1; transform: translateX(-3px); }

  /* ── Header ── */
  .auth-header { text-align: center; margin-bottom: 1.75rem; }
  .auth-eyebrow { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7dc8c1; margin: 0 0 0.6rem; font-weight: 500; }
  .auth-title { font-family: 'HammersmithOne', Georgia, serif; font-size: clamp(2rem, 5vw, 2.75rem); color: #2a2420; margin: 0; }
  .auth-underline { width: 40px; height: 3px; background: #7dc8c1; border-radius: 2px; margin: 0.8rem auto 0; }

  /* ── Form grid ── */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .form-section {}

  .section-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
  }

  .section-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #2a2420; flex-shrink: 0; }
  .section-title { font-family: 'HammersmithOne', Georgia, serif; font-size: 1rem; color: #2a2420; margin: 0; }
  .section-sub { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.78rem; color: #7a6f68; margin: 0 0 1rem; }

  .fields { display: flex; flex-direction: column; gap: 0.85rem; }

  /* ── Field ── */
  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.82rem; color: #4a3f3a; }
  .field-inner { position: relative; display: flex; align-items: center; }
  .field-icon { position: absolute; left: 14px; color: #477c77; font-size: 0.88rem; pointer-events: none; z-index: 1; }

  .field-input {
    width: 100%; background: #a2e1db;
    border: 2px solid transparent; border-radius: 14px;
    padding: 12px 44px 12px 40px;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 0.9rem; color: #2a2420;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
  }
  .field-input::placeholder { color: #477c77; }
  .field-input:focus { outline: none; border-color: #477c77; box-shadow: 0 0 0 3px rgba(125,200,193,0.3); }
  .field-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .field-input.mismatch { border-color: #f46958 !important; }

  .field-input:-webkit-autofill,
  .field-input:-webkit-autofill:hover,
  .field-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 100px #a2e1db inset !important;
    -webkit-text-fill-color: #2a2420 !important;
  }

  .toggle-pass { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: #477c77; padding: 4px; border-radius: 4px; transition: color 0.2s ease; font-size: 0.88rem; }
  .toggle-pass:hover { color: #2a2420; }

  .field-error { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.75rem; color: #f46958; margin: 0; }

  /* ── Password strength ── */
  .strength-bar { display: flex; align-items: center; gap: 4px; margin-top: 2px; }
  .strength-seg { flex: 1; height: 3px; border-radius: 2px; transition: background 0.3s ease; }
  .strength-label { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.72rem; font-weight: 600; min-width: 36px; transition: color 0.3s ease; }

  /* ── Contact toggles ── */
  .contact-block { display: flex; flex-direction: column; gap: 0; }

  .contact-toggle {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 12px; cursor: pointer;
    border: 2px solid transparent;
    transition: background 0.2s ease, border-color 0.2s ease;
    user-select: none;
  }
  .contact-toggle:hover { background: rgba(162,225,219,0.2); }
  .contact-toggle.active { background: rgba(162,225,219,0.25); border-color: rgba(125,200,193,0.5); }
  .contact-toggle input[type="checkbox"] { display: none; }

  .toggle-track {
    width: 36px; height: 20px; border-radius: 999px;
    background: rgba(42,36,32,0.15); border: 2px solid #2a2420;
    position: relative; flex-shrink: 0;
    transition: background 0.2s ease;
  }
  .contact-toggle.active .toggle-track { background: #7dc8c1; }

  .toggle-thumb {
    position: absolute; top: 1px; left: 1px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #2a2420;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .contact-toggle.active .toggle-thumb { transform: translateX(16px); }

  .contact-info { display: flex; flex-direction: column; gap: 1px; }
  .contact-name { font-family: 'HammersmithOne', Georgia, serif; font-size: 0.88rem; color: #2a2420; display: flex; align-items: center; gap: 6px; }
  .contact-hint { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.72rem; color: #7a6f68; }

  .contact-input-wrap {
    margin-top: 6px; padding: 0 4px;
    animation: slideDown 0.25s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Terms row ── */
  .terms-row { margin-bottom: 1.25rem; }

  .terms-label { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
  .terms-label input[type="checkbox"] { display: none; }

  .terms-box {
    width: 20px; height: 20px; border-radius: 6px;
    border: 2px solid #2a2420; background: transparent;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.2s ease;
    color: #2a2420;
  }
  .terms-box.checked { background: #a2e1db; }

  .terms-text { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.88rem; color: #4a3f3a; }
  .terms-link { color: #2a2420; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
  .terms-link:hover { color: #7dc8c1; }

  /* ── Submit row ── */
  .submit-row { display: flex; justify-content: center; }

  .btn-submit {
    width: 100%; max-width: 360px; padding: 14px;
    background: #b4a6d5; color: #2a2420;
    font-family: 'HammersmithOne', Georgia, serif; font-size: 1.05rem;
    border: 2.5px solid #2a2420; border-radius: 14px;
    box-shadow: 3px 3px 0px #2a2420; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-submit:hover:not(:disabled) { background: #9b8bc4; transform: translateY(-2px); box-shadow: 5px 5px 0px #2a2420; }
  .btn-submit:active:not(:disabled) { transform: translateY(1px); box-shadow: 1px 1px 0px #2a2420; }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

  /* Spinner */
  .spinner { width: 16px; height: 16px; border: 2.5px solid rgba(42,36,32,0.25); border-top-color: #2a2420; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Switch ── */
  .auth-switch { text-align: center; margin: 1rem 0 0; font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.9rem; color: #4a3f3a; }
  .switch-link { font-weight: 600; color: #2a2420; text-decoration: underline; text-underline-offset: 3px; }
  .switch-link:hover { color: #f4a87c; }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .form-grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .auth-card.wide { max-width: 520px; }
  }

  @media (max-width: 520px) {
    .auth-card { padding: 2rem 1.4rem 1.75rem; border-radius: 20px; box-shadow: 5px 5px 0px #2a2420; }
  }
</style>
