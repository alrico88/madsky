import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import node from "@astrojs/node";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [mdx(), solidJs(), compress()],
  vite: {
    optimizeDeps: {
      exclude: ["sharp"],
    },
  },
  adapter: node({
    mode: "standalone",
  }),
});
