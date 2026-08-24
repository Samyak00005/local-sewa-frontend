import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const liveApiUrl = (env.VITE_DEV_API_PROXY || "https://localsewa.com").replace(/\/$/, "");

  return {
    // Relative assets also work when the build is bundled inside an Android app.
    base: "./",
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: liveApiUrl,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
