import React from "react";
import { createRoot } from "react-dom/client";
import { EngineeringConsole } from "./EngineeringConsole.jsx";

let consoleRoot = null;

export function mountEngineeringConsole(engine, modules, onModuleSelected) {
  const rootElement = document.querySelector("#react-root");
  if (!rootElement) {
    throw new Error("React overlay root #react-root was not found.");
  }
  consoleRoot ??= createRoot(rootElement);
  consoleRoot.render(
    <EngineeringConsole
      phase="constructor"
      engine={engine}
      modules={modules}
      onModuleSelected={onModuleSelected}
    />,
  );
}

export function unmountEngineeringConsole() {
  consoleRoot?.unmount();
  consoleRoot = null;
}
