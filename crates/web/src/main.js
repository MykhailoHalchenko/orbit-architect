import init, { add } from "../pkg/orbit_web.js";

const status = document.querySelector("#status");

init()
  .then(() => {
    status.textContent = `Rust WebAssembly is ready: 2 + 2 = ${add(2n, 2n)}`;
  })
  .catch((error) => {
    status.textContent = "Failed to load Rust WebAssembly.";
    console.error(error);
  });
