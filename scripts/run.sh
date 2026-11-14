#!/usr/bin/env sh
set -eu

TARGET="${1:-desktop}"
ASSETS_DIR="${2:-}"
ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ -n "$ASSETS_DIR" ]; then
    if [ ! -d "$ASSETS_DIR" ]; then
        printf "Assets directory does not exist: %s\n" "$ASSETS_DIR" >&2
        exit 1
    fi
    ORBIT_ASSETS_DIR="$(CDPATH= cd -- "$ASSETS_DIR" && pwd)"
    export ORBIT_ASSETS_DIR
fi

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        printf "Required command '%s' was not found in PATH.\n" "$1" >&2
        exit 1
    fi
}

run_npm() {
    require_command npm
    (cd "$ROOT_DIR/crates/web" && npm "$@")
}

case "$TARGET" in
    desktop)
        require_command cargo
        cargo run -p orbit-desktop
        ;;
    web)
        run_npm install
        run_npm run dev -- --host
        ;;
    build)
        require_command cargo
        cargo build --workspace
        run_npm install
        run_npm run build
        ;;
    test)
        require_command cargo
        cargo test --workspace
        ;;
    *)
        printf "Usage: %s [desktop|web|build|test] [assets-directory]\n" "$0" >&2
        exit 2
        ;;
esac
