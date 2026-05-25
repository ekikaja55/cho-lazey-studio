/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  // Ambil data 'back' dari URL query parameter, contoh: /invoice?back=/dashboard
  const fallbackUrl = url.searchParams.get("back") || "/home";

  // Return object ini akan otomatis dibaca sebagai PROPS di +page@.svelte
  return {
    fallbackUrl,
  };
}
