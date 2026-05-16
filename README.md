TradeBoard — Mini Service Request Board
A full-stack web app where homeowners can post service requests and tradespeople can browse, manage, and update them.
Built with Next.js 14 (App Router), Express, MongoDB / Mongoose, and Tailwind CSS.
---
Project Structure
```
service-board/
├── backend/                  # Express REST API
│   ├── __tests__/            # Jest + Supertest tests
│   ├── middleware/            # Global error handler + JWT auth middleware
│   ├── models/               # Mongoose schemas (JobRequest, User)
│   ├── routes/               # Express route handlers (jobs, auth)
│   ├── seed/                 # Sample data seed script
│   └── server.js             # App entry point
│
└── frontend/                 # Next.js (App Router)
    ├── app/
    │   ├── page.js           # Home — job listing + filters + search
    │   ├── new-job/          # New job form (protected — login required)
    │   ├── jobs/[id]/        # Job detail + status update + delete
    │   ├── login/            # Login page
    │   └── register/         # Register page
    ├── components/           # JobCard, StatusBadge, HeaderNav
    ├── context/              # AuthContext — JWT state management
    └── lib/api.js            # Thin API client (fetch wrapper)
```
---
Prerequisites
Node.js 18+
npm 9+
MongoDB running locally or a MongoDB Atlas free-tier cluster
---
Environment Variables
Backend — `backend/.env`
Copy `backend/.env.example` to `backend/.env` and fill in:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/service-board?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
```
Frontend — `frontend/.env.local`
Copy `frontend/.env.local.example` to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
---
Setup & Run
1. Backend
```bash
cd backend
npm install
cp .env.example .env        # then edit .env with your MongoDB URI and JWT secret
npm run dev                 # starts on http://localhost:5000
```
2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                 # starts on http://localhost:3000
```
3. (Optional) Seed sample data
```bash
cd backend
npm run seed
```
This inserts 8 sample jobs across all categories and statuses.
---
API Reference
Base URL: `http://localhost:5000`
Auth Routes
Method	Path	Description	Auth Required
`POST`	`/api/auth/register`	Register a new user, returns JWT token	No
`POST`	`/api/auth/login`	Login, returns JWT token	No
`GET`	`/api/auth/me`	Get current logged-in user	Yes
Example — register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","email":"john@example.com","password":"secret123"}'
```
Example — login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```
Job Routes
Method	Path	Description	Auth Required
`GET`	`/api/jobs`	List all jobs. Supports `?category=`, `?status=`, `?search=`	No
`GET`	`/api/jobs/:id`	Fetch a single job by ID	No
`POST`	`/api/jobs`	Create a new job	Yes
`PATCH`	`/api/jobs/:id`	Update status only (`Open` / `In Progress` / `Closed`)	No
`DELETE`	`/api/jobs/:id`	Delete a job	Yes
Example — create a job (with token):
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"title":"Leaking tap","description":"Kitchen tap dripping","category":"Plumbing","location":"Glasgow","contactEmail":"john@example.com"}'
```
---
Authentication
JWT-based authentication is implemented as a bonus feature:
Register at `/register` or Sign in at `/login`
On success, a JWT token is stored in `localStorage` and sent as a `Bearer` token on protected requests
Posting a job and deleting a job require a valid token
Browsing jobs and updating status are public — no login needed
The header shows the logged-in user's name and a Sign out button when authenticated
---
Running Tests
```bash
cd backend
npm test
```
Tests use Jest + Supertest against a dedicated `service-board-test` database. They cover:
`GET /api/jobs` — empty response, full list, category filter, status filter
`POST /api/jobs` — valid create, missing title/description, invalid email
`PATCH /api/jobs/:id` — status update, invalid status, 404 for missing job
`DELETE /api/jobs/:id` — successful delete, 404 for missing job
---
Data Model
```js
// MongoDB collection: jobRequests
{
  title:        String,   // required
  description:  String,   // required
  category:     "Plumbing" | "Electrical" | "Painting" | "Joinery" | "Other"
  location:     String,
  contactName:  String,   // optional
  contactEmail: String,   // optional, validated email format when provided
  status:       "Open" | "In Progress" | "Closed"  // default: "Open"
  createdAt:    Date,     // auto-set
  updatedAt:    Date,     // auto-set
}

// MongoDB collection: users
{
  name:      String,   // required
  email:     String,   // required, unique, validated
  password:  String,   // required, min 6 chars, bcrypt hashed
  createdAt: Date,     // auto-set
}
```
---
Features Implemented
Core
[x] Job listing (home page) with card layout
[x] Category and status filter dropdowns
[x] Keyword search across title and description
[x] New job form with client-side validation (blur + submit)
[x] Job detail page with full info
[x] Status update dropdown (tradesperson view — public)
[x] Delete with confirmation step
[x] Full REST API with correct HTTP status codes
[x] Global error handler (validation, cast errors, 404s)
Bonus
[x] JWT-based auth — register, login, protected POST and DELETE
[x] Keyword search across title and description (MongoDB text index)
[x] Unit tests on all four API endpoints (Jest + Supertest)
[x] Seed script with 8 realistic sample jobs
---
Tech Stack
Layer	Choice
Frontend	Next.js 14 (App Router), React
Styling	Tailwind CSS
Backend	Node.js + Express
Database	MongoDB Atlas

ODM	Mongoose
Auth	JSON Web Tokens (jsonwebtoken)
Encryption	bcryptjs
Testing	Jest + Supertest
