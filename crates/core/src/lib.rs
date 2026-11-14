pub const MISSION_TITLE: &str = "Oasis Under the Ice";
pub const MISSION_DESCRIPTION: &str =
    "Landing on the South Pole of Mars, exploration of the subglacial layer.";
pub const MISSION_REQUIREMENTS: &str =
    "Install a drill or radar, stay within the budget, and respect structural mass.";

pub const NAVIGATOR_DIALOG: &str = "Team, eyes on the screen. Our first target is the south polar cap of Mars, the 'Oasis Under the Ice' location. Orbital scanners have detected anomalous thermal activity beneath the ice sheet there. Our mission is to assemble the spacecraft, execute a pinpoint landing in the designated sector, and confirm the presence of subsurface water.";

pub const TEAM_DIALOGS: [&str; 3] = [
    "Let me warn you right away: the grant for this mission is strictly limited. Don't try to cram in the most expensive fuel tanks and premium hull plating, or our budget will blow up before we even launch.",
    "The polar zone means heavy winds and freezing temperatures. Keep an eye on the thrust-to-weight ratio: if you overload the rocket with extra modules, we simply won't reach the required trajectory.",
    "There's no point in flying without scientific equipment! Make sure to install a drilling rig or ground-penetrating radar on board, otherwise we won't be able to break through the ice and collect samples.",
];

pub const TEAM_ROLES: [&str; 3] = ["Financier", "Engineer", "Scientist"];
pub const TEAM_EMOTIONS: [&str; 3] = ["strict", "focused", "inspired"];

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GamePhase {
    Menu,
    Missions,
    Briefing,
    Details,
    Constructor,
}

pub struct GameState {
    phase: GamePhase,
    team_dialog_index: usize,
}

impl GameState {
    pub fn new() -> Self {
        Self {
            phase: GamePhase::Menu,
            team_dialog_index: 0,
        }
    }

    pub fn phase(&self) -> GamePhase {
        self.phase
    }

    pub fn team_dialog_index(&self) -> usize {
        self.team_dialog_index
    }

    pub fn current_team_member(&self) -> usize {
        self.team_dialog_index
    }

    pub fn play(&mut self) -> bool {
        self.transition(GamePhase::Menu, GamePhase::Missions)
    }

    pub fn select_mission(&mut self, mission: u8) -> bool {
        mission == 1 && self.transition(GamePhase::Missions, GamePhase::Briefing)
    }

    pub fn complete_briefing(&mut self) -> bool {
        self.transition(GamePhase::Briefing, GamePhase::Details)
    }

    pub fn next_team_dialog(&mut self) -> bool {
        if self.phase != GamePhase::Details || self.team_dialog_index + 1 >= TEAM_DIALOGS.len() {
            return false;
        }
        self.team_dialog_index += 1;
        true
    }

    pub fn team_dialogs_complete(&self) -> bool {
        self.team_dialog_index + 1 >= TEAM_DIALOGS.len()
    }

    pub fn start_constructor(&mut self) -> bool {
        if !self.team_dialogs_complete() {
            return false;
        }
        self.transition(GamePhase::Details, GamePhase::Constructor)
    }

    fn transition(&mut self, from: GamePhase, to: GamePhase) -> bool {
        if self.phase != from {
            return false;
        }
        self.phase = to;
        true
    }
}

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    fn mission_flow_requires_all_team_dialogs() {
        let mut state = GameState::new();
        assert!(state.play());
        assert!(state.select_mission(1));
        assert!(state.complete_briefing());
        assert!(!state.start_constructor());
        assert!(state.next_team_dialog());
        assert!(state.next_team_dialog());
        assert!(state.start_constructor());
        assert_eq!(state.phase(), GamePhase::Constructor);
    }

    #[test]
    fn team_dialog_metadata_matches_dialogs() {
        assert_eq!(TEAM_ROLES.len(), TEAM_DIALOGS.len());
        assert_eq!(TEAM_EMOTIONS.len(), TEAM_DIALOGS.len());
    }
}
