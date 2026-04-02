import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/api/auth/token": {
        target: "https://anilist.co",
        changeOrigin: true,
        rewrite: () => "/api/v2/oauth/token",
      },
    },
  },
});
