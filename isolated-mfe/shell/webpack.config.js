const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

module.exports = {
  output: {
    uniqueName: 'shell',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        cart: 'cart@http://localhost:5201/remoteEntry.js',
        bikes: 'bikes@http://localhost:5202/remoteEntry.js',
        orders: 'orders@http://localhost:5203/remoteEntry.js',
      },
      shared: {},
    }),
  ],
};
