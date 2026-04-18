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
        cart: 'cart@http://localhost:4201/remoteEntry.js',
        bikes: 'bikes@http://localhost:4202/remoteEntry.js',
        orders: 'orders@http://localhost:4203/remoteEntry.js',
      },
      shared: {},
    }),
  ],
};
