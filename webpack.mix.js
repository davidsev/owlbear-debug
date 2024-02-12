const mix = require('laravel-mix');
require('mix-tailwindcss');

mix.ts('src/index.ts', 'dist/app.js')
    .tailwind()
    .sourceMaps(false, 'source-map')
    .disableNotifications()
    .copy('static', 'dist')
    .options({
        terser: {
            terserOptions: {
                format: {
                    comments: false,
                },
                compress: {
                    drop_console: true
                }
            },
            extractComments: false,
        },
        clearConsole: false,
        postCss: [require('postcss-svg')]
    })
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.handlebars$/,
                    loader: 'handlebars-loader',
                    options: {
                        knownHelpers: [],
                        knownHelpersOnly: true,
                        strict: true,
                    }
                }
            ],
        },
        resolve: {
            fallback: { 'buffer': false }
        }
    });
