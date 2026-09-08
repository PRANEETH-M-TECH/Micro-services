# Communa

A community-restricted, AI-assisted marketplace platform for housing societies. Capstone project — see [`Communa_Capstone_Requirements.docx`](./Communa_Capstone_Requirements.docx) for the full requirements/architecture document.

Residents (consumers) discover and contact verified sellers — fellow residents offering food, clothing, essentials, services, or tuitions — from within their own housing society. Every account is approved by a society admin before it gets access. It's peer-to-peer commerce, structured and admin-moderated, instead of scattered WhatsApp groups.

---

## 1. Stack, and why each piece was chosen

| Layer | Technology | Why |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Fast dev server, small production bundle, matches the capstone requirements doc exactly |
| Backend | Node.js + Express REST API | Simple, well-understood REST layer; easy to explain route-by-route in a viva |
| Database | PostgreSQL | Relational schema (Users/Sellers/Categories/AdminActions) maps cleanly to tables + foreign keys |
| Auth | JWT + bcrypt | Stateless tokens, no session store needed; bcrypt for one-way password hashing |
| AI | Google Gemini API (`gemini-2.5-flash`) | Natural-language search, category suggestion, listing generation — all advisory, never auto-publishing (admin approval is still required) |
| Containerization | Docker + Docker Compose | See §2 |
| CI/CD | Jenkins (self-hosted, in Docker) | See §3 |

The previous Next.js + Firebase prototype ("Urban Rise" water delivery app) is archived under [`legacy/`](./legacy) for reference — it is not part of the current build.

---

## 2. Why Docker — and what "deployed on Docker" actually means

**The problem Docker solves:** this app has three moving parts that all need to run together — a database, a backend API, a frontend. Without Docker, you'd have to manually install Postgres, install Node, configure them to find each other, and hope the versions on your laptop match whatever the grader's machine has. Docker packages each part (with its exact dependencies) into a **container** — a small, self-contained, reproducible unit that runs identically anywhere Docker is installed.

**What we actually built:**
- `backend/Dockerfile` — packages the Express API into an image
- `frontend/Dockerfile` — builds the React app, then serves the static files through nginx
- `backend/db/Dockerfile` — a Postgres image with our schema (`init.sql`) baked in, so the database creates all its tables automatically on first boot
- `docker-compose.yml` — the file that says "run all three of these together, on these ports, wired to each other" — this is the actual **deployment**: running `docker compose up` takes the three Dockerfiles, builds images from them, and starts three live containers that talk to each other and serve the app at `http://localhost`.

**Why there's no public `https://` URL:** that would require renting a cloud server with a public IP address, a domain name, and a TLS certificate — none of which the capstone requirements ask for. The requirement is a **local, containerized, live deployment** you demo from your own laptop. `http://localhost` is a completely real, live deployment — it's just scoped to your machine, which is exactly the intended setup for an in-person faculty demo.

---

## 3. Why Jenkins — and what it's actually doing

**The problem Jenkins solves:** without it, every time you change code, you'd have to manually run `docker compose up -d --build` yourself to see the change live. That's fine for you, but it doesn't demonstrate **continuous deployment** — the core idea that a team's changes should reach production automatically and reliably, with tests gating anything broken from going out. Jenkins is the tool that watches your repository and does that rebuild-and-redeploy step **for you, automatically**, whenever new code lands.

**What we set up, concretely:**
- Jenkins itself runs as its own Docker container (`docker-compose.jenkins.yml`), separate from the app's three containers
- It's a custom image (`jenkins/Dockerfile`) — the stock Jenkins image doesn't include Docker or Node.js, so we added both, since the pipeline needs to run `npm test` and drive Docker
- Jenkins is given access to Docker itself via a mounted socket (`/var/run/docker.sock`) — this lets Jenkins tell your machine's real Docker daemon to build and start the app's containers, rather than trying to run Docker-inside-Docker (unnecessarily complex)
- The **pipeline job** (`communa-pipeline`) is configured to watch this exact repo folder (bind-mounted into Jenkins at `/workspace`) via **Poll SCM** — every minute, it checks "has a new commit landed?" If yes, it automatically runs the steps defined in `Jenkinsfile`:
  1. Checkout the new code
  2. Run backend tests (`npm test` in `backend/`)
  3. Run frontend tests (`npm test` in `frontend/`)
  4. Rebuild the Docker images (`docker compose build`)
  5. Redeploy (`docker compose up -d`) — Docker only recreates containers whose image actually changed, so this is fast
  6. Health-check both the backend and frontend to confirm the new deployment is actually live before declaring success

That's the full "develop → test → deploy" loop your Software Engineering syllabus asks for, running unattended.

---

## 4. The whole flow, end to end (for explaining to faculty)

```
 You edit code (e.g. a landing page color)
        │
        ▼
 git commit + git push
        │
        ▼
 Jenkins' Poll SCM notices the new commit (checks every 60s)
        │
        ▼
 Jenkinsfile runs automatically:
   1. Checkout          → pulls your new commit
   2. Backend tests      → npm test (Jest + Supertest)
   3. Frontend tests      → npm test (Vitest + React Testing Library)
   4. Build images        → docker compose build
   5. Deploy              → docker compose up -d  (recreates only what changed)
   6. Health check        → confirms the new containers actually respond
        │
        ▼
 The live app at http://localhost now reflects your change
 — with zero manual steps after the git push
```

Everything left of "Jenkins' Poll SCM" is your normal development work. Everything from Poll SCM onward happened without you touching a keyboard — that's the part worth pointing at during the demo.

---

## 5. Daily routine — starting everything back up (e.g. after shutting down your laptop)

You do **not** need to redo any setup (no reinstalling plugins, no recreating the Jenkins job, no rebuilding images from scratch) — all of that is preserved in Docker volumes that persist on disk across restarts. You only need to get Docker and the containers running again.

1. **Start Docker Desktop.** Open it from the Start menu, wait until it shows "Engine running."
2. **Bring the app back up:**
   ```powershell
   cd "C:\Users\home\Desktop\Micro\Micro-services"
   docker compose up -d
   ```
   (No `--build` needed unless you changed code since the last time — see the command reference below for when to add it.)
3. **Bring Jenkins back up:**
   ```powershell
   docker compose -f docker-compose.jenkins.yml up -d
   ```
4. **Log into Jenkins**: go to `http://localhost:8080`. It's the *same login* as before (username `admin` and whatever password/account you set up during first-time setup) — Jenkins' entire state, including your `communa-pipeline` job, lives in a persistent volume and survives restarts. You are not setting anything up again.
5. That's it — both are live again. Making a code change and pushing it will trigger Jenkins automatically, same as before.

*(In practice, Docker Desktop usually restarts previously-running containers on its own once the engine comes up, since they're configured with `restart: unless-stopped`. Running the two commands above anyway is the safe, guaranteed way to confirm everything's actually up — takes a few seconds if nothing needed rebuilding.)*

---

## 6. Demo accounts (seeded)

So category pages aren't empty and you don't have to live-register every account during the presentation, run this once (needs the `db` container up and reachable):

```powershell
cd "C:\Users\home\Desktop\Micro\Micro-services\backend"
npm run seed
```

It's safe to run more than once — it skips anything that already exists. This creates:

| Role | Email | Password | Purpose |
|---|---|---|---|
| Admin | whatever `ADMIN_EMAIL` is in `.env` | whatever `ADMIN_PASSWORD` is in `.env` | Created automatically on backend startup, not by the seed script |
| Consumer | `demo.consumer@communa.local` | `Demo@123` | Log in as this to browse categories/listings without registering live |
| Consumer | `faculty.guest@communa.local` | `Demo@123` | Hand this one to the evaluator if they want to click around themselves |
| Seller | `lakshmi.kitchen@communa.local` | `Demo@123` | Approved listing under **Food** |
| Seller | `fatima.ethnic@communa.local` | `Demo@123` | Approved listing under **Clothing** |
| Seller | `suresh.store@communa.local` | `Demo@123` | Approved listing under **Essentials** |
| Seller | `vikram.tailor@communa.local` | `Demo@123` | Approved listing under **Additional Services** |
| Seller | `ramesh.tuition@communa.local` | `Demo@123` | Approved listing under **Tuitions** |

All 5 categories have at least one approved, browsable listing. For the *live* approval-flow part of the demo (steps 7–14 below), still register a **fresh** account on the spot — that's what actually proves the pending → admin-approves → live flow, rather than something pre-baked.

---

## 7. Full command reference

### Everyday app commands

| Command | What it does | When to use it |
|---|---|---|
| `docker compose up -d` | Starts (or resumes) the app's 3 containers in the background | Normal day-to-day startup, no code changes |
| `docker compose up -d --build` | Rebuilds images from current code, then starts | After you (or I) changed code in `frontend/` or `backend/` |
| `docker compose ps` | Lists the app's containers and their status | Quick "is it actually running?" check |
| `docker compose down` | Stops and removes the app's containers | Shutting down cleanly. Your database data is safe — it lives in a named volume, not inside the container |
| `docker compose down -v` | Same as above, **but also deletes the database volume** | Only when you deliberately want a totally fresh database (wipes all registered users/listings) |
| `docker compose logs -f backend` | Streams live logs from just the backend container | Debugging a backend error |
| `docker compose logs -f frontend` | Streams live logs from just the frontend container | Debugging a frontend/nginx error |
| `curl.exe http://localhost:4000/api/health` | Checks the backend is reachable and healthy | Quick health check without opening a browser |
| `curl.exe -I http://localhost` | Checks the frontend is being served | Same, for the frontend |
| `npm run dev` (from repo root) | Runs backend + frontend locally with hot reload, outside Docker | Fast iteration while coding — not needed for the demo itself. Requires `docker compose stop backend` first (both want port 4000) and `db` left running in Docker |
| `npm run seed` (from `backend/`) | Loads the demo accounts/listings from §6 | Once, any time after the `db` container is up and empty (or re-run any time — it's idempotent) |

### Jenkins commands

| Command | What it does | When to use it |
|---|---|---|
| `docker compose -f docker-compose.jenkins.yml up -d` | Starts (or resumes) the Jenkins container | Normal day-to-day startup |
| `docker compose -f docker-compose.jenkins.yml up -d --build` | Rebuilds the Jenkins image itself, then starts | Only if you change `jenkins/Dockerfile` or `jenkins/plugins.txt` — rare |
| `docker compose -f docker-compose.jenkins.yml ps` | Checks if the Jenkins container is up | Quick status check |
| `docker exec communa-jenkins cat /var/jenkins_home/secrets/initialAdminPassword` | Prints the first-run unlock password | **Only works on the very first boot**, before you finish the setup wizard. After that, this file no longer exists — that's normal, just log in with your admin account instead |
| `docker logs communa-jenkins --tail 50` | Shows Jenkins' own recent startup/error logs | Jenkins won't start, or the UI won't load |

### Demo / making a change go live automatically

```powershell
# 1. Make a small visible code change, e.g. edit frontend/src/pages/Landing.jsx

# 2. Commit and push
git add <the file(s) you changed>
git commit -m "Describe the change"
git push

# 3. Wait up to 60 seconds — Jenkins' Poll SCM notices the new commit on its own
#    (watch it happen live: Jenkins UI → communa-pipeline → a new build appears automatically)

# 4. Refresh http://localhost — the change is now live, with zero manual deploy steps
```

You can also trigger it manually instead of waiting: open the `communa-pipeline` job in Jenkins and click **"Build Now"**.

---

## 8. Troubleshooting — common errors and what they mean

| Symptom | What's actually happening | Fix |
|---|---|---|
| `docker: error ... dockerDesktopLinuxEngine: The system cannot find the file specified` | Docker Desktop isn't running | Open Docker Desktop, wait for "Engine running," then retry |
| `open C:\...\docker-compose.yml: The system cannot find the file specified` | You ran the command from the wrong folder | `cd "C:\Users\home\Desktop\Micro\Micro-services"` first |
| `docker exec communa-jenkins cat .../initialAdminPassword` → `No such file or directory` | Either Jenkins hasn't finished its first boot yet (wait ~30–60s and retry), or the file simply no longer exists because setup was already completed once | If you've already been through the Jenkins setup wizard before, this is expected — just log in normally instead |
| `Error response from daemon: No such container: communa-jenkins` | The container isn't running — possibly stopped or removed | `docker compose -f docker-compose.jenkins.yml up -d` |
| Jenkins pipeline fails: `ERROR: Unable to find Jenkinsfile from git /workspace` | Either the branch specifier doesn't match your actual branch (should be `*/main`), or — most commonly — **your latest code was never committed**. Docker/git only see committed history, not files sitting uncommitted on disk | Check Branch Specifier is `*/main` in the job's Pipeline config; and always `git add` + `git commit` + `git push` before expecting Jenkins to see a change |
| Jenkins pipeline fails: `Checkout of Git remote '/workspace' aborted because it references a local directory, which may be insecure` | Jenkins' git plugin blocks local-path checkouts by default as a security measure | Already fixed in `docker-compose.jenkins.yml` via the `JAVA_OPTS` env var — if you ever recreate the Jenkins container from scratch and hit this again, confirm that line is still present |
| App containers fail to start with a **port already allocated** error | Something else (often an old, differently-named container) is already using port 80, 4000, or 5432 | `docker compose ps` to find what's running, `docker compose -p <old-project-name> down` to stop the conflicting stack |
| AI buttons (Smart Search / Suggest Category / Generate Listing) return an error | Usually `GEMINI_API_KEY` missing, wrong, or the account has no quota | Check the value in `.env`, then `docker compose up -d --build backend` to reload it |
| A secret (API key, password) got accidentally printed to a terminal or shared here | Treat it as exposed | Revoke/regenerate that key from its provider's dashboard, update `.env`, then `docker compose up -d --build backend` |
| You changed `JWT_SECRET` and now nobody can stay logged in | Expected — changing the JWT secret invalidates every previously-issued login token | Just log in again; avoid changing it unless you mean to sign everyone out |

---

## 9. Presentation demo script (test cases)

Run through these in order during your live demo. Each one has an action and an expected result — if the expected result doesn't happen, that's your cue to check the troubleshooting table above.

### Setup check (before the audience arrives)

| # | Action | Expected result |
|---|---|---|
| 1 | `docker compose ps` | All 3 app containers (`db`, `backend`, `frontend`) show `Up`/`healthy` |
| 2 | `docker compose -f docker-compose.jenkins.yml ps` | `communa-jenkins` shows `Up` |
| 3 | `curl.exe http://localhost:4000/api/health` | Returns `{"status":"ok",...}` |
| 4 | Open `http://localhost` in browser | Landing page loads, "Enter Community" button visible |
| 5 | Open `http://localhost:8080` in browser | Jenkins dashboard loads, you're logged in |

### Application walkthrough (the product itself)

| # | Action | Expected result |
|---|---|---|
| 6 | Log in as admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`) | Lands on Admin Dashboard |
| 6b | *(Optional, if you ran `npm run seed`)* Log in as `demo.consumer@communa.local` / `Demo@123` in a second window | Lands on Category Grid with all 5 categories already populated — good for showing the browsing experience quickly before doing the live registration flow below |
| 7 | Open a private/incognito window → Register a **new** consumer account (a fresh one, not a seeded one) | Redirected to "Pending Approval" screen |
| 8 | Back in the admin tab → "Pending Consumers" tab → Approve that account | Account disappears from the pending list |
| 9 | Log in as the now-approved consumer | Lands on Category Grid (5 categories visible) |
| 10 | In the incognito window, register a **seller** account, get it approved the same way, log in, go to "Become a Seller" | Form loads with the two AI buttons |
| 11 | Type a rough description → click "✨ Suggest Category" | A category auto-fills within a few seconds |
| 12 | Click "✨ Generate Listing" | Title/description/price fields auto-fill |
| 13 | Submit the listing | Redirected home; listing is now "pending" |
| 14 | Back in admin tab → "Pending Sellers" tab → Approve the listing | Listing disappears from pending |
| 15 | As the consumer, browse to that category | The approved listing now appears |
| 16 | Click into the listing → "Call" / "WhatsApp" buttons | Buttons are present and correctly formatted with the contact number |
| 17 | On the Category Grid, use the Smart Search bar with a natural-language query (e.g. "someone who sells homemade food") | Returns AI-ranked matching sellers |

### CI/CD demo (the part that proves the DevOps pipeline)

| # | Action | Expected result |
|---|---|---|
| 18 | Open `frontend/src/pages/Landing.jsx` in an editor, change something visible (e.g. the headline text or a color class) | — |
| 19 | `git add`, `git commit -m "..."`, `git push` | Commit succeeds |
| 20 | Switch to the Jenkins UI, open `communa-pipeline` | Within ~60 seconds, a new build starts **on its own** — nobody clicked "Build Now" |
| 21 | Click into the running build → Console Output | Watch it move through: Checkout → Backend tests → Frontend tests → Build Images → Deploy → Health Check |
| 22 | Wait for `Finished: SUCCESS` | Pipeline completes green |
| 23 | Refresh `http://localhost` in the browser | The change you made in step 18 is now live — with zero manual deploy commands run after the `git push` |

Step 18–23 is the single most important sequence to rehearse beforehand — it's the concrete proof of "any change triggers an automatic rebuild and redeploy."

---

## 10. Project structure

```
Micro-services/
├── backend/              Express API, Postgres schema, Jest tests
├── frontend/              Vite + React app, Vitest/RTL tests
├── jenkins/                Custom Jenkins image (Docker CLI + Node.js + plugins)
├── legacy/                  Archived Next.js/Firebase prototype (reference only)
├── docker-compose.yml         App stack: db + backend + frontend
├── docker-compose.jenkins.yml   Jenkins, separately
├── Jenkinsfile                   The CI/CD pipeline definition
├── .env.example                    Template for required environment variables
└── Communa_Capstone_Requirements.docx   The graded requirements document
```

## 11. Tests

```bash
cd backend && npm test
cd frontend && npm test
```
