/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    mode: "development",
    target: "web",
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.tsx?$/,
                loader: "eslint-loader",
                exclude: /node_modules/,
                options: {
                    failOnError: true,
                    quiet: true,
                    cache: true,
                },
            },
            {
                test: /\.tsx?$/,
                loader: ["ts-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        library: "AnotherFormLoader",
        libraryTarget: "umd",
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
};
