import { Dialogs } from "./dialogs.js";
import { assets } from "./assets.js";

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

  render() {
    this.root.innerHTML = `
      <section class="constructor-layout">
        <aside class="telemetry panel">
          <h2>Live telemetry</h2>
          <div id="telemetry-bars"></div>
          <div id="dialog" class="dialog"></div>
        </aside>
        <section class="monitor panel">
          <p class="eyebrow">ENGINEERING CONSOLE</p>
          <h1>Rocket Constructor</h1>
          <div id="rocket-stack" class="rocket-stack"></div>
          <p class="hint">Parts snap into the assembly grid from Stage 4 to Stage 1.</p>
        </section>
        <aside class="coffee panel" title="Coffee mug easter egg" data-asset-slot="coffee-mug">
          <button id="coffee-button" class="mug" aria-label="Touch coffee mug">COFFEE</button>
          <span>Asset slot: coffee-mug</span>
        </aside>
      </section>
      <section class="bottom-panel panel">
        <nav id="stage-tabs" class="stage-tabs"></nav>
        <div id="module-slots" class="module-slots"></div>
        <button id="launch-button" class="launch-button">LAUNCH</button>
      </section>
    `;
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
          `<button class="stage-tab ${index === this.activeStage ? "active" : ""}" data-stage="${index}">${label}</button>`,
      )
      .join("");

    const stage = stages[this.activeStage][1];
    const slots = this.root.querySelector("#module-slots");
    slots.innerHTML = this.game.modules
      .filter((module) => module.stage === stage)
      .map(
        (module, option) => `
          <button class="module-slot ${module.selected ? "selected" : ""}" data-option="${option}">
            <img class="module-asset" src="${assets.modules[stage === "launch_vehicle" ? "launchVehicle" : stage][module.id]}" alt="" />
            <strong>${module.name}</strong>
            <span>$${module.costM}M · ${(module.massTenths / 10).toFixed(1)}t</span>
            <small>${module.powerKw > 0 ? "+" : ""}${module.powerKw} kW${module.capacityTenths ? ` · ${(module.capacityTenths / 10).toFixed(1)}t capacity` : ""}</small>
          </button>`,
      )
      .join("");

    const stack = this.root.querySelector("#rocket-stack");
    stack.innerHTML = [...stages]
      .reverse()
      .map(([label, stage]) => {
        const selected = this.game.modules.find((module) => module.stage === stage && module.selected);
        return `<div class="rocket-layer"><span>${label}</span><strong>${selected?.name || "EMPTY BAY"}</strong></div>`;
      })
      .join("");
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
    this.root.querySelectorAll("[data-stage]").forEach((button) => {
      button.addEventListener("click", () => {
        this.activeStage = Number(button.dataset.stage);
        this.renderStages();
        this.bindModuleEvents();
      });
    });
    this.bindModuleEvents();
    this.root.querySelector("#coffee-button").addEventListener("click", () => {
      this.message = this.dialogs.coffee();
      this.renderDialog();
    });
    this.root.querySelector("#launch-button").addEventListener("click", () => this.launch());
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
    this.root.dispatchEvent(new CustomEvent("launched", { detail: result }));
  }
}
