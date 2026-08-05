const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_URL || "https://assets.networksandnodes.org"
).replace(/\/+$/, "");

// These tokens are derived from the currently verified public object ETags.
// Update a token whenever its immutable CDN object is replaced.
const ASSET_VERSIONS = Object.freeze({
  "Chicago_Air_Jordan1_Compress-v1.glb": "471915b9bc62126c0fcdd0152bffb344",
  "Building_Under_Cons_Compress-v1.glb": "2990d2cf8c0b2eba038654be29e78d69",
  "Midnight_Sentinel_Compress-v1.glb": "0ed7a505aadee2eafe541375ff9dd139",
  "Stock-shirt-compressed-v1.glb": "1d6753625d3ecacac8dfdd9f87ecb620",
});

export function assetUrl(path) {
  const cleanPath = String(path).replace(/^\/+/, "");
  const url = new URL(`${ASSET_BASE_URL}/${cleanPath}`);
  const version = ASSET_VERSIONS[cleanPath];
  if (version) url.searchParams.set("v", version);
  return url.toString();
}

export { ASSET_VERSIONS };
