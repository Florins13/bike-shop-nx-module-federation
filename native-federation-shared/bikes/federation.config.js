const {
  withNativeFederation,
  share,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'bikes',

  exposes: {
    './mount': './src/mount.ts',
  },

  shared: share({
    '@angular/core': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/common': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/common/http': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/compiler': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser-dynamic': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser/animations': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser/animations/async': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/router': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/forms': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/animations': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    'rxjs': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    'tslib': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
  }),
});
