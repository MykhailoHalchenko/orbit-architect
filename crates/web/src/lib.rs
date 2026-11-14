use orbit_core::{
    GamePhase, GameState, MISSION_DESCRIPTION, MISSION_REQUIREMENTS, MISSION_TITLE,
    NAVIGATOR_DIALOG, TEAM_DIALOGS, TEAM_EMOTIONS, TEAM_ROLES,
};
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

fn phase_name(phase: GamePhase) -> &'static str {
    match phase {
        GamePhase::Menu => "menu",
        GamePhase::Missions => "missions",
        GamePhase::Briefing => "briefing",
        GamePhase::Details => "details",
        GamePhase::Constructor => "constructor",
    }
}
