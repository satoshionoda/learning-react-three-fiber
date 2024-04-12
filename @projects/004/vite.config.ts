import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), glsl(), ViteImageOptimizer({ jpg: { quality: 75 } })],
  resolve: {
    alias: [{ find: /^@\//, replacement: `${__dirname}/src/` }],
  },
  build: {
    outDir: `../../dist/projects/004`,
  },
}));
