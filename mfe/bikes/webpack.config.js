const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

module.exports = {
  output: {
    uniqueName: 'bikes',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'bikes',
      filename: 'remoteEntry.js',
      exposes: {
        './web-component': './src/bootstrap-element.ts',
      },
      shared: {},
    }),
  ],
};
