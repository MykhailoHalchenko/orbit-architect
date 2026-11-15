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
import { publishTelemetry } from "./wasm-bridge.js";
import { allSoundUrls } from "./sound-assets.js";
import { SoundManager } from "./audio.js";

const status = document.querySelector("#status");
const sound = new SoundManager();

const missionReports = Object.freeze({
  "base-drill": Object.freeze({
    name: "Base Drill",
    nameEn: "BASE DRILL",
    science: 45,
    conclusion:
      "Analysis conclusion: The mechanical drill successfully pierced the upper layer of Martian ice to a depth of 350 meters and collected basic core samples. A high concentration of water ice was confirmed, but the drill lacked the power to reach the deep subglacial lake. The mission stayed within budget but requires deeper scanning.\n\nCrew comment: \"We reached the ice's upper shell — the water is definitely there, but the main lake lies deeper!\"",
  }),
  "mars-sar": Object.freeze({
    name: "MARS-SAR Radar",
    nameEn: "MARS-SAR RADAR",
    science: 80,
    conclusion:
      "Analysis conclusion: The orbital-landing ground-penetrating radar scanned 1.8 km of permafrost and built an accurate 3D map of the subglacial reservoir. A large liquid saltwater lake was detected beneath the South Pole of Mars. The data was transmitted to Earth without loss.\n\nCrew comment: \"A clean signal! We can see the boundaries of the subglacial lake as clearly as the palm of our hand — a perfect site for the next base.\"",
  }),
  "quantum-spectrometer": Object.freeze({
    name: "Quantum Spectrometer",
    nameEn: "QUANTUM SPECTROMETER",
    science: 100,
    conclusion:
      "Analysis conclusion: Molecular analysis of the subglacial layer detected liquid water, mineral salts, and organic biosignatures. The maximum volume of scientific data was collected — this is the discovery of the century for the colonization of Mars.\n\nCrew comment: \"The spectrometer is off the charts! These samples contain traces of biochemical activity — we found a true oasis under the ice!\"",
  }),
});

function setConstructorMode(active) {
  document.body.classList.toggle("constructor-mode", active);
  const reactRoot = document.querySelector("#react-root");
  if (reactRoot) reactRoot.inert = !active;
}

function focusGameCanvas() {
  document.querySelector("#game-canvas")?.focus({ preventScroll: true });
}

window.addEventListener("game:launch_sequence", focusGameCanvas);

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
      <div class="briefing-title">
        <p class="eyebrow">MISSION BRIEFING</p>
        <h1>Oasis Under the Ice</h1>
      </div>
      <div class="dialogue-card asset-dialogue">
        <p class="eyebrow">NAVIGATOR · CONFERENCE ROOM</p>
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
        <div class="details-title">
          <p class="eyebrow">MISSION DETAILS · ${character.role.toUpperCase()}</p>
          <h1>Oasis Under the Ice</h1>
        </div>
        <div class="details-content">
          <p class="details-requirements">Goal: Land at the South Pole of Mars and explore the subglacial layer.<br />Install a drill or radar, stay under $400M, and respect booster capacity.</p>
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
  focusGameCanvas();
  const root = document.querySelector("#app");
  root.innerHTML = "";
  const view = new ConstructorView(root, game, sound);
  window.orbitConstructor = view;
  publishTelemetry(game.rust);
  root.addEventListener(
    "launched",
    () => renderExploration(game),
    { once: true },
  );
}

function renderExploration(game) {
  setConstructorMode(false);
  focusGameCanvas();
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
    renderMissionReport(game);
  });
}

function renderMissionReport(game) {
  setConstructorMode(false);
  const reward = game.reward();
  const telemetry = game.telemetry;
  const payload = game.modules.find((module) => module.stage === "payload" && module.selected);
  const report = missionReports[payload?.id] || missionReports["base-drill"];
  const status = { Gold: "Success", Silver: "Partial", Bronze: "Fail" }[reward.tier] || "Fail";
  const conclusion = report.conclusion
    .split("\n\n")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  document.querySelector("#app").innerHTML = `
    <section class="mission-report-screen">
      <img class="mission-report-backdrop" src="${assets.backgrounds.hud}" alt="" />
      <div class="mission-report-ui">
        <header class="mission-report-header">
          <p class="mission-report-kicker">MISSION CONTROL · FINAL TRANSMISSION</p>
          <h1>MISSION REPORT: OASIS UNDER THE ICE</h1>
          <p>MISSION REPORT: OASIS UNDER THE ICE</p>
        </header>
        <div class="mission-report-metrics" aria-label="Mission metrics">
          <div class="mission-report-plaque">
            <span>STATUS</span>
            <strong>${status}</strong>
          </div>
          <div class="mission-report-plaque">
            <span>DATA</span>
            <strong>${report.science}%</strong>
          </div>
          <div class="mission-report-plaque">
            <span>BUDGET</span>
            <strong>$${telemetry.budget}M / $${telemetry.budgetLimit}M</strong>
          </div>
        </div>
        <aside class="mission-report-preview">
          <p class="mission-report-label">SELECTED INSTRUMENT</p>
          <div class="mission-report-preview-art">
            <img src="${assets.modules.payload[payload?.id || "base-drill"]}" alt="${report.name}" />
          </div>
          <strong>${report.name}</strong>
          <span>${report.nameEn}</span>
        </aside>
        <article class="mission-report-text">
          <p class="mission-report-label">RETURNED SIGNAL ANALYSIS</p>
          <div>${conclusion}</div>
        </article>
        <button class="mission-report-finish primary-button" id="mission-report-finish" aria-label="FINISH">
          FINISH
        </button>
      </div>
    </section>
  `;
  document.querySelector("#mission-report-finish").addEventListener("click", () => {
    window.location.reload();
  });
}
