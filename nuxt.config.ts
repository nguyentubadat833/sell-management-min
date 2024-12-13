// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    // srcDir: 'src/',
    extends: [
        './base'
    ],
    modules: ["@prisma/nuxt", '@nuxt/ui', "nuxt-lodash", 'nuxt-time'],
    prisma: {
        installStudio: false,
        generateClient: false,
        installCLI: false,
        runMigration: false

    },
    imports: {
        dirs: [
            //   'stores',
            'composables',
            'composables/*/index.{ts,js,mjs,mts}',
            'composables/**/**',
            // 'utils',
            // 'utils/*/index.{ts,js,mjs,mts}',
            // 'utils/**/**',

            // 'types',
            // 'types/*/index.{ts,js,mjs,mts}',
            // 'types/**/**',
        ]
    },
    colorMode: {
        preference: 'light'
    },
    experimental: {
        asyncContext: true,
        // componentIslands: {
        //     selectiveClient: 'deep'
        // }
    },
})