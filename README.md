# Quasar Apps — Company Website

Marketing site for Quasar Apps, a UX-led web & mobile development studio. Showcases
case studies and services, with a contact form that stores submissions and emails the team.

- **Frontend:** React (CRA + CRACO), Tailwind CSS, Framer Motion, React Router
- **Backend:** FastAPI, MongoDB (Motor), Resend (email)
- **Branches:** work on `develop`; `main` is production. Promote via a `develop → main` PR.

> Roadmap for hardening this project to production quality lives in [`ROADMAP.md`](./ROADMAP.md).

## Repository layout

```
backend/      FastAPI app (single module: server.py) + pytest suite
frontend/     React app (src/components, src/pages); CRACO build
memory/       Product docs (PRD.md)
.github/      CI workflow
ROADMAP.md    Phased engineering roadmap
```

## Prerequisites

- **Node** 20+ and **Yarn** 1.x
- **Python** 3.11+
- A **MongoDB** instance (local or hosted)
- (optional) a **Resend** API key for contact-form email notifications

## Environment variables

Copy the example files and fill them in (`.env` files are gitignored):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Variable | Where | Purpose |
|----------|-------|---------|
| `MONGO_URL` | backend | MongoDB connection string (**required**) |
| `DB_NAME` | backend | Database name (**required**) |
| `RESEND_API_KEY` | backend | Resend key; if empty, email is skipped (messages still stored) |
| `CONTACT_EMAIL` | backend | Recipient for contact-form notifications |
| `CORS_ORIGINS` | backend | Comma-separated allowed origins (defaults to `*`) |
| `REACT_APP_BACKEND_URL` | frontend | Base URL of the backend, e.g. `http://localhost:8000` |

## Running locally

**Backend** (from `backend/`):

```bash
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

**Frontend** (from `frontend/`):

```bash
yarn install
yarn start
```

The app calls `${REACT_APP_BACKEND_URL}/api/...`.

## API

- `GET  /api/` — health/root
- `GET  /api/case-studies` — list case studies
- `GET  /api/case-studies/{slug}` — case study detail
- `POST /api/contact` — submit the contact form (rate-limited 5/min per IP)

## Tests

The backend suite (`backend/tests/`) is an HTTP integration suite. It **skips** unless a
target backend is provided. Install the pinned test tooling first — it's kept out of the
runtime `requirements.txt` (see `backend/dev-requirements.txt`):

```bash
pip install -r backend/dev-requirements.txt
REACT_APP_BACKEND_URL=http://localhost:8000 pytest backend/tests -q
```

CI (`.github/workflows/ci.yml`) builds the frontend and compiles + collects the backend
suite on every push/PR to `main`/`develop`.

## Deployment notes

- Run uvicorn behind the TLS-terminating proxy with
  `--proxy-headers --forwarded-allow-ips=<proxy-ip>` so the contact-form rate limiter
  keys on the real client IP. Without it the limit is coarser (global) but still fails closed.
- Set `CORS_ORIGINS` to the production frontend origin(s) instead of `*`.
