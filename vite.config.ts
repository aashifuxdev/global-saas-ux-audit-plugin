import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        ui: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "ui.js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
