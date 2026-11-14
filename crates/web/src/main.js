import init, {
  OrbitGame,
  mission_description,
  mission_requirements,
  mission_title,
  navigator_dialog,
  team_dialog,
  team_emotion,
  team_role,
} from "../pkg/orbit_web.js";
import { assets } from "./assets.js";
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
    const game = new WebGame(rust.game, dialogue);

    window.orbitGame = game;
    window.orbitAssets = assets;
    window.orbitMission = Object.freeze({
      title: mission_title(),
      description: mission_description(),
      requirements: mission_requirements(),
      navigatorDialog: navigator_dialog(),
      dialogue,
    });

    status.textContent = "Rust WebAssembly game data is ready.";
  })
  .catch((error) => {
    status.textContent = "Failed to load Rust WebAssembly.";
    console.error(error);
  });
