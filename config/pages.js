const path = require('path');

module.exports = [
  {
    filename: 'index.html',
    template: path.resolve(__dirname, '../public/index.html'),
    inject: true,
    chunks: ['app'],
    entry: {
      key: 'app',
      file: path.resolve(__dirname, '../src/index.js'),
    },
  },
];
