const assetRoot = "/assets";

export const assets = {
  backgrounds: {
    menu: `${assetRoot}/backgrounds/menu.png`,
    missionHub: `${assetRoot}/backgrounds/mission-hub.png`,
    conferenceRoom: `${assetRoot}/backgrounds/conference-room.png`,
    missionDetails: `${assetRoot}/backgrounds/mission-details.png`,
  },
  characters: {
    navigator: {
      neutral: `${assetRoot}/characters/navigator/neutral.png`,
    },
    financier: {
      strict: `${assetRoot}/characters/financier/strict.png`,
      neutral: `${assetRoot}/characters/financier/neutral.png`,
      worried: `${assetRoot}/characters/financier/worried.png`,
    },
    engineer: {
      focused: `${assetRoot}/characters/engineer/focused.png`,
    },
    scientist: {
      inspired: `${assetRoot}/characters/scientist/inspired.png`,
    },
  },
};

export function resolveAsset(path) {
  if (typeof path !== "string" || path.trim() === "") {
    throw new TypeError("Asset path must be a non-empty string");
  }
  return path;
}

export function setAssetRoot(root) {
  if (typeof root !== "string" || root.trim() === "") {
    throw new TypeError("Asset root must be a non-empty string");
  }
  return root.replace(/\/+$/, "");
}
