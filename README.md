# Finance Data Processing and Access Control Backend

A RESTful backend API for a finance dashboard system with role-based access control, financial records management, and aggregated analytics.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma (v7) |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Password Hashing | bcryptjs |

## Project Structure

```
src/
├── controllers/       # Request handlers (thin layer, delegates to services)
├── services/          # Business logic and database queries
├── routes/            # Route definitions with access control applied
├── middleware/        # authenticate, authorize, error handler
├── validators/        # Zod schemas for input validation
└── utils/             # Prisma client, JWT helpers
```

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create a PostgreSQL database
createdb finance_db

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Run database migrations
npx prisma migrate dev

# 5. Start the development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://USER@localhost:5432/finance_db"
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"
PORT=3000
```

---

## Roles

| Role | Permissions |
|---|---|
| `VIEWER` | Read financial records |
| `ANALYST` | Read records + access dashboard analytics |
| `ADMIN` | Full access — manage users, records, and analytics |

---

## API Reference

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

**Register body:**
```json
{
  "name": "Ocean Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "ADMIN"
}
```

**Login body:**
```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

All protected routes require: `Authorization: Bearer <token>`

---

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/me` | Any auth | Get own profile |
| GET | `/api/users` | ADMIN | List all users |
| GET | `/api/users/:id` | ADMIN | Get user by ID |
| PATCH | `/api/users/:id` | ADMIN | Update name, role, or isActive |
| DELETE | `/api/users/:id` | ADMIN | Delete a user |

**PATCH body (all fields optional):**
```json
{
  "name": "New Name",
  "role": "ANALYST",
  "isActive": false
}
```

---

### Financial Records

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/records` | VIEWER, ANALYST, ADMIN | List records with filters and pagination |
| GET | `/api/records/:id` | VIEWER, ANALYST, ADMIN | Get single record |
| POST | `/api/records` | ADMIN | Create a record |
| PATCH | `/api/records/:id` | ADMIN | Update a record |
| DELETE | `/api/records/:id` | ADMIN | Soft delete a record |

**GET query params:**
```
?type=INCOME|EXPENSE
&category=Salary
&from=2026-01-01T00:00:00.000Z
&to=2026-12-31T00:00:00.000Z
&page=1
&limit=10
```

**POST / PATCH body:**
```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01T00:00:00.000Z",
  "notes": "Monthly salary"
}
```

---

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | ANALYST, ADMIN | Total income, expenses, net balance |
| GET | `/api/dashboard/categories` | ANALYST, ADMIN | Totals grouped by category and type |
| GET | `/api/dashboard/trends` | ANALYST, ADMIN | Monthly income vs expenses (last 12 months) |
| GET | `/api/dashboard/recent` | ANALYST, ADMIN | 5 most recent records |

---

## Design Decisions and Assumptions

1. **Role assignment on registration** — The `role` field is accepted at registration for testing convenience. In production, role assignment would be a separate admin action.

2. **Soft deletes** — Financial records are never hard-deleted. The `isDeleted` flag hides them from all queries while preserving the audit trail.

3. **Decimal precision** — `amount` is stored as `DECIMAL(12,2)` to avoid floating-point errors common with financial data.

4. **ANALYST vs VIEWER** — Viewers can read raw records but cannot access aggregated analytics. Analysts can access both. This reflects a typical org setup where raw data access and insight access are separate concerns.

5. **Prisma v7 adapter** — Prisma v7 dropped the `url` field from `schema.prisma` in favor of `prisma.config.ts` for migrations and a driver adapter (`@prisma/adapter-pg`) for the runtime client.

6. **Pagination** — All record listing endpoints support `page` and `limit` query params with a max limit of 100.
