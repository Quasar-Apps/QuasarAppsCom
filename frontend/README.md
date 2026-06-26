# Quasar Apps — Frontend

React single-page app for the Quasar Apps marketing site. Built with **Create React App
via [CRACO](https://craco.js.org/)** (not plain `react-scripts`), Tailwind CSS, Framer
Motion, and React Router.

See the [root README](../README.md) for full-stack setup; this file covers the frontend only.

## Setup

```bash
yarn install
cp .env.example .env   # set REACT_APP_BACKEND_URL
```

`REACT_APP_BACKEND_URL` is the base URL of the backend (no trailing slash); the app calls
`${REACT_APP_BACKEND_URL}/api/...`.

## Scripts

> Uses **Yarn** + **CRACO**. Use these, not `npm`/`react-scripts` directly.

| Command | What it does |
|---------|--------------|
| `yarn start` | Run the dev server (`craco start`) at http://localhost:3000 |
| `yarn build` | Production build to `build/` (`craco build`) |
| `yarn test`  | Run tests in watch mode (`craco test`) |

## Structure

```
src/
  App.js            Router + Toaster
  pages/            HomePage, CaseStudyPage
  components/       Section components (Hero, Services, Contact, ...)
  components/ui/    shadcn/ui primitives (currently unused — see ROADMAP FE-1)
  index.css         Design tokens + "Liquid Glass" styles
```

## Plugins

`plugins/health-check/` adds `/health/live` and `/health/ready` endpoints, toggled via
`ENABLE_HEALTH_CHECK`.
