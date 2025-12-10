// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/i18n',
		'@nuxt/ui',
		'@nuxt/image',
		'@pinia/nuxt',
	],
	ssr: false,
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	ui: {
		theme: {
			colors: [
				'beige-100',
				'beige-500',
				'gray-100',
				'gray-300',
				'gray-500',
				'gray-900',
				'secondary-green',
				'secondary-yellow',
				'secondary-cyan',
				'secondary-navy',
				'secondary-red',
				'secondary-purple',
				'other-purple',
				'other-turqoise',
				'other-brown',
				'other-magenta',
				'other-blue',
				'other-navy-gray',
				'other-army-green',
				'other-gold',
				'other-orange',
				'white',
				'info',
				'success',
				'warning',
				'error',
				'neutral',
			],
		},
	},
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
