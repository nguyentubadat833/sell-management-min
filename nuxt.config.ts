// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/eslint", "@prisma/nuxt"],

  prisma: {
    installStudio: false,
    installCLI: false,
    installClient: false,
  },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: "2024-11-27"
})