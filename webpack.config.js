const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'extension.bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "ws": false,
      "http": false,
      "https": false,
      "url": false,
      "net": false,
      "tls": false,
      "fs": false,
      "crypto": false
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  externals: {
    vscode: 'commonjs vscode'
  }
};
