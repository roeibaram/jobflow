# Jobflow

Jobflow is a full-stack app for keeping a job search organized in one place.

Instead of spreading everything across notes, spreadsheets, and saved links, the app lets you keep track of applications, recruiter outreach, statuses, follow-up dates, and personal notes from one dashboard.

## What it does

- add a job application with company, role, link, applied date, status, and notes
- save recruiter and outreach details on the same record
- edit and delete applications
- filter applications by status
- search by company, role, recruiter, or notes
- set a next step and follow-up date
- see overdue and upcoming follow-ups in a reminder panel
- view quick stats for total applications, interviews, offers, and follow-ups

## Current state

The main workflow is working end to end.

You can run the app locally, create records, update them, delete them, and keep the list saved through the backend. It is usable now, but it is still an early version. There is no authentication yet, no real database, and no test coverage.

## Stack

Frontend:
- React
- Vite
- CSS with BEM-style class naming

Backend:
- Node.js
- Express

Storage:
- JSON file

## Running locally

From the project root:

```bash
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)
API: [http://localhost:5001](http://localhost:5001)

## Deployment note

Local development works without any extra setup because Vite proxies `/api` requests to the Express server.

If you deploy the frontend and backend separately, add a `client/.env` file with:

```bash
VITE_API_URL=https://your-api-url.com
```

An example file is included at [client/.env.example](/Users/roeibaram/projects/jobflow/client/.env.example).

## API routes

- `GET /api/health`
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
