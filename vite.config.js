import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});
