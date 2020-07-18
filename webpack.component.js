const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
})

