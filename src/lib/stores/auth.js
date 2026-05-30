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

    login(user) {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
      set(user);
    },

    logout() {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(SESSION_KEY);
      }
      set(null);
    },
  };
}

export const auth = createAuthStore();

export const isLoggedIn = derived(auth, ($auth) => $auth !== null);

export const userRole = derived(auth, ($auth) => $auth?.role ?? null);
