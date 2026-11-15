use orbit_core::{
    BUDGET_LIMIT, GamePhase, GameState, MISSION_DESCRIPTION, MISSION_REQUIREMENTS, MISSION_TITLE,
    MODULES, ModuleStage, NAVIGATOR_DIALOG, RocketModule, TEAM_DIALOGS, TEAM_EMOTIONS, TEAM_ROLES,
};
use serde_json::json;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct OrbitGame {
    state: GameState,
}

#[wasm_bindgen]
impl OrbitGame {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            state: GameState::new(),
        }
    }

    pub fn phase(&self) -> String {
        phase_name(self.state.phase()).to_string()
    }

    pub fn team_dialog_index(&self) -> usize {
        self.state.team_dialog_index()
    }

    pub fn current_team_member(&self) -> usize {
        self.state.current_team_member()
    }

    pub fn play(&mut self) -> bool {
        self.state.play()
    }

    pub fn select_mission(&mut self, mission: u8) -> bool {
        self.state.select_mission(mission)
    }

    pub fn complete_briefing(&mut self) -> bool {
        self.state.complete_briefing()
    }

    pub fn next_team_dialog(&mut self) -> bool {
        self.state.next_team_dialog()
    }

    pub fn start_constructor(&mut self) -> bool {
        self.state.start_constructor()
    }

    pub fn select_module(&mut self, stage: u8, option: u8) -> bool {
        self.state.select_module(stage, option)
    }

    pub fn telemetry_json(&self) -> String {
        let telemetry = self.state.validation().telemetry;
        json!({
            "budget": telemetry.budget,
            "budgetLimit": BUDGET_LIMIT,
            "massTenths": telemetry.mass_tenths,
            "capacityTenths": telemetry.capacity_tenths,
            "powerKw": telemetry.power,
            "complete": telemetry.complete
        })
        .to_string()
    }

    pub fn validation_json(&self) -> String {
        let validation = self.state.validation();
        json!({
            "valid": validation.valid,
            "errors": validation.errors,
            "telemetry": serde_json::from_str::<serde_json::Value>(&self.telemetry_json()).unwrap_or_default()
        })
        .to_string()
    }

    pub fn launch(&mut self) -> String {
        let validation = self.state.validation();
        if !validation.valid {
            return launch_error_json(validation.errors);
        }
        if self.state.launch() {
            json!({
                "success": true,
                "phase": self.phase(),
                "tier": ending_name(self.state.ending())
            })
            .to_string()
        } else {
            json!({"success": false, "error": "invalid_phase"}).to_string()
        }
    }

    pub fn collect_sample(&mut self) -> bool {
        self.state.collect_sample()
    }

    pub fn discover_secret_part(&mut self) -> bool {
        self.state.discover_secret_part()
    }

    pub fn finish_exploration(&mut self) -> bool {
        self.state.finish_exploration()
    }

    pub fn reward_json(&self) -> String {
        let tier = self.state.ending();
        let base_reward = match tier {
            Some(orbit_core::EndingTier::Bronze) => 50,
            Some(orbit_core::EndingTier::Silver) => 120,
            Some(orbit_core::EndingTier::Gold) => 250,
            None => 0,
        };
        let energy_bonus = match tier {
            Some(orbit_core::EndingTier::Bronze) | None => 0,
            Some(orbit_core::EndingTier::Silver) => 15,
            Some(orbit_core::EndingTier::Gold) => 40,
        };
        let telemetry = self.state.validation().telemetry;
        let sample_reward = self.state.exploration_samples() as u32 * 5;
        let secret_energy = if self.state.has_secret_part() { 30 } else { 0 };
        json!({
            "tier": ending_name(tier),
            "baseRewardM": base_reward,
            "sampleRewardM": sample_reward,
            "unspentBudgetM": BUDGET_LIMIT.saturating_sub(telemetry.budget),
            "nextMissionBudgetM": base_reward + sample_reward + BUDGET_LIMIT.saturating_sub(telemetry.budget),
            "energyBonusKw": energy_bonus + secret_energy,
            "secretPart": self.state.has_secret_part(),
            "samples": self.state.exploration_samples(),
            "title": if matches!(tier, Some(orbit_core::EndingTier::Gold)) {
                "Xeno-Horizon Pioneer"
            } else {
                ""
            }
        })
        .to_string()
    }
}

#[wasm_bindgen]
pub fn mission_title() -> String {
    MISSION_TITLE.to_string()
}

#[wasm_bindgen]
pub fn mission_description() -> String {
    MISSION_DESCRIPTION.to_string()
}

#[wasm_bindgen]
pub fn mission_requirements() -> String {
    MISSION_REQUIREMENTS.to_string()
}

#[wasm_bindgen]
pub fn navigator_dialog() -> String {
    NAVIGATOR_DIALOG.to_string()
}

#[wasm_bindgen]
pub fn modules_json() -> String {
    json!(MODULES.iter().map(module_json).collect::<Vec<_>>()).to_string()
}

#[wasm_bindgen]
pub fn team_dialog(index: usize) -> Result<String, JsValue> {
    TEAM_DIALOGS
        .get(index)
        .map(|dialog| dialog.to_string())
        .ok_or_else(|| JsValue::from_str("Team dialog index is out of range"))
}

#[wasm_bindgen]
pub fn team_role(index: usize) -> Result<String, JsValue> {
    TEAM_ROLES
        .get(index)
        .map(|role| role.to_string())
        .ok_or_else(|| JsValue::from_str("Team role index is out of range"))
}

#[wasm_bindgen]
pub fn team_emotion(index: usize) -> Result<String, JsValue> {
    TEAM_EMOTIONS
        .get(index)
        .map(|emotion| emotion.to_string())
        .ok_or_else(|| JsValue::from_str("Team emotion index is out of range"))
}

fn module_json(module: &RocketModule) -> serde_json::Value {
    json!({
        "id": module.id,
        "name": module.name,
        "stage": stage_name(module.stage),
        "costM": module.cost_m,
        "massTenths": module.mass_tenths,
        "powerKw": module.power_kw,
        "capacityTenths": module.capacity_tenths
    })
}

fn stage_name(stage: ModuleStage) -> &'static str {
    match stage {
        ModuleStage::Payload => "payload",
        ModuleStage::Power => "power",
        ModuleStage::Hull => "hull",
        ModuleStage::LaunchVehicle => "launch_vehicle",
    }
}

fn launch_error_json(errors: Vec<&str>) -> String {
    let message = errors
        .first()
        .map(|error| match *error {
            "budget" => "Whoa there, billionaire! Our cap is $400M, not 'infinite.' Trim the fancy hardware, or I'm putting the extra millions straight on your personal credit card—with interest.",
            "power" => "We're running on hopes and static electricity here! Your instruments will die the second they touch the ice. Upgrade the power bay or pick a less hungry gadget.",
            "mass" => "Physics says 'no,' Chief. With that much mass on top, this rocket's only destination is sideways into the fence. Grab a heavier booster or put the payload on a diet!",
            _ => "Call me old-fashioned, Chief, but I prefer flying rockets that aren't missing entire sections. Fill all four bays before hitting the big green button.",
        })
        .unwrap_or("Rocket validation failed.");
    json!({"success": false, "errors": errors, "message": message}).to_string()
}

fn ending_name(ending: Option<orbit_core::EndingTier>) -> &'static str {
    match ending {
        Some(orbit_core::EndingTier::Bronze) => "bronze",
        Some(orbit_core::EndingTier::Silver) => "silver",
        Some(orbit_core::EndingTier::Gold) => "gold",
        None => "",
    }
}

fn phase_name(phase: GamePhase) -> &'static str {
    match phase {
        GamePhase::Menu => "menu",
        GamePhase::Missions => "missions",
        GamePhase::Briefing => "briefing",
        GamePhase::Details => "details",
        GamePhase::Constructor => "constructor",
        GamePhase::Exploration => "exploration",
        GamePhase::Summary => "summary",
    }
}

impl Default for OrbitGame {
    fn default() -> Self {
        Self::new()
    }
}
