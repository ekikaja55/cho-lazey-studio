<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from '$lib/stores/toast.js';

  let { onSwitch } = $props();

  let username = $state(''); let email = $state(''); let password = $state(''); let passwordConf = $state('');
  let agreeTerms = $state(false); let loading = $state(false); let showPass = $state(false); let showPassConf = $state(false);
  let hasLine = $state(false); let hasPhone = $state(false); let hasInstagram = $state(false);
  let lineId = $state(''); let phone = $state(''); let instagram = $state('');

  let pwStrength = $derived.by(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  });

  const strengthLabel = $derived(['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength]);
  const strengthColor = $derived(['', '#f46958', '#ffba09', '#7dc8c1', '#a2e1a6'][pwStrength]);

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
      username     = d.username     ?? '';
      email        = d.email        ?? '';
      agreeTerms   = d.agreeTerms   ?? false;
      hasLine      = d.hasLine      ?? false;
      hasPhone     = d.hasPhone     ?? false;
      hasInstagram = d.hasInstagram ?? false;
      lineId       = d.lineId       ?? '';
      phone        = d.phone        ?? '';
      instagram    = d.instagram    ?? '';
    } catch {}
  }

  function clearSession() {
    if (typeof sessionStorage !== 'undefined')
      sessionStorage.removeItem(SS_KEY + 'data');
  }

  $effect(() => {
    username; email; agreeTerms; hasLine; hasPhone; hasInstagram; lineId; phone; instagram;
    saveToSession();
  });

  onMount(() => {
    loadFromSession();
    const params = new URLSearchParams(window.location.search);
    if (params.get('accepted') === '1') agreeTerms = true;
  });

  async function handleRegister(e) {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password || !passwordConf) { toast.error('Please fill in all required fields.'); return; }
    if (!agreeTerms) { toast.error('You must accept the Terms & Conditions.'); return; }
    if (password !== passwordConf) { toast.error('Passwords do not match.'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    if (!hasLine && !hasPhone && !hasInstagram) { toast.error('Please provide at least one contact method.'); return; }

    loading = true;
    setTimeout(() => {
      clearSession();
      toast.success('[PROTOTYPE] Registration noted! Switching to login...');
      setTimeout(() => {
        onSwitch();
        loading = false;
      }, 1500);
    }, 600);
  }
</script>

<div class="inner-form">

  <a href="/home" class="back-btn">
    <i class="fa-solid fa-arrow-left"></i> Back to Home
  </a>

  <div class="auth-header">
    <p class="auth-eyebrow">✦ join the studio ✦</p>
    <h1 class="auth-title">REGISTER</h1>
    <div class="auth-underline"></div>
  </div>

  <form onsubmit={handleRegister} novalidate id="registerForm">
    <div class="form-stack">
      <section class="form-section">
        <div class="section-header">
          <div class="section-dot" style="background:#a2e1db"></div>
          <h2 class="section-title">Basic Information</h2>
        </div>
        <div class="fields">
          <div class="field-wrap">
            <label for="reg-user" class="field-label">Username</label>
            <div class="field-inner">
              <i class="fa-solid fa-user field-icon"></i>
              <input id="reg-user" type="text" placeholder="Choose a username" bind:value={username} class="field-input" disabled={loading} />
            </div>
          </div>

          <div class="field-wrap">
            <label for="reg-email" class="field-label">Email Address</label>
            <div class="field-inner">
              <i class="fa-solid fa-envelope field-icon"></i>
              <input id="reg-email" type="email" placeholder="your@email.com" bind:value={email} class="field-input" disabled={loading} />
            </div>
          </div>

          <div class="field-wrap">
            <label for="reg-pass" class="field-label">Password</label>
            <div class="field-inner">
              <i class="fa-solid fa-lock field-icon"></i>
              <input id="reg-pass" type={showPass ? 'text' : 'password'} placeholder="Min. 8 chars" bind:value={password} class="field-input" disabled={loading} />
              <button type="button" class="toggle-pass" onclick={() => showPass = !showPass} aria-label="Toggle password visibility">
                <i class="fa-solid {showPass ? 'fa-eye-slash' : 'fa-eye'}"></i>
              </button>
            </div>
            {#if password}
              <div class="strength-wrap">
                <div class="strength-bar">
                  {#each [1,2,3,4] as n}
                    <div class="strength-seg" style="background: {n <= pwStrength ? strengthColor : 'rgba(42,36,32,0.12)'}"></div>
                  {/each}
                </div>
                <span class="strength-label" style="color:{strengthColor}">{strengthLabel}</span>
              </div>
            {/if}
          </div>

          <div class="field-wrap">
            <label for="reg-conf" class="field-label">Confirm Password</label>
            <div class="field-inner">
              <i class="fa-solid fa-lock field-icon"></i>
              <input id="reg-conf" type={showPassConf ? 'text' : 'password'} placeholder="Repeat password" bind:value={passwordConf} class="field-input" disabled={loading} />
              <button type="button" class="toggle-pass" onclick={() => showPassConf = !showPassConf} aria-label="Toggle confirm password visibility">
                <i class="fa-solid {showPassConf ? 'fa-eye-slash' : 'fa-eye'}"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-header">
          <div class="section-dot" style="background:#b4a6d5"></div>
          <h2 class="section-title">Contact Method</h2>
          <span class="section-hint">at least one required</span>
        </div>
        <div class="fields contact-fields">

          <div class="contact-block">
            <label class="contact-toggle" class:active={hasLine}>
              <input type="checkbox" bind:checked={hasLine} disabled={loading} />
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <span class="contact-name"><i class="fa-brands fa-line"></i> Line ID</span>
            </label>
            {#if hasLine}
              <div class="contact-input-wrap" style="--accent:#06c755">
                <div class="field-inner">
                  <i class="fa-brands fa-line field-icon" style="color:#06c755"></i>
                  <input type="text" placeholder="Your Line ID" bind:value={lineId} class="field-input contact-field-input" disabled={loading} />
                </div>
              </div>
            {/if}
          </div>

          <div class="contact-block">
            <label class="contact-toggle" class:active={hasPhone}>
              <input type="checkbox" bind:checked={hasPhone} disabled={loading} />
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <span class="contact-name"><i class="fa-solid fa-phone"></i> Phone Number</span>
            </label>
            {#if hasPhone}
              <div class="contact-input-wrap" style="--accent:#477c77">
                <div class="field-inner">
                  <i class="fa-solid fa-phone field-icon" style="color:#477c77"></i>
                  <input type="tel" placeholder="+62 8xx xxxx xxxx" bind:value={phone} class="field-input contact-field-input" disabled={loading} />
                </div>
              </div>
            {/if}
          </div>

          <div class="contact-block">
            <label class="contact-toggle" class:active={hasInstagram}>
              <input type="checkbox" bind:checked={hasInstagram} disabled={loading} />
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
              <span class="contact-name"><i class="fa-brands fa-instagram"></i> Instagram</span>
            </label>
            {#if hasInstagram}
              <div class="contact-input-wrap" style="--accent:#c13584">
                <div class="field-inner">
                  <span class="field-icon at-sign" style="color:#c13584">@</span>
                  <input type="text" placeholder="your_handle" bind:value={instagram} class="field-input contact-field-input" disabled={loading} />
                </div>
              </div>
            {/if}
          </div>

        </div>
      </section>

    </div>

    <div class="terms-row">
      <label class="terms-label">
        <input type="checkbox" bind:checked={agreeTerms} disabled={loading} />
        <span class="terms-box" class:checked={agreeTerms}>
          {#if agreeTerms}<i class="fa-solid fa-check"></i>{/if}
        </span>
        <span class="terms-text">
          I agree to the
          <a href="/terms" class="terms-link" target="_blank" rel="noopener noreferrer">
            Terms &amp; Conditions <i class="fa-solid fa-arrow-up-right-from-square terms-ext-icon"></i>
          </a>
        </span>
      </label>
    </div>

    <button type="submit" class="btn-submit" disabled={loading}>
      {#if loading}
        <span class="spinner"></span> Creating...
      {:else}
        <i class="fa-solid fa-user-plus"></i> Create Account
      {/if}
    </button>
  </form>

  <div class="auth-switch-wrap">
    <p class="auth-switch-text">Already have an account?</p>
    <button type="button" class="switch-btn" onclick={onSwitch}>
      <i class="fa-solid fa-right-to-bracket"></i> Login here
    </button>
  </div>

</div>

<style>
  .inner-form {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    align-self: flex-start;
    font-family: 'HammersmithOne', Georgia, serif;
    font-size: 0.8rem;
    color: #2a2420;
    background: #a2e1db;
    border: 2px solid #2a2420;
    border-radius: 999px;
    padding: 5px 14px;
    text-decoration: none;
    margin-bottom: 1.25rem;
    transition: background 0.2s, transform 0.2s;
    box-shadow: 2px 2px 0 #2a2420;
  }
  .back-btn:hover { background: #7dc8c1; transform: translateX(-3px); }

  .auth-header { text-align: center; margin-bottom: 1.5rem; }
  .auth-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #7dc8c1; margin: 0 0 0.5rem; font-weight: 500; }
  .auth-title { font-family: 'HammersmithOne', serif; font-size: clamp(1.8rem, 4vw, 2.5rem); color: #2a2420; margin: 0; }
  .auth-underline { width: 40px; height: 3px; background: #7dc8c1; border-radius: 2px; margin: 0.7rem auto 0; }

  .form-stack { display: flex; flex-direction: column; gap: 1.75rem; margin-bottom: 1.25rem; }

  .form-section { display: flex; flex-direction: column; }
  .section-header { display: flex; align-items: center; gap: 9px; margin-bottom: 11px; flex-wrap: wrap; }
  .section-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #2a2420; flex-shrink: 0; }
  .section-title { font-family: 'HammersmithOne', serif; font-size: 0.95rem; color: #2a2420; margin: 0; }
  .section-hint { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; color: #7c6f6a; background: rgba(42,36,32,0.07); border-radius: 999px; padding: 2px 10px; margin-left: auto; }

  .fields { display: flex; flex-direction: column; gap: 0.8rem; }
  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-family: 'HammersmithOne', serif; font-size: 0.8rem; color: #4a3f3a; }
  .field-inner { position: relative; display: flex; align-items: center; }
  .field-icon { position: absolute; left: 14px; color: #477c77; font-size: 0.9rem; z-index: 1; }
  .at-sign { font-family: 'HammersmithOne', serif; font-size: 1rem; font-weight: 700; }
  .field-input {
    width: 100%;
    background: #a2e1db;
    border: 2px solid transparent;
    border-radius: 14px;
    padding: 12px 44px 12px 40px;
    font-family: 'HammersmithOne', serif;
    font-size: 0.9rem;
    color: #2a2420;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }
  .field-input::placeholder { color: #477c77; opacity: 0.8; }
  .field-input:focus { outline: none; border-color: #477c77; box-shadow: 0 0 0 4px rgba(125,200,193,0.25); }

  .toggle-pass { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: #477c77; padding: 4px; font-size: 0.9rem; }

  .strength-wrap { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
  .strength-bar { display: flex; gap: 4px; flex: 1; }
  .strength-seg { flex: 1; height: 4px; border-radius: 2px; transition: background 0.3s; }
  .strength-label { font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600; min-width: 36px; }

  .contact-fields { gap: 0.5rem; }
  .contact-block { display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; }
  .contact-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 12px;
    cursor: pointer;
    border: 2px solid rgba(42,36,32,0.1);
    background: rgba(42,36,32,0.04);
    transition: background 0.2s, border-color 0.2s;
    user-select: none;
  }
  .contact-toggle:hover { background: rgba(162,225,219,0.2); }
  .contact-toggle.active { background: rgba(162,225,219,0.3); border-color: rgba(125,200,193,0.6); }
  .contact-toggle input { display: none; }
  .toggle-track { width: 36px; height: 20px; border-radius: 999px; background: rgba(42,36,32,0.15); border: 2px solid #2a2420; position: relative; flex-shrink: 0; transition: background 0.25s; }
  .contact-toggle.active .toggle-track { background: #7dc8c1; }
  .toggle-thumb { position: absolute; top: 1px; left: 1px; width: 14px; height: 14px; border-radius: 50%; background: #2a2420; transition: transform 0.2s; }
  .contact-toggle.active .toggle-thumb { transform: translateX(16px); }
  .contact-name { font-family: 'HammersmithOne', serif; font-size: 0.87rem; }
  .contact-input-wrap { padding: 6px 12px 10px; background: rgba(162,225,219,0.15); border: 2px solid rgba(125,200,193,0.35); border-top: none; border-radius: 0 0 12px 12px; }
  .contact-field-input { background: #fff !important; border-color: var(--accent, #477c77) !important; }
  .contact-field-input:focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #477c77) 20%, transparent) !important; }

  .terms-row { margin-bottom: 1.1rem; }
  .terms-label { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
  .terms-label input { display: none; }
  .terms-box {
    width: 20px; height: 20px; border-radius: 6px; border: 2px solid #2a2420;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.65rem; color: #2a2420;
    transition: background 0.2s;
  }
  .terms-box.checked { background: #a2e1db; }
  .terms-text { font-family: 'DM Sans', sans-serif; font-size: 0.87rem; color: #4a3f3a; }
  .terms-link {
    color: #477c77;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-style: dotted;
    transition: color 0.2s, text-decoration-style 0.2s;
    white-space: nowrap;
  }
  .terms-link:hover { color: #2a2420; text-decoration-style: solid; }
  .terms-ext-icon { font-size: 0.65rem; vertical-align: middle; margin-left: 2px; }

  .btn-submit {
    width: 100%;
    padding: 13px;
    background: #b4a6d5;
    color: #2a2420;
    font-family: 'HammersmithOne', serif;
    font-size: 1rem;
    border: 2.5px solid #2a2420;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2a2420;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  }
  .btn-submit:hover:not(:disabled) { background: #9b8bc4; transform: translateY(-2px); box-shadow: 5px 5px 0px #2a2420; }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

  .auth-switch-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 1.25rem;
    padding: 10px 16px;
    background: rgba(42,36,32,0.05);
    border: 1.5px solid rgba(42,36,32,0.12);
    border-radius: 14px;
    flex-wrap: wrap;
  }
  .auth-switch-text { font-family: 'DM Sans', sans-serif; font-size: 0.87rem; color: #4a3f3a; margin: 0; }
  .switch-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #2a2420;
    color: #f0ebe3;
    border: none;
    border-radius: 999px;
    padding: 6px 16px;
    font-family: 'HammersmithOne', serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .switch-btn:hover { background: #477c77; transform: translateY(-1px); }

  .spinner { width: 16px; height: 16px; border: 2.5px solid rgba(42,36,32,0.2); border-top-color: #2a2420; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
