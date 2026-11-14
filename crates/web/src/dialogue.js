import { createCharacter } from "./characters.js";

export function createTeamDialogue(rust, count = 3) {
  return Array.from({ length: count }, (_, index) =>
    createCharacter({
      role: rust.teamRole(index),
      emotion: rust.teamEmotion(index),
      dialogue: rust.teamDialog(index),
    }),
  );
}

export function getDialogueLine(dialogue, index) {
  const line = dialogue[index];
  if (!line) {
    throw new RangeError(`Dialogue index ${index} is out of range`);
  }
  return line;
}
