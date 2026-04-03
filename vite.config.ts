import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({
      babelConfig: {
        plugins: [
          ["babel-plugin-react-compiler", {}],
          ["@babel/plugin-syntax-jsx", {}],
        ],
        presets: ["@babel/preset-typescript"],
      },
      filter: /\.[jt]sx?$/u,
      loader: "jsx",
    }),
    tsconfigPaths(),
  ],
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
