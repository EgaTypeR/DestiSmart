const path = require('path');

module.exports = {
  entry: 'index.js', // Change this to match the entry point of your backend application
  output: {
    path: path.resolve(__dirname, 'dist'), // Change this to match the output directory for your bundled files
    filename: 'bundle.js' // Change this to match the name of the bundled file
  },
  mode: 'development', // Change this to 'production' for production builds
  target: 'node', // Specify the environment for webpack to bundle for
  // Add any additional webpack configuration here
};