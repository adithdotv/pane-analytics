# Pane Analytics

A privacy-friendly, self-hosted website analytics tool — a lightweight
alternative to Google Analytics or Plausible. No cookies, no personal data
stored, no user tracking across sites.

**Live demo:** https://pane-analytics.in

---

## Why I built this

Most portfolio projects are CRUD apps deployed with one click on a managed
platform (Vercel, Railway). This one is deliberately different: it's built
to demonstrate real systems-engineering skills — handling write-heavy
traffic at scale, deploying on a self-managed Linux server, and running a
genuine CI/CD pipeline — not just "can I build a REST API."

## What it does

- Drop a small JS snippet on any website
- Every pageview is tracked: URL, referrer, and nothing else — no cookies,
  no IP storage, no cross-site tracking
- A dashboard shows visits over time, top pages, and top referrers
- Handles bursty traffic without hammering the database on every request

## Architecture

**Write path** (every pageview):

```
Browser (tracker.js) → Nginx → FastAPI receiver → Redis queue → Worker → PostgreSQL
```

Incoming pageviews don't hit Postgres directly. They're pushed onto a Redis
list, and a separate worker process drains the queue every ~2 seconds,
batch-inserting up to 500 rows at once. This trades a small amount of
latency for a large reduction in database write load — the same underlying
pattern used by production logging/analytics pipelines, just at a learnable
scale.

**Read path** (dashboard):

```
Dashboard → Nginx → FastAPI receiver → PostgreSQL
```

Stats queries go straight to Postgres, bypassing the queue, since the
dashboard needs to reflect committed data.

## Tech stack

| Layer | Tech |
|---|---|
| Tracker | Vanilla JS |
| Backend API | FastAPI (Python) |
| Queue | Redis |
| Worker | Python |
| Database | PostgreSQL |
| Dashboard | Next.js, Recharts |
| Infra | AWS EC2 (Ubuntu 24.04), Nginx, systemd, Let's Encrypt |
| CI/CD | GitHub Actions |

## Infrastructure details

- **systemd** manages the receiver, worker, and dashboard as independent
  services — each restarts automatically on crash, and can fail without
  taking the others down
- **Nginx** is the single public entry point — reverse-proxies to each
  internal service by URL path, terminates TLS, and rate-limits the
  `/collect` endpoint (5 req/s per IP, burst 10) to prevent abuse
- **GitHub Actions** runs the full pytest suite against a temporary
  Postgres container on every push; deployment only proceeds if tests pass,
  then SSHs in, pulls, rebuilds, and restarts services automatically

## Testing

```bash
cd receiver
pytest -v
```

Current coverage: ~73% (`pytest --cov=. --cov-report=term-missing`). Core
request/response and SQL aggregation logic is covered; the worker's
infinite polling loop is tested via its extracted `process_batch` function
rather than directly, since testing an infinite loop directly isn't
practical.

## Local development setup

```bash
# Backend
cd receiver
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Worker (separate terminal)
python worker.py

# Dashboard (separate terminal)
cd dashboard
npm install
npm run dev
```

Requires a local PostgreSQL and Redis instance — see `.env.example` for
required environment variables.

## What I'd build next

- Multi-tenant support (currently single-site only)
- Real user accounts and per-site API keys
- Bot/spam filtering on incoming pageviews
- Automated database backups
- Uptime monitoring with alerting

## Lessons from deploying this for real

Building the app was the easy part. Deploying it surfaced real,
unglamorous infrastructure problems: SSH key mismatches on a fresh EC2
instance, running out of disk space mid-deploy from an oversized
`requirements.txt`, a Node.js production build exhausting RAM on a
`t2.micro` and needing swap space, DNS propagation delays before TLS could
be issued, a Postgres password mismatch that looked like a networking
issue at first, and a Linux file-permission `403` caused by an overly
locked-down home directory. Debugging each one end-to-end — reading the
exact error, isolating the failing layer, fixing the narrowest thing
first — was the actual point of this project.
