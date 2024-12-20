/** @type {import('tailwindcss').Config} */
import * as tailwindcss_line_clamp from '@tailwindcss/line-clamp'
export default {
    content: [],
    theme: {
        extend: {
            backgroundImage: {
                'main': "url('/public/images/background/main.png')",
            }
        },
    },
    plugins: [
        tailwindcss_line_clamp
    ],
}

