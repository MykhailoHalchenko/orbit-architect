# orbit-architect
Orbit Architect is a space mission simulation game where you design, build, and launch a rocket to explore Mars. Your first mission, "Oasis Under the Ice," challenges you to assemble a spacecraft to investigate a potential subglacial lake at the Martian south pole. Balance your budget, mass, and power systems to create a launch-ready vehicle and achieve mission success.

This project is built with Rust and is designed to run on both desktop and the web.

## Features

-   **Rocket Construction:** Assemble your spacecraft by selecting modules for four key stages: Payload, Power System, Hull, and Launch Vehicle.
-   **Resource Management:** Make critical design choices to stay within the mission's $400M budget, manage the rocket's total mass against the booster's capacity, and ensure a positive power balance for all systems.
-   **Mission-Based Gameplay:** Follow briefings and team dialogue to understand mission requirements and build a rocket capable of succeeding.
-   **Multiple Endings:** Your rocket configuration determines the mission's outcome, with Bronze, Silver, and Gold tiers based on your design choices.
-   **Cross-Platform:**
    -   A native **desktop** version built with Rust and Raylib.
    -   A **web** version powered by Rust compiled to WebAssembly, with a UI built using Vite, React, and Tailwind CSS.

## Architecture

The project is structured as a Rust workspace with three main crates:

-   `crates/core`: Contains all the shared game logic, state management, and mission data. This crate is platform-agnostic.
-   `crates/desktop`: Implements the native desktop client using the `raylib` library for rendering and user input.
-   `crates/web`: The web client, which compiles the core logic to WebAssembly. The frontend is built with Vite and React, interfacing with the WASM module to run the game in a browser.

## Tech Stack

-   **Core:** Rust
-   **Desktop:** Rust, [Raylib](https://www.raylib.com/)
-   **Web:** Rust (WASM), [wasm-pack](https://rustwasm.github.io/wasm-pack/), [Vite](https://vitejs.dev/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

-   [Rust](https://www.rust-lang.org/tools/install)
-   [Node.js and npm](https://nodejs.org/en)
-   [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (for web development)

### Running the Project

Convenience scripts are provided in the `scripts/` directory to run the different versions of the application.

#### Run the Desktop App

```bash
# On Linux/macOS
./scripts/run.sh desktop

# On Windows (PowerShell)
.\scripts\run.ps1 -Target desktop
```

#### Run the Web App (Development Server)

This command will install npm dependencies, build the WebAssembly module, and start a local Vite development server.

```bash
# On Linux/macOS
./scripts/run.sh web

# On Windows (PowerShell)
.\scripts\run.ps1 -Target web
```

### Running Tests

To run the test suite for the core game logic:

```bash
# On Linux/macOS
./scripts/run.sh test

# On Windows (PowerShell)
.\scripts\run.ps1 -Target test
```

## Building for Production

To build the entire project, including the optimized web application artifacts:

```bash
# On Linux/macOS
./scripts/run.sh build

# On Windows (PowerShell)
.\scripts\run.ps1 -Target build
```

This command will compile the Rust workspace and generate the static web files in the `crates/web/dist` directory, ready for deployment.

## Deployment

The web application is automatically deployed to GitHub Pages from the `main` branch using the GitHub Actions workflow defined in `.github/workflows/deploy.yml`.
