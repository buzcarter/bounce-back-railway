const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'trolley-controller': './src/microcontroller/microcontroller.ts',
  },
  output: {
    clean: true,
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'dist'),
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/simulator/assets/views/index.html',
    }),
  ],
  devServer: {
    contentBase: './dist',
  },
  devtool: 'source-map',
};
