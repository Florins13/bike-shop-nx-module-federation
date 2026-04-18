# Bike Shop - Standalone MFE Setup

Each micro-frontend runs independently with its own Angular version, wired together
via **Module Federation** and **Angular Elements** (no shared dependencies).

## Architecture

| MFE | Angular Version | Port | Role |
|---------|----------------|------|------|
| shell | 19 | 4200 | Host (Module Federation container) |
| cart | 20 | 4201 | Remote (custom element: `<mfe-cart>`) |
| bikes | 21 | 4202 | Remote (custom element: `<mfe-bikes>`) |
| orders | 19 | 4203 | Remote (custom element: `<mfe-orders>`) |

## Setup

Install dependencies for each MFE:

```bash
cd isolated-mfe/shell && npm install
cd isolated-mfe/cart && npm install
cd isolated-mfe/bikes && npm install
cd isolated-mfe/orders && npm install
```

## Development

Start each MFE in a separate terminal:

```bash
# Terminal 1 - Remotes first
cd isolated-mfe/cart && npm start
# Terminal 2
cd isolated-mfe/bikes && npm start
# Terminal 3
cd isolated-mfe/orders && npm start
# Terminal 4 - Host last
cd isolated-mfe/shell && npm start
```

## Production Build

```bash
chmod +x isolated-mfe/build-all.sh
./isolated-mfe/build-all.sh
```

## How It Works

- **No shared dependencies**: Each remote bundles its own Angular framework. This is intentional
  to measure the bundle size impact of NOT sharing dependencies across different Angular versions.
- **Angular Elements**: Each remote wraps its main component as a custom element using
  `@angular/elements`. The host loads these via Module Federation and renders them as
  `<mfe-cart>`, `<mfe-bikes>`, `<mfe-orders>`.
- **Cross-MFE communication**: Uses `window.dispatchEvent` / `window.addEventListener`
  for events like `add-to-cart` and `navigate-to`.
