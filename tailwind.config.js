const {colors} = require('tailwindcss/defaultTheme')

module.exports = {
    prefix: '',
    purge: [
        './components/**/*.{vue,js}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
    ],
    darkMode: false, // or 'media' or 'class'
    corePlugins: {
        backgroundOpacity: false,
        scale: false,
        skew: false,
        stroke: false,
        strokeWidth: false,
        tableLayout: false,
        translate: false,
        transform: false,
        transformOrigin: false,
        transitionDelay: false,
        transitionDuration: false,
        transitionProperty: false,
        transitionTimingFunction: false,
        listStyleType: false,
        listStylePosition: false,
		
		// 禁用一些小程序 class 不支持的分割
		divideWidth: false,
		divideColor: false,
		divideStyle: false,
		divideOpacity: false,
    },
    theme: {
        fontFamily: {},
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
        },
        spacing: {
            none: '0',
            xs: '0.305rem',
            sm: '0.625rem',
            md: '1.25rem',
            lg: '1.875rem',
            xl: '3.75rem',
            xxl: '7.5rem',
        },
        borderWidth: {
            default: '1px',
            '0': '0',
            '2': '2px',
            '4': '4px',
        },
        colors: {
            black: colors.black,
            white: colors.white,
            gray: {
                ...colors.gray,
                '666': '#999999',
                '999': '#666666',
            }
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            df: '1.125rem',
            lg: '1.25rem',
            xl: '1.5rem',
            xxl: '2.25rem',
        },
        fontWeight: {
            normal: 400,
            bold: 800,
        },
        letterSpacing: {
            normal: '0',
            wide: '.025em',
        },
        lineHeight: {
            'normal': '1.5',
            'relaxed': '1.625',
            'loose': '2',
        },
        extend: {
            colors: {
                themes: 'var(--color-themes)'
            },
            spacing: {}
        }
    },
    variants: {
        backgroundColor: ['responsive'],
        borderColor: ['responsive'],
        extend: {},
    },
    plugins: [],
}
