mod game_state;
pub mod mission;

pub use game_state::{GamePhase, GameState};
pub use mission::{
    calculate_mission_result, check_collision, Astronaut, Booster, BUDGET_LIMIT, EndingTier,
    GameState as MissionState, Hull, Item, ItemKind, LaunchError, MISSION_DESCRIPTION,
    MISSION_REQUIREMENTS, MISSION_TITLE, MODULES, ModuleStage, NAVIGATOR_DIALOG, Payload,
    PowerSystem, RocketConfig, RocketModule, RocketTelemetry, TEAM_DIALOGS, TEAM_EMOTIONS,
    TEAM_ROLES, Telemetry, Validation, MissionSummary,
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
    fn rocket_config_calculates_and_validates_telemetry() {
        let rocket = RocketConfig {
            payload: Some(Payload::BaseDrill),
            power_system: Some(PowerSystem::Solar),
            hull: Some(Hull::Standard),
            booster: Some(Booster::ArrowS),
        };
        assert_eq!(
            rocket.calculate_telemetry(),
            RocketTelemetry {
                total_cost_m: 240,
                total_mass_tenths: 19,
                power_balance_kw: 10,
            }
        );
        assert_eq!(rocket.validate_for_launch(), Ok(()));
    }

    #[test]
    fn rocket_config_rejects_power_and_capacity_failures() {
        let no_power = RocketConfig {
            payload: Some(Payload::MarsSar),
            power_system: Some(PowerSystem::Solar),
            hull: Some(Hull::Standard),
            booster: Some(Booster::ArrowS),
        };
        assert!(matches!(
            no_power.validate_for_launch(),
            Err(LaunchError::InsufficientPower { .. })
        ));

        let over_capacity = RocketConfig {
            payload: Some(Payload::QuantumSpectrometer),
            power_system: Some(PowerSystem::Rtg),
            hull: Some(Hull::Thermal),
            booster: Some(Booster::ArrowS),
        };
        assert!(matches!(
            over_capacity.validate_for_launch(),
            Err(LaunchError::OverBudget { .. })
        ));
    }

    #[test]
    fn exploration_collision_and_rewards_are_deterministic() {
        let astronaut = Astronaut {
            x: 10.0,
            y: 10.0,
            velocity: 2.0,
            width: 12.0,
            height: 18.0,
        };
        let sample = Item {
            x: 18.0,
            y: 20.0,
            width: 8.0,
            height: 8.0,
            kind: ItemKind::MarsSample,
        };
        assert!(check_collision(&astronaut, &sample));

        let rocket = RocketConfig {
            payload: Some(Payload::BaseDrill),
            power_system: Some(PowerSystem::Rtg),
            hull: Some(Hull::Standard),
            booster: Some(Booster::TitanM),
        };
        let summary = calculate_mission_result(&rocket, 2, true);
        assert_eq!(summary.tier, EndingTier::Silver);
        assert_eq!(summary.base_reward_m, 120);
        assert_eq!(summary.sample_reward_m, 10);
        assert_eq!(summary.energy_bonus_kw, 45);
        assert_eq!(summary.total_reward_m, 130);
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
