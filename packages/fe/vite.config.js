import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "src/assets",
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true
    }
  }
});
