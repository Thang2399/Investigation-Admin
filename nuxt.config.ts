// nuxt.config.ts
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    runtimeConfig: {
        externalBaseURL: process.env.NUXT_API_BASE_URL || 'http://localhost:1234',
        cookieName: process.env.COOKIE_NAME || 'token',
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
        },
    },
    build: { transpile: ['vuetify', 'vuepic/vue-datepicker'] },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }))
            })
        },
    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
})
