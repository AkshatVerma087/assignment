# Scalable REST API + Frontend (Assignment Submission)

This project delivers a full-stack task management system with:
- JWT authentication (cookie-based)
- Role-based access control (`user`, `admin`)
- CRUD APIs for tasks
- Basic React frontend to test APIs
- API versioning, validation, and error handling
- Docker deployment setup

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Frontend: React + Vite
- Deployment: Docker + Docker Compose

## Project Structure
- `backend/` Express API, models, routes, controllers, middleware
- `frontend/` React test UI for auth + task CRUD
- `docker-compose.yml` Full local containerized deployment

## Implemented Features (Requirement Checklist)
### Backend (Primary Focus)
- User registration & login with password hashing (`bcrypt`) and JWT authentication
- Role-based access:
  - `user`: task dashboard and own task CRUD
  - `admin`: access admin endpoint to view all users
- CRUD APIs for secondary entity (`tasks`)
- API versioning with `/api/v1/*` (legacy `/api/*` still supported for backward compatibility)
- Validation & sanitization middleware for auth/task payloads
- Centralized 404 and global error handlers
- MongoDB schema design for users/tasks

### Basic Frontend (Supportive)
- Register + Login UI
- Protected dashboard route
- Task CRUD UI (create, list, update title/description/status, delete)
- Admin panel UI (users list)
- API error/success feedback shown in UI

### Security & Scalability
- JWT stored in HTTP-only cookie
- Input validation and basic sanitization in middleware
- Modular and scalable folder layout (`controllers`, `routes`, `middlewares`, `models`)
- Dockerized for deployment readiness

## Local Setup (Without Docker)
## 1) Backend
```bash
cd backend
npm install
```

Create `.env` in `backend/` from `.env.example`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/assignment_db
JWT_SECRET=replace_with_a_secure_random_value
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Run backend:
```bash
npm run dev
```

## 2) Frontend
```bash
cd frontend
npm install
```

Create `.env` in `frontend/` from `.env.example`:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Run frontend:
```bash
npm run dev
```

## Docker Deployment
Run entire stack (Mongo + backend + frontend):
```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- MongoDB: `mongodb://localhost:27017`

## API Summary
Base URL (versioned):
- `http://localhost:3000/api/v1`

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/logout`
- `GET /auth/verify`

Tasks (authenticated user):
- `POST /tasks`
- `GET /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Admin:
- `GET /admin/users`

## Create Admin User (optional helper)
```bash
cd backend
npm run create:admin
```

Default fallback credentials (if not overridden in `.env`):
- `admin@example.com`
- `Admin@12345`

## Scalability Note
For production scale, recommended next steps:
- Move auth/session and rate limits to Redis
- Add request logging/observability (Winston + OpenTelemetry)
- Add API gateway and split modules into services (auth/task/admin)
- Add horizontal scaling with load balancer and stateless backend containers
- Add CI/CD, test pipeline, and managed database backups
