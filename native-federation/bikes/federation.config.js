const {
  withNativeFederation,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'bikes',

  exposes: {
    './web-component': './src/bootstrap-element.ts',
  },

  shared: {
    // No shared dependencies — true isolation, independent Angular version.
  },
});
