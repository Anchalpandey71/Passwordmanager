import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to './' so that built assets use relative paths.
  // This is crucial for GitHub Pages deployment.
  base: "./",
});
