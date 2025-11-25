// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/i18n',
		'nuxt-posthog',
		'@nuxt/ui',
		'@nuxt/image',
	],
	ssr: false,
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	runtimeConfig: {
		public: {
			apiBase: 'http://localhost:3001',
		},
	},
	compatibilityDate: '2025-07-15',
	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
			},
		},
	},
	i18n: {
		locales: [
			{ code: 'en', language: 'en-US', file: 'en.json' },
		],
		defaultLocale: 'en',
		langDir: 'locales',
	},
});
