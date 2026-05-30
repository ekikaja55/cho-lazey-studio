export function load({ url }) {
  const fallbackUrl = url.searchParams.get("back") || "/home";
  return {
    fallbackUrl,
  };
}
