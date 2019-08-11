const merge = require("webpack-merge");
const baseConfig = require("./webpack.config");
const package = require("./package.json");

module.exports = merge(baseConfig, {
    devtool: "source-map",
    mode: "production",
    output: {
        filename: `${package.name}.min.js`,
    },
});
