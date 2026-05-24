/**
 * toast.svelte.js
 * Cho's Studio — Toast Notification Store
 * Svelte 5 runes-based. Replaces notie + vue-toastification.
 */

import { writable } from "svelte/store";

/** @typedef {'success'|'error'|'warning'|'info'|'neutral'} ToastType */

/**
 * @typedef {Object} Toast
 * @property {string} id
 * @property {ToastType} type
 * @property {string} message
 * @property {number} duration
 */

function createToastStore() {
  const { subscribe, update } = writable(/** @type {Toast[]} */ ([]));

  /**
   * @param {string} message
   * @param {ToastType} type
   * @param {number} duration ms
   */
  function add(message, type = "info", duration = 3500) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast = { id, type, message, duration };

    update((toasts) => [...toasts, toast]);

    setTimeout(() => remove(id), duration);
    return id;
  }

  function remove(id) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  return {
    subscribe,
    remove,
    success: (msg, duration) => add(msg, "success", duration),
    error: (msg, duration) => add(msg, "error", duration),
    warning: (msg, duration) => add(msg, "warning", duration),
    info: (msg, duration) => add(msg, "info", duration),
    neutral: (msg, duration) => add(msg, "neutral", duration),
  };
}

export const toast = createToastStore();
