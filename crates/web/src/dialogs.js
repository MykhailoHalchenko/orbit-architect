const launchMessages = {
  budget:
    "Whoa there, billionaire! Our cap is $400M, not 'infinite.' Trim the fancy hardware, or I'm putting the extra millions straight on your personal credit card—with interest.",
  power:
    "We're running on hopes and static electricity here! Your instruments will die the second they touch the ice. Upgrade the power bay or pick a less hungry gadget.",
  mass:
    "Physics says 'no,' Chief. With that much mass on top, this rocket's only destination is sideways into the fence. Grab a heavier booster or put the payload on a diet!",
  missing_parts:
    "Call me old-fashioned, Chief, but I prefer flying rockets that aren't missing entire sections. Fill all four bays before hitting the big green button.",
};

export class Dialogs {
  constructor(dialogue) {
    this.dialogue = dialogue;
  }

  engineerEnter() {
    return "Alright, blueprints are live. Pick your science toy first, keep it powered, wrap it in a decent hull, and bolt on a booster that won't turn our launchpad into a new Martian crater.";
  }

  coffee() {
    return "Touch that mug and you're writing the orbital trajectory math by hand. That triple espresso is legally classified as rocket propellant.";
  }

  moduleEvent(selectedIds) {
    if (
      selectedIds.includes("rtg-gold") &&
      (selectedIds.includes("mars-sar") || selectedIds.includes("quantum-spectrometer"))
    ) {
      return "Oh, pure poetry! With that sensor and nuclear power, we won't just find water under the ice—we'll know what's swimming in it before we even land!";
    }
    if (selectedIds.includes("quantum-spectrometer") || selectedIds.includes("colossus-h")) {
      return "I can practically hear our budget crying. Remember, $400M has to cover the whole rocket—not just one museum-grade paperweight.";
    }
    return null;
  }

  launchError(errors) {
    return launchMessages[errors[0]] || "Rocket validation failed.";
  }

  currentTeamLine(index) {
    return this.dialogue[index];
  }
}
