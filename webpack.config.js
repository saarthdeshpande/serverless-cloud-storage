const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDevelopment = false;

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: "index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
    ],
    mode: 'production',
    optimization: {
        usedExports: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env', {
                                    "targets": "defaults"
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?publicPath=/&name=font/[name].[ext]'
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    'file-loader?publicPath=/&name=static/images/[name].[ext]'
                ]
            },
        ]
    }
};