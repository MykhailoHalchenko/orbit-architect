mod app;
mod assets;
mod scene;
mod screen;
mod ui;

use app::OrbitApp;
use assets::AssetManager;

const WIDTH: i32 = 1280;
const HEIGHT: i32 = 720;

fn main() {
    let (mut handle, thread) = raylib::init()
        .size(WIDTH, HEIGHT)
        .title("Orbit Architect")
        .build();
    handle.set_target_fps(60);

    let assets = AssetManager::load(&mut handle, &thread);
    let mut app = OrbitApp::new(WIDTH, HEIGHT);

    while !handle.window_should_close() {
        let mouse = handle.get_mouse_position();
        let mut draw = handle.begin_drawing(&thread);
        app.draw(&mut draw, mouse, &assets);
    }
}
