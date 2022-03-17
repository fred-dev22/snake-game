const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        main: path.join(__dirname, "src/index.js")
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [{
                test: /\.js/,
                exclude: /(node_modules)/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /.(png|svg|jpg|gif|mp3|ogg)$/,
                use: ['file-loader'],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "./src/index.html")
        })
    ],
    stats: "minimal",
    devtool: "source-map",
    mode: "development",
    devServer: {
        open: true,
        static: path.resolve(__dirname, './dist'),
        port: 4000
    }
};