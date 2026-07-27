import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  preview: {
    allowedHosts: ["*.railway.app", "*.up.railway.app", "troquel-production.up.railway.app", "reliable-abundance-production-2f49.up.railway.app"]
  },
  server: {
    middlewareMode: false,
    allowedHosts: "all"
  }
});
