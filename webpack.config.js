const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path")

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[fullhash].js',
        path: path.join(__dirname, "dist/"),
        libraryTarget: 'amd'
    },
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: "./public/index.html",
            filename: './index.html'
        })
    ],
    target: 'node',
    externals: [nodeExternals({importType: 'umd'})],
    module: { // new concept, loaders
        rules: [
            {
                test: /\.js|\.jsx$/,
                loader: 'babel-loader', // loaders referenced
                exclude: /node_modules/, // we do not need to transpile other libraries
                query: require('./.babelrc'), // reference to babel rules
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
}