/**
 * auth.js
 * Cho's Studio — Auth Store (Prototype)
 * Simpan user session di sessionStorage
 */

import { writable, derived } from "svelte/store";

const SESSION_KEY = "cho_session";

function loadSession() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function createAuthStore() {
  const { subscribe, set, update } = writable(loadSession());

  return {
    subscribe,

    /** Login — simpan user ke store + sessionStorage */
    login(user) {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
      set(user);
    },

    /** Logout — hapus session */
    logout() {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(SESSION_KEY);
      }
      set(null);
    },
  };
}

export const auth = createAuthStore();

/** Derived: apakah user sudah login? */
export const isLoggedIn = derived(auth, ($auth) => $auth !== null);

/** Derived: role user saat ini */
export const userRole = derived(auth, ($auth) => $auth?.role ?? null);
