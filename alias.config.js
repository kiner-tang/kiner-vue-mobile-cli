const path = require('path');

module.exports = {

    resolve: {

        alias: {

            '@': path.resolve(__dirname, 'src'),

            '@/components': path.resolve(__dirname, 'src/components'),

            '@/assets': path.resolve(__dirname, 'src/assets'),

            '@/service': path.resolve(__dirname, 'src/service'),

            '@/store': path.resolve(__dirname, 'src/store'),

            '@/utils': path.resolve(__dirname, 'src/utils'),

            '@/views': path.resolve(__dirname, 'src/views'),

        }

    }
};

