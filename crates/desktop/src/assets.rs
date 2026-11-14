use raylib::prelude::*;
use std::env;
use std::path::{Path, PathBuf};

pub struct AssetPaths {
    root: PathBuf,
}

impl AssetPaths {
    pub fn discover() -> Self {
        let root = env::var_os("ORBIT_ASSETS_DIR")
            .map(PathBuf::from)
            .or_else(|| {
                let current = env::current_dir().ok()?;
                let direct = current.join("Assets");
                if direct.is_dir() {
                    return Some(direct);
                }
                current.parent().map(|parent| parent.join("Assets"))
            })
            .unwrap_or_else(|| PathBuf::from("Assets"));
        Self { root }
    }

    pub fn file(&self, name: &str) -> PathBuf {
        self.root.join(name)
    }

    pub fn root(&self) -> &Path {
        &self.root
    }
}

pub struct AssetManager {
    pub financier_strict: Option<Texture2D>,
}

impl AssetManager {
    pub fn load(handle: &mut RaylibHandle, thread: &RaylibThread) -> Self {
        let paths = AssetPaths::discover();
        let portrait_path = paths.file("financier_strict.png");
        let financier_strict = match portrait_path.to_str() {
            Some(path) => match handle.load_texture(thread, path) {
                Ok(texture) => Some(texture),
                Err(error) => {
                    eprintln!(
                        "Could not load asset '{}': {error}",
                        portrait_path.display()
                    );
                    None
                }
            },
            None => {
                eprintln!("Asset path is not valid UTF-8: {}", portrait_path.display());
                None
            }
        };
        if financier_strict.is_none() {
            eprintln!(
                "Using procedural fallback. Set ORBIT_ASSETS_DIR to the directory containing game assets (currently '{}').",
                paths.root().display()
            );
        }
        Self { financier_strict }
    }
}
