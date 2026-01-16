/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sub-black': '#050505',
                'sub-dark': '#0a0a0a',
                'sub-gray': '#1a1a1a',
                'neon-green': '#00ff41',
                'neon-blue': '#00f3ff',
                'neon-pink': '#ff00ff',
            },
            fontFamily: {
                mono: ['monospace'], // We can add a better font later
            }
        },
    },
    plugins: [],
}
