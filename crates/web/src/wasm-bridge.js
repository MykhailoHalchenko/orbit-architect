const actions = Object.freeze({
  selectModule: "selectModule",
  launch: "launch",
});

export function sendToGameEngine(engine, action, payload = {}) {
  if (!engine) {
    throw new Error(`Unsupported game engine action: ${action}`);
  }

  let result;
  switch (action) {
    case actions.selectModule:
      if (typeof engine.select_module !== "function") {
        throw new Error(`Wasm engine does not expose select_module`);
      }
      result = engine.select_module(payload.stage, payload.option);
      break;
    case actions.launch:
      if (typeof engine.launch !== "function") {
        throw new Error(`Wasm engine does not expose launch`);
      }
      result = JSON.parse(engine.launch());
      break;
    default:
      throw new Error(`Unsupported game engine action: ${action}`);
  }

  publishTelemetry(engine);
  if (result?.success) {
    publishGameEvent("MISSION_SUCCESS", result);
  }
  return result;
}

export function publishTelemetry(engine) {
  const telemetry = JSON.parse(engine.telemetry_json());
  window.dispatchEvent(new CustomEvent("game:telemetry", { detail: telemetry }));
  return telemetry;
}

export function publishGameEvent(type, detail = {}) {
  window.dispatchEvent(new CustomEvent(`game:${type.toLowerCase()}`, { detail }));
}

export { actions as gameActions };
