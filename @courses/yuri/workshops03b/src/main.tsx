// import { App } from "@/App.tsx";

import { initApp } from "@/App.tsx";

const root = document.getElementById("root");
if (!root) {
  throw new Error("No root element found");
}

initApp(root);

// new App(root);
