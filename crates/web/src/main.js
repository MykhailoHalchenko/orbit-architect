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
import { mountEngineeringConsole, unmountEngineeringConsole } from "./react-overlay.jsx";

const status = document.querySelector("#status");
const sound = new SoundManager();

const missionReports = Object.freeze({
  "base-drill": Object.freeze({
    name: "Base Drill",
    nameEn: "BASE DRILL",
    status: "PARTIAL SUCCESS",
    science: 45,
    medal: "bronze",
    medalTitle: "Bronze Medal — Partial Success",
    bonus: 50,
    kw: 0,
    conclusion:
      "Analysis: Mechanical drill pierced 350m of surface ice and extracted core samples. High water-ice concentration confirmed, but power was insufficient to reach the deep subglacial lake.\n\nCrew: 'We hit the upper ice crust—water is definitely here, but the main lake lies deeper!'",
  }),
  "mars-sar": Object.freeze({
    name: "MARS-SAR Radar",
    nameEn: "MARS-SAR RADAR",
    status: "SUCCESS",
    science: 80,
    medal: "silver",
    medalTitle: "Silver Medal — Successful Mission",
    bonus: 120,
    kw: 15,
    conclusion:
      "Analysis: Ground-penetrating radar scanned 1.8km of permafrost and mapped the 3D subglacial reservoir. Large liquid saltwater lake confirmed under the South Pole.\n\nCrew: 'Clean signal! We see the subglacial lake boundaries clearly—perfect spot for the next base.'",
  }),
  "quantum-spectrometer": Object.freeze({
    name: "Quantum Spectrometer",
    nameEn: "QUANTUM SPECTROMETER",
    status: "TRIUMPH",
    science: 100,
    medal: "gold",
    medalTitle: "Gold Medal — Mission Triumph",
    bonus: 250,
    kw: 40,
    conclusion:
      "Analysis: Molecular scan confirmed liquid water, mineral salts, and organic biosignatures. Maximum science data collected—discovery of the century for Mars colonization.\n\nCrew: 'Spectrometer is off the charts! Biochemical activity detected—we found a true oasis under the ice!'",
  }),
});

const LANDING_MS = 3000;
const EXPEDITION_MS = 2500;

let phase = "menu";
let phaseTimers = [];

function setPhase(next) {
  phase = next;
  document.body.dataset.phase = next;
  setConstructorMode(next === "constructor");
}

function clearPhaseTimers() {
  phaseTimers.forEach((timer) => window.clearTimeout(timer));
  phaseTimers = [];
}

function afterMs(ms, callback) {
  phaseTimers.push(window.setTimeout(callback, ms));
}

Object.defineProperty(window, "orbitPhase", { get: () => phase });

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
  clearPhaseTimers();
  setPhase("constructor");
  focusGameCanvas();
  const root = document.querySelector("#app");
  root.innerHTML = "";
  const view = new ConstructorView(root, game, sound);
  window.orbitConstructor = view;
  mountEngineeringConsole(game.rust, game.modules, (stage, option) =>
    view.syncModuleSelection(stage, option),
  );
  publishTelemetry(game.rust);
  root.addEventListener(
    "launched",
    () => {
      unmountEngineeringConsole();
      renderPostLaunch(game);
    },
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
    renderPostLaunch(game);
  });
}

function selectedPayloadId(game) {
  const payload = game.modules.find((module) => module.stage === "payload" && module.selected);
  return payload && missionReports[payload.id] ? payload.id : "base-drill";
}

function renderPostLaunch(game) {
  clearPhaseTimers();
  setPhase("landing");
  const payloadId = selectedPayloadId(game);
  const { landingScene, rocket, expedition } = assets.postLaunch;
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section id="post-launch" class="absolute inset-0 overflow-hidden bg-black" data-phase="landing">
      <img id="post-launch-scene" class="absolute inset-0 h-full w-full object-cover" src="${landingScene}" alt="Mars surface" />
      <img id="post-launch-rocket" class="rocket-descend absolute top-[-60%] left-1/2 -translate-x-1/2 h-[65%] w-auto object-contain mix-blend-screen" src="${rocket}" alt="Rocket landing on Mars" />
    </section>
  `;
  sound.playLoop("marsAmbient");

  afterMs(LANDING_MS, () => {
    setPhase("expedition");
    const stage = root.querySelector("#post-launch");
    stage.dataset.phase = "expedition";
    stage.querySelector("#post-launch-rocket")?.remove();
    stage.querySelector("#post-launch-scene").src = expedition[payloadId];
    stage.querySelector("#post-launch-scene").alt = missionReports[payloadId].name;
  });

  afterMs(LANDING_MS + EXPEDITION_MS, () => {
    setPhase("report");
    const stage = root.querySelector("#post-launch");
    stage.dataset.phase = "report";
    renderMissionReport(game, stage, payloadId);
  });
}

function renderMissionReport(game, stage, payloadId) {
  const telemetry = game.telemetry;
  const report = missionReports[payloadId];
  const overlay = document.createElement("div");
  overlay.id = "post-launch-report";
  overlay.className = "report-fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm";
  stage.append(overlay);
  let medalView = false;
  const render = () => {
    overlay.innerHTML = `
    <section class="mission-report-screen !bg-transparent">
      <img class="mission-report-backdrop !opacity-60" src="${assets.backgrounds.hud}" alt="" />
      <div class="mission-report-ui">
        <header class="mission-report-header">
          <h1>MISSION REPORT: OASIS UNDER THE ICE</h1>
        </header>
        <div class="mission-report-metrics" aria-label="Mission metrics">
          <div class="mission-report-plaque">
            <span>STATUS</span>
            <strong>${report.status}</strong>
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
        <article class="mission-report-text ${medalView ? "medal-view" : ""}">
          ${
            medalView
              ? `<img class="mission-medal" src="${assets.postLaunch.medals[report.medal]}" alt="${report.medalTitle}" />
                 <h2>${report.medalTitle}</h2>
                 <p>Congratulations! Mission Completed!</p>
                 <p>Reward: +$${report.bonus}M Budget (+$${Math.max(0, telemetry.budgetLimit - telemetry.budget)}M unspent carried over)</p>`
              : `<p>${report.conclusion.replace(/\n\n/g, "</p><p>")}</p>`
          }
        </article>
        <button class="mission-report-finish primary-button" id="mission-report-finish" aria-label="${medalView ? "FINISH" : "VIEW MEDAL"}">
          ${medalView ? "FINISH" : "VIEW MEDAL"}
        </button>
      </div>
    </section>
    `;
    overlay.querySelector("#mission-report-finish").addEventListener("click", () => {
      if (!medalView) {
        medalView = true;
        render();
        return;
      }
      const carryOver = Math.max(0, telemetry.budgetLimit - telemetry.budget) + report.bonus;
      const wallet = JSON.parse(localStorage.getItem("orbit-wallet") || '{"budget":400,"powerKw":0}');
      localStorage.setItem("orbit-wallet", JSON.stringify({
        budget: wallet.budget + carryOver,
        powerKw: wallet.powerKw + report.kw,
      }));
      sound.stop("marsAmbient");
      window.location.reload();
    });
  };
  render();
}