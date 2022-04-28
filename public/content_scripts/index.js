import Injector from "./Injector.js";

Injector.inject(window);

window.addEventListener("js", (e) => {
  window.dispatchEvent(new CustomEvent("cs", { detail: e.detail }));
});