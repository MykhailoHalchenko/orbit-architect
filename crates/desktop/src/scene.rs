use crate::assets::AssetManager;
use crate::screen::Screen;
use crate::ui::Ui;
use orbit_core::{
    MISSION_DESCRIPTION, MISSION_REQUIREMENTS, MISSION_TITLE, NAVIGATOR_DIALOG, TEAM_DIALOGS,
};
use raylib::prelude::*;

pub struct SceneRenderer {
    width: i32,
    height: i32,
}

impl SceneRenderer {
    pub fn new(width: i32, height: i32) -> Self {
        Self { width, height }
    }

    pub fn render(
        &self,
        draw: &mut RaylibDrawHandle,
        screen: Screen,
        dialog_index: &mut usize,
        mouse: Vector2,
        assets: &AssetManager,
    ) -> Option<Screen> {
        self.background(draw, screen);
        match screen {
            Screen::Menu => self.menu(draw, mouse),
            Screen::Missions => self.missions(draw, mouse),
            Screen::Briefing => self.briefing(draw, mouse),
            Screen::Details => self.details(draw, dialog_index, mouse, assets),
            Screen::Constructor => {
                self.constructor(draw);
                None
            }
        }
    }

    fn menu(&self, draw: &mut RaylibDrawHandle, mouse: Vector2) -> Option<Screen> {
        draw.draw_text("ORBIT ARCHITECT", 350, 115, 58, Color::WHITE);
        draw.draw_text(
            "A mission to build, land, and discover",
            405,
            185,
            22,
            Color::LIGHTGRAY,
        );
        if Ui::button(
            draw,
            Rectangle::new(490.0, 260.0, 300.0, 72.0),
            "PLAY",
            mouse,
        ) {
            return Some(Screen::Missions);
        }
        draw.draw_text("THE CREW IS WAITING", 500, 485, 20, Color::SKYBLUE);
        None
    }

    fn missions(&self, draw: &mut RaylibDrawHandle, mouse: Vector2) -> Option<Screen> {
        draw.draw_text("MISSION SELECT", 70, 65, 42, Color::WHITE);
        draw.draw_text("HANGAR / OPERATIONS HUB", 75, 115, 20, Color::LIGHTGRAY);
        for (index, label) in ["Mission 1", "Mission 2", "Mission 3"].iter().enumerate() {
            let bounds = Rectangle::new(75.0, 205.0 + index as f32 * 82.0, 260.0, 58.0);
            if Ui::button(draw, bounds, label, mouse) && index == 0 {
                return Some(Screen::Briefing);
            }
        }
        None
    }

    fn briefing(&self, draw: &mut RaylibDrawHandle, mouse: Vector2) -> Option<Screen> {
        draw.draw_rectangle(0, 0, self.width, self.height, Color::new(6, 12, 25, 125));
        draw.draw_text("CONFERENCE ROOM", 70, 55, 34, Color::LIGHTGRAY);
        draw.draw_rectangle(360, 105, 570, 300, Color::new(21, 107, 133, 255));
        draw.draw_rectangle_lines_ex(
            Rectangle::new(360.0, 105.0, 570.0, 300.0),
            5.0,
            Color::SKYBLUE,
        );
        draw.draw_text(MISSION_TITLE, 455, 235, 32, Color::WHITE);
        draw.draw_circle(175, 340, 90.0, Color::new(59, 130, 158, 255));
        draw.draw_circle(175, 320, 38.0, Color::PEACHPUFF);
        draw.draw_text("NAVIGATOR", 105, 465, 22, Color::WHITE);
        draw.draw_rectangle(70, 515, 1140, 145, Color::new(7, 18, 32, 235));
        draw.draw_rectangle_lines_ex(
            Rectangle::new(70.0, 515.0, 1140.0, 145.0),
            2.0,
            Color::SKYBLUE,
        );
        Ui::wrapped_text(
            draw,
            NAVIGATOR_DIALOG,
            Rectangle::new(100.0, 540.0, 1010.0, 75.0),
            19,
        );
        if Ui::button(
            draw,
            Rectangle::new(1060.0, 610.0, 125.0, 40.0),
            "NEXT",
            mouse,
        ) {
            return Some(Screen::Details);
        }
        None
    }

    fn details(
        &self,
        draw: &mut RaylibDrawHandle,
        dialog_index: &mut usize,
        mouse: Vector2,
        assets: &AssetManager,
    ) -> Option<Screen> {
        draw.draw_text(MISSION_TITLE, 70, 55, 42, Color::WHITE);
        draw.draw_text(
            "MISSION BRIEFING / HOLOGRAPHIC INTERFACE",
            75,
            105,
            18,
            Color::SKYBLUE,
        );
        draw.draw_rectangle(120, 160, 1040, 270, Color::new(10, 65, 89, 220));
        draw.draw_rectangle_lines_ex(
            Rectangle::new(120.0, 160.0, 1040.0, 270.0),
            3.0,
            Color::new(84, 220, 245, 255),
        );
        draw.draw_text("GOAL", 175, 195, 22, Color::SKYBLUE);
        Ui::wrapped_text(
            draw,
            MISSION_DESCRIPTION,
            Rectangle::new(175.0, 235.0, 850.0, 45.0),
            22,
        );
        draw.draw_text("REQUIREMENTS", 175, 315, 22, Color::SKYBLUE);
        Ui::wrapped_text(
            draw,
            MISSION_REQUIREMENTS,
            Rectangle::new(175.0, 355.0, 850.0, 45.0),
            22,
        );
        if let Some(texture) = &assets.financier_strict {
            draw.draw_texture_ex(texture, Vector2::new(1050.0, 175.0), 0.0, 0.2, Color::WHITE);
        }
        draw.draw_text("TEAM WARNINGS", 70, 485, 24, Color::WHITE);
        let speaker = ["FINANCIER", "ENGINEER", "SCIENTIST"][*dialog_index];
        draw.draw_text(speaker, 75, 525, 18, Color::GOLD);
        Ui::wrapped_text(
            draw,
            TEAM_DIALOGS[*dialog_index],
            Rectangle::new(210.0, 520.0, 850.0, 60.0),
            18,
        );
        if *dialog_index == TEAM_DIALOGS.len() - 1 {
            if Ui::button(
                draw,
                Rectangle::new(470.0, 625.0, 340.0, 58.0),
                "START CONSTRUCTOR",
                mouse,
            ) {
                return Some(Screen::Constructor);
            }
        } else if Ui::button(
            draw,
            Rectangle::new(1070.0, 510.0, 130.0, 45.0),
            "NEXT",
            mouse,
        ) {
            *dialog_index += 1;
        }
        None
    }

    fn constructor(&self, draw: &mut RaylibDrawHandle) {
        draw.draw_text("ROCKET CONSTRUCTOR", 70, 65, 42, Color::WHITE);
        draw.draw_text(MISSION_TITLE, 75, 115, 20, Color::SKYBLUE);
        draw.draw_rectangle(425, 160, 220, 360, Color::new(20, 33, 48, 255));
        draw.draw_rectangle(500, 240, 70, 240, Color::LIGHTGRAY);
        draw.draw_triangle(
            Vector2::new(500.0, 240.0),
            Vector2::new(535.0, 165.0),
            Vector2::new(570.0, 240.0),
            Color::WHITE,
        );
        draw.draw_rectangle(480, 340, 110, 18, Color::ORANGE);
        draw.draw_text("ASSEMBLY BAY", 440, 550, 20, Color::LIGHTGRAY);
        draw.draw_text(
            "Select modules to begin building your mission rocket.",
            720,
            230,
            20,
            Color::WHITE,
        );
        draw.draw_text("Budget:  $ 100,000", 720, 300, 24, Color::GOLD);
        draw.draw_text("Mass:    0 / 100 t", 720, 345, 24, Color::SKYBLUE);
        draw.draw_text("Science module: required", 720, 390, 24, Color::LIGHTGRAY);
    }

    fn background(&self, draw: &mut RaylibDrawHandle, screen: Screen) {
        draw.clear_background(match screen {
            Screen::Menu | Screen::Missions => Color::new(5, 14, 35, 255),
            Screen::Briefing => Color::new(18, 30, 53, 255),
            Screen::Details | Screen::Constructor => Color::new(8, 24, 43, 255),
        });
        for index in 0..70 {
            let x = (index * 197 + 31) % self.width;
            let y = (index * 83 + 17) % self.height;
            draw.draw_circle(x, y, if index % 4 == 0 { 2.0 } else { 1.0 }, Color::WHITE);
        }
        draw.draw_circle(1090, 130, 150.0, Color::new(35, 87, 130, 255));
        draw.draw_circle(1120, 105, 150.0, Color::new(9, 25, 55, 255));
        draw.draw_rectangle(0, 570, self.width, 150, Color::new(8, 27, 45, 255));
        draw.draw_line(0, 570, self.width, 570, Color::new(71, 166, 189, 255));
        if screen == Screen::Missions {
            draw.draw_rectangle(720, 190, 380, 300, Color::new(38, 48, 62, 255));
            draw.draw_rectangle(760, 230, 300, 180, Color::new(16, 86, 112, 255));
            draw.draw_triangle(
                Vector2::new(870.0, 300.0),
                Vector2::new(930.0, 180.0),
                Vector2::new(990.0, 300.0),
                Color::new(210, 220, 230, 255),
            );
            draw.draw_rectangle(895, 300, 70, 190, Color::new(204, 211, 217, 255));
            draw.draw_rectangle(885, 355, 90, 14, Color::new(238, 139, 54, 255));
            draw.draw_text("HANGAR", 825, 520, 24, Color::LIGHTGRAY);
        }
    }
}
