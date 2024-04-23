import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), glsl()],
  resolve: {
    alias: [{ find: /^@\//, replacement: `${__dirname}/src/` }],
  },
  build: {
    outDir: `../../dist/projects/003`,
  },
}));
