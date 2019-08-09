/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    mode: "development",
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
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    // for prod build include again
    externals: {
        // Use external version of React
        react: "react",
    },
    output: {
        filename: "index.js",
        libraryTarget: "commonjs",
        path: path.resolve(__dirname, "dist"),
    },
};
