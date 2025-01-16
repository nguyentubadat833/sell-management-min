// https://nuxt.com/docs/api/configuration/nuxt-config
// import fs from 'fs';
// import path from 'path';

import configs from "./configs";
import type {TPaymentMethod} from "~/types/TPayment";

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
        paypal: {
            clientId: process.env.NUXT_PAYPAL_CLIENT_ID
        },
        vnPay: {
            tmnCode: process.env.NUXT_VNPAY_TMN_CODE,
            secretKey: process.env.NUXT_VNPAY_SECRET_KEY,
            paymentUrl: process.env.NUXT_VNPAY_URL_PAYMENT
        },
        vietQR: {
            generateQrUrl: process.env.NUXT_VIETQR_GENERATE_QR_URL,
            clientId: process.env.NUXT_VIETQR_CLIENT_ID,
            apiKey: process.env.NUXT_VIETQR_API_KEY,
            bankId: process.env.NUXT_VIETQR_BANK_ID,
            bankAccount: {
                number: process.env.NUXT_VIETQR_BANK_NUMBER_ACCOUNT,
                name: process.env.NUXT_VIETQR_BANK_NAME_ACCOUNT
            }
        },
        payOS: {
            clientId: process.env.NUXT_PAYOS_CLIENT_ID,
            apiKey: process.env.NUXT_PAYOS_API_KEY,
            checksumKey: process.env.NUXT_PAYOS_CHECKSUM_KEY,
            pageReturn: process.env.NUXT_PAYOS_RETURN_PAGE
        },
        public: {
            acceptPaymentMethods: (convertAcceptMethods(process.env.NUXT_APP_ACCEPT_PAYMENT_METHODS) ?? configs.validPaymentMethods) as TPaymentMethod[],
            vnPay: {
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
        clientId: process.env.NUXT_PAYPAL_CLIENT_ID,
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
        componentIslands: {
            selectiveClient: "deep"
        }
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
                {
                    src: 'https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js'
                }
                // {
                //     src: 'https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js'
                // }
            ]
        }
    }
})

function convertAcceptMethods(input: string | undefined): TPaymentMethod[] | null {
    if (!input) return null;

    const result = input.split(',').filter(Boolean);
    if (result.length > 0) {
        const validPaymentMethods = configs.validPaymentMethods
        result.forEach(e => {
            if (!validPaymentMethods.includes(e as TPaymentMethod)) {
                throw new Error(`Invalid payment method: ${e}. The valid methods include: ${validPaymentMethods}`)
            }
        })
        return result as TPaymentMethod[]
    } else {
        return null
    }
}
