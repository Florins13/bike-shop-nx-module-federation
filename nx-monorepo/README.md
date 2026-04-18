# Bike Shop Nx Module Federation

## Backend API
To make the frontend fully functional, build and run the API from:
https://github.com/Florins13/software-engineering/tree/backend-rest-api

## Microfrontends in this workspace

| Project | Role | Local URL |
| --- | --- | --- |
| `shell` | Host application | `http://localhost:4200` |
| `cart` | Remote | `http://localhost:4201` |
| `bikes` | Remote | `http://localhost:4202` |
| `orders` | Remote | `http://localhost:4203` |

## Run the microfrontends

Install dependencies first:

```sh
npm install
```

Run host + all remotes in dev mode (recommended):

```sh
npx nx serve shell --devRemotes=cart,bikes,orders
```

Run only the host:

```sh
npx nx serve shell
```

Run individual remotes:

```sh
npx nx serve cart
npx nx serve bikes
npx nx serve orders
```

> `cart`, `bikes`, and `orders` have `dependsOn: ["shell:serve"]`, so starting a remote also starts the shell if it is not already running.

## Useful Nx commands

| Command | What it does |
| --- | --- |
| `npx nx show projects` | Lists all projects in the workspace |
| `npx nx show project <project-name>` | Shows all targets/options for one project |
| `npx nx graph` | Opens the project dependency graph |
| `npx nx run <project>:<target>` | Runs a target (build/test/lint/serve) |
| `npx nx run-many -t <target> -p <p1>,<p2>` | Runs the same target on multiple projects |
| `npx nx affected -t <target>` | Runs target only for affected projects |
| `npx nx build <project>` | Builds one project |
| `npx nx test <project>` | Runs unit tests for one project |
| `npx nx lint <project>` | Runs linting for one project |
| `npx nx format:check` | Checks formatting |
| `npx nx format:write` | Applies formatting |
| `npx nx reset` | Clears Nx cache and stops daemon |

## Useful Nx Module Federation commands

| Command | What it does |
| --- | --- |
| `npx nx serve shell --devRemotes=cart,bikes,orders` | Runs host with selected remotes in dev mode |
| `npx nx serve shell --skipRemotes=cart` | Runs host while excluding one or more remotes |
| `npx nx build shell --configuration=production` | Builds host for production |
| `npx nx build cart --configuration=production` | Builds a remote for production |
| `npx nx run shell:serve-static` | Serves built host output statically |
| `npx nx run cart:serve-static` | Serves built remote output statically |
| `npx nx g @nx/angular:host <name>` | Generates a new MF host app |
| `npx nx g @nx/angular:remote <name> --host=<host-name>` | Generates a new MF remote app connected to a host |
| `npx nx g @nx/angular:federate-module <name> --project=<remote-name>` | Generates a federated module in a remote |
| `npx nx g @nx/angular:setup-mf --project=<app-name>` | Adds Module Federation config to an existing app |

---
npx nx run shell:build:production
npx nx run-many --target=build --configuration=production --projects=bikes,cart,orders --parallel=3
