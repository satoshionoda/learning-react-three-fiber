import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@\//, replacement: `${__dirname}/src/` }],
  },
  build: {
    outDir: `../../dist/projects/001`,
  },
}));
