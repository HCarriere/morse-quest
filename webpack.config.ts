const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/game.ts",
  },
  output: {
    library: 'MorseQuest',
    path: path.resolve(__dirname, './build'),
    filename: "morsequest-bundle.js" // 
  },
  resolve: {
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