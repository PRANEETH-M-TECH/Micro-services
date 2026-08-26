# Communa

A community-restricted, AI-assisted marketplace platform for housing societies. Capstone project — see [`Communa_Capstone_Requirements.docx`](./Communa_Capstone_Requirements.docx) for the full requirements/architecture document.

## Stack

- **Frontend**: React (Vite) + Tailwind CSS — [`frontend/`](./frontend)
- **Backend**: Node.js + Express REST API — [`backend/`](./backend)
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **AI**: Google Gemini API (`gemini-2.5-flash`) — natural-language search, category suggestion, listing generator
- **Containerization**: Docker + Docker Compose
- **CI/CD**: Jenkins (self-hosted, in Docker)

The previous Next.js + Firebase prototype ("Urban Rise" water delivery app) has been archived under [`legacy/`](./legacy) for reference — it is not part of the current build.

## Running locally

```bash
cp .env.example .env
# edit .env — at minimum set GEMINI_API_KEY

docker compose up --build
```

- App: http://localhost
- Backend health check: http://localhost:4000/api/health
- A bootstrap admin account is created automatically on first backend startup, using `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`.

## CI/CD demo (Jenkins)

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
```

- Jenkins UI: http://localhost:8080
- First-run admin password: `docker exec communa-jenkins cat /var/jenkins_home/secrets/initialAdminPassword`

Set up a Pipeline job pointing at this repo (`Jenkinsfile` at the root), with **Poll SCM** configured on a short interval. Any push to the repo is picked up, runs tests, rebuilds the Docker images, and redeploys via `docker compose up -d` — then a health check confirms the new containers actually came up before the build is marked successful.

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```
