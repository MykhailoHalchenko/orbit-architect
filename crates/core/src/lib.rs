mod game_state;
mod mission;

pub use game_state::{GamePhase, GameState};
pub use mission::{
    BUDGET_LIMIT, EndingTier, MISSION_DESCRIPTION, MISSION_REQUIREMENTS, MISSION_TITLE, MODULES,
    ModuleStage, NAVIGATOR_DIALOG, RocketModule, TEAM_DIALOGS, TEAM_EMOTIONS, TEAM_ROLES,
    Telemetry, Validation,
};

pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert_eq!(add(2, 2), 4);
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

    #[test]
    fn constructor_has_exactly_twenty_valid_combinations() {
        let mut valid = 0;
        for payload in 0..3 {
            for power in 0..3 {
                for hull in 0..3 {
                    for booster in 0..3 {
                        let mut state = constructor_state();
                        assert!(state.select_module(0, payload));
                        assert!(state.select_module(1, power));
                        assert!(state.select_module(2, hull));
                        assert!(state.select_module(3, booster));
                        if state.validation().valid {
                            valid += 1;
                        }
                    }
                }
            }
        }
        assert_eq!(valid, 20);
    }

    fn constructor_state() -> GameState {
        let mut state = GameState::new();
        state.play();
        state.select_mission(1);
        state.complete_briefing();
        state.next_team_dialog();
        state.next_team_dialog();
        state.start_constructor();
        state
    }
}
