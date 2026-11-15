import { assets } from "./assets.js";

const characterAssets = {
  Financier: assets.characters.financier,
  Engineer: {
    ...assets.characters.engineer,
    focused: assets.characters.engineer.neutral,
  },
  Scientist: {
    ...assets.characters.scientist,
    inspired: assets.characters.scientist.excited,
  },
};

export function createCharacter({ role, emotion, dialogue }) {
  if (!role || !emotion || !dialogue) {
    throw new Error("Character requires role, emotion, and dialogue");
  }

  return Object.freeze({
    role,
    emotion,
    dialogue,
    assetKey: `${role.toLowerCase()}-${emotion}`,
    asset: characterAssets[role]?.[emotion] ?? null,
  });
}

export function createPlayer() {
  return Object.freeze({
    id: "player",
    currentCharacter: null,
    selectedAsset: null,
  });
}
