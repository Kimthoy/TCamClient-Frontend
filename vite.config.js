import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // LOCAL BACKEND ONLY
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
