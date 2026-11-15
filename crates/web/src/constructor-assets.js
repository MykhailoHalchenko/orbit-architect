import { assetByStem, imageFiles } from "./asset-lookup.js";

export const constructorAssets = Object.freeze({
  payload: Object.freeze({
    "base-drill": assetByStem("01 → part_drill"),
    "mars-sar": assetByStem("01 → part_radar"),
    "quantum-spectrometer": assetByStem("01 → part_spectrometer"),
  }),
  power: Object.freeze({
    "solar-wing-v1": assetByStem("02 → part_solar"),
    "powercache-x": assetByStem("02 → part_battery"),
    "rtg-gold": assetByStem("02 → part_rtg"),
  }),
  hull: Object.freeze({
    "standard-hull": assetByStem("03 → part_hull"),
    "thermal-shield": assetByStem("03 → part_shield"),
    "deep-space-relay": assetByStem("03 → part_relay"),
  }),
  launchVehicle: Object.freeze({
    "arrow-s": assetByStem("04 → part_rocket_arrow"),
    "titan-m": assetByStem("04 → part_rocket_titan"),
    "colossus-h": assetByStem("04 → part_rocket_colossus"),
  }),
  additional: Object.freeze({
    "stage-1-1": new URL("../../../Assets/1-1.png", import.meta.url).href,
    "stage-1": new URL("../../../Assets/1.png", import.meta.url).href,
    "stage-2-2": new URL("../../../Assets/2-2.png", import.meta.url).href,
    "stage-2": new URL("../../../Assets/2.png", import.meta.url).href,
    "stage-3-3": new URL("../../../Assets/3-3.png", import.meta.url).href,
    "stage-3": new URL("../../../Assets/3.png", import.meta.url).href,
    "stage-4-4": new URL("../../../Assets/4-4.png", import.meta.url).href,
    "stage-4": new URL("../../../Assets/4.png", import.meta.url).href,
    "asset-8dfb95c0cfc925a2": new URL("../../../Assets/8dfb95c0cfc925a2.png", import.meta.url).href,
    "asset-19f514765534d3f4": new URL("../../../Assets/19f514765534d3f4.png", import.meta.url).href,
    "artboard-2-copy-2": new URL("../../../Assets/Artboard_2_copy_2.png", import.meta.url).href,
    "artboard-2-copy-4": new URL("../../../Assets/Artboard_2_copy_4.png", import.meta.url).href,
    "artboard-2-copy-5": new URL("../../../Assets/Artboard_2_copy_5.png", import.meta.url).href,
    "artboard-2-copy-6": new URL("../../../Assets/Artboard_2_copy_6.png", import.meta.url).href,
    "artboard-2-copy-7": new URL("../../../Assets/Artboard_2_copy_7.png", import.meta.url).href,
    "artboard-2-copy-8": new URL("../../../Assets/Artboard_2_copy_8.png", import.meta.url).href,
    "asset-5899a8f7785b74f8": new URL("../../../Assets/5899a8f7785b74f8.png", import.meta.url).href,
    "asset-efbdef661a2608fd": new URL("../../../Assets/efbdef661a2608fd.png", import.meta.url).href,
    "asset-image": new URL("../../../Assets/image.png", import.meta.url).href,
    "launch-button": assetByStem("кнопка запуск"),
    "launch-button-pressed": assetByStem("кнопка запуск нажата"),
    "launch-button-disabled": assetByStem("кнопка запуск заблокована"),
  }),
});

export const allConstructorAssetUrls = Object.freeze([
  ...Object.values(constructorAssets.payload),
  ...Object.values(constructorAssets.power),
  ...Object.values(constructorAssets.hull),
  ...Object.values(constructorAssets.launchVehicle),
  ...Object.values(constructorAssets.additional),
]);

export const allAssetFiles = imageFiles;