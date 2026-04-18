const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

module.exports = {
  output: {
    uniqueName: 'cart',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './web-component': './src/bootstrap-element.ts',
      },
      shared: {},
    }),
  ],
};
