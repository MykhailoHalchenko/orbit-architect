import { constructorAssets } from "./constructor-assets.js";
import { assetByStem } from "./asset-lookup.js";

export const assets = Object.freeze({
  backgrounds: Object.freeze({
    menu: new URL("../../../Assets/531ac2012901f62b.png", import.meta.url).href,
    missionHub: new URL("../../../Assets/b29187f4e8e137aa.png", import.meta.url).href,
    conferenceRoom: new URL("../../../Assets/b40364a44ee0fd61.png", import.meta.url).href,
    missionDetails: new URL("../../../Assets/d392504422d17c21.png", import.meta.url).href,
    hud: new URL("../../../Assets/HUD_.png", import.meta.url).href,
  }),
  characters: Object.freeze({
    navigator: Object.freeze({
      neutral: new URL("../../../Assets/navigator_neutral.png", import.meta.url).href,
      proud: new URL("../../../Assets/navigator_proud.png", import.meta.url).href,
    }),
    financier: Object.freeze({
      strict: new URL("../../../Assets/financier_strict.png", import.meta.url).href,
      neutral: new URL("../../../Assets/financier_neutral.png", import.meta.url).href,
      smile: new URL("../../../Assets/financier_smile.png", import.meta.url).href,
      worried: new URL("../../../Assets/financier_worried.png", import.meta.url).href,
    }),
    engineer: Object.freeze({
      happy: new URL("../../../Assets/engineer_happy.png", import.meta.url).href,
      neutral: new URL("../../../Assets/engineer_neutral.png", import.meta.url).href,
      sad: new URL("../../../Assets/engineer_sad.png", import.meta.url).href,
    }),
    scientist: Object.freeze({
      excited: new URL("../../../Assets/scientist_excited.png", import.meta.url).href,
      neutral: new URL("../../../Assets/scientist_neutral.png", import.meta.url).href,
      sad: new URL("../../../Assets/scientist_sad.png", import.meta.url).href,
    }),
  }),
  postLaunch: Object.freeze({
    landingScene: assetByStem("Замерзла пустеля на заході сонця"),
    rocket: assetByStem("ракета"),
    neonHud: assetByStem("Неоновий HUD із льодовим розрізом"),
    expedition: Object.freeze({
      "base-drill": assetByStem("Gemini_Generated_Image_too6h7too6h7too6"),
      "mars-sar": assetByStem("Gemini_Generated_Image_too6h7too6h7too6 (1)"),
      "quantum-spectrometer": assetByStem("Gemini_Generated_Image_too6h7too6h7too6 (2)"),
    }),
    medals: Object.freeze({
      bronze: assetByStem("Бронзова медаль"),
      silver: assetByStem("Срібна медаль"),
      gold: assetByStem("Золота медаль"),
    }),
    constructorScreen: assetByStem("шоловний екран в конструкторі"),
  }),
  additional: constructorAssets.additional,
  modules: constructorAssets,
});