var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    filename: './dist/bundle.js'
  },

  devServer: {
    inline: true
  }
};