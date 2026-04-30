import { defineConfig } from "vite";
import path from "path";

const isReplit = process.env.REPL_ID !== undefined;

const port = Number(process.env.PORT || 5173);
const basePath = process.env.BASE_PATH || "/";
const apiPort = Number(process.env.API_PORT || 3001);

export default defineConfig({
  base: basePath,
  plugins: [
    ...(isReplit
      ? [
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({ root: path.resolve(import.meta.dirname, "..") })
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner()
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        services: path.resolve(import.meta.dirname, "services/index.html"),
        "a-propos": path.resolve(import.meta.dirname, "a-propos/index.html"),
        contact: path.resolve(import.meta.dirname, "contact/index.html"),
        admin: path.resolve(import.meta.dirname, "admin/index.html"),
        project: path.resolve(import.meta.dirname, "project/index.html"),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: false },
    // En local : proxy /api → serveur API Node.js
    // Sur Replit : le proxy global gère ça automatiquement
    proxy: isReplit
      ? undefined
      : {
          "/api": {
            target: `http://localhost:${apiPort}`,
            changeOrigin: true,
          },
        },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
