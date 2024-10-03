const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
        }),
    ],
};