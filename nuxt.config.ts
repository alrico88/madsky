export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { class: "light" },
      title: "MADSKY",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#222529" },
        { name: "author", content: "Alberto Rico" },
      ],
    },
  },

  css: ["@/assets/main.css", "@/assets/main.scss"],

  modules: ["@vueuse/nuxt", "@vite-pwa/nuxt", "@nuxt/ui", "nuxt-umami"],

  ui: { colorMode: false },

  nitro: {
    externals: { inline: ["@iconify/utils"] },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "MADSKY",
      description: "Observa el cielo de Madrid y sus colores",
      theme_color: "#222529",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    client: {
      installPrompt: true,
    },
  },

  runtimeConfig: {
    databaseUrl: "",
    processKey: "",
    imageUrl: "",
    imageTop: 85,
    imageLeft: 280,
    imageWidth: 1640,
    imageHeight: 360,
    imageReferrer: "https://meteosierra.com/webcams/madrid-moratalaz/",
    locationLat: "",
    locationLon: "",
    webdavEndpoint: "",
    webdavUsername: "",
    webdavPassword: "",
    public: {
      measurementsLocation: [40.4, -3.64],
    },
  },

  fonts: {
    provider: "google",
    families: [
      {
        name: "Noto Sans",
        weights: [400, 600, 800],
      },
      {
        name: "Bungee",
        weights: [400, 600, 800],
      },
      {
        name: "Inconsolata",
        weight: 400,
      },
    ],
  },

  compatibilityDate: "2025-03-02",

  experimental: {
    inlineRouteRules: true,
  },
  umami: {
    id: "",
    host: "",
  },
});
