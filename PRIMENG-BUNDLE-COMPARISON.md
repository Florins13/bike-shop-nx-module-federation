# PrimeNG Bundle Size Comparison: Shared vs Non-Shared Dependencies

## Experiment Overview

This report compares the bundle size impact of adding **PrimeNG** to micro-frontend (MFE)
architectures under two strategies:

1. **Nx + Module Federation (shared deps)** — Single Angular 21 version, PrimeNG 21 shared
   across all MFEs via Module Federation's `shared` config
2. **Standalone MFE + Angular Elements (no shared deps)** — Each MFE has its own Angular
   version (19/20/21), PrimeNG bundled independently per remote, zero shared libraries

PrimeNG was added to **cart** and **bikes** MFEs only (not shell or orders).

### PrimeNG Components Used

| Component | Module | Used In |
|-----------|--------|---------|
| Button | `primeng/button` | Cart (remove, +/−, checkout), Bikes (add to cart, edit, delete) |
| Card | `primeng/card` | Bikes (bike product cards) |
| Tag | `primeng/tag` | Cart (price badge), Bikes (price, "Electric" badge) |
| InputText | `primeng/inputtext` | Bikes (search input) |
| Badge | `primeng/badge` | Bikes (imported for potential stock display) |

### Versions Used

| Setup | Angular | PrimeNG | TypeScript |
|-------|---------|---------|------------|
| Nx (all apps) | 21.2.9 | 21.x | ~5.9.0 |
| Standalone shell | 19.2.21 | — | ~5.7.0 |
| Standalone cart | 20.3.19 | 20.x | ~5.8.0 |
| Standalone bikes | 21.2.9 | 21.x | ~5.9.0 |
| Standalone orders | 19.2.21 | — | ~5.7.0 |

---

## Bundle Size Results

### Per-MFE Comparison (Raw JS)

| MFE | Standalone (no sharing) | Nx (shared deps) | Notes |
|---------|------------------------:|------------------:|-------|
| Shell | 215.5 KB | 739.3 KB | No PrimeNG; Nx includes shared Angular in fallback |
| Cart | **761.2 KB** | **1,104.7 KB** | PrimeNG 20 (standalone) vs 21 (Nx) |
| Bikes | **809.3 KB** | **1,196.4 KB** | PrimeNG 21 in both |
| Orders | 378.8 KB | 745.6 KB | No PrimeNG |
| **Total dist** | **2,164.8 KB** | **6,539.5 KB** | |

### Per-MFE Comparison (Gzipped — more realistic for network transfer)

| MFE | Standalone (gzipped) | Nx (gzipped) |
|---------|---------------------:|-----------------:|
| Shell | 65.7 KB | 221.3 KB |
| Cart | **237.1 KB** | **321.8 KB** |
| Bikes | **248.4 KB** | **343.2 KB** |
| Orders | 119.7 KB | 222.3 KB |
| **Total dist** | **668.6 KB** | **1,666.3 KB** |

> ⚠️ **Important**: The "Total dist" numbers are misleading for runtime comparison.
> In the Nx setup, shared dependencies (Angular, RxJS, PrimeNG) are duplicated in
> each app's dist folder as Module Federation fallback, but **only one copy loads at
> runtime**. See the "Estimated Runtime Payload" section below.

---

## Estimated Runtime Payload

This is what the **browser actually downloads** when a user visits the app and all
4 MFEs load:

### Standalone MFE (no sharing)

Every remote downloads its own Angular + PrimeNG runtime:

| What loads | Size (gzipped) |
|------------|---------------:|
| Shell (Angular 19 core) | ~66 KB |
| Cart (Angular 20 + PrimeNG 20 + app code) | ~237 KB |
| Bikes (Angular 21 + PrimeNG 21 + app code) | ~248 KB |
| Orders (Angular 19 core + app code) | ~120 KB |
| **Total runtime download** | **~671 KB** |

### Nx Module Federation (shared deps)

Angular + PrimeNG load **once** via the host. Remotes only contribute unique code:

| What loads | Size (gzipped) |
|------------|---------------:|
| Shell host (Angular 21 shared + router + app) | ~221 KB |
| Shared PrimeNG chunks (loaded once) | ~0 KB (tree-shaken into remote chunks) |
| Cart remote (unique component code) | ~30-50 KB |
| Bikes remote (unique component code) | ~30-50 KB |
| Orders remote (unique route code) | ~10-20 KB |
| **Total runtime download** | **~300–350 KB** |

### Runtime Comparison

| Metric | Standalone | Nx Shared | Difference |
|--------|----------:|----------:|----------:|
| **Estimated runtime download** | ~671 KB | ~300–350 KB | **~2x larger** |
| Angular instances in memory | 3 (v19, v20, v21) | 1 (v21) | 3x more |
| PrimeNG instances in memory | 2 (v20, v21) | 1 (v21) | 2x more |

---

## PrimeNG-Specific Bundle Impact

### How much does PrimeNG add per remote? (Standalone, no sharing)

| MFE | Without PrimeNG | With PrimeNG | PrimeNG Overhead |
|------|----------------:|-------------:|-----------------:|
| Cart (raw) | 557.2 KB | 761.2 KB | **+204.0 KB (+37%)** |
| Cart (gz) | 183.7 KB | 237.1 KB | **+53.4 KB (+29%)** |
| Bikes (raw) | 593.1 KB | 809.3 KB | **+216.2 KB (+36%)** |
| Bikes (gz) | 193.4 KB | 248.4 KB | **+55.0 KB (+28%)** |

### Key Takeaway

When PrimeNG is **not shared**, each remote that uses it pays a **~200 KB raw / ~54 KB
gzipped** overhead. With 2 remotes using PrimeNG, that's **~400 KB raw / ~108 KB gzipped**
of duplicated PrimeNG code.

When PrimeNG **is shared** (Nx setup), this cost is paid **once** — savings of ~200 KB raw /
~54 KB gzipped for every additional remote.

---

## Detailed File Breakdown

### Standalone Cart (Angular 20 + PrimeNG 20, no sharing)

| File | Raw | Gzipped | Contents |
|------|----:|--------:|----------|
| remoteEntry.js | 3.2 KB | 1.7 KB | Module Federation entry |
| main.js | 2.8 KB | 1.5 KB | App entry |
| 689.js | 296.5 KB | 94.8 KB | Angular core + bootstrap-element |
| 780.js | 225.3 KB | 75.6 KB | Angular common/platform |
| 980.js | 167.0 KB | 45.7 KB | PrimeNG components + app code |
| 700.js | 66.4 KB | 19.3 KB | @angular/animations/browser |
| **Total** | **761.2 KB** | **237.1 KB** | |

### Standalone Bikes (Angular 21 + PrimeNG 21, no sharing)

| File | Raw | Gzipped | Contents |
|------|----:|--------:|----------|
| remoteEntry.js | 3.2 KB | 1.7 KB | Module Federation entry |
| main.js | 2.8 KB | 1.5 KB | App entry |
| 548.js | 301.8 KB | 96.6 KB | Angular core + bootstrap-element |
| 120.js | 231.5 KB | 77.4 KB | Angular common/platform |
| 420.js | 203.5 KB | 53.6 KB | PrimeNG components + app code |
| 291.js | 66.4 KB | 19.3 KB | @angular/animations/browser |
| **Total** | **809.3 KB** | **248.4 KB** | |

### Nx Cart (Angular 21 + PrimeNG 21, shared via MF)

| File | Raw | Gzipped | Contents |
|------|----:|--------:|----------|
| remoteEntry.mjs | 283.6 KB | ~80 KB | MF entry + shared dep references |
| __federation_expose_CartComponent.js | 6.0 KB | 2.0 KB | Unique cart component code |
| main.js | 140.2 KB | 29.9 KB | App bootstrap (shared Angular ref) |
| common.js | 51.9 KB | 15.4 KB | Common chunk |
| + ~70 lazy chunks | ~823 KB | ~194 KB | Shared Angular + PrimeNG (fallback) |
| **Total dist** | **1,104.7 KB** | **321.8 KB** | Runtime: only expose + shared refs |

### Nx Bikes (Angular 21 + PrimeNG 21, shared via MF)

| File | Raw | Gzipped | Contents |
|------|----:|--------:|----------|
| remoteEntry.mjs | 289.6 KB | ~82 KB | MF entry + shared dep references |
| __federation_expose_BikeListComponent.js | 5.2 KB | 1.9 KB | Unique bikes component code |
| main.js | 144.9 KB | 30.2 KB | App bootstrap (shared Angular ref) |
| common.js | 49.2 KB | 14.6 KB | Common chunk |
| + ~72 lazy chunks | ~707 KB | ~214 KB | Shared Angular + PrimeNG (fallback) |
| **Total dist** | **1,196.4 KB** | **343.2 KB** | Runtime: only expose + shared refs |

---

## Pros and Cons of Each Approach (with PrimeNG)

### Sharing PrimeNG via Module Federation (Nx)

**Pros:**
- PrimeNG loaded once (~200 KB), shared across all remotes
- Consistent UI — all remotes use the same PrimeNG version and theme
- Smaller total runtime payload (~300 KB vs ~671 KB gzipped)
- Theme changes apply globally without rebuilding remotes

**Cons:**
- All remotes must use the same PrimeNG major version
- PrimeNG upgrade requires coordinated release across all teams
- Shared singleton can cause issues if remotes expect different PrimeNG configs
- Nx Module Federation wrapper adds complexity

### Bundling PrimeNG per Remote (Standalone Angular Elements)

**Pros:**
- Each remote can use any PrimeNG version independently
- Teams upgrade PrimeNG on their own schedule
- No coordination needed — complete autonomy
- Different PrimeNG themes per remote if needed

**Cons:**
- ~54 KB gzipped overhead **per remote** that uses PrimeNG
- Multiple PrimeNG instances in memory (2 in this case)
- Potential CSS conflicts between PrimeNG versions on same page
- Users download PrimeNG multiple times — wasted bandwidth
- Theme consistency is the developer's responsibility

---

## Recommendations

### When to share PrimeNG (Nx / Module Federation shared):
- Teams can coordinate on a single PrimeNG version
- 3+ remotes use PrimeNG (savings compound: ~54 KB per additional remote)
- UI consistency across MFEs is a requirement
- Public-facing app where bundle size directly impacts UX

### When NOT to share PrimeNG (Standalone / Angular Elements):
- Teams are on different Angular major versions (PrimeNG version must match)
- Migrating from one UI library to another (e.g., Material → PrimeNG) incrementally
- Only 1-2 remotes use PrimeNG (overhead is manageable)
- Internal/enterprise tool where bandwidth is not a constraint

### Hybrid Approach (Best of Both Worlds)
For organizations that want version independence but reduced duplication:
1. Use **Native Federation** (`@angular-architects/native-federation`) which supports
   version negotiation — if two remotes use PrimeNG 21, it shares; if one uses 20,
   it loads separately
2. Share **only framework deps** (Angular, RxJS) and let each remote bundle its own
   PrimeNG — this gives UI library autonomy while reducing the larger Angular duplication
3. Use **Import Maps** to externalize PrimeNG as a CDN dependency shared by URL

---

## Summary Table

| Metric | Standalone (no sharing) | Nx (shared) | Delta |
|--------|------------------------:|------------:|------:|
| Cart + Bikes dist (raw) | 1,570.5 KB | 2,301.1 KB | Nx larger (fallback copies) |
| Cart + Bikes dist (gz) | 485.5 KB | 665.0 KB | Nx larger (fallback copies) |
| **Est. runtime download** | **~671 KB gz** | **~300-350 KB gz** | **Shared saves ~50%** |
| Angular instances | 3 | 1 | Shared: 3x less memory |
| PrimeNG instances | 2 | 1 | Shared: 2x less memory |
| PrimeNG overhead per remote | ~54 KB gz each | ~0 KB (shared) | ~54 KB saved per remote |
| Version independence | ✅ Full | ❌ Must match | Trade-off |
| Team autonomy | ✅ Full | ⚠️ Coordinated | Trade-off |
| UI consistency | ⚠️ Manual | ✅ Automatic | Trade-off |
