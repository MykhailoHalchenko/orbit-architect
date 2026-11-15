use super::mission::{
    BUDGET_LIMIT, EndingTier, MODULES, ModuleStage, RocketModule, TEAM_DIALOGS, Telemetry,
    Validation,
};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GamePhase {
    Menu,
    Missions,
    Briefing,
    Details,
    Constructor,
    Exploration,
    Summary,
}

struct RocketState {
    selected: [Option<usize>; 4],
    samples: u8,
    secret_part: bool,
    ending: Option<EndingTier>,
}

impl RocketState {
    fn new() -> Self {
        Self {
            selected: [None; 4],
            samples: 0,
            secret_part: false,
            ending: None,
        }
    }

    fn select(&mut self, stage: u8, option: u8) -> bool {
        let stage_index = stage as usize;
        if stage_index > 3 || option > 2 {
            return false;
        }
        let module_index = stage_index * 3 + option as usize;
        if MODULES[module_index].stage != stage_for_index(stage_index) {
            return false;
        }
        self.selected[stage_index] = Some(module_index);
        true
    }

    fn telemetry(&self) -> Telemetry {
        let mut budget = 0;
        let mut mass_tenths = 0;
        let mut power = 0;
        let mut capacity_tenths = 0;
        for index in self.selected.into_iter().flatten() {
            let module = MODULES[index];
            budget += module.cost_m;
            mass_tenths += module.mass_tenths;
            power += module.power_kw;
            capacity_tenths = capacity_tenths.max(module.capacity_tenths);
        }
        Telemetry {
            budget,
            mass_tenths,
            power,
            capacity_tenths,
            complete: self.selected.iter().all(Option::is_some),
        }
    }

    fn validation(&self) -> Validation {
        let telemetry = self.telemetry();
        let mut errors = Vec::new();
        if !telemetry.complete {
            errors.push("missing_parts");
        }
        if telemetry.budget > BUDGET_LIMIT {
            errors.push("budget");
        }
        if telemetry.power < 0 {
            errors.push("power");
        }
        if telemetry.complete && telemetry.mass_tenths > telemetry.capacity_tenths {
            errors.push("mass");
        }
        Validation {
            valid: errors.is_empty(),
            errors,
            telemetry,
        }
    }
}

fn stage_for_index(index: usize) -> ModuleStage {
    match index {
        0 => ModuleStage::Payload,
        1 => ModuleStage::Power,
        2 => ModuleStage::Hull,
        _ => ModuleStage::LaunchVehicle,
    }
}

pub struct GameState {
    phase: GamePhase,
    team_dialog_index: usize,
    rocket: RocketState,
}

impl GameState {
    pub fn new() -> Self {
        Self {
            phase: GamePhase::Menu,
            team_dialog_index: 0,
            rocket: RocketState::new(),
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
        self.team_dialogs_complete() && self.transition(GamePhase::Details, GamePhase::Constructor)
    }

    pub fn select_module(&mut self, stage: u8, option: u8) -> bool {
        self.phase == GamePhase::Constructor && self.rocket.select(stage, option)
    }

    pub fn validation(&self) -> Validation {
        self.rocket.validation()
    }

    pub fn selected_module(&self, stage: u8) -> Option<RocketModule> {
        self.rocket
            .selected
            .get(stage as usize)
            .copied()
            .flatten()
            .map(|index| MODULES[index])
    }

    pub fn launch(&mut self) -> bool {
        let validation = self.validation();
        if !validation.valid || self.phase != GamePhase::Constructor {
            return false;
        }
        let telemetry = validation.telemetry;
        self.rocket.ending = Some(Self::determine_ending(&self.rocket.selected, telemetry));
        self.phase = GamePhase::Exploration;
        true
    }

    pub fn collect_sample(&mut self) -> bool {
        if self.phase != GamePhase::Exploration || self.rocket.samples >= 3 {
            return false;
        }
        self.rocket.samples += 1;
        true
    }

    pub fn discover_secret_part(&mut self) -> bool {
        if self.phase != GamePhase::Exploration || self.rocket.secret_part {
            return false;
        }
        self.rocket.secret_part = true;
        true
    }

    pub fn finish_exploration(&mut self) -> bool {
        if self.phase != GamePhase::Exploration {
            return false;
        }
        self.phase = GamePhase::Summary;
        true
    }

    pub fn exploration_samples(&self) -> u8 {
        self.rocket.samples
    }

    pub fn has_secret_part(&self) -> bool {
        self.rocket.secret_part
    }

    pub fn ending(&self) -> Option<EndingTier> {
        self.rocket.ending
    }

    fn determine_ending(selected: &[Option<usize>; 4], telemetry: Telemetry) -> EndingTier {
        let payload = selected[0].map(|index| MODULES[index].id);
        let booster = selected[3].map(|index| MODULES[index].id);
        if payload == Some("mars-sar") && (360..=395).contains(&telemetry.budget) {
            EndingTier::Gold
        } else if payload == Some("base-drill")
            && (290..=400).contains(&telemetry.budget)
            && (booster == Some("titan-m") || selected[1] == Some(5))
        {
            EndingTier::Silver
        } else {
            EndingTier::Bronze
        }
    }

    fn transition(&mut self, from: GamePhase, to: GamePhase) -> bool {
        if self.phase != from {
            return false;
        }
        self.phase = to;
        true
    }
}

impl Default for GameState {
    fn default() -> Self {
        Self::new()
    }
}
