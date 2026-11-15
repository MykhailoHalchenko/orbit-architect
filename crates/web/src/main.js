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
import { ConstructorView } from "./constructor.js";
import { createTeamDialogue } from "./dialogue.js";
import { WebGame } from "./game.js";

const status = document.querySelector("#status");

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
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="screen-card">
      <p class="eyebrow">COSMIC GAME · MISSION 1</p>
      <h1>Oasis Under the Ice</h1>
      <p>Assemble a spacecraft, land on Mars, and search the subglacial layer.</p>
      <button class="primary-button" id="play">PLAY</button>
    </section>
  `;
  root.querySelector("#play").addEventListener("click", () => {
    game.play();
    renderMission(game);
  });
}

function renderMission(game) {
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="screen-card">
      <p class="eyebrow">MISSION SELECT · HANGAR</p>
      <h1>Choose a mission</h1>
      <button class="primary-button" id="mission-1">MISSION 1</button>
      <button class="secondary-button" disabled>MISSION 2 · LOCKED</button>
      <button class="secondary-button" disabled>MISSION 3 · LOCKED</button>
    </section>
  `;
  root.querySelector("#mission-1").addEventListener("click", () => {
    game.selectMission(1);
    renderBriefing(game);
  });
}

function renderBriefing(game) {
  const root = document.querySelector("#app");
  root.innerHTML = `
    <section class="screen-card dialogue-card">
      <p class="eyebrow">NAVIGATOR · CONFERENCE ROOM</p>
      <h1>Oasis Under the Ice</h1>
      <p>${navigator_dialog()}</p>
      <button class="primary-button" id="briefing-next">NEXT</button>
    </section>
  `;
  root.querySelector("#briefing-next").addEventListener("click", () => {
    game.completeBriefing();
    renderDetails(game);
  });
}

function renderDetails(game) {
  let index = 0;
  const root = document.querySelector("#app");
  const update = () => {
    const character = game.dialogue[index];
    root.innerHTML = `
      <section class="screen-card dialogue-card">
        <p class="eyebrow">MISSION DETAILS · ${character.role.toUpperCase()}</p>
        <h1>Oasis Under the Ice</h1>
        <p>Goal: Landing on the South Pole of Mars and exploring the subglacial layer.</p>
        <p>Requirements: Install a drill or radar, stay within the $400M budget, and respect structural mass.</p>
        <hr />
        <p data-asset-slot="${character.assetKey}"><b>${character.role}</b> · ${character.emotion}</p>
        <p>${character.dialogue}</p>
        <button class="secondary-button" id="dialog-next" ${index === 2 ? "disabled" : ""}>NEXT</button>
        <button class="primary-button" id="constructor-start" ${index !== 2 ? "disabled" : ""}>START CONSTRUCTOR</button>
      </section>
    `;
    root.querySelector("#dialog-next").addEventListener("click", () => {
      if (game.nextCharacter()) {
        index += 1;
        update();
      }
    });
    root.querySelector("#constructor-start").addEventListener("click", () => {
      if (game.startConstructor()) renderConstructor(game);
    });
  };
  update();
}

function renderConstructor(game) {
  const root = document.querySelector("#app");
  root.innerHTML = "";
  const view = new ConstructorView(root, game);
  root.addEventListener(
    "launched",
    () => renderExploration(game),
    { once: true },
  );
  window.orbitConstructor = view;
}

function renderExploration(game) {
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
    game.collectSample();
    update();
  });
  root.querySelector("#secret").addEventListener("click", () => {
    game.discoverSecretPart();
    update();
  });
  root.querySelector("#finish").addEventListener("click", () => {
    game.finishExploration();
    renderSummary(game);
  });
}

function renderSummary(game) {
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
