import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendToGameEngine } from "./wasm-bridge.js";
import { assets } from "./assets.js";

const initialTelemetry = {
  budget: 0,
  budgetLimit: 400,
  massTenths: 0,
  capacityTenths: 0,
  powerKw: 0,
};

const launchErrorText = {
  missing_parts: "Complete all four assembly stages.",
  insufficient_power: "Add more power before launch.",
  overweight: "Reduce payload mass or improve capacity.",
  over_budget: "Reduce the build cost below $400M.",
};

export function EngineeringConsole({ engine, modules = [], onModuleSelected }) {
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [message, setMessage] = useState("");
  const [launchError, setLaunchError] = useState(null);
  const [coffeeTaps, setCoffeeTaps] = useState(0);
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    const handleTelemetry = (event) => setTelemetry(event.detail);
    const handleMissionSuccess = () => setMessage("MISSION SUCCESS · TRAJECTORY LOCKED");
    const handleLaunchError = (event) => {
      const errors = event.detail?.errors || [];
      setLaunchError(
        errors.map((error) => launchErrorText[error] || error).join(" · ") ||
          "Launch requirements not met.",
      );
      setMessage("LAUNCH ABORTED · REVIEW TELEMETRY");
    };
    window.addEventListener("game:telemetry", handleTelemetry);
    window.addEventListener("game:mission_success", handleMissionSuccess);
    window.addEventListener("game:launch_error", handleLaunchError);
    return () => {
      window.removeEventListener("game:telemetry", handleTelemetry);
      window.removeEventListener("game:mission_success", handleMissionSuccess);
      window.removeEventListener("game:launch_error", handleLaunchError);
    };
  }, []);

  const selectPayloadModule = (module) => {
    const option = visiblePayloadModules.findIndex((candidate) => candidate.id === module.id);
    if (option < 0) return;
    sendToGameEngine(engine, "selectModule", { stage: 0, option });
    onModuleSelected?.(0, option);
    setMessage(`${module.name} selected.`);
  };

  const budgetClass =
    telemetry.budget > telemetry.budgetLimit
      ? "text-red-500 drop-shadow-md"
      : "text-cyan-400";
  const massClass =
    telemetry.capacityTenths > 0 && telemetry.massTenths > telemetry.capacityTenths
      ? "text-red-500 drop-shadow-md"
      : "text-cyan-400";

  const visibleModules = modules.filter((module) => module.stage === "payload");
  const visiblePayloadModules = visibleModules;

  return (
    <motion.section
      className="react-console ui-interactive pointer-events-none backdrop-blur-md bg-slate-900/60 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
      aria-label="Engineering Console"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <motion.header
        className="react-console-header pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <p className="eyebrow">REACT UI · WASM LINK</p>
        <strong>ENGINEERING CONSOLE</strong>
      </motion.header>
      <motion.div
        className="react-telemetry"
        animate={launchError ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className={budgetClass} data-telemetry="budget">
          Budget: ${telemetry.budget}M / ${telemetry.budgetLimit}M
        </span>
        <span className={massClass} data-telemetry="mass">
          Mass: {(telemetry.massTenths / 10).toFixed(1)}t
        </span>
        <span className={telemetry.powerKw < 0 ? "text-red-500 drop-shadow-md" : "text-cyan-400"}>
          Energy: {telemetry.powerKw} kW
        </span>
      </motion.div>
      <AnimatePresence mode="wait">
        {launchError ? (
          <motion.p
            key="launch-error"
            className="react-console-message react-console-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {launchError}
          </motion.p>
        ) : message ? (
          <motion.p
            key={message}
            className="react-console-message"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
      <div className="react-module-previews" aria-label="Payload module details">
        {visibleModules.map((module) => (
          <motion.button
            key={module.id}
            className="react-module-preview pointer-events-auto"
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={() => selectPayloadModule(module)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{module.name}</span>
            <AnimatePresence>
              {hoveredModule === module.id && (
                <motion.small
                  className="react-module-tooltip"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  ${module.costM}M · {(module.massTenths / 10).toFixed(1)}t · {module.powerKw} kW
                </motion.small>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <motion.button
        className="react-coffee-widget pointer-events-auto"
        aria-label="Take a coffee break"
        onClick={() => {
          setCoffeeTaps((value) => value + 1);
          setMessage("Engineer coffee break acknowledged.");
          window.dispatchEvent(new CustomEvent("game:coffee_request"));
        }}
        whileTap={{ scale: 0.88, rotate: -8, y: -8 }}
        animate={{ rotate: coffeeTaps ? [0, -4, 4, 0] : 0 }}
      >
        ☕
      </motion.button>
      <motion.img
        className="react-character-sprite"
        src={assets.characters.engineer.neutral}
        alt="Engineer"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
      />
    </motion.section>
  );
}
