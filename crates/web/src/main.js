import init, {
  OrbitGame,
  modules_json,
  mission_description,
  mission_requirements,
  mission_title,
  navigator_dialog,
  team_dialog,
  team_emotion,
  team_role,
} from "../pkg/orbit_web.js";
import { assets } from "./assets.js";
import { allAssetFiles, allConstructorAssetUrls } from "./constructor-assets.js";
import { ConstructorView } from "./constructor.js";
import { createTeamDialogue } from "./dialogue.js";
import { WebGame } from "./game.js";
import { mountEngineeringConsole } from "./react-overlay.jsx";
import { publishTelemetry } from "./wasm-bridge.js";
import { allSoundUrls } from "./sound-assets.js";
import { SoundManager } from "./audio.js";

const status = document.querySelector("#status");
const sound = new SoundManager();

function setConstructorMode(active) {
  document.body.classList.toggle("constructor-mode", active);
}

init()
  .then(() => {
    const rust = {
      game: new OrbitGame(),
      teamDialog: team_dialog,
      teamEmotion: team_emotion,
      teamRole: team_role,
    };
    const dialogue = createTeamDialogue(rust);
    const modules = JSON.parse(modules_json()).map((module) => ({ ...module, selected: false }));
    const game = new WebGame(rust.game, dialogue, modules);

    window.orbitGame = game;
    window.orbitAssets = assets;
    window.orbitAssetCatalog = Object.freeze([
      ...allConstructorAssetUrls,
      ...Object.values(allAssetFiles),
    ]);
    for (const assetUrl of window.orbitAssetCatalog) {
      const preloadedAsset = new Image();
      preloadedAsset.src = assetUrl;
      preloadedAsset.alt = "";
    }
    window.orbitSoundCatalog = Object.freeze(allSoundUrls);
    window.orbitMission = Object.freeze({
      title: mission_title(),
      description: mission_description(),
      requirements: mission_requirements(),
      navigatorDialog: navigator_dialog(),
      dialogue,
    });

    status.remove();
    renderMenu(game);
  })
  .catch((error) => {
    status.textContent = "Failed to load Rust WebAssembly.";
    console.error(error);
  });

function renderMenu(game) {
  setConstructorMode(false);
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="asset-screen menu-screen">
      <img class="screen-backdrop" src="${assets.additional["asset-8dfb95c0cfc925a2"]}" alt="" />
      <img class="screen-preview" src="${assets.backgrounds.menu}" alt="Crew viewing Earth from orbit" />
      <div class="screen-content">
        <p class="eyebrow">COSMIC GAME · MISSION 1</p>
        <h1>Oasis Under the Ice</h1>
        <p>Assemble a spacecraft, land on Mars, and search the subglacial layer.</p>
        <button class="image-button" id="play" aria-label="Play">
          <img class="button-normal" src="${assets.additional["asset-19f514765534d3f4"]}" alt="PLAY" />
          <img class="button-pressed" src="${assets.additional["asset-image"]}" alt="" />
        </button>
      </div>
    </section>
  `;
  root.querySelector("#play").addEventListener("click", () => {
    sound.play("menu");
    game.play();
    renderMission(game);
  });
}

function renderMission(game) {
  setConstructorMode(false);
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="asset-screen mission-screen">
      <img class="screen-backdrop" src="${assets.backgrounds.missionHub}" alt="Mission hangar" />
      <div class="screen-content mission-menu">
        <p class="eyebrow">MISSION SELECT · HANGAR</p>
        <h1>Choose a mission</h1>
        <button class="image-button" id="mission-1" aria-label="Mission 1">
          <img class="button-normal" src="${assets.additional["artboard-2-copy-2"]}" alt="MISSION 1" />
          <img class="button-pressed" src="${assets.additional["artboard-2-copy-6"]}" alt="" />
        </button>
        <button class="image-button" disabled aria-label="Mission 2 locked">
          <img class="button-normal" src="${assets.additional["artboard-2-copy-4"]}" alt="MISSION 2" />
          <img class="button-disabled" src="${assets.additional["artboard-2-copy-7"]}" alt="" />
        </button>
        <button class="image-button" disabled aria-label="Mission 3 locked">
          <img class="button-normal" src="${assets.additional["artboard-2-copy-5"]}" alt="MISSION 3" />
          <img class="button-disabled" src="${assets.additional["artboard-2-copy-8"]}" alt="" />
        </button>
      </div>
    </section>
  `;
  root.querySelector("#mission-1").addEventListener("click", () => {
    sound.play("menu");
    game.selectMission(1);
    renderBriefing(game);
  });
}

function renderBriefing(game) {
  setConstructorMode(false);
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="asset-screen briefing-screen">
      <img class="screen-backdrop blurred" src="${assets.backgrounds.conferenceRoom}" alt="Conference room" />
      <div class="briefing-sprite">
        <img src="${assets.characters.navigator.neutral}" alt="Navigator" />
      </div>
      <div class="dialogue-card asset-dialogue">
        <p class="eyebrow">NAVIGATOR · CONFERENCE ROOM</p>
        <h1>Oasis Under the Ice</h1>
        <p>${navigator_dialog()}</p>
        <button class="secondary-button" id="briefing-next">NEXT</button>
      </div>
    </section>
  `;
  root.querySelector("#briefing-next").addEventListener("click", () => {
    sound.play("navigation");
    game.completeBriefing();
    renderDetails(game);
  });
}

function renderDetails(game) {
  setConstructorMode(false);
  let index = 0;
  const root = document.querySelector("#app");
  const update = () => {
    const character = game.dialogue[index];
    root.innerHTML = `
      <section class="asset-screen details-screen">
        <img class="screen-backdrop" src="${assets.backgrounds.missionDetails}" alt="Mission holographic display" />
        <img class="details-frame" src="${assets.additional["asset-5899a8f7785b74f8"]}" alt="" />
        <div class="details-content">
          <p class="eyebrow">MISSION DETAILS · ${character.role.toUpperCase()}</p>
          <h1>Oasis Under the Ice</h1>
          <p>Goal: Landing on the South Pole of Mars and exploring the subglacial layer.</p>
          <p>Requirements: Mandatory drill or radar, budget <= $400M and structural mass compliance.</p>
          <div class="team-dialogue">
            <img src="${character.asset}" alt="${character.role} ${character.emotion}" />
            <div>
              <p data-asset-slot="${character.assetKey}"><b>${character.role}</b> · ${character.emotion}</p>
              <p>${character.dialogue}</p>
            </div>
          </div>
          <button class="secondary-button" id="dialog-next" ${index === 2 ? "disabled" : ""}>NEXT</button>
          <button class="primary-button" id="constructor-start" ${index !== 2 ? "disabled" : ""}>START CONSTRUCTOR</button>
        </div>
      </section>
    `;
    root.querySelector("#dialog-next").addEventListener("click", () => {
      sound.play("navigation");
      if (game.nextCharacter()) {
        index += 1;
        update();
      }
    });
    root.querySelector("#constructor-start").addEventListener("click", () => {
      if (game.startConstructor()) {
        sound.play("navigation");
        renderConstructor(game);
      }
    });
  };
  update();
}

function renderConstructor(game) {
  setConstructorMode(true);
  const root = document.querySelector("#app");
  root.innerHTML = "";
  const view = new ConstructorView(root, game, sound);
  window.orbitConstructor = view;
  publishTelemetry(game.rust);
  mountEngineeringConsole(game.rust, game.modules, (stage, option) => {
    view.syncModuleSelection(stage, option);
  });
  root.addEventListener(
    "launched",
    () => renderExploration(game),
    { once: true },
  );
}

function renderExploration(game) {
  setConstructorMode(false);
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="screen-card">
      <p class="eyebrow">MARS · 2D EXPLORATION</p>
      <h1>Collect evidence</h1>
      <p>Collect up to 3 mineral samples and search for the hidden alien technology.</p>
      <div class="exploration-map" aria-label="Mars exploration asset slot" data-asset-slot="mars-exploration"></div>
      <button class="secondary-button" id="sample">COLLECT SAMPLE</button>
      <button class="secondary-button" id="secret">SEARCH HIDDEN SITE</button>
      <button class="primary-button" id="finish">FINISH EXPLORATION</button>
      <p id="loot-status">Samples: 0 / 3 · Secret part: not found</p>
    </section>
  `;
  const statusElement = root.querySelector("#loot-status");
  const update = () => {
    statusElement.textContent = `Samples: ${game.reward().samples} / 3 · Secret part: ${game.reward().secretPart ? "found" : "not found"}`;
  };
  root.querySelector("#sample").addEventListener("click", () => {
    sound.play("selection");
    game.collectSample();
    update();
  });
  root.querySelector("#secret").addEventListener("click", () => {
    sound.play("selection");
    game.discoverSecretPart();
    update();
  });
  root.querySelector("#finish").addEventListener("click", () => {
    sound.play("navigation");
    game.finishExploration();
    renderSummary(game);
  });
}

function renderSummary(game) {
  setConstructorMode(false);
  const reward = game.reward();
  document.querySelector("#app").innerHTML = `
    <section class="screen-card reward-card">
      <p class="eyebrow">MISSION COMPLETE</p>
      <h1>${reward.tier.toUpperCase()} TIER</h1>
      ${reward.title ? `<h2>${reward.title}</h2>` : ""}
      <p>Base reward: +$${reward.baseRewardM}M</p>
      <p>Exploration loot: +$${reward.sampleRewardM}M</p>
      <p>Unspent budget: +$${reward.unspentBudgetM}M</p>
      <p>Permanent energy bonus: +${reward.energyBonusKw} kW</p>
      <p>Next mission budget: <b>$${reward.nextMissionBudgetM}M</b></p>
    </section>
  `;
}
