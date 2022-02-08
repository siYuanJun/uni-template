module.exports = {
    parser: require('postcss-comment'),
    plugins: [
        require('tailwindcss')({
            config: `${__dirname}/tailwind.config.js`,
        }),
        require('autoprefixer')({
            remove: process.env.UNI_PLATFORM !== 'h5',
        }),
        require('postcss-class-rename')({
            '\\\\:': '--',
            '\\\\/': '--',
            '\\\\.': '--',
            '.:': '--',
            '\\*': '--',
        }),
    ],
}
