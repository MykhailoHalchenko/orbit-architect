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
