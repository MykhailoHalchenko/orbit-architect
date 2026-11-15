import React, { useEffect, useState } from "react";
import { sendToGameEngine } from "./wasm-bridge.js";
import { assets } from "./assets.js";

const initialTelemetry = {
  budget: 0,
  budgetLimit: 400,
  massTenths: 0,
  capacityTenths: 0,
  powerKw: 0,
};

export function EngineeringConsole({ engine, modules = [], onModuleSelected }) {
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleTelemetry = (event) => setTelemetry(event.detail);
    const handleMissionSuccess = () => setMessage("MISSION SUCCESS · TRAJECTORY LOCKED");
    window.addEventListener("game:telemetry", handleTelemetry);
    window.addEventListener("game:mission_success", handleMissionSuccess);
    return () => {
      window.removeEventListener("game:telemetry", handleTelemetry);
      window.removeEventListener("game:mission_success", handleMissionSuccess);
    };
  }, []);

  const installSpectrometer = () => {
    const option = modules
      .filter((module) => module.stage === "payload")
      .findIndex((module) => module.id === "quantum-spectrometer");
    if (option < 0) {
      setMessage("Quantum Spectrometer is not available.");
      return;
    }
    sendToGameEngine(engine, "selectModule", { stage: 0, option });
    onModuleSelected?.(0, option);
    setMessage("Quantum Spectrometer selected.");
  };

  const budgetClass =
    telemetry.budget > telemetry.budgetLimit
      ? "text-red-500 drop-shadow-md"
      : "text-cyan-400";
  const massClass =
    telemetry.capacityTenths > 0 && telemetry.massTenths > telemetry.capacityTenths
      ? "text-red-500 drop-shadow-md"
      : "text-cyan-400";

  return (
    <section
      className="react-console ui-interactive pointer-events-none backdrop-blur-md bg-slate-900/60 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
      aria-label="Engineering Console"
    >
      <header className="react-console-header pointer-events-none">
        <p className="eyebrow">REACT UI · WASM LINK</p>
        <strong>ENGINEERING CONSOLE</strong>
      </header>
      <div className="react-telemetry">
        <span className={budgetClass}>
          Budget: ${telemetry.budget}M / ${telemetry.budgetLimit}M
        </span>
        <span className={massClass}>Mass: {(telemetry.massTenths / 10).toFixed(1)}t</span>
        <span className={telemetry.powerKw < 0 ? "text-red-500 drop-shadow-md" : "text-cyan-400"}>
          Energy: {telemetry.powerKw} kW
        </span>
      </div>
      <button
        className="primary-button pointer-events-auto transition-colors duration-300 hover:bg-cyan-500"
        onClick={installSpectrometer}
      >
        Install Quantum Spectrometer
      </button>
      {message && <p className="react-console-message transition-opacity duration-300">{message}</p>}
      <img
        className="react-character-sprite transition-transform duration-300 translate-y-0"
        src={assets.characters.engineer.neutral}
        alt="Engineer"
      />
    </section>
  );
}
