# Native Federation Shared - Bike Shop MFE

This project is a variant of `native-federation/` that **enables dependency sharing** between MFEs and **removes Angular Elements** (no web components). Remote components are loaded directly as Angular components using `NgComponentOutlet`.

## Architecture

| App | Angular | Port | Role | PrimeNG |
|--------|---------|------|--------|---------|
| Shell | 19 | 5300 | Host | No |
| Cart | 20 | 5301 | Remote | 20 |
| Bikes | 21 | 5302 | Remote | 21 |
| Orders | 19 | 5303 | Remote | No |

### Key Differences from `native-federation/`

| Aspect | `native-federation/` | `native-federation-shared/` |
|--------|---------------------|----------------------------|
| **Angular Elements** | ✅ Used (web components) | ❌ Removed |
| **Component rendering** | Custom elements (`<mfe-bikes>`) | `NgComponentOutlet` |
| **Dependency sharing** | Disabled (`shared: {}`) | Enabled (`singleton: true`) |
| **`@angular/core` sharing** | Each MFE bundles its own | Shared across all MFEs |
| **Isolation model** | Full isolation via web components | Shared Angular runtime |

### Shared Dependencies

All MFEs declare the following as shared singletons with `strictVersion: false`:
- `@angular/core`, `@angular/common`, `@angular/compiler`
- `@angular/platform-browser`, `@angular/platform-browser-dynamic`
- `@angular/router`, `@angular/forms`, `@angular/animations`
- `rxjs`, `tslib`

PrimeNG is **not** shared (each MFE bundles its own) because the PrimeNG chart module requires `chart.js` which complicates shared bundling.

With `singleton: true` and `strictVersion: false`, the native federation runtime will pick a single version at runtime (typically the highest loaded version). Since the MFEs use different Angular versions (19, 20, 21), this is an **experimental setup** to observe how the sharing mechanism handles version conflicts.

## Quick Start

```bash
# Install dependencies for each app
cd shell && npm install && cd ..
cd bikes && npm install && cd ..
cd cart && npm install && cd ..
cd orders && npm install && cd ..

# Serve all
./serve-all.sh

# Or build all
./build-all.sh
```

## How It Works

### Remote Loading (No Web Components)

Instead of creating custom elements, each MFE directly exposes its Angular component:

```js
// bikes/federation.config.js
exposes: {
  './component': './src/app/product/bike-list/bike-list-component.ts',
}
```

The shell loads and renders remote components using Angular's `NgComponentOutlet`:

```ts
const bikesModule = await loadRemoteModule({
  remoteName: 'bikes',
  exposedModule: './component'
});
this.bikesComponent = bikesModule.BikeListComponent;
```

```html
<ng-container *ngComponentOutlet="bikesComponent"></ng-container>
```

### Dependency Sharing

The `federation.config.js` in each app uses `share()` to declare shared dependencies:

```js
const { withNativeFederation, share } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  shared: share({
    '@angular/core': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    // ... more shared deps
  }),
});
```

## ⚠️ Important Notes

- **Multi-version Angular sharing is experimental.** When multiple Angular versions are present with `singleton: true`, only one version is loaded at runtime. Components compiled with a different version may encounter runtime errors.
- This setup demonstrates the _mechanics_ of dependency sharing. For production, all MFEs should ideally use the same Angular major version when sharing `@angular/core`.
- The `strictVersion: false` flag suppresses version mismatch warnings but does not guarantee compatibility.
