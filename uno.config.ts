import { defineConfig, presetWind3 } from "unocss";
import extractorPug from "@unocss/extractor-pug";

export default defineConfig({
  presets: [
    presetWind3({
      dark: "media",
    }),
  ],
  extractors: [extractorPug()],
});
