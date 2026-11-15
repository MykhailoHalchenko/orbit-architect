import React from "react";
import { createRoot } from "react-dom/client";
import { EngineeringConsole } from "./EngineeringConsole.jsx";

export function mountEngineeringConsole(engine, modules, onModuleSelected) {
  const rootElement = document.querySelector("#react-root");
  if (!rootElement) {
    throw new Error("React overlay root #react-root was not found.");
  }
  return createRoot(rootElement).render(
    <EngineeringConsole
      engine={engine}
      modules={modules}
      onModuleSelected={onModuleSelected}
    />,
  );
}
