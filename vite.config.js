import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      // Ensure automatic JSX runtime (React 17+)
      // This prevents "dispatcher is null" errors
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
  ],
  resolve: {
    // CRITICAL: Deduplicate React to prevent "dispatcher is null" error
    // This ensures only ONE copy of React is used across all packages
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react-is"],
    alias: {
      // Force all imports to resolve to the same React instance
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client"],
    exclude: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
  build: {
    target: "es2020",
    // Ensure React is not bundled multiple times
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
