import { URL, fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

dotenv.config({ path: "../../.env" });

export default defineConfig({
    build: {
        emptyOutDir: true,
    },
    esbuild: {
        supported: {
          'top-level-await': true //browsers can handle top-level-await features
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: "globalThis",
            },
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:4943",
                changeOrigin: true,
            },
        },
    },
    plugins: [react(), environment("all", { prefix: "REACT_APP_" }), environment("all", { prefix: "CANISTER_" }), environment("all", { prefix: "DFX_" })],
    resolve: {
        alias: [
            {
                find: "declarations",
                replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
            },
        ],
    },
});
