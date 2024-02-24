export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/eslint-module", "dayjs-nuxt", "nuxt-icon"],
  devtools: { enabled: true },
  css: ["~/assets/styles/index.scss"],
  dayjs: {
    plugins: ["localizedFormat", "customParseFormat", "utc", "timezone"],
    locales: ["ru"],
    defaultLocale: "ru",
  },
});
