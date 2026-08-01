const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_URL || "https://assets.networksandnodes.org"
).replace(/\/+$/, "");

export function assetUrl(path) {
  const cleanPath = String(path).replace(/^\/+/, "");
  return `${ASSET_BASE_URL}/${cleanPath}`;
}
