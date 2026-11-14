use raylib::prelude::*;

fn main() {
    let (mut handle, thread) = raylib::init()
        .size(1280, 720)
        .title("Orbit Architect")
        .build();

    handle.set_target_fps(60);

    while !handle.window_should_close() {
        let mut draw = handle.begin_drawing(&thread);
        draw.clear_background(Color::BLACK);
        draw.draw_text("Orbit Architect", 32, 32, 32, Color::WHITE);
        draw.draw_text("Rust + Raylib", 32, 76, 20, Color::LIGHTGRAY);
    }
}
