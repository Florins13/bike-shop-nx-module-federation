# Native Federation - Bike Shop MFE

This project demonstrates the same Bike Shop micro-frontend architecture as `isolated-mfe/`, but uses **@angular-architects/native-federation** instead of **webpack Module Federation**.

## Architecture

| App | Angular | Port | Role | PrimeNG |
|--------|---------|------|--------|---------|
| Shell | 19 | 5200 | Host | No |
| Cart | 20 | 5201 | Remote | 20 |
| Bikes | 21 | 5202 | Remote | 21 |
| Orders | 19 | 5203 | Remote | No |

Each remote exposes a web component (`<mfe-bikes>`, `<mfe-cart>`, `<mfe-orders>`) via `@angular/elements`, identical to the isolated-mfe approach.

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

The shell discovers remotes at runtime via `src/assets/federation.manifest.json`:

```json
{
  "bikes": "http://localhost:5202/remoteEntry.json",
  "cart": "http://localhost:5201/remoteEntry.json",
  "orders": "http://localhost:5203/remoteEntry.json"
}
```

Remotes are loaded dynamically using `loadRemoteModule()`:

```ts
import { loadRemoteModule } from '@angular-architects/native-federation';

await loadRemoteModule({
  remoteName: 'bikes',
  exposedModule: './web-component'
});
```

---

## Comparison: Isolated MFE (Webpack MF) vs Native Federation

### Build Tooling

| Aspect | Isolated MFE (Webpack MF) | Native Federation |
|--------|---------------------------|-------------------|
| **Bundler** | Webpack (via `@angular-builders/custom-webpack`) | esbuild (via `@angular-devkit/build-angular:application`) |
| **Config file** | `webpack.config.js` | `federation.config.js` |
| **Builder package** | `@angular-builders/custom-webpack` | `@angular-architects/native-federation` |
| **Build speed** | Slower (webpack) | Faster (esbuild under the hood) |
| **Remote entry** | `remoteEntry.js` (JavaScript) | `remoteEntry.json` (JSON manifest) |

### Configuration

**Webpack MF** requires a full webpack config:
```js
// webpack.config.js
const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
module.exports = withModuleFederationPlugin({
  name: 'bikes',
  exposes: { './web-component': './src/bootstrap-element.ts' },
  shared: {}
});
```

**Native Federation** uses a simpler JS config:
```js
// federation.config.js
const { withNativeFederation } = require('@angular-architects/native-federation/config');
module.exports = withNativeFederation({
  name: 'bikes',
  exposes: { './web-component': './src/bootstrap-element.ts' },
  shared: {}
});
```

### angular.json Architecture

**Webpack MF** replaces the default builder:
```json
{
  "build": { "builder": "@angular-builders/custom-webpack:browser", ... },
  "serve": { "builder": "@angular-builders/custom-webpack:dev-server", ... }
}
```

**Native Federation** wraps the default builder (layered approach):
```json
{
  "build": { "builder": "@angular-architects/native-federation:build", "options": { "target": "esbuild" } },
  "serve": { "builder": "@angular-architects/native-federation:dev-server", "options": { "target": "serve-original" } },
  "esbuild": { "builder": "@angular-devkit/build-angular:application", ... },
  "serve-original": { "builder": "@angular-devkit/build-angular:dev-server", ... }
}
```

### Remote Loading

**Webpack MF** uses webpack's built-in dynamic imports:
```ts
import('bikes/web-component');
```
This requires `declare module 'bikes/web-component'` type declarations.

**Native Federation** uses an explicit API:
```ts
import { loadRemoteModule } from '@angular-architects/native-federation';
loadRemoteModule({ remoteName: 'bikes', exposedModule: './web-component' });
```
No type declarations needed — the API is fully typed.

### Host Initialization

**Webpack MF**: No special initialization. The host's webpack config knows about remotes.

**Native Federation**: Requires initialization before bootstrap:
```ts
// main.ts
import { initFederation } from '@angular-architects/native-federation';
initFederation('/assets/federation.manifest.json')
  .then(() => import('./bootstrap'));
```

### Summary Table

| Feature | Webpack Module Federation | Native Federation |
|---------|---------------------------|-------------------|
| Bundler dependency | Webpack only | Any (esbuild, vite, etc.) |
| Build speed | Slower | Faster (esbuild) |
| Config complexity | Webpack knowledge required | Simpler JS config |
| Remote discovery | Hardcoded in webpack config or runtime | JSON manifest file |
| Remote entry format | JavaScript (`remoteEntry.js`) | JSON (`remoteEntry.json`) |
| Type declarations | Required (`declare module`) | Not required |
| Angular CLI compat | Overrides CLI builder | Wraps CLI builder |
| Shared deps | Webpack handles at runtime | Native federation runtime |
| Future-proof | Tied to webpack | Bundler-agnostic |
| Web component approach | Same (`@angular/elements`) | Same (`@angular/elements`) |
| Cross-MFE events | Same (`CustomEvent`) | Same (`CustomEvent`) |
| Multi-version Angular | ✅ Supported | ✅ Supported |

### When to Choose Which

**Choose Webpack Module Federation when:**
- You're already invested in webpack configuration and plugins
- You need webpack-specific loaders or plugins
- Your team is familiar with webpack MF concepts

**Choose Native Federation when:**
- You want faster builds (esbuild)
- You want to be bundler-agnostic (future migration to vite, rspack, etc.)
- You prefer simpler configuration
- You're starting a new project
- You want to use Angular's native `application` builder
