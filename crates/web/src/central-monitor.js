import { assets } from "./assets.js";

const stages = [
  ["Stage 1", "payload"],
  ["Stage 2", "power"],
  ["Stage 3", "hull"],
  ["Stage 4", "launch_vehicle"],
];

export class CentralMonitor {
  constructor(root, game, onStageSelected) {
    this.root = root;
    this.game = game;
    this.onStageSelected = onStageSelected;
  }

  renderBlueprint() {
    const validation = this.game.validate();
    const selected = this.game.modules.filter((module) => module.selected);
    const warning = validation.errors;

    this.root.className = "central-monitor blueprint-mode";
    this.root.innerHTML = `
      <div class="rocket-schematic" aria-label="Rocket assembly blueprint">
        <svg class="rocket-schematic-art" viewBox="0 0 160 420" role="img" aria-label="Cyan rocket hologram">
          <g fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 5">
            <path d="M80 18 48 78v238l32 76 32-76V78L80 18Z" />
            <path d="M48 124H24l-14 48 38-18M112 124h24l14 48-38-18M48 246H22l-12 42 38-16M112 246h26l12 42-38-16" />
            <path d="M48 78h64M48 182h64M48 286h64M80 18v376" />
            <circle cx="80" cy="112" r="18" /><circle cx="80" cy="216" r="18" />
          </g>
        </svg>
        ${this.callout(0, stages[0], selected, warning, "stage-callout stage-callout-payload")}
        ${this.callout(1, stages[1], selected, warning, "stage-callout stage-callout-power")}
        ${this.callout(2, stages[2], selected, warning, "stage-callout stage-callout-hull")}
        ${this.callout(3, stages[3], selected, warning, "stage-callout stage-callout-booster")}
      </div>
    `;
    this.root.querySelectorAll("[data-stage-callout]").forEach((button) => {
      button.addEventListener("click", () => {
        this.onStageSelected?.(Number(button.dataset.stageCallout));
      });
    });
  }

  callout(stageIndex, [label, stage], selected, errors, className) {
    const module = selected.find((item) => item.stage === stage);
    const problem = module && this.hasProblem(stage, errors);
    const asset = module ? this.assetFor(stage, module.id) : "";
    return `
      <button class="${className} ${problem ? "problem" : ""}" data-stage-callout="${stageIndex}" type="button" aria-label="${label} ${module?.name || "empty bay"}">
        ${module ? `<img src="${asset}" alt="" class="blueprint-part" />` : ""}
      </button>
    `;
  }

  hasProblem(stage, errors) {
    if (errors.includes("budget")) return true;
    if (errors.includes("power") && (stage === "payload" || stage === "power")) return true;
    if (errors.includes("mass") && (stage === "payload" || stage === "launchVehicle")) return true;
    return false;
  }

  assetFor(stage, id) {
    const assetStage = stage === "launch_vehicle" ? "launchVehicle" : stage;
    return assets.modules[assetStage][id];
  }

  renderFlight(result) {
    const tier = result.tier || "mission";
    const booster = this.game.modules.find(
      (module) => module.stage === "launch_vehicle" && module.selected,
    );
    const boosterAsset = booster ? this.assetFor("launch_vehicle", booster.id) : "";
    this.root.className = "central-monitor mission-camera";
    this.root.innerHTML = `
      <div class="flight-view" aria-live="polite">
        <img class="flight-hud" src="${assets.backgrounds.hud}" alt="" />
        <div class="flight-grid"></div>
        <img class="flight-rocket" src="${boosterAsset}" alt="${booster?.name || "Rocket"}" />
        <p class="flight-caption">MISSION 1 · ${tier.toUpperCase()} TRAJECTORY</p>
      </div>
      <div class="flight-readout">
        <span>THRUST <b>OPTIMAL</b></span>
        <span>STAGE SEPARATION <b class="separation">IN PROGRESS</b></span>
        <span>LINK <b>STABLE</b></span>
      </div>
    `;
  }
}
