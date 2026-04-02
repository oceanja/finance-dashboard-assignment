# 💰 Finance Data Processing & Access Control Backend

A premium, RESTful backend for a sophisticated finance dashboard. This system features robust **Role-Based Access Control (RBAC)**, precise financial data modeling, and automated summary analytics.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **🚀 Runtime** | Node.js (v18+) |
| **⚡ Framework** | Express.js |
| **🛡️ Language** | TypeScript |
| **🐘 Database** | PostgreSQL |
| **💎 ORM** | Prisma (v7) |
| **🔑 Auth** | JWT (jsonwebtoken) |
| **✅ Validation** | Zod |
| **🔒 Hashing** | BcryptJS |

---

## 📂 Project Structure

```bash
src/
├── 🎮 controllers/    # Strategic request handlers
├── 🧪 services/       # Core business logic & database orchestration
├── 🛤️ routes/         # Secured API path definitions
├── 🛡️ middleware/     # Auth, RBAC, and error processing
├── 📐 validators/     # Zod schema definitions
└── 🛠️ utils/          # Prisma client and JWT utilities
```

---

## ⚙️ Setup & Installation

### 📋 Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)

### 🚀 Getting Started

```bash
# 1️⃣ Clone the repository
git clone https://github.com/oceanja/finance-dashboard-assignment.git
cd finance-dashboard-assignment

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure your environment
cp .env.example .env
# ✏️ Edit .env with your DATABASE_URL

# 4️⃣ Initialize the database
npx prisma migrate dev

# 5️⃣ Launch the development server
npm run dev
```

---

## 🔐 Role-Based Access Control (RBAC)

| Role | 🔓 Permissions |
| :--- | :--- |
| **👤 VIEWER** | Can view personal profile and browse financial records. |
| **📊 ANALYST** | All Viewer permissions + access to dashboard analytics & trends. |
| **⚡ ADMIN** | Full system access — manage users, records, and global analytics. |

---

## 📡 API Documentation

### 🔑 Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | 🌍 Public | Create a new user account |
| `POST` | `/api/auth/login` | 🌍 Public | Authenticate and receive a JWT |

> [!NOTE]
> All protected routes require an `Authorization: Bearer <token>` header.

---

### 👥 User Management

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | 🔐 Authenticated | Fetch current user profile |
| `GET` | `/api/users` | ⚡ ADMIN | List all registered users |
| `GET` | `/api/users/:id` | ⚡ ADMIN | Retrieve specific user details |
| `PATCH` | `/api/users/:id` | ⚡ ADMIN | Update user (name, role, status) |
| `DELETE` | `/api/users/:id` | ⚡ ADMIN | Remove a user from the system |

---

### 💵 Financial Records

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/records` | 👤 VIEWER+ | List records with filters/pagination |
| `GET` | `/api/records/:id` | 👤 VIEWER+ | Get detailed record information |
| `POST` | `/api/records` | ⚡ ADMIN | Create a new transaction |
| `PATCH` | `/api/records/:id` | ⚡ ADMIN | Modify an existing record |
| `DELETE` | `/api/records/:id` | ⚡ ADMIN | Perform a soft-delete on a record |

**⚡ Powerful Filtering:**
`?type=INCOME|EXPENSE&category=Salary&from=2026-01-01&to=2026-12-31&page=1&limit=10`

---

### 📊 Dashboard Analytics

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | 📊 ANALYST+ | Overview of Income, Expense, Balance |
| `GET` | `/api/dashboard/categories`| 📊 ANALYST+ | Category-wise spending/earning data |
| `GET` | `/api/dashboard/trends` | 📊 ANALYST+ | 12-month financial trend data |
| `GET` | `/api/dashboard/recent` | 📊 ANALYST+ | Live feed of latest activities |

---

## 💡 Key Design Decisions

1. 🔄 **Soft Deletion Strategy**: Records aren't wiped; they're archived via a `isDeleted` flag, maintaining a perfect audit trail.
2. 🧮 **Financial Precision**: Leverages `Decimal(12,2)` to prevent floating-point calculation errors in net balance reporting.
3. 📦 **Scalable Pagination**: All listing endpoints are paginated by default with custom limits (max 100) to ensure high performance.
4. 🏗️ **Clean Architecture**: Strict separation of concerns between Controllers (request handling) and Services (business logic).

---
✨ Built with passion for excellence. ✨
