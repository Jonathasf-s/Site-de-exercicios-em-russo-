import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tudo que começar com /api é enviado para o servidor (porta 3001)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:3001" },
  },
});