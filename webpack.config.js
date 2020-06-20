const path = require('path');
const package = require('./package.json');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          failOnError: true,
          quiet: true,
          cache: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    // Use external version of React
    react: 'react',
  },
  output: {
    filename: `${package.name}.js`,
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
  },
};
