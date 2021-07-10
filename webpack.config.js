const path = require('path')
const webpack = require('webpack')
const WebpackNodeExternals = require('webpack-node-externals')

module.exports = {
  context: __dirname,
  target: 'node',
  devtool: false,
  entry: './libs/index.js',
  output: {
    library: 'Logger',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    globalObject: 'this'
  },
  plugins: [
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10000
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  resolve: {
    extensions: ['.js']
  },
  externals: [
    WebpackNodeExternals()
  ],
}
