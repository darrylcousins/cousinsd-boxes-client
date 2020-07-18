const path = require("path")

module.exports = {
  name: 'library',
  entry: {
    'index': "./src/index.jsx"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx']
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ["@babel/preset-env", {"targets": { "node": "current" }}],
                '@babel/react',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
        ]
      }
    ]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  }
}
