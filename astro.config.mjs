import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [mdx(), solidJs()],
  vite: {
    optimizeDeps: {
      exclude: ["sharp"],
    },
  },
  adapter: node({
    mode: "standalone",
  }),
});
