/**
 * toast.js
 * Cho's Studio — Brutalist Pop-up Store
 * Hanya satu pop-up aktif sekaligus, tidak auto-close, tutup via tombol OK
 */

import { writable } from "svelte/store";

/** @typedef {'success'|'error'|'warning'|'info'|'neutral'} ToastType */

/**
 * @typedef {Object} PopupItem
 * @property {string}    id
 * @property {ToastType} type
 * @property {string}    message
 */

function createToastStore() {
  /** @type {import('svelte/store').Writable<PopupItem[]>} */
  const { subscribe, update } = writable([]);

  /**
   * Tambah pop-up baru ke antrian
   * @param {string}    message
   * @param {ToastType} type
   */
  function add(message, type = "info") {
    const id = `popup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    update((q) => [...q, { id, type, message }]);
    return id;
  }

  /** Tutup pop-up paling depan (atau berdasarkan id) */
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
  };
}

export const toast = createToastStore();
