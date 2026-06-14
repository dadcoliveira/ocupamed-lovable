import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  import { fileURLToPath, URL } from "url";

  export default defineConfig({
    base: "/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: ["react", "react-dom"],
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      host: "0.0.0.0",
    },
  });
  