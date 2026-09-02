# ✈️ FLY AYLA — Enterprise Private Aviation Charter & Executive Management Platform

A commercial-grade private aviation management platform engineered with decoupled **Frontend (React/Vite)** and **Backend (Node.js/Express + MongoDB)** architectures.

---

## 🏛️ High-Level Physical Architecture

```text
FLY-AYLA/
│
├── frontend/                     # Client & Public Single-Page Experience
│   ├── package.json              # Frontend UI Dependencies (React 19, Motion, Lucide)
│   ├── .env.example              # Frontend Config & API Endpoints
│   ├── components/               # Domain-driven modular React components
│   │   ├── admin/                # Executive Mission Control & Sub-Views
│   │   ├── booking/              # Direct Operating Cost & Flight Request Engines
│   │   ├── common/               # Design-system buttons, inputs, badges, empty states
│   │   ├── layout/               # Header, Navbars, Footer
│   │   ├── modals/               # Dynamic PDF Quote, Charter Detail & Creation Modals
│   │   ├── portal/               # Customer Command Portal & Boarding Pass Views
│   │   └── public/               # Commercial Landing & Direct Operating Cost sections
│   ├── contexts/                 # AuthContext & Session Store
│   ├── services/                 # Centralized API service layer (Admin, Customer, Auth)
│   ├── hooks/                    # Reusable React hooks
│   ├── types/                    # Enterprise TypeScript declarations
│   └── styles/                   # Modern Tailwind CSS Design System
│
├── backend/                      # Production REST API & Business Logic Server
│   ├── package.json              # Backend Dependencies (Express, Mongoose, Bcrypt, JWT)
│   ├── .env.example              # Server Secrets, Database URI & Integration Keys
│   └── src/
│       ├── config/               # Database connection (MongoDB / Mongoose)
│       ├── constants/            # Role, Status and Operational Enums
│       ├── middleware/           # authenticateUser, requireAdmin, ownership validation
│       ├── models/               # MongoDB Schemas (User, FlightRequest, Quote, Booking, etc.)
│       ├── routes/               # Modular Express REST API Endpoints
│       ├── services/             # Direct Operating Cost engine, token services, integrations
│       ├── validators/           # Strict payload and credential sanitizers
│       ├── app.ts                # Express app setup and middleware configuration
│       └── server.ts             # Server entry point and database seeding
│
├── server.ts                     # Full-stack orchestrator for local & cloud runtime (Port 3000)
├── package.json                  # Root build orchestrator
├── tsconfig.json                 # Strict TypeScript configuration
└── README.md                     # Architecture & Engineering Documentation
```

---

## 🔐 Authentication & Authorization Flow

1. **Password Security**: Passwords are cryptographically hashed using `bcryptjs` with salt rounds before writing to MongoDB. Plaintext passwords are never stored or logged.
2. **Role Enforcement**:
   - `customer`: Default role assigned upon public registration. Customers can only access and manipulate their own quotes, bookings, invoices, and requests.
   - `admin`: Reserved for operations dispatchers and executive flight managers. Must be granted via administrative role management.
3. **JWT Access & Refresh Strategy**: Issues signed JWT access tokens with structured claims (`id`, `email`, `role`, `status`).

---

## 🛩️ Direct Operating Cost (DOC) & Pricing Engine

The backend pricing engine computes flight estimates based on empirical aviation metrics:
- **Fuel Burn Index**: Live gallons/hour consumption indexed to JetFuelX spot prices.
- **Airport Landing & Ground Handling**: Standard ramp fees, passenger facility charges (PFC), and overnight parking.
- **Navigation & Airway Charges**: En-route ATC fees calculated by nautical distance.
- **Crew & Per Diem Costs**: Standard crew duty allowances per flight leg.
- **FET / Sales Tax**: 7.5% Federal Excise Tax + statutory segment fees.

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp backend/.env.example .env
```

### 3. Run in Development
```bash
npm run dev
```
The server binds to `http://localhost:3000`, running both the backend REST API (`/api/*`) and the high-performance frontend client.

### 4. Build for Production
```bash
npm run build
npm start
```
# fly-ayla
