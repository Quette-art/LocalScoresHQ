import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "icon-192.png",
        "icon-512.png",
        "logo.png",
      ],

      manifest: {
        name: "LocalScoresHQ",

        short_name: "LSHQ",

        description:
          "Live scores, standings and schedules for DMV youth sports.",

        theme_color: "#0ea5e9",

        background_color: "#020617",

        display: "standalone",

        start_url: "/",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },

          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});