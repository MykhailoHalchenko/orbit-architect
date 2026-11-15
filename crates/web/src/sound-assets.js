export const soundAssets = Object.freeze({
  click: new URL("../../../Sounds/click.wav", import.meta.url).href,
  menu: new URL(
    "../../../Sounds/skyscraper_seven-click-buttons-ui-menu-sounds-effects-button-14-205402.wav",
    import.meta.url,
  ).href,
  navigation: new URL(
    "../../../Sounds/skyscraper_seven-click-buttons-ui-menu-sounds-effects-button-6-203600.wav",
    import.meta.url,
  ).href,
  selection: new URL(
    "../../../Sounds/skyscraper_seven-click-buttons-ui-menu-sounds-effects-button-7-203601.wav",
    import.meta.url,
  ).href,
  marsAmbient: new URL("../../../Sounds/mars_wind.mp3", import.meta.url).href,
});

export const allSoundUrls = Object.freeze(Object.values(soundAssets));
