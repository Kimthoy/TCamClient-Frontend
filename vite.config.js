import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // <-- your Laravel dev URL
        changeOrigin: true,
        secure: false,
        // If your backend expects paths without /api prefix, uncomment rewrite:
        // rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
});
