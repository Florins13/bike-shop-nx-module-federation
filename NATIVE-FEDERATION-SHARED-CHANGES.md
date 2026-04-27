# Native Federation Shared — Changes & Lessons Learned

A detailed comparison between `native-federation` (isolated, custom elements) and `native-federation-shared` (shared dependencies, no custom elements).

---

## 1. What Changed

### 1.1 Removed `@angular/elements` (Custom Elements)

| | `native-federation` | `native-federation-shared` |
|---|---|---|
| **Dependency** | `@angular/elements` in every MFE | Removed from all MFEs |
| **Bootstrap file** | `bootstrap-element.ts` using `createCustomElement()` | `mount.ts` using `createComponent()` |
| **Registration** | `customElements.define('mfe-bikes', element)` | No custom element registration |
| **Shell rendering** | `<mfe-bikes></mfe-bikes>` (custom HTML tag) | `<div #bikesHost>` (plain DOM element) |

**Before** — `native-federation/bikes/src/bootstrap-element.ts`:
```ts
import { createCustomElement } from '@angular/elements';

export async function mount() {
  const app = await createApplication({ ... });
  const element = createCustomElement(BikeListComponent, { injector: app.injector });
  customElements.define('mfe-bikes', element);
}
```

**After** — `native-federation-shared/bikes/src/mount.ts`:
```ts
import { createApplication } from '@angular/platform-browser';
import { createComponent } from '@angular/core';

export async function mount(hostElement: HTMLElement) {
  const appRef = await createApplication({ ... });
  const compRef = createComponent(BikeListComponent, {
    environmentInjector: appRef.injector,
    hostElement,
  });
  appRef.attachView(compRef.hostView);
}
```

**Key difference**: `mount()` now receives a `hostElement` parameter. The shell provides a plain `<div>` and the MFE renders its component directly into it — no Web Components API involved.

---

### 1.2 Shell: How It Loads MFEs

| | `native-federation` | `native-federation-shared` |
|---|---|---|
| **Schema** | `CUSTOM_ELEMENTS_SCHEMA` required | Not needed |
| **Template** | Custom element tags (`<mfe-bikes>`) | `@ViewChild` host divs (`<div #bikesHost>`) |
| **Mount call** | `module.mount()` — no args | `module.mount(hostElement)` — passes DOM element |
| **Change detection** | Plain properties (worked with zone.js) | Signals (`signal('')`) required for zoneless |

**Before** — shell template:
```html
<mfe-bikes></mfe-bikes>
<mfe-cart></mfe-cart>
```

**After** — shell template:
```html
<div #bikesHost></div>
<div #cartHost></div>
```

**Before** — shell component:
```ts
schemas: [CUSTOM_ELEMENTS_SCHEMA]
// ...
await bikesModule.mount(); // registers custom element globally
```

**After** — shell component:
```ts
@ViewChild('bikesHost', { static: true }) bikesHost!: ElementRef<HTMLElement>;
// ...
await bikesModule.mount(this.bikesHost.nativeElement); // renders into specific div
```

---

### 1.3 Federation Config: Enabling Shared Dependencies

This is the core change that motivates the project.

**Before** — `native-federation/*/federation.config.js`:
```js
module.exports = withNativeFederation({
  name: 'bikes',
  exposes: { './web-component': './src/bootstrap-element.ts' },
  shared: {
    // Empty — each MFE bundles its own Angular. True isolation.
  },
});
```

**After** — `native-federation-shared/*/federation.config.js`:
```js
const { withNativeFederation, share } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'bikes',
  exposes: { './mount': './src/mount.ts' },
  shared: share({
    '@angular/core':            { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/common':          { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/common/http':     { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/compiler':        { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser-dynamic': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser/animations': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/platform-browser/animations/async': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/router':          { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/forms':           { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/animations':      { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    'rxjs':                     { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    'tslib':                    { singleton: true, strictVersion: false, requiredVersion: 'auto' },
  }),
});
```

**What `share()` options mean:**
- `singleton: true` — only one copy of the library is loaded at runtime (the highest compatible version wins)
- `strictVersion: false` — allows version mismatches (critical when mixing Angular 19/20/21)
- `requiredVersion: 'auto'` — reads the version from each app's `package.json`

**What could NOT be shared:**
- **PrimeNG** — its chart module imports `chart.js/auto` which fails during esbuild bundling. Each MFE bundles its own PrimeNG.

---

### 1.4 Exposed Module Naming

| | `native-federation` | `native-federation-shared` |
|---|---|---|
| Exposed key | `./web-component` | `./mount` |
| Exposed file | `./src/bootstrap-element.ts` | `./src/mount.ts` |

The shell's `loadRemoteModule` calls changed accordingly:
```ts
// Before
loadRemoteModule({ remoteName: 'bikes', exposedModule: './web-component' })
// After
loadRemoteModule({ remoteName: 'bikes', exposedModule: './mount' })
```

---

### 1.5 Zoneless Change Detection + Signals

The shell uses **zoneless change detection** (`provideExperimentalZonelessChangeDetection` in Angular 19). With zoneless, Angular doesn't know when async operations complete — plain class properties set after `await` don't trigger re-renders.

**Fix**: All state in shell components was converted to **signals**:
```ts
// Before (broken with zoneless)
loadError = '';
// After (works with zoneless)
loadError = signal('');
```

---

### 1.6 ViewChild Cannot Be Inside `@if`/`@else`

Using `@ViewChild({ static: true })` requires the target element to exist in the DOM **before** `ngOnInit`. Elements inside Angular's `@if`/`@else` control flow blocks are conditionally rendered and not available at static resolution time.

**Broken**:
```html
@if (loadError()) {
  <p>{{ loadError() }}</p>
} @else {
  <div #bikesHost></div>  <!-- NOT in DOM at init time! -->
}
```

**Fixed** — host divs always rendered:
```html
@if (loadError()) {
  <p>{{ loadError() }}</p>
}
<div #bikesHost></div>  <!-- Always in DOM -->
```

---

### 1.7 Why `NgComponentOutlet` Failed (Attempted & Abandoned)

Before the `mount()` approach, we tried using `NgComponentOutlet` to render remote components directly in the shell's template. This caused:

```
NG0203: inject() must be called from an injection context
```

**Root cause**: `NgComponentOutlet` creates the remote component inside the **shell's** Angular injector. When the remote component was compiled with Angular 21 but the shell runs Angular 19, the two Angular runtimes have incompatible internal injection mechanisms. The stack trace showed two different Angular bundles being mixed (`_effect-chunk2.mjs` from one version, `_angular_core.crWBg4qT3S-dev.js` from another).

**Solution**: Each MFE creates its **own** `ApplicationRef` via `createApplication()`, giving it an independent injection hierarchy. The Angular runtime code may be shared (loaded once), but each MFE has its own injector tree.

---

## 2. Summary of All Modified Files

| File | Change |
|---|---|
| `*/federation.config.js` (all 4 apps) | Added `share()` with Angular packages, rxjs, tslib |
| `bikes/src/bootstrap-element.ts` | **Deleted** → replaced by `bikes/src/mount.ts` |
| `cart/src/bootstrap-element.ts` | **Deleted** → replaced by `cart/src/mount.ts` |
| `orders/src/bootstrap-element.ts` | **Deleted** → replaced by `orders/src/mount.ts` |
| `bikes/package.json` | Removed `@angular/elements` |
| `cart/package.json` | Removed `@angular/elements` |
| `orders/package.json` | Removed `@angular/elements` |
| `shell/src/app/shopping-view/shopping-view.ts` | `@ViewChild` + `mount(hostElement)` instead of custom elements |
| `shell/src/app/shopping-view/shopping-view.html` | `<div #bikesHost>` instead of `<mfe-bikes>` |
| `shell/src/app/checkout-wrapper/checkout-wrapper.ts` | Same pattern for orders MFE |
| `shell/src/app/app.config.ts` | Added `provideAnimationsAsync()` |
| `*/angular.json` | Ports changed to 5300–5303 |
| `shell/src/assets/federation.manifest.json` | URLs updated to new ports |

---

## 3. Pros and Cons

### ✅ Pros

| Pro | Details |
|---|---|
| **Smaller bundle sizes** | Angular core, common, router, rxjs, etc. are loaded **once** and shared across all MFEs. In the isolated approach, each MFE bundles its own copy of Angular (~200KB+ gzipped per MFE). |
| **Faster load times** | After the shell loads Angular, MFEs only download their application-specific code. No duplicate framework downloads. |
| **No Web Components dependency** | Removes `@angular/elements` and the Web Components API. The `mount()` pattern is simpler and gives full control over component lifecycle. |
| **No `CUSTOM_ELEMENTS_SCHEMA`** | The shell doesn't need to suppress Angular template validation for unknown HTML tags. |
| **Cleanup function** | `mount()` returns a destroy callback, enabling proper cleanup when navigating away. Custom elements don't offer this natively. |
| **Lower memory usage** | One Angular runtime in memory instead of one per MFE. |
| **Shared `rxjs` and utilities** | Libraries like rxjs and tslib are also deduplicated. |

### ❌ Cons

| Con | Details |
|---|---|
| **Version coupling risk** | `singleton: true` forces all MFEs to use **one** Angular version at runtime (the highest compatible one). If Angular 21 has breaking internal changes vs Angular 19, things can break silently. `strictVersion: false` suppresses these warnings. |
| **Less isolation** | MFEs share global state from the singleton Angular runtime (e.g., Zone.js patches, platform refs). A bug in the shared runtime affects all MFEs. |
| **PrimeNG cannot be shared** | Libraries with complex bundling (chart.js, certain PrimeNG modules) fail esbuild's share mechanism. Each MFE still bundles its own PrimeNG — so savings are limited for UI-heavy MFEs. |
| **`NgComponentOutlet` doesn't work** | You **cannot** use Angular's built-in `NgComponentOutlet` to render cross-version components. The `mount()` pattern with `createApplication()` is required, adding boilerplate to each MFE. |
| **Build warnings** | Native Federation's `share()` generates harmless but noisy warnings about non-existent sub-package entry points (e.g., `@angular/common/http/locales/extra`). |
| **Independent deployment is riskier** | Deploying an MFE built with Angular 22 while others use Angular 19 could break sharing. Teams must coordinate Angular upgrades more carefully. |
| **Shell must provide host elements** | The shell needs to manage DOM elements via `@ViewChild` and pass them to `mount()`. This is more manual than just dropping a custom element tag in the template. |
| **No Shadow DOM encapsulation** | Custom elements can use Shadow DOM for style isolation. The `mount()` approach renders into the shell's DOM, so CSS can leak between MFEs and the shell. |

---

## 4. When to Use Which Approach

| Scenario | Recommended Approach |
|---|---|
| MFEs on **same Angular version**, optimizing bundle size | **Shared** (`native-federation-shared`) |
| MFEs on **different Angular major versions**, need guaranteed isolation | **Isolated** (`native-federation`) |
| Teams deploy **independently** with different release cycles | **Isolated** — less coordination needed |
| Single team or coordinated releases, want **fastest load times** | **Shared** — maximum deduplication |
| MFEs use **different frameworks** (React + Angular) | **Isolated** — sharing doesn't apply cross-framework |

---

## 5. Build Size Comparison (Production)

All numbers below are from **production builds** (`ng build --configuration production`).

### 5.1 Raw JS Size (uncompressed)

#### Isolated — each MFE bundles its own Angular

| App | JS Size |
|---|---|
| Shell | 257 KB |
| Bikes (Angular 21) | 892 KB |
| Cart (Angular 20) | 816 KB |
| Orders (Angular 19) | 486 KB |
| **Total downloaded** | **2,451 KB** |

#### Shared — Angular loaded once, app code per MFE

| App | Total on disk | Shared libs | App-only code |
|---|---|---|---|
| Shell | 1,259 KB | 1,115 KB | 144 KB |
| Bikes (Angular 21) | 1,981 KB | 1,495 KB | 486 KB |
| Cart (Angular 20) | 1,836 KB | 1,422 KB | 414 KB |
| Orders (Angular 19) | 1,270 KB | 1,115 KB | 155 KB |

> **Note:** Each app's `dist/` contains its own copy of the shared libraries on disk, but at runtime the browser loads them **only once** (from the app that provides the highest compatible version — in this case, bikes with Angular 21).

**Browser actually downloads:**
- Shared libs (once, from bikes): **1,495 KB**
- App-only code (all 4 apps): **1,198 KB**
- **Total: 2,693 KB** — 10% larger than isolated ⚠️

### 5.2 Gzipped Size (actual network transfer)

This is what actually matters — gzip is always enabled on production servers.

#### Isolated (gzipped)

| App | Gzipped |
|---|---|
| Shell | 80 KB |
| Bikes | 259 KB |
| Cart | 242 KB |
| Orders | 149 KB |
| **Total** | **730 KB** |

#### Shared (gzipped)

| App | Total | Shared libs | App-only |
|---|---|---|---|
| Shell | 368 KB | 322 KB | 46 KB |
| Bikes | 496 KB | 368 KB | 128 KB |
| Cart | 464 KB | 351 KB | 112 KB |
| Orders | 371 KB | 321 KB | 49 KB |

**Browser actually downloads (gzipped):**
- Shared libs (once, from bikes): **368 KB**
- App-only code (all 4 apps): **336 KB**
- **Total: 704 KB** — 3.5% smaller than isolated ✅

### 5.3 Summary

| Metric | Isolated | Shared | Difference |
|---|---|---|---|
| Raw JS (browser downloads) | 2,451 KB | 2,693 KB | +242 KB (+10%) ⚠️ |
| Gzipped (actual transfer) | 730 KB | 704 KB | **−26 KB (−3.5%)** ✅ |

### 5.4 Why the savings are modest

1. **Tree-shaking is very effective in the isolated approach.** Each MFE only bundles the Angular code it actually uses. The shared approach must ship **full Angular packages** because any MFE might need any part of them.

2. **Only 4 MFEs.** The shared approach's advantage **scales with the number of MFEs**. With 4 apps, Angular is duplicated 3–4 times in isolated mode — but each tree-shaken copy is much smaller than the full package. With 10+ MFEs, the shared approach would show significant savings.

3. **PrimeNG is not shared.** Bikes and Cart both bundle their own PrimeNG (different major versions). If PrimeNG could be shared, the savings would increase substantially.

### 5.5 When shared wins big

The break-even point depends on your setup, but generally:

| Number of MFEs | Expected savings |
|---|---|
| 2–3 MFEs | Negligible or negative — tree-shaking in isolated mode is more efficient |
| 4–6 MFEs | Modest savings (3–10%) — starts paying off |
| 7+ MFEs | Significant savings (15–30%+) — each new MFE only adds its app-specific code |
| 10+ MFEs, same Angular version | Maximum benefit — shared libs amortized across many small app bundles |
