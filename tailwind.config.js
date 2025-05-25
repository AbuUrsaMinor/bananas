/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'media', // Use media query for dark mode based on system preference
    future: {
        hoverOnlyWhenSupported: true, // Only apply hover styles on devices that support hover
    },
    theme: {
        extend: {
            animation: {
                'bounce-gentle': 'bounce-gentle 2s infinite',
            },
            keyframes: {
                'bounce-gentle': {
                    '0%, 100%': {
                        transform: 'translateY(-5%)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateY(0)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                },
            }, colors: {
                'accent': '#4F8EF7',
                'ink': {
                    400: '#A0A0A0',
                    900: '#1A1A1A',
                },
                'surface': {
                    0: '#FFFFFF',
                    100: '#F8F9FB',
                },
                'dark': {
                    'ink': {
                        400: '#A0A0A0',
                        900: '#FFFFFF',
                    },
                    'surface': {
                        0: '#1A1A1A',
                        100: '#121212',
                    },
                },
                'kid-purple': {
                    50: '#FAF5FF',
                    100: '#F3E8FF',
                    200: '#E9D5FF',
                    300: '#D8B4FE',
                    400: '#C084FC',
                    500: '#A855F7',
                    600: '#9333EA',
                },
            },
            borderWidth: {
                '3': '3px',
            },
            fontFamily: {
                'sans': ['Inter', 'SF Pro Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                'comic': ['Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'sans-serif'],
            },
            spacing: {
                '1': '4px',
                '2': '8px',
                '3': '16px',
                '4': '24px',
                '5': '32px',
            },
            borderRadius: {
                's': '4px',
                'l': '12px',
            },
            boxShadow: {
                'DEFAULT': '0 2px 6px rgba(0, 0, 0, .05)',
                'elevated': '0 4px 12px rgba(0, 0, 0, .1)',
            },
            height: {
                'header': '56px',
                'tabbar': '56px',
                'fab': '56px',
            },
            width: {
                'fab': '56px',
            },
            backdropBlur: {
                'header': '10px',
            },
        },
    },
    plugins: [],
}
