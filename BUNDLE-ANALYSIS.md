# Module Federation + Angular Elements: Multi-Version Bundle Analysis

## Overview

This document analyzes the bundle size impact of running **multiple Angular versions** across
micro-frontends (MFEs), using **Module Federation** with **Angular Elements** and **no shared
dependencies**.

### Setup

| MFE | Role | Angular Version | Port |
|---------|---------|-----------------|------|
| Shell | Host | 19.2.21 | 4200 |
| Cart | Remote | 20.3.19 | 4201 |
| Bikes | Remote | 21.2.9 | 4202 |
| Orders | Remote | 19.2.21 | 4203 |

Each remote wraps its UI in a **custom element** (`<mfe-cart>`, `<mfe-bikes>`, `<mfe-orders>`)
using `@angular/elements` and exposes it via Module Federation. The host loads remotes
dynamically and renders them as native HTML tags.

**No dependencies are shared** between host and remotes — each remote bundles its own complete
Angular framework.

---

## Bundle Sizes

### Per-MFE Breakdown (Production Build)

| MFE | Raw JS | Gzipped JS | Total Dist |
|---------|----------:|-------------:|-----------:|
| Shell | 215.5 KB | 65.7 KB | 356.2 KB |
| Cart | 557.2 KB | 183.7 KB | 575.7 KB |
| Bikes | 593.1 KB | 193.4 KB | 612.7 KB |
| Orders | 378.8 KB | 119.7 KB | 398.4 KB |
| **Total** | **1,744.6 KB** | **562.5 KB** | **1,943.0 KB** |

### Detailed File Breakdown

**Shell (Angular 19 — Host)**
| File | Raw | Gzipped |
|------|----:|--------:|
| main.js (entry) | 5.4 KB | 2.3 KB |
| 987.js (bootstrap + Angular core) | 210.2 KB | 63.5 KB |
| **Total** | **215.5 KB** | **65.7 KB** |

**Cart (Angular 20 — Remote)**
| File | Raw | Gzipped |
|------|----:|--------:|
| remoteEntry.js | 3.2 KB | 1.7 KB |
| main.js | 2.6 KB | 1.4 KB |
| 12.js (bootstrap-element + Angular core) | 285.0 KB | 91.9 KB |
| 221.js (Angular common/platform) | 213.1 KB | 72.3 KB |
| 928.js (app bootstrap) | 53.3 KB | 17.8 KB |
| **Total** | **557.2 KB** | **183.7 KB** |

**Bikes (Angular 21 — Remote)**
| File | Raw | Gzipped |
|------|----:|--------:|
| remoteEntry.js | 3.2 KB | 1.7 KB |
| main.js | 2.6 KB | 1.4 KB |
| 548.js (bootstrap-element + Angular core) | 290.8 KB | 93.7 KB |
| 120.js (Angular common/platform) | 220.0 KB | 74.4 KB |
| 117.js (app bootstrap) | 76.5 KB | 23.4 KB |
| **Total** | **593.1 KB** | **193.4 KB** |

**Orders (Angular 19 — Remote)**
| File | Raw | Gzipped |
|------|----:|--------:|
| remoteEntry.js | 3.2 KB | 1.7 KB |
| main.js | 2.6 KB | 1.4 KB |
| 930.js (Angular core) | 182.7 KB | 57.3 KB |
| 993.js (Angular common/http) | 101.1 KB | 35.0 KB |
| 43.js (bootstrap-element + app) | 89.2 KB | 25.8 KB |
| **Total** | **378.8 KB** | **119.7 KB** |

---

## Comparison vs Original Nx Setup

The original monorepo uses Nx with Module Federation and **shared Angular dependencies**
(all apps on Angular 21.2.9).

| MFE | Original (gzipped) | Multi-Version (gzipped) | Delta |
|---------|-----------:|-----------:|------:|
| Shell | 221.3 KB | 65.7 KB | −155.6 KB |
| Cart | 211.7 KB | 183.7 KB | −28.0 KB |
| Bikes | 223.1 KB | 193.4 KB | −29.7 KB |
| Orders | 222.3 KB | 119.7 KB | −102.6 KB |
| **Per-MFE Total** | **878.4 KB** | **562.5 KB** | **−315.9 KB** |

> **Important context**: The original Nx build bundles shared dependencies (Angular) into each
> MFE's dist folder as fallback, but at **runtime** Module Federation deduplicates them — only
> **one copy** of Angular loads. The per-MFE dist sizes above are misleading for runtime comparison.

### Estimated Runtime Payload (what the browser actually downloads)

| Scenario | Estimated Total Download |
|----------|-------------------------:|
| **Original Nx (shared deps)** | ~250–280 KB gzipped |
| **Multi-Version (no sharing)** | ~562 KB gzipped |
| **Increase** | **~2x larger** |

In the original setup, Angular core (~65 KB gzipped) loads once and is shared across all 4 MFEs.
In the multi-version setup, **3 separate Angular runtimes** load (v19, v20, v21), each ~60–95 KB.

---

## Architecture Details

### How It Works

```
┌──────────────────────────────────────────────────┐
│                  Shell (Host)                     │
│                  Angular 19                       │
│                  Port 4200                        │
│                                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ <mfe-bikes> │ │ <mfe-cart>  │ │ <mfe-orders>│ │
│  │  Angular 21 │ │  Angular 20 │ │  Angular 19 │ │
│  │  Port 4202  │ │  Port 4201  │ │  Port 4203  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└──────────────────────────────────────────────────┘
```

1. **Module Federation** loads each remote's `remoteEntry.js` at runtime
2. Host calls `import('cart/web-component').then(m => m.mount())` to register the custom element
3. Each remote uses `createApplication()` + `createCustomElement()` from `@angular/elements`
4. Custom elements render inside the host DOM as `<mfe-cart>`, `<mfe-bikes>`, `<mfe-orders>`
5. Cross-MFE communication uses `window.dispatchEvent(new CustomEvent(...))`:
   - `add-to-cart` — bikes → cart
   - `navigate-to` — remotes → shell (for route changes)

### Key Technical Choices

- **Zoneless change detection** (`provideExperimentalZonelessChangeDetection` in v19,
  `provideZonelessChangeDetection` in v20/v21) — avoids zone.js conflicts between
  multiple Angular instances
- **No shared dependencies** (`shared: {}` in webpack) — each remote is fully self-contained
- **`@angular-builders/custom-webpack`** — integrates Module Federation with Angular CLI
  without needing Nx
- **`output.publicPath: 'auto'`** — enables correct asset resolution regardless of host URL

---

## Pros and Cons

### ✅ Pros

1. **True version independence** — Each MFE can use a completely different Angular version.
   Teams can upgrade on their own schedule without coordinating across the entire organization.

2. **Complete team autonomy** — Each MFE is a standalone project with its own `package.json`,
   `node_modules`, build pipeline, and deployment. No monorepo coordination needed.

3. **Zero coupling between MFEs** — No shared dependencies means no version conflicts,
   no singleton issues, and no "diamond dependency" problems. One team's upgrade cannot
   break another team's MFE.

4. **Independent deployability** — Each remote can be built and deployed independently.
   A new version of `cart` (Angular 20) can go live without rebuilding `shell` or `bikes`.

5. **Fault isolation** — If one remote crashes, it only affects its own custom element.
   The host and other remotes continue working. Angular Elements provides a natural
   error boundary.

6. **Technology migration path** — This pattern enables gradual migration not just between
   Angular versions, but potentially to other frameworks entirely (React, Vue, Lit) since
   custom elements are framework-agnostic.

7. **Simplified mental model** — Each MFE is "just an Angular app." No special Nx plugins,
   no shared library management, no workspace-level dependency coordination.

8. **Build speed** — Each MFE builds independently in 2–5 seconds. No full-workspace builds.
   CI can build only changed MFEs.

### ❌ Cons

1. **~2x larger total bundle** — The browser downloads ~562 KB gzipped vs ~280 KB with
   shared deps. Each remote includes its own Angular runtime (~60–95 KB gzipped).
   For 3 remotes, that's ~200 KB of duplicated framework code.

2. **Multiple Angular runtimes in memory** — Each custom element bootstraps its own Angular
   application instance. On a page showing all 3 remotes, 3+ separate Angular instances
   run simultaneously, increasing memory usage.

3. **No shared state management** — Angular's dependency injection doesn't cross custom
   element boundaries. Shared state requires explicit mechanisms like `CustomEvent`,
   `BroadcastChannel`, or a framework-agnostic state library.

4. **Style isolation challenges** — Each Angular instance has its own `ViewEncapsulation`.
   Global styles don't naturally propagate into custom elements. Consistent theming
   requires either shared CSS custom properties (CSS variables) or duplicated style sheets.

5. **Slower initial page load** — The browser must download, parse, and execute multiple
   Angular bundles before all MFEs render. Users see the host shell first, then remotes
   pop in as their bundles load (potential layout shift / CLS issues).

6. **Increased maintenance burden** — 4 separate `package.json` files, 4 separate
   `node_modules`, 4 separate Angular CLI configs. Keeping them consistent (linting rules,
   TypeScript settings, build config) requires discipline or shared tooling.

7. **Cross-MFE communication is primitive** — `CustomEvent` dispatching works but is
   loosely typed, hard to debug, and lacks discoverability. No compile-time safety
   for the event contracts between MFEs.

8. **More complex local development** — Running the full app requires starting 4 dev
   servers in 4 terminals. No single `nx serve` command. Hot reload only works within
   a single MFE.

9. **Potential zone.js / change detection conflicts** — Although we use zoneless change
   detection to mitigate this, running multiple Angular apps on the same page is not an
   officially supported configuration. Edge cases with global event handlers, animations,
   or third-party libraries could surface.

10. **No tree-shaking across MFEs** — Common utilities, models, or services used by
    multiple MFEs are duplicated in each bundle rather than shared from a library.

---

## When to Use This Approach

### Good fit when:
- Large organizations with many independent teams that need release autonomy
- Migrating a legacy Angular app incrementally (e.g., v15 → v19 one section at a time)
- MFEs are coarse-grained (each represents a full page or major section, not small widgets)
- Network bandwidth is not the primary constraint (internal tools, enterprise apps)
- Teams have different upgrade timelines and cannot synchronize major version bumps

### Avoid when:
- All MFEs can reasonably run the same Angular version
- Bundle size / initial load performance is critical (public-facing, mobile-first apps)
- MFEs are fine-grained (many small components on the same page)
- A monorepo with shared dependencies already works well for the team
- The organization is small enough that coordinated upgrades are feasible

---

## Recommendations

If you choose this approach in production:

1. **Use a CDN with aggressive caching** — Since remotes are independently deployed,
   each gets its own cache entry. Content-hashed filenames ensure cache busting only
   for changed MFEs.

2. **Lazy-load remotes** — Don't load all remotes upfront. Load them on route navigation
   or user interaction to reduce initial payload.

3. **Consider a shared design system via CSS custom properties** — Instead of sharing
   Angular component libraries, share design tokens as CSS variables that work across
   any framework.

4. **Define a typed event contract** — Create a shared TypeScript types-only package
   (no runtime code) that defines the `CustomEvent` payloads used for cross-MFE
   communication.

5. **Monitor bundle sizes in CI** — Set up bundle size budgets for each MFE and fail
   the build if they're exceeded.

6. **Evaluate Native Federation** — The `@angular-architects/native-federation` package
   provides a more Angular-native approach to Module Federation that may simplify some
   of the webpack configuration.
