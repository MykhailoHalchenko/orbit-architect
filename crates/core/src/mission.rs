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
pub const BUDGET_LIMIT: u32 = 400;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ModuleStage {
    Payload,
    Power,
    Hull,
    LaunchVehicle,
}

#[derive(Clone, Copy, Debug)]
pub struct RocketModule {
    pub id: &'static str,
    pub name: &'static str,
    pub stage: ModuleStage,
    pub cost_m: u32,
    pub mass_tenths: u32,
    pub power_kw: i32,
    pub capacity_tenths: u32,
}

pub const MODULES: [RocketModule; 12] = [
    RocketModule {
        id: "base-drill",
        name: "Base Drill",
        stage: ModuleStage::Payload,
        cost_m: 80,
        mass_tenths: 12,
        power_kw: -30,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "mars-sar",
        name: "MARS-SAR Radar",
        stage: ModuleStage::Payload,
        cost_m: 180,
        mass_tenths: 20,
        power_kw: -65,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "quantum-spectrometer",
        name: "Quantum Spectrometer",
        stage: ModuleStage::Payload,
        cost_m: 280,
        mass_tenths: 28,
        power_kw: -110,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "solar-wing-v1",
        name: "Solar-Wing v1",
        stage: ModuleStage::Power,
        cost_m: 40,
        mass_tenths: 4,
        power_kw: 40,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "powercache-x",
        name: "PowerCache-X",
        stage: ModuleStage::Power,
        cost_m: 60,
        mass_tenths: 8,
        power_kw: 70,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "rtg-gold",
        name: "RTG-Gold (Nuclear)",
        stage: ModuleStage::Power,
        cost_m: 150,
        mass_tenths: 15,
        power_kw: 120,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "standard-hull",
        name: "Standard Hull",
        stage: ModuleStage::Hull,
        cost_m: 20,
        mass_tenths: 3,
        power_kw: 0,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "thermal-shield",
        name: "Thermal Shield",
        stage: ModuleStage::Hull,
        cost_m: 45,
        mass_tenths: 7,
        power_kw: 0,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "deep-space-relay",
        name: "Deep-Space Relay",
        stage: ModuleStage::Hull,
        cost_m: 55,
        mass_tenths: 5,
        power_kw: 0,
        capacity_tenths: 0,
    },
    RocketModule {
        id: "arrow-s",
        name: "Arrow-S",
        stage: ModuleStage::LaunchVehicle,
        cost_m: 100,
        mass_tenths: 0,
        power_kw: 0,
        capacity_tenths: 35,
    },
    RocketModule {
        id: "titan-m",
        name: "Titan-M",
        stage: ModuleStage::LaunchVehicle,
        cost_m: 150,
        mass_tenths: 0,
        power_kw: 0,
        capacity_tenths: 55,
    },
    RocketModule {
        id: "colossus-h",
        name: "Colossus-H",
        stage: ModuleStage::LaunchVehicle,
        cost_m: 250,
        mass_tenths: 0,
        power_kw: 0,
        capacity_tenths: 80,
    },
];

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum EndingTier {
    Bronze,
    Silver,
    Gold,
}

#[derive(Clone, Copy, Debug)]
pub struct Telemetry {
    pub budget: u32,
    pub mass_tenths: u32,
    pub power: i32,
    pub capacity_tenths: u32,
    pub complete: bool,
}

pub struct Validation {
    pub valid: bool,
    pub errors: Vec<&'static str>,
    pub telemetry: Telemetry,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum GameState {
    MenuIdle,
    ConstructorBuilding,
    LaunchSequence,
    MarsExploration,
    MissionEnd,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Payload {
    BaseDrill,
    MarsSar,
    QuantumSpectrometer,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PowerSystem {
    Solar,
    PowerCache,
    Rtg,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Hull {
    Standard,
    Thermal,
    Relay,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Booster {
    ArrowS,
    TitanM,
    ColossusH,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct RocketTelemetry {
    pub total_cost_m: u32,
    pub total_mass_tenths: u32,
    pub power_balance_kw: i32,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LaunchError {
    MissingPayload,
    MissingPowerSystem,
    MissingHull,
    MissingBooster,
    OverBudget { cost_m: u32, limit_m: u32 },
    InsufficientPower { balance_kw: i32 },
    OverCapacity { mass_tenths: u32, capacity_tenths: u32 },
}

#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct RocketConfig {
    pub payload: Option<Payload>,
    pub power_system: Option<PowerSystem>,
    pub hull: Option<Hull>,
    pub booster: Option<Booster>,
}

impl RocketConfig {
    pub fn calculate_telemetry(&self) -> RocketTelemetry {
        let mut telemetry = RocketTelemetry {
            total_cost_m: 0,
            total_mass_tenths: 0,
            power_balance_kw: 0,
        };
        if let Some(payload) = self.payload {
            add_payload_telemetry(payload, &mut telemetry);
        }
        if let Some(power_system) = self.power_system {
            add_power_telemetry(power_system, &mut telemetry);
        }
        if let Some(hull) = self.hull {
            add_hull_telemetry(hull, &mut telemetry);
        }
        if let Some(booster) = self.booster {
            add_booster_telemetry(booster, &mut telemetry);
        }
        telemetry
    }

    pub fn validate_for_launch(&self) -> Result<(), LaunchError> {
        let Some(_payload) = self.payload else {
            return Err(LaunchError::MissingPayload);
        };
        let Some(_power_system) = self.power_system else {
            return Err(LaunchError::MissingPowerSystem);
        };
        let Some(_hull) = self.hull else {
            return Err(LaunchError::MissingHull);
        };
        let Some(booster) = self.booster else {
            return Err(LaunchError::MissingBooster);
        };

        let telemetry = self.calculate_telemetry();
        if telemetry.total_cost_m > BUDGET_LIMIT {
            return Err(LaunchError::OverBudget {
                cost_m: telemetry.total_cost_m,
                limit_m: BUDGET_LIMIT,
            });
        }
        if telemetry.power_balance_kw < 0 {
            return Err(LaunchError::InsufficientPower {
                balance_kw: telemetry.power_balance_kw,
            });
        }
        let capacity_tenths = booster_capacity(booster);
        if telemetry.total_mass_tenths > capacity_tenths {
            return Err(LaunchError::OverCapacity {
                mass_tenths: telemetry.total_mass_tenths,
                capacity_tenths,
            });
        }
        Ok(())
    }
}

fn add_payload_telemetry(payload: Payload, telemetry: &mut RocketTelemetry) {
    let (cost_m, mass_tenths, power_balance_kw) = match payload {
        Payload::BaseDrill => (80, 12, -30),
        Payload::MarsSar => (180, 20, -65),
        Payload::QuantumSpectrometer => (280, 28, -110),
    };
    telemetry.total_cost_m += cost_m;
    telemetry.total_mass_tenths += mass_tenths;
    telemetry.power_balance_kw += power_balance_kw;
}

fn add_power_telemetry(power_system: PowerSystem, telemetry: &mut RocketTelemetry) {
    let (cost_m, mass_tenths, power_balance_kw) = match power_system {
        PowerSystem::Solar => (40, 4, 40),
        PowerSystem::PowerCache => (60, 8, 70),
        PowerSystem::Rtg => (150, 15, 120),
    };
    telemetry.total_cost_m += cost_m;
    telemetry.total_mass_tenths += mass_tenths;
    telemetry.power_balance_kw += power_balance_kw;
}

fn add_hull_telemetry(hull: Hull, telemetry: &mut RocketTelemetry) {
    let (cost_m, mass_tenths) = match hull {
        Hull::Standard => (20, 3),
        Hull::Thermal => (45, 7),
        Hull::Relay => (55, 5),
    };
    telemetry.total_cost_m += cost_m;
    telemetry.total_mass_tenths += mass_tenths;
}

fn add_booster_telemetry(booster: Booster, telemetry: &mut RocketTelemetry) {
    telemetry.total_cost_m += match booster {
        Booster::ArrowS => 100,
        Booster::TitanM => 150,
        Booster::ColossusH => 250,
    };
}

fn booster_capacity(booster: Booster) -> u32 {
    match booster {
        Booster::ArrowS => 35,
        Booster::TitanM => 55,
        Booster::ColossusH => 80,
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Astronaut {
    pub x: f32,
    pub y: f32,
    pub velocity: f32,
    pub width: f32,
    pub height: f32,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ItemKind {
    MarsSample,
    AlienTech,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Item {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
    pub kind: ItemKind,
}

pub fn check_collision(player: &Astronaut, item: &Item) -> bool {
    player.x < item.x + item.width
        && player.x + player.width > item.x
        && player.y < item.y + item.height
        && player.y + player.height > item.y
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct MissionSummary {
    pub tier: EndingTier,
    pub base_reward_m: u32,
    pub sample_reward_m: u32,
    pub energy_bonus_kw: i32,
    pub total_reward_m: u32,
}

pub fn calculate_mission_result(
    rocket: &RocketConfig,
    collected_samples: u8,
    alien_tech_found: bool,
) -> MissionSummary {
    let tier = match rocket.payload {
        Some(Payload::MarsSar) => EndingTier::Gold,
        Some(Payload::BaseDrill)
            if rocket.booster == Some(Booster::TitanM)
                || rocket.power_system == Some(PowerSystem::Rtg) =>
        {
            EndingTier::Silver
        }
        _ => EndingTier::Bronze,
    };
    let base_reward_m = match tier {
        EndingTier::Bronze => 50,
        EndingTier::Silver => 120,
        EndingTier::Gold => 250,
    };
    let energy_bonus_kw = match tier {
        EndingTier::Bronze => 0,
        EndingTier::Silver => 15,
        EndingTier::Gold => 40,
    } + if alien_tech_found { 30 } else { 0 };
    let sample_reward_m = u32::from(collected_samples) * 5;

    MissionSummary {
        tier,
        base_reward_m,
        sample_reward_m,
        energy_bonus_kw,
        total_reward_m: base_reward_m + sample_reward_m,
    }
}

#[cfg(target_arch = "wasm32")]
#[allow(dead_code)]
unsafe extern "C" {
    pub fn update_ui_telemetry(
        total_cost_m: u32,
        total_mass_tenths: u32,
        power_balance_kw: i32,
    );
}

#[unsafe(no_mangle)]
pub extern "C" fn set_rocket_part(stage: i32, part_id: i32) -> bool {
    (0..4).contains(&stage) && (0..3).contains(&part_id)
}
