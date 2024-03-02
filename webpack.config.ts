const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/Game.ts",
  },
  output: {
    library: 'MorseQuest',
    path: path.resolve(__dirname, './build'),
    filename: "morsequest-bundle.js" // 
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin({})],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};