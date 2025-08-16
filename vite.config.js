import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://web-service-ventas-api.onrender.com",
        changeOrigin: true,
        // opcional: asegura que /api/productos -> /api/productos
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
