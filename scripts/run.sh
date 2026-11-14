#!/usr/bin/env sh
set -eu

TARGET="${1:-desktop}"
ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

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
        printf "Usage: %s [desktop|web|build|test]\n" "$0" >&2
        exit 2
        ;;
esac
