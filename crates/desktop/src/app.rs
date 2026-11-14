use crate::assets::AssetManager;
use crate::scene::SceneRenderer;
use crate::screen::Screen;
use raylib::prelude::*;

pub struct OrbitApp {
    screen: Screen,
    dialog_index: usize,
    renderer: SceneRenderer,
}

impl OrbitApp {
    pub fn new(width: i32, height: i32) -> Self {
        Self {
            screen: Screen::Menu,
            dialog_index: 0,
            renderer: SceneRenderer::new(width, height),
        }
    }

    pub fn draw(&mut self, draw: &mut RaylibDrawHandle, mouse: Vector2, assets: &AssetManager) {
        if let Some(next_screen) =
            self.renderer
                .render(draw, self.screen, &mut self.dialog_index, mouse, assets)
        {
            if next_screen == Screen::Details {
                self.dialog_index = 0;
            }
            self.screen = next_screen;
        }
        if self.screen == Screen::Details {
            self.dialog_index = self.dialog_index.min(2);
        }
    }
}
