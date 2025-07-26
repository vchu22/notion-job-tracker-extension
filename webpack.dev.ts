const { merge } = require('webpack-merge');
const config = require('./webpack.config.ts');

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map'
});