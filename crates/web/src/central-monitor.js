import { assets } from "./assets.js";

const stages = [
  ["Stage 1", "payload"],
  ["Stage 2", "power"],
  ["Stage 3", "hull"],
  ["Stage 4", "launch_vehicle"],
];

export class CentralMonitor {
  constructor(root, game) {
    this.root = root;
    this.game = game;
  }

  renderBlueprint() {
    const telemetry = this.game.telemetry;
    const validation = this.game.validate();
    const selected = this.game.modules.filter((module) => module.selected);
    const warning = validation.errors;

    this.root.className = "central-monitor blueprint-mode";
    this.root.innerHTML = `
      <div class="monitor-header">
        <p class="eyebrow">CENTRAL MONITOR · BLUEPRINT MODE</p>
        <span class="monitor-status">ASSEMBLY ${telemetry.complete ? "READY" : "IN PROGRESS"}</span>
      </div>
      <div class="blueprint-grid" aria-label="Rocket assembly blueprint">
        ${[...stages]
          .reverse()
          .map(([label, stage]) => this.blueprintLayer(label, stage, selected, warning))
          .join("")}
      </div>
      <p class="monitor-hint">
        ${warning.length ? "Review highlighted nodes before launch." : "Select modules to build the spacecraft layer by layer."}
      </p>
    `;
  }

  blueprintLayer(label, stage, selected, errors) {
    const module = selected.find((item) => item.stage === stage);
    const problem = module && this.hasProblem(stage, errors);
    const asset = module ? this.assetFor(stage, module.id) : "";
    return `
      <div class="blueprint-layer ${module ? "installed" : "empty"} ${problem ? "problem" : ""}">
        <span class="blueprint-label">${label}</span>
        ${
          module
            ? `<img src="${asset}" alt="${module.name}" class="blueprint-part" />
               <strong>${module.name}</strong>`
            : "<span class=\"blueprint-empty\">EMPTY BAY</span>"
        }
        ${problem ? `<span class="blueprint-warning">${errors.includes("mass") ? "MASS" : "CHECK"}</span>` : ""}
      </div>
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
      <div class="monitor-header">
        <p class="eyebrow">CENTRAL MONITOR · MISSION CAMERA</p>
        <span class="monitor-status flight-status">LIVE</span>
      </div>
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
