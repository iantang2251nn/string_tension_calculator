import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repoBase = "/string_tension_calculator/";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? repoBase : "/",
  plugins: [react(), tailwindcss()],
});
