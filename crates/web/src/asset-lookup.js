export const imageFiles = import.meta.glob("../../../Assets/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: "?url",
});

const normalize = (value) => value.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();

const index = Object.entries(imageFiles).map(([path, url]) => ({
  stem: normalize(decodeURIComponent(path.split("/").pop()).replace(/\.[^.]+$/, "")),
  url,
}));

export function assetByStem(name) {
  const wanted = normalize(name.replace(/\.[^.]+$/, ""));
  const match =
    index.find((entry) => entry.stem === wanted) ??
    index.find((entry) => entry.stem.startsWith(wanted));
  if (!match) throw new Error(`Missing asset: ${name}`);
  return match.url;
}

export const allImageUrls = Object.freeze(Object.values(imageFiles));