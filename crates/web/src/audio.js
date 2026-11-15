import { soundAssets } from "./sound-assets.js";

const soundVolumes = Object.freeze({
  click: 0.45,
  menu: 0.55,
  navigation: 0.5,
  selection: 0.45,
});

export class SoundManager {
  play(name) {
    const source = soundAssets[name];
    if (!source) {
      throw new Error(`Unknown sound effect: ${name}`);
    }

    const audio = new Audio(source);
    audio.volume = soundVolumes[name] ?? 0.5;
    audio.addEventListener("ended", () => audio.remove(), { once: true });
    audio.play().catch((error) => {
      console.warn(`Unable to play sound effect "${name}".`, error);
    });
  }
}
