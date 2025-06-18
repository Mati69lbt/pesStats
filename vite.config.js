import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/pesStats/", // 👈 nombre exacto del repositorio
  plugins: [react(), tailwindcss()],
});
