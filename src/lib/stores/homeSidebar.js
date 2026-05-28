/**
 * $lib/stores/homeSidebar.js
 * Shared sidebar minimize state — consumed by home FloatingSidebar + layout
 */
import { writable } from "svelte/store";

export const sidebarMinimized = writable(false);
