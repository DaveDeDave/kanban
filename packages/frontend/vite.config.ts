import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@/modern-normalize": path.resolve(__dirname, "../../node_modules/modern-normalize")
    }
  }
});
