/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,scss,handlebars}'],
    theme: {
        extend: {},
    },
    plugins: [
        require('rippleui'),
    ],
};

