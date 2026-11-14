import { createPlayer } from "./characters.js";
import { getDialogueLine } from "./dialogue.js";

export class WebGame {
  constructor(rust, dialogue) {
    this.rust = rust;
    this.player = createPlayer();
    this.dialogue = dialogue;
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
}
