# Continuous Feedback Application — Flow & Startup Guide

## Overview
This application enables professors to run timed feedback sessions and students to submit anonymous emoticon feedback in real time.

- Frontend (React + Vite) runs on port 3001
- Backend (Express + Sequelize + PostgreSQL) runs on port 3000
- Frontend proxies API calls to backend to avoid CORS

## How To Start

1. Backend (requires PostgreSQL running locally and a populated `.env`):
   - Env file: [backend/.env](../backend/.env)
   - Config uses env: [backend/config/config.js](../backend/config/config.js)
   - Start:
     ```powershell
     cd backend
     npm install
     npm run migrate
     npm run dev
     ```
   - Health: open http://localhost:3000 — should return `{ message: "Server running" }`

2. Frontend:
   - Vite server config: [frontend/vite.config.js](../frontend/vite.config.js)
   - Start:
     ```powershell
     cd frontend
     npm install
     npm run dev
     ```
   - Open http://localhost:3001

## Backend Flow

### Architecture
- Entry: [backend/app.js](../backend/app.js)
- Routes:
  - Auth: [backend/routes/authRoutes.js](../backend/routes/authRoutes.js)
  - Activities: [backend/routes/activityRoutes.js](../backend/routes/activityRoutes.js)
  - Feedback: [backend/routes/feedbackRoutes.js](../backend/routes/feedbackRoutes.js)
- Controllers:
  - [authController](../backend/controllers/authController.js)
  - [activityController](../backend/controllers/activityController.js)
  - [feedbackController](../backend/controllers/feedbackController.js)
- Services (business logic):
  - [authService](../backend/services/authService.js)
  - [activityService](../backend/services/activityService.js)
  - [feedbackService](../backend/services/feedbackService.js)
- Middleware:
  - JWT auth: [authMiddleware](../backend/middleware/authMiddleware.js)
  - Role check: [roleMiddleware](../backend/middleware/roleMiddleware.js)
  - Validation: [validateMiddleware](../backend/middleware/validateMiddleware.js)

### Auth
- Signup/Login handled in controllers which delegate to `authService`
- JWT contains `id`, `email`, and `role`
- `authMiddleware` verifies token and attaches `req.user`
- `roleMiddleware(["PROFESSOR"])` protects professor-only endpoints

### Activities
- Create/List (professor only): [backend/routes/activityRoutes.js](../backend/routes/activityRoutes.js)
  - Middleware chain for create: `auth` → `role(["PROFESSOR"])` → `validate([...])` → controller
- Get by code (student use): `GET /activities/:code` (no auth required)
- Storage model: [backend/models/activity.js](../backend/models/activity.js)

### Feedback
- Submit (students): `POST /feedbacks`
- List by activity (professors): `GET /feedbacks/:activityId`
- Storage model: [backend/models/feedback.js](../backend/models/feedback.js)

### Database & Migrations
- ORM: Sequelize; dialect: PostgreSQL
- Models: [backend/models/index.js](../backend/models/index.js)
- Migrations (run in order):
  - Users: [backend/migrations/20251219000001-create-user.js](../backend/migrations/20251219000001-create-user.js)
  - Activities: [backend/migrations/20251219000002-create-activity.js](../backend/migrations/20251219000002-create-activity.js)
  - Feedbacks: [backend/migrations/20251219000003-create-feedback.js](../backend/migrations/20251219000003-create-feedback.js)
- Timestamps use snake_case: `created_at`, `updated_at`

## Frontend Flow

### App Structure
- App entry: [frontend/src/main.jsx](../frontend/src/main.jsx)
- Router/UI: [frontend/src/App.jsx](../frontend/src/App.jsx)
- Auth context: [frontend/src/context/AuthContext.jsx](../frontend/src/context/AuthContext.jsx)
- API client (axios): [frontend/src/services/api.js](../frontend/src/services/api.js)
  - Base URL: `http://localhost:3000` (or `VITE_API_URL`)
  - Adds `Authorization: Bearer <token>` when token exists

### Pages
- Professor
  - Activities list: [frontend/src/pages/professor/Activities.jsx](../frontend/src/pages/professor/Activities.jsx)
  - Create activity: [frontend/src/pages/professor/CreateActivity.jsx](../frontend/src/pages/professor/CreateActivity.jsx)
  - Dashboard: [frontend/src/pages/professor/ActivityDashboard.jsx](../frontend/src/pages/professor/ActivityDashboard.jsx)
- Student
  - Join by code: [frontend/src/pages/student/StudentJoin.jsx](../frontend/src/pages/student/StudentJoin.jsx)
  - Submit feedback: [frontend/src/pages/student/StudentFeedback.jsx](../frontend/src/pages/student/StudentFeedback.jsx)

### Authentication (Frontend)
- `AuthContext` stores `{ token, user }` in `localStorage`
- On login/signup: receives `{ token, user }` from backend and navigates to professor pages
- Protected routes can use `PrivateRoute` and/or context’s `isAuthenticated`

## User Journey

1. Professor
   - Sign up or log in at `/login` or `/signup`
   - Create a new activity with an access code and time window
   - Share the code with students
   - Monitor live feedback on the dashboard

2. Student
   - Go to `/student/join` and enter the access code
   - Submit emoticon feedback during the active session

## Ports & Proxy
- Frontend: port 3001 ([frontend/vite.config.js](../frontend/vite.config.js))
- Backend: port 3000 ([backend/app.js](../backend/app.js))
- Proxy forwards `/auth`, `/activities`, `/feedbacks` to backend

## Troubleshooting
- If migrations fail, ensure the order is Users → Activities → Feedbacks
- If professor endpoints return 403, re-login to get a JWT with `role`
- If frontend cannot reach backend, verify both servers and proxy settings

## Quick Commands
```powershell
# Backend
cd backend
npm install
npm run migrate
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```
