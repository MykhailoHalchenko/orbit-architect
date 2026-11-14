use raylib::prelude::*;

pub struct Ui;

impl Ui {
    pub fn button(
        draw: &mut RaylibDrawHandle,
        bounds: Rectangle,
        label: &str,
        mouse: Vector2,
    ) -> bool {
        let hovered = bounds.check_collision_point_rec(mouse);
        let color = if hovered {
            Color::new(44, 178, 210, 255)
        } else {
            Color::new(24, 98, 145, 255)
        };
        draw.draw_rectangle_rec(bounds, color);
        draw.draw_rectangle_lines_ex(bounds, 2.0, Color::new(130, 230, 255, 255));
        let text_width = draw.measure_text(label, 24);
        draw.draw_text(
            label,
            (bounds.x + (bounds.width - text_width as f32) / 2.0) as i32,
            (bounds.y + 13.0) as i32,
            24,
            Color::WHITE,
        );
        hovered && draw.is_mouse_button_pressed(MouseButton::MOUSE_BUTTON_LEFT)
    }

    pub fn wrapped_text(
        draw: &mut RaylibDrawHandle,
        text: &str,
        bounds: Rectangle,
        font_size: i32,
    ) {
        let mut line = String::new();
        let mut y = bounds.y as i32;
        for word in text.split_whitespace() {
            let candidate = if line.is_empty() {
                word.to_string()
            } else {
                format!("{line} {word}")
            };
            if draw.measure_text(&candidate, font_size) > bounds.width as i32 && !line.is_empty() {
                draw.draw_text(&line, bounds.x as i32, y, font_size, Color::WHITE);
                line = word.to_string();
                y += font_size + 8;
            } else {
                line = candidate;
            }
        }
        if !line.is_empty() {
            draw.draw_text(&line, bounds.x as i32, y, font_size, Color::WHITE);
        }
    }
}
