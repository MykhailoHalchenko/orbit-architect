import { Dialogs } from "./dialogs.js";
import { assets } from "./assets.js";
import { CentralMonitor } from "./central-monitor.js";

const stages = [
  ["Stage 1", "payload"],
  ["Stage 2", "power"],
  ["Stage 3", "hull"],
  ["Stage 4", "launch_vehicle"],
];

export class ConstructorView {
  constructor(root, game) {
    this.root = root;
    this.game = game;
    this.dialogs = new Dialogs(game.dialogue);
    this.activeStage = 0;
    this.message = this.dialogs.engineerEnter();
    this.render();
  }

  selectedModules() {
    return this.game.telemetry;
  }

  selectedIds() {
    return stages
      .map(([, stage]) => this.game.modules.find((module) => module.stage === stage && module.selected)?.id)
      .filter(Boolean);
  }

  syncModuleSelection(stageIndex, option) {
    const stage = stages[stageIndex][1];
    this.game.modules.forEach((module) => {
      if (module.stage === stage) module.selected = false;
    });
    const selected = this.game.modules.filter((module) => module.stage === stage)[option];
    if (selected) selected.selected = true;
    this.renderStages();
    this.renderTelemetry();
  }

  render() {
    this.root.innerHTML = `
      <section class="constructor-screen">
        <section class="constructor-layout">
          <aside class="telemetry panel">
            <h2>Live telemetry</h2>
            <div id="telemetry-bars"></div>
            <div id="dialog" class="dialog"></div>
          </aside>
          <section class="monitor panel">
            <p class="eyebrow">ENGINEERING CONSOLE</p>
            <h1>Rocket Constructor</h1>
            <div id="central-monitor"></div>
          </section>
          <aside class="coffee panel" title="Coffee mug easter egg" data-asset-slot="coffee-mug">
            <button id="coffee-button" class="mug" aria-label="Touch coffee mug"></button>
          </aside>
        </section>
        <section class="bottom-panel panel">
          <nav id="stage-tabs" class="stage-tabs"></nav>
          <div id="module-slots" class="module-slots"></div>
          <button id="launch-button" class="launch-button pointer-events-auto" aria-label="Launch">
            <img class="launch-normal" src="${assets.additional["launch-button"]}" alt="LAUNCH" />
            <img class="launch-pressed" src="${assets.additional["launch-button-pressed"]}" alt="" />
            <img class="launch-disabled" src="${assets.additional["launch-button-disabled"]}" alt="" />
          </button>
        </section>
      </section>
    `;
    this.centralMonitor = new CentralMonitor(this.root.querySelector("#central-monitor"), this.game);
    this.renderStages();
    this.renderTelemetry();
    this.renderDialog();
    this.bindEvents();
  }

  renderStages() {
    const tabs = this.root.querySelector("#stage-tabs");
    tabs.innerHTML = stages
      .map(
        ([label], index) =>
          `          <button class="stage-tab pointer-events-auto ${index === this.activeStage ? "active" : ""}" data-stage="${index}">
            <img src="${assets.additional[`stage-${index + 1}${index === this.activeStage ? "-1" : ""}`]}" alt="" />
            <span>${label}</span>
          </button>`,
      )
      .join("");

    const stage = stages[this.activeStage][1];
    const slots = this.root.querySelector("#module-slots");
    slots.innerHTML = this.game.modules
      .filter((module) => module.stage === stage)
      .map(
        (module, option) => `
          <button class="module-slot pointer-events-auto ${module.selected ? "selected" : ""}" data-option="${option}">
            <img class="module-asset" src="${assets.modules[stage === "launch_vehicle" ? "launchVehicle" : stage][module.id]}" alt="" />
            <strong>${module.name}</strong>
            <span>$${module.costM}M · ${(module.massTenths / 10).toFixed(1)}t</span>
            <small>${module.powerKw > 0 ? "+" : ""}${module.powerKw} kW${module.capacityTenths ? ` · ${(module.capacityTenths / 10).toFixed(1)}t capacity` : ""}</small>
          </button>`,
      )
      .join("");

    this.centralMonitor.renderBlueprint();
  }

  renderTelemetry() {
    const telemetry = this.game.telemetry;
    const budget = Math.min(100, (telemetry.budget / telemetry.budgetLimit) * 100);
    const power = telemetry.powerKw >= 0 ? Math.min(100, telemetry.powerKw) : 0;
    const mass = telemetry.capacityTenths
      ? Math.min(100, (telemetry.massTenths / telemetry.capacityTenths) * 100)
      : 0;
    this.root.querySelector("#telemetry-bars").innerHTML = `
      ${this.bar("Budget", `$${telemetry.budget}M / $${telemetry.budgetLimit}M`, budget, telemetry.budget > telemetry.budgetLimit)}
      ${this.bar("Energy", `${telemetry.powerKw} kW net`, power, telemetry.powerKw < 0)}
      ${this.bar("Mass", `${(telemetry.massTenths / 10).toFixed(1)}t / ${(telemetry.capacityTenths / 10).toFixed(1)}t`, mass, telemetry.complete && telemetry.massTenths > telemetry.capacityTenths)}
    `;
  }

  bar(label, value, percent, danger) {
    return `<div class="bar-group"><div><span>${label}</span><span>${value}</span></div><div class="bar"><i class="${danger ? "danger" : ""}" style="width:${percent}%"></i></div></div>`;
  }

  renderDialog() {
    this.root.querySelector("#dialog").innerHTML = `<b>Engineer</b><p>${this.message}</p>`;
  }

  bindEvents() {
    const tabs = this.root.querySelector("#stage-tabs");
    tabs.onclick = (event) => {
      const button = event.target.closest("[data-stage]");
      if (!button) return;
      this.activeStage = Number(button.dataset.stage);
      this.renderStages();
      this.bindModuleEvents();
    };
    this.bindModuleEvents();
    this.root.querySelector("#coffee-button").addEventListener("click", () => {
      this.message = this.dialogs.coffee();
      this.renderDialog();
    });
    this.root.querySelector("#launch-button").onclick = () => this.launch();
  }

  bindModuleEvents() {
    this.root.querySelectorAll("[data-option]").forEach((button) => {
      button.addEventListener("click", () => {
        const option = Number(button.dataset.option);
        this.game.modules.forEach((module) => {
          if (module.stage === stages[this.activeStage][1]) module.selected = false;
        });
        const selected = this.game.modules.filter((module) => module.stage === stages[this.activeStage][1])[option];
        selected.selected = true;
        this.game.selectModule(this.activeStage, option);
        this.message = this.dialogs.moduleEvent(this.selectedIds()) || this.message;
        this.renderStages();
        this.renderTelemetry();
        this.renderDialog();
        this.bindEvents();
      });
    });
  }

  launch() {
    const result = this.game.launch();
    if (!result.success) {
      this.message = this.dialogs.launchError(result.errors);
      this.renderDialog();
      return;
    }
    this.message = "Launch confirmed, Chief. Mission camera is live.";
    this.renderDialog();
    this.centralMonitor.renderFlight(result);
    this.root.querySelector("#launch-button").disabled = true;
    window.setTimeout(() => {
      this.root.dispatchEvent(new CustomEvent("launched", { detail: result }));
    }, 2200);
  }
}
