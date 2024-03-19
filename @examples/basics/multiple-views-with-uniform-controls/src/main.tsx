import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@mantine/core/styles.css";
import { theme } from "@/theme.ts";

const root = document.getElementById("root");
if (!root) {
  throw new Error("No root element found");
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
