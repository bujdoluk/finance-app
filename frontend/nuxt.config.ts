// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    'nuxt-posthog',
    '@nuxt/ui',
    '@nuxt/image',
  ],
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      stylistic: {
        indent: 'tab',
        semi: true,
      }
    }
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', },
    ],
    defaultLocale: 'en',
    langDir: 'locales',
  }
})