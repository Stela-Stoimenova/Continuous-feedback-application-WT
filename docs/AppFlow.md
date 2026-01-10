# Continuous Feedback Application — Flow & Startup Guide

## Overview
This application enables professors to run timed feedback sessions and students to submit anonymous emoticon feedback in real time.

**Deployment Configuration:**
- **Production**: Frontend and backend run on the same server/port (e.g., port 3000)
- **Development**: Frontend (Vite) on port 5173, Backend (Express) on port 3000
- Backend serves static frontend files from `backend/dist/`
- All API routes use `/api` prefix
- Real-time updates via Socket.io

## How To Start

### Development Mode

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
   - Health check: open http://localhost:3000

2. Frontend:
   - Start:
     ```powershell
     cd frontend
     npm install
     npm run dev
     ```
   - Open http://localhost:5173

### Production Mode (Single Server)

1. Build frontend:
   ```powershell
   cd frontend
   npm run build
   ```

2. Copy build to backend:
   ```powershell
   xcopy /E /I /Y dist ..\backend\dist
   ```

3. Start backend (serves both API and frontend):
   ```powershell
   cd ..\backend
   npm start
   ```
   - Application available at: http://localhost:3000

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
- Routes: `/api/auth/signup`, `/api/auth/login`

### Activities
- Create/List (professor only): [backend/routes/activityRoutes.js](../backend/routes/activityRoutes.js)
  - Middleware chain for create: `auth` → `role(["PROFESSOR"])` → `validate([...])` → controller
- Get by code (student use): `GET /api/activities/:code` (no auth required)
- Storage model: [backend/models/activity.js](../backend/models/activity.js)
- Routes: `/api/activities`

### Feedback
- Submit (students): `POST /api/feedbacks`
- List by activity (professors): `GET /api/feedbacks/:activityId`
- Storage model: [backend/models/feedback.js](../backend/models/feedback.js)
- Real-time updates via Socket.io when new feedback is submitted

### Quotes
- External API proxy: `GET /api/quotes/quote`
- Fetches motivational quotes from ZenQuotes API
- Used in QuoteBanner component

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
  - Base URL: Uses `window.location` for dynamic API URLs (deployment-ready)
  - Falls back to `VITE_API_URL` environment variable
  - Adds `Authorization: Bearer <token>` when token exists
  - All requests go to `/api/*` endpoints
- Socket.io client: [frontend/src/services/socket.js](../frontend/src/services/socket.js)
  - Connects to same origin as frontend for real-time updates

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

2. StudentDeployment
- **Development**: 
  - Frontend: port 5173 (Vite dev server)
  - Backend: port 3000
- **Production**: 
  - Single server on port 3000 (or Railway-assigned port)
  - Backend serves static frontend files from `dist/`
  - All API routes prefixed with `/api`
  - Socket.io on same port as HTTP server

## Deployment to Railway

1. Buquotes don't load, check the `/api/quotes/quote` endpoint
- In production, ensure `backend/dist/` contains the built frontend files
- For Railway deployment, verify DATABASE_URL is set and migrations have run

## Quick Commands
```powershell
# Development - Backend
cd backend
npm install
npm run migrate
npm run dev

# Development - Frontend
cd frontend
npm install
npm run dev

# Production Build & Deploy
cd frontend
npm run build
xcopy /E /I /Y dist ..\backend\dist
cd ..\backend
npm start

3. Push to GitHub and connect to Railway:
   ```powershell
   cd backend
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```

4. Run migrations on Railway:
   ```powershell
   railway run npm run migrate
   ```
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
