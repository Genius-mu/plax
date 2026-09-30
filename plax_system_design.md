# Plax ID — Digital Identity Verification Platform
## System Design & Architecture Specification

---

## 1. Executive Summary & Core Concept

**Plax ID** (formerly *TrustVerify*) is an enterprise-grade Digital Identity Verification & KYC Compliance platform. It enables businesses to integrate automated document verification, facial selfie matching, and risk analysis into customer onboarding workflows while giving compliance teams a centralized dashboard for real-time monitoring, audit logging, and manual decisioning.

### Key Objectives
* **Demonstrate Enterprise Architecture**: Modern frontend (Vue 3, Pinia, TypeScript, Vue Router, Tailwind CSS) paired with a clean REST backend (Node.js, Express, TypeScript, Prisma ORM, PostgreSQL).
* **Pluggable Verification Engine**: Sandbox provider adapter with simulated OCR/biometric verification delays, realistic edge cases (liveness fail, expired ID, mismatched names), and clear integration hooks for live APIs (Stripe Identity, Sumsub, Persona).
* **Strict Security & Compliance**: Role-Based Access Control (RBAC), JWT authentication, request rate limiting, input validation via Zod, and immutable audit logs.

---

## 2. System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend — Vue 3 SPA"]
        UI["Vue Components & Views"]
        Router["Vue Router (RBAC Guards)"]
        Store["Pinia Stores"]
        APIClient["Axios API Service Layer"]
        
        UI --> Store
        Store --> APIClient
        APIClient --> Router
    end

    subgraph Server ["Backend — Express REST Service"]
        Middleware["Security & Auth Middleware (JWT, Rate Limit, Zod)"]
        Controllers["REST Controllers (Auth, Verifications, Customers, Logs)"]
        Services["Business Logic & Verification Engine"]
        Adapter["Verification Provider Adapter"]
        
        Middleware --> Controllers
        Controllers --> Services
        Services --> Adapter
    end

    subgraph External ["External / Sandbox Engine"]
        MockProvider["Mock KYC Provider (OCR, Liveness, Face Match)"]
        RealAPI["Stripe / Sumsub / Persona API (Future Slot)"]
        
        Adapter --> MockProvider
        Adapter -.-> RealAPI
    end

    subgraph Storage ["Data Layer"]
        Prisma["Prisma ORM"]
        Postgres[(PostgreSQL Database)]
        DocStorage["Encrypted Object / Local File Storage"]
        
        Services --> Prisma
        Prisma --> Postgres
        Services --> DocStorage
    end

    APIClient -->|HTTPS REST / JSON| Middleware
```

---

## 3. Database Schema Design (Prisma / PostgreSQL)

```mermaid
erDiagram
    ORGANIZATION ||--o{ USER : employs
    USER ||--o{ VERIFICATION : submits_or_reviews
    CUSTOMER ||--o{ VERIFICATION : owns
    VERIFICATION ||--o{ VERIFICATION_DOCUMENT : contains
    VERIFICATION ||--o{ RISK_SIGNAL : flags
    VERIFICATION ||--o{ AUDIT_LOG : generates
    USER ||--o{ AUDIT_LOG : performs

    ORGANIZATION {
        string id PK
        string name
        string slug
        datetime createdAt
    }

    USER {
        string id PK
        string email UK
        string passwordHash
        string fullName
        enum role "ADMIN | REVIEWER | CUSTOMER"
        string organizationId FK
        datetime createdAt
    }

    CUSTOMER {
        string id PK
        string email UK
        string firstName
        string lastName
        string country
        string status "ACTIVE | FLAGGED | BLOCKED"
        datetime createdAt
    }

    VERIFICATION {
        string id PK
        string customerId FK
        string reviewerId FK
        enum status "PENDING | PROCESSING | APPROVED | REJECTED | MANUAL_REVIEW"
        float riskScore "0.00 to 100.00"
        enum riskLevel "LOW | MEDIUM | HIGH | CRITICAL"
        string rejectionReason
        datetime submittedAt
        datetime completedAt
    }

    VERIFICATION_DOCUMENT {
        string id PK
        string verificationId FK
        enum type "PASSPORT | DRIVERS_LICENSE | NATIONAL_ID | PROOF_OF_ADDRESS"
        string documentNumber
        string issueCountry
        datetime expiryDate
        string fileUrl
        boolean ocrVerified
    }

    RISK_SIGNAL {
        string id PK
        string verificationId FK
        string code "NAME_MISMATCH | EXPIRED_DOC | LIVENESS_FAILED | HIGH_RISK_IP | SANCTION_MATCH"
        enum severity "LOW | MEDIUM | HIGH | CRITICAL"
        string description
    }

    AUDIT_LOG {
        string id PK
        string actorId FK
        string action "VERIFICATION_SUBMITTED | VERIFICATION_APPROVED | VERIFICATION_REJECTED | USER_LOGIN | ROLE_CHANGED"
        string targetType
        string targetId
        json payload
        string ipAddress
        datetime createdAt
    }
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| Feature / Resource | Admin | Reviewer | Customer |
| :--- | :---: | :---: | :---: |
| **Start Verification Workflow** | ❌ | ❌ | ✅ |
| **Upload ID Documents & Selfie** | ❌ | ❌ | ✅ |
| **View Own Verification Status** | ❌ | ❌ | ✅ |
| **View Company Dashboard & Analytics** | ✅ | ✅ | ❌ |
| **List & Filter All Verifications** | ✅ | ✅ | ❌ |
| **Review Document Details & Risk Signals** | ✅ | ✅ | ❌ |
| **Approve / Reject Verification** | ✅ | ✅ | ❌ |
| **View Audit Logs** | ✅ | ❌ | ❌ |
| **Manage Team & Assign Roles** | ✅ | ❌ | ❌ |
| **Configure Provider & Risk Rules** | ✅ | ❌ | ❌ |

---

## 5. Verification State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Customer opens link
    DRAFT --> SUBMITTED : Form & Documents Uploaded
    SUBMITTED --> PROCESSING : Async Adapter Initiated
    
    state PROCESSING {
        [*] --> OCR_SCANNING
        OCR_SCANNING --> BIOMETRIC_MATCH
        BIOMETRIC_MATCH --> RISK_SCORING
    }
    
    PROCESSING --> APPROVED : Risk Score < 25 & Doc Valid
    PROCESSING --> REJECTED : Tampered Doc / Liveness Fail
    PROCESSING --> MANUAL_REVIEW : Medium Risk (25 - 75)
    
    MANUAL_REVIEW --> APPROVED : Reviewer Approves
    MANUAL_REVIEW --> REJECTED : Reviewer Rejects
    
    APPROVED --> [*]
    REJECTED --> [*]
```

---

## 6. Frontend Architecture (Vue 3 + TypeScript)

### Directory Structure Blueprint

```
src/
├── assets/                  # Styling, icons, typography tokens
│   ├── main.css             # Dark theme design system tokens & glassmorphism
│   └── fonts/
├── components/              # Atomic UI components
│   ├── common/              # Base Button, Input, Modal, Badge, Card, Spinner
│   ├── dashboard/           # MetricsCard, ActivityChart, VerificationsTable
│   ├── verification/        # DocUploader, SelfieCapture, StepIndicator
│   └── layout/              # Sidebar, Topbar, AuthLayout, DashboardLayout
├── composables/             # Reusable composition functions
│   ├── useAuth.ts           # Authentication logic & current user state
│   ├── useVerifications.ts  # Verification query & action hooks
│   └── useNotification.ts  # Toast & alert manager
├── router/                  # Vue Router configuration
│   ├── index.ts             # Route definitions
│   └── guards.ts            # Authentication & RBAC guard logic
├── services/                # API client abstraction
│   ├── api.ts               # Axios instance with interceptors
│   ├── authService.ts       # Auth endpoints
│   ├── verificationService.ts
│   └── customerService.ts
├── stores/                  # Pinia state stores
│   ├── authStore.ts         # User session & permissions
│   ├── verificationStore.ts # Dashboard data, filters, active item
│   └── customerStore.ts     # Customer records
├── types/                   # TypeScript interfaces & Enums
│   ├── auth.ts
│   ├── verification.ts
│   └── api.ts
├── views/                   # Main page components
│   ├── auth/                # Login, Register, ForgotPassword
│   ├── dashboard/           # Overview, Verifications, Customers, RiskSignals, AuditLogs
│   ├── verification/        # Customer onboarding flow steps
│   └── settings/            # Profile, Team, Security
├── App.vue                  # Root component
└── main.ts                  # App entry point
```

---

## 7. REST API Endpoint Specification

### Authentication
* `POST /api/auth/register` — Register a new account
* `POST /api/auth/login` — Authenticate and receive JWT access/refresh tokens
* `POST /api/auth/logout` — Invalidate current session
* `GET  /api/auth/me` — Retrieve logged-in user profile & role

### Verifications Workflow
* `GET   /api/verifications` — List verifications (supports `status`, `riskLevel`, `search`, `page`, `limit`)
* `POST  /api/verifications` — Customer starts & submits a new verification
* `GET   /api/verifications/:id` — Get detailed verification file, documents, & risk signals
* `PATCH /api/verifications/:id/decision` — Reviewer/Admin approves or rejects verification

### Dashboard Analytics & Stats
* `GET /api/dashboard/stats` — Metrics overview (Total, Approved, Pending, Failed, Avg Risk Score)
* `GET /api/dashboard/activity` — Timeline chart data for verifications over time

### Audit Logs & Team Management
* `GET  /api/audit-logs` — Fetch audit trail (Admin only)
* `GET  /api/team` — List organization team members (Admin only)
* `POST /api/team/invite` — Invite new team member with assigned role (Admin only)

---

## 8. Implementation Roadmap (Phased Development Plan)

```mermaid
gantt
    title Plax ID — Phased Rollout Plan
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation
    Design System & Design Tokens        :p1_1, 2026-10-01, 2d
    Vue 3 + Vite + Tailwind Setup       :p1_2, after p1_1, 2d
    section Phase 2: Mock API & Views
    Vue Router & Pinia Stores           :p2_1, after p1_2, 2d
    Dashboard UI & Verifications Table  :p2_2, after p2_1, 3d
    Customer Verification Flow UI       :p2_3, after p2_2, 3d
    section Phase 3: Backend REST Service
    Express + TypeScript API Setup      :p3_1, after p2_3, 2d
    Prisma Schema & PostgreSQL Config    :p3_2, after p3_1, 2d
    JWT Auth & RBAC Middleware          :p3_3, after p3_2, 3d
    section Phase 4: Verification Engine
    Pluggable Verification Adapter      :p4_1, after p3_3, 3d
    Risk Signal Processor & Webhooks    :p4_2, after p4_1, 2d
    section Phase 5: Security & Polish
    Audit Logging & Error Boundaries    :p5_1, after p4_2, 2d
    Integration Testing & Polish        :p5_2, after p5_1, 2d
```

---

## 9. Next Immediate Steps

1. **Setup Monorepo / Directory Structure** for `plax` (Frontend `client` and Backend `server`).
2. **Install Core Dependencies**:
   * Frontend: Pinia, Vue Router, Axios, Lucide Vue icons / Heroicons, Tailwind CSS.
   * Backend: Express, TypeScript, Prisma, jsonwebtoken, bcrypt, Zod, cors, dotenv.
3. **Build Frontend Design System**: Dark theme palette, glassmorphic cards, custom status pills, and responsive layout.
