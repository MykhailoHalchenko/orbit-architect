import { createPlayer } from "./characters.js";
import { getDialogueLine } from "./dialogue.js";

export class WebGame {
  constructor(rust, dialogue, modules) {
    this.rust = rust;
    this.player = createPlayer();
    this.dialogue = dialogue;
    this.modules = modules;
  }

  get phase() {
    return this.rust.phase();
  }

  get currentCharacter() {
    const index = this.rust.current_team_member();
    return getDialogueLine(this.dialogue, index);
  }

  play() {
    return this.rust.play();
  }

  selectMission(mission) {
    return this.rust.select_mission(mission);
  }

  completeBriefing() {
    return this.rust.complete_briefing();
  }

  nextCharacter() {
    return this.rust.next_team_dialog();
  }

  startConstructor() {
    return this.rust.start_constructor();
  }

  selectModule(stage, option) {
    return this.rust.select_module(stage, option);
  }

  get telemetry() {
    return JSON.parse(this.rust.telemetry_json());
  }

  validate() {
    return JSON.parse(this.rust.validation_json());
  }

  launch() {
    return JSON.parse(this.rust.launch());
  }

  collectSample() {
    return this.rust.collect_sample();
  }

  discoverSecretPart() {
    return this.rust.discover_secret_part();
  }

  finishExploration() {
    return this.rust.finish_exploration();
  }

  reward() {
    return JSON.parse(this.rust.reward_json());
  }
}
