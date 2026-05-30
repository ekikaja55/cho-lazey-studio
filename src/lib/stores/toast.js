import { writable } from "svelte/store";

function createToastStore() {
  const { subscribe, update } = writable([]);

  function add(message, type = "info") {
    const id = `popup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    update((q) => [...q, { id, type, message }]);
    return id;
  }

  function remove(id) {
    update((q) => q.filter((p) => p.id !== id));
  }

  return {
    subscribe,
    remove,
    success: (msg) => add(msg, "success"),
    error: (msg) => add(msg, "error"),
    warning: (msg) => add(msg, "warning"),
    info: (msg) => add(msg, "info"),
    neutral: (msg) => add(msg, "neutral"),
    contact: (msg) => add(msg, "contact"),
  };
}

export const toast = createToastStore();
