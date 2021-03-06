const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const dotenv = require('dotenv').config({path: __dirname + '.env'});


module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: "index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
        new webpack.DefinePlugin({'process.env': JSON.stringify(dotenv.parsed)},),
        new UglifyJsPlugin()
    ],
    mode: 'production',
    optimization:  {
        usedExports: true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        minimize: true
    },
    performance: {
        hints: false
    },
    devtool: false,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
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