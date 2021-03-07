const path = require('path')
const {
  CheckerPlugin,
  TsConfigPathsPlugin,
} = require('awesome-typescript-loader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: path.resolve('src', 'index.ts'),
  context: path.resolve('src'),
  devtool: 'inline-source-map',
  output: {
    pathinfo: true,
    filename: 'bundle.js',
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'awesome-typescript-loader',
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js'],
    plugins: [new TsConfigPathsPlugin()],
  },
  plugins: [new CleanWebpackPlugin(), new CheckerPlugin()],
}
