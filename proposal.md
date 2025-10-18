# Project Proposal: Cloud-Native Workout Tracking Web App

## 1. Motivation

Fitness enthusiasts, students, and working professionals often struggle to consistently log and track their workout progress. Many existing fitness apps are feature‑bloated, subscription‑locked, or treat user data as a closed asset. We aim to build a **lightweight, cloud‑native workout tracking web app** that focuses on the essentials: fast workout logging, accessible history, and clear progress trends—while ensuring user data persists reliably across sessions and redeployments.

**Target Users**
- Students or casual gym‑goers seeking a simple progress log.
- Fitness beginners who want a clean, low‑friction interface that doesn’t overwhelm them.
- Privacy‑conscious users who value data persistence, portability, and availability.

**Why it’s worth pursuing**
- **Pedagogical value**: The project exercises the full cloud‑native stack emphasized in ECE1779—containerization, orchestration, persistent storage, deployment, and monitoring—while keeping scope realistic.
- **User value**: A streamlined tracker lowers friction for habit formation, helping users keep consistent records and visualize incremental progress.
- **Gap in existing solutions**: Many apps lock features behind paywalls, collect unnecessary personal data, or are mobile‑only. A simple, open, web‑based tool with transparent data handling offers a compelling alternative.
- **Cloud‑native credibility**: Running on managed Kubernetes with persistent storage and CI/CD demonstrates skills immediately transferable to industry internships and roles.

---

## 2. Objectives and Key Features

### Project Objectives
Design and deploy a **stateful, cloud‑native web app** that:
- Enables secure user accounts and individualized workout logs.
- Persists data in a relational store with durable volumes and clear backup/restore processes.
- Presents simple visualizations of progress over time to support habit formation.
- Demonstrates modern cloud‑native operations (observability, CI/CD, security, backups).

### Core Functional Features
- **User Authentication**: Sign‑up/login with hashed passwords; session or JWT‑based auth. Password reset flow (email link) is a stretch goal.
- **Workout Logging**: Capture exercises, sets, reps, weight, notes, and date. Editing and deletion supported with audit timestamps.
- **History & Charts**: Weekly volume (sets×reps×weight), per‑exercise trend lines, and simple PR/1‑RM estimates to visualize progress.
- **Usability**: Fast input with sensible defaults, keyboard shortcuts on desktop, and responsive UI for mobile browsers.
- **Accessibility**: WCAG‑aware color contrast, focus states, keyboard navigability, and alt text for charts.

### Non‑Functional Requirements (NFRs)
- **Availability**: Target 99.5% during the project window.
- **Performance**: p95 API latency < 300ms for common read/write paths at low concurrency.
- **Security**: All traffic over HTTPS; secrets stored in Kubernetes Secrets; least‑privilege DB roles.
- **Scalability**: Horizontal scale at the app tier via multiple replicas.

### Orchestration Approach (**Kubernetes on Fly.io**)
- Local development on **Minikube**; production on **Fly.io managed Kubernetes**.
- Use **Deployments** (stateless app replicas), **Services** (internal/external routing), and **PersistentVolume/PVC** for PostgreSQL.
- Apply **ConfigMaps** (non‑sensitive config) and **Secrets** (credentials, API keys). Basic HPA config is a stretch goal.

### Deployment Provider (**Fly.io**)
- Host the application on Fly.io. Use **Fly Volumes** for database durability across restarts and rollouts.
- Leverage Fly’s logs/metrics for baseline observability and capacity monitoring.

### Database & Persistent Storage
- **PostgreSQL** (relational).
- **Persistent storage** bound via PVC to ensure data survives pod restarts and rolling updates.
- **Indices** on `users.username`, `users.email`, and foreign keys for quick lookups. See Database Schema section.

### Monitoring & Observability
- **Metrics**: CPU, memory, disk, request rate, error rate, latency percentiles.
- **Logging**: Structured logs (JSON) to simplify filtering by request id and user id.
- **Health**: `/health` liveness/readiness for app; readiness probe for DB (e.g., `pg_isready`).
- **Alerts**: Basic thresholds (e.g., error rate > 5% for 5 min; p95 latency > 800ms; pod restart storms).

### Planned Advanced Features

We plan to implement three advanced features:

**Serverless Integration & Integration with External Services (SendGrid Email API)**  
A Fly.io function to send email reminders via SendGrid if a user hasn’t logged a workout for 7 days.
- Implement a Fly.io Function that runs daily or weekly.
- The function queries the database to identify users who have not logged a workout for seven days.
- It then triggers an event (via API) to send them a reminder email.
- The serverless function and backend will integrate with SendGrid, a third-party email service.
- SendGrid handles reliable delivery and templating of reminder or summary emails.

**CI/CD pipeline (GitHub Actions)**  
Build, test, containerize, and deploy to Fly.io Kubernetes on merge to `main` (with environment gates).

**Database Backup & Recovery**  
Automated nightly PostgreSQL dumps to cloud object storage with retention for recovery.

### Scope & Feasibility
- **In scope**: auth, logging, charts; K8s orchestration; Fly.io deployment; persistence; metrics/alerts; CI/CD; backups; HTTPS & secrets.
- **Out of scope**: native mobile app, social feed, complex recommendation systems.

---

## 3. Tentative Plan

Our team of 4 members will split responsibilities as follows:

**Ellen Pan — Backend Developer**
- Implement REST API (Node.js/Express or Python Flask).
- Define database schema (users, workouts, exercises).
- Integrate with PostgreSQL.

**Luke Ren — Frontend Developer**
- Build a simple web interface (React or HTML/CSS/JS).
- Workout logging form and data visualization (charts).
- User authentication UI.

**Jake Shi — Deployment & Orchestration**
- Containerize the app with Docker.
- Configure Docker Compose for local dev.
- Set up a Kubernetes deployment on Fly.io with persistent volumes.
- Implement monitoring/dashboard setup.

**Jiakai Tang — DevOps & Advanced Features**
- Set up CI/CD pipeline with GitHub Actions.
- Implement a serverless email reminder function.
- Configure automated PostgreSQL backups to cloud storage.

**Team Collaboration**
- Weekly syncs to integrate features.
- Shared GitHub repo with branch-based workflow.
- Early deployment to the cloud for iterative testing.

**Execution Approach**
- Develop locally using Docker Compose (app + DB) with seed data for quick iteration.
- Validate Kubernetes manifests on Minikube; deploy to Fly.io Kubernetes with persistent volumes.
- Wire observability (logs/metrics, health checks) and configure CI/CD for repeatable deploys.
- Implement and verify automated backups and restore.

---

## 4. Database Schema

We use a normalized design to separate users, workouts, and exercises, enabling efficient queries and straightforward extensibility.

**Tables**

**users**
- `id` (PK, UUID)
- `username` (VARCHAR, unique, indexed)
- `email` (VARCHAR, unique, indexed)
- `password_hash` (TEXT)
- `created_at` (TIMESTAMP, default now)

**workouts**
- `id` (PK, UUID)
- `user_id` (FK → users.id, indexed)
- `date` (DATE, indexed)
- `notes` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**exercises**
- `id` (PK, UUID)
- `workout_id` (FK → workouts.id, indexed)
- `name` (VARCHAR, indexed)
- `sets` (INT)
- `reps` (INT)
- `weight` (DECIMAL)

**Constraints & Data Integrity**
- Foreign keys enforce ownership and cascade deletes from `workouts` to `exercises` (or soft‑delete policy, depending on UX).
- Indexes on frequent filters (`user_id`, `date`, `name`) to keep pages responsive.
- Simple audit fields (`created_at`, `updated_at`) support troubleshooting and analytics.

**Representative queries** (conceptual)
- Fetch latest workouts for a user; aggregate weekly volume; compute PR candidates by exercise.

---

## 5. System Architecture Overview

- **Frontend (React)**: SPA that handles auth, forms, and chart rendering; communicates with the API.
- **Backend API (FastAPI/Express)**: Stateless service providing auth, workout CRUD, and aggregation endpoints.
- **PostgreSQL**: Stateful component bound to a persistent volume; single primary instance for course scope.
- **Kubernetes**: Deployments (frontend, backend), Service objects (ClusterIP/LoadBalancer), PVC/PV for DB, Secrets/ConfigMaps for configuration.
- **Fly.io**: Execution environment, networking, logs/metrics, and block storage volumes.

The system favors simplicity: one database instance (with backups) and horizontally scalable app tier. This balances reliability and project feasibility.
