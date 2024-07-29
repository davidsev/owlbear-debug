module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-nesting': {},
        autoprefixer: {},
        'postcss-image-inliner': {},
        ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
    }
};
