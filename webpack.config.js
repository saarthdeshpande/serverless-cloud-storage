const nodeExternals = require('webpack-node-externals');
const path = require("path")

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, "build/static/js")
    },
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    target: 'node',
    externals: [nodeExternals()],
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