const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './app/Booter.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Swing Swine",
            meta: {
                'Cache-Control': {'http-equiv': 'Cache-Control', 'content': 'no-cache, no-store, must-revalidate'},
                'Pragma': {'http-equiv': 'Pragma', 'content': 'no-cache'},
                'Expires': {'http-equiv': 'Expires', 'content': '0'}
            }
        }),
        new CopyWebpackPlugin([
            {from: 'app/assets', to: 'assets'}
        ], {debug: 'error'})
    ]
};