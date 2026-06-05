# SPIIK Inventory Manager

A web application for managing SPIIK student association's physical inventory — overalls, badges, shirts, and other merchandise. Built for the association's board members to track stock levels, log every change, and undo mistakes.

## Features

- **Product management** – Add, edit, and delete products with attributes like name, category, size, and quantity
- **Change history** – Every update is logged with who changed what, when, and the old vs new value
- **Undo changes** – Revert any logged change to restore the previous value
- **Access control** – No public registration; new users are invited by existing board members via time-limited invite links
- **Dashboard** – Overview of current inventory with warnings for low or zero stock

## Tech stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Frontend:** EJS (server-rendered templates)
- **Auth:** JWT (httpOnly cookies), bcrypt
- **Testing:** Vitest, Supertest, MongoDB Memory Server
- **Deployment:** Vercel

## Getting started

### Prerequisites

- Node.js v18+
- MongoDB (local instance or a MongoDB Atlas connection string)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd inventariehanterare

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in MONGODB_URI and JWT_SECRET

# 4. Seed the database with an initial admin user
#    Set SEED_PASSWORD in .env (SEED_EMAIL defaults to admin@spiik.se), then:
npm run seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running tests

```bash
npm test
```

Tests use an in-memory MongoDB instance — no external database required.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the production server |
| `npm run dev` | Start the server with auto-reload (nodemon) |
| `npm test` | Run the test suite (Vitest) |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the database with an initial admin user |

## Project status

### Implemented
- BR-1: Product CRUD — create, edit, delete, filter by category
- BR-2: Change history log via mongoose-history — logs who, what, when with old/new values
- BR-3: Undo function — revert updates, deletes and creates from history view
- BR-4: Invite-only access control — no public registration, JWT auth with httpOnly cookies

### What remains
- Dashboard with inventory graphs and stock level visualization
- CSV export
- Integration with SPIIK's kiosk system

### Development stage
Final delivery (v1.0.0). All base requirements implemented and tested. No known bugs.

### Test status
- 33 automated tests (Vitest) — all passing
- 11 manual test cases — all passing
- CI/CD pipeline runs lint and tests on every push

## License

This project is part of the course 1DV613 at Linnaeus University.