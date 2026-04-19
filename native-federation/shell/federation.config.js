const {
  withNativeFederation,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',

  shared: {
    // No shared dependencies — each MFE bundles its own Angular.
    // This enables true isolation and independent versioning.
  },
});
