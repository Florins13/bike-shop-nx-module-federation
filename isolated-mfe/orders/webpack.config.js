const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

module.exports = {
  output: {
    uniqueName: 'orders',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'orders',
      filename: 'remoteEntry.js',
      exposes: {
        './web-component': './src/bootstrap-element.ts',
      },
      shared: {},
    }),
  ],
};
