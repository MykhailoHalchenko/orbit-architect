import { assets, resolveAsset } from "./assets.js";

const characterAssets = {
  Financier: assets.characters.financier,
  Engineer: assets.characters.engineer,
  Scientist: assets.characters.scientist,
};

export function createCharacter({ role, emotion, dialogue }) {
  if (!role || !emotion || !dialogue) {
    throw new Error("Character requires role, emotion, and dialogue");
  }

  const asset = characterAssets[role]?.[emotion];
  if (!asset) {
    throw new Error(`No asset configured for ${role} with emotion ${emotion}`);
  }

  return Object.freeze({
    role,
    emotion,
    dialogue,
    asset: resolveAsset(asset),
  });
}

export function createPlayer() {
  return Object.freeze({
    id: "player",
    currentCharacter: null,
    selectedAsset: null,
  });
}
