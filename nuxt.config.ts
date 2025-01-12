// https://nuxt.com/docs/api/configuration/nuxt-config
// import fs from 'fs';
// import path from 'path';

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devServer: {
        port: Number(process.env.NUXT_APP_DEV_PORT) ?? 3000,
        // https: {
        //     key: fs.readFileSync(path.resolve(__dirname, './ssl/localhost.key')).toString(),
        //     cert: fs.readFileSync(path.resolve(__dirname, './ssl/localhost.crt')).toString(),
        // }
    },
    ssr: true,
    devtools: {enabled: true},
    // srcDir: 'src/',
    extends: [
        './base'
    ],
    runtimeConfig: {
        app: {
            isUseWarehouse: process.env.NUXT_APP_IS_USE_WAREHOUSE ?? false,
            isUseReceiveInventory: process.env.NUXT_APP_IS_USE_RECEIVE_INVENTORY ?? false,
            fileStorageRoot: process.env.NUXT_APP_STORAGE_FILE_MOUNT
        },
        auth: {
            secret: process.env.NUXT_AUTH_SECRET,
            google: {
                id: process.env.NUXT_AUTH_GOOGLE_CLIENT_ID,
                secret: process.env.NUXT_AUTH_GOOGLE_CLIENT_SECRET
            }
        },
        vnpay: {
            tmnCode: process.env.NUXT_VNPAY_TMN_CODE,
            secretKey: process.env.NUXT_VNPAY_SECRET_KEY,
            paymentUrl: process.env.NUXT_VNPAY_URL_PAYMENT
        },
        public: {
            vnpay: {
                returnUrl: process.env.NUXT_VNPAY_RETURN_URL
            }
        }
    },
    modules: [
        "@prisma/nuxt",
        '@nuxt/ui',
        "nuxt-lodash",
        'nuxt-time',
        '@sidebase/nuxt-auth',
        'nuxt-file-storage',
        '@nuxt/image',
        '@nuxt/content',
        '@nuxtjs/device',
        'nuxt-paypal',
        '@nuxtjs/ngrok'
    ],
    paypal: {
        clientId: 'AekPE1obxYWN4XbykdUaAOnC3imQBfKw-5z8iXwwNhxo3iURtz27voWVNWdLroHkmg5gKl8P3Nfnzzpl',
    },
    ngrok: {
        authtoken_from_env: true
    },
    auth: {
        provider: {
            type: 'authjs',
            trustHost: false,
            defaultProvider: 'google',
            addDefaultCallbackUrl: true
        }
    },
    fileStorage: {
        mount: process.env.NUXT_APP_STORAGE_FILE_MOUNT
    },
    prisma: {
        installStudio: false,
        generateClient: false,
        // installCLI: false,
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
    vite: {
        resolve: {
            alias: {
                '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
            },
        },
    },
    app: {
        pageTransition: {name: 'page', mode: 'out-in',},
        layoutTransition: {name: 'layout', mode: 'out-in'},
        head: {
            link: [{
                // href: 'https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css',
                // rel: 'stylesheet'
            }],
            script: [
                // {
                //     src: 'https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js'
                // }
            ]
        }
    }
})