# SweatSync: Cloud-Native Workout Tracking Web App

## ECE1779 Project Proposal

**Team Members**  
- Jiakai Tang – 1002689487  
- Jake Shi – 1007861431  
- Ruoming Ren – 1005889013  
- Ellen Pan – 1002159353  

---

## Motivation

Fitness enthusiasts, students, and working professionals often struggle to consistently log and track their workout progress. Many existing fitness apps are feature-bloated, subscription-locked, or treat user data as a closed asset. We aim to build a **lightweight, cloud-native workout tracking web app** that focuses on the essentials: fast workout logging, accessible history, and clear progress trends, while ensuring user data persists reliably across sessions and redeployments.

Nowadays, many fitness enthusiasts, students, and working professionals often face difficulties in tracking their workout progress regularly. Existing fitness applications are often overloaded with unnecessary features, require paid subscriptions, or restrict access to user data. This project aims to develop a lightweight, cloud-based workout tracking web application that focuses on essential functions: quick workout logging, easy access to past records, and clear visualization of progress trends. The system will also ensure that user data remains secure and persistent across sessions and application updates.

### Target Users

- Students and casual gym-goers who want a simple way to record their workouts and track progress without spending too much time setting up or learning complicated features.  
- Fitness beginners who prefer a clean and low-friction interface that helps them build consistent workout habits without feeling overwhelmed.  
- Privacy-focused users who care about the security and ownership of their data and want their workout records to stay available and consistent across different devices or app updates.

### Why it’s worth pursuing

- **Pedagogical value:** This project provides hands-on experience with the complete cloud-native development stack taught in ECE1779. It includes containerization, orchestration, persistent storage, deployment, and monitoring. The scope remains realistic for the project timeline while still demonstrating solid technical depth.  
- **User value:** The application aims to reduce friction in daily workout tracking. By offering a clean and efficient interface, it helps users form consistent fitness habits and better understand their long-term progress through clear visualizations.  
- **Gap in existing solutions:** Many apps lock features behind paywalls, collect unnecessary personal data, or are mobile-only. Our proposed tool focuses on simplicity, transparency, and accessibility through an open, web-based design.  
- **Cloud-native credibility:** The project runs on a managed Kubernetes environment with persistent storage and CI/CD integration. This setup closely mirrors real-world industry practices, helping team members build practical and transferable skills for future internships or professional roles.

---

## Objectives and Key Features

### Project Objectives

Design and deploy a stateful, cloud-native web app that:  
- Enables secure user accounts and individualized workout logs.  
- Persists data in a relational store with durable volumes and clear backup/restore processes.  
- Presents simple visualizations of progress over time to support habit formation.  
- Demonstrates modern cloud-native operations (observability, CI/CD, security, backups).

### Core Functional Features

- **User Authentication:** Sign-up/login with hashed passwords; session or JWT-based auth. Password reset flow (email link) is a stretch goal.  
- **Workout Logging:** Capture exercises, sets, reps, weight, notes, and date. Editing and deletion are supported with audit timestamps.  
- **History & Charts:** Weekly volume (sets×reps×weight), per-exercise trend lines, and simple PR/1-RM estimates to visualize progress.  
- **Usability:** Fast input with sensible defaults, keyboard shortcuts on desktop, and responsive UI for mobile browsers.  
- **Accessibility:** WCAG-aware color contrast, focus states, keyboard navigability, and alt text for charts.

### Non-Functional Requirements (NFRs)

- **Availability:** Target uptime of 99.5% during the project window.  
- **Performance:** p95 API latency < 300ms for common read/write paths at low concurrency.  
- **Security:** All traffic over HTTPS; secrets stored in Kubernetes Secrets; least-privilege DB roles.  
- **Scalability:** Horizontal scale at the app tier via multiple replicas.

### Orchestration Approach (Kubernetes on Fly.io)

- Local development on **Minikube**; production deployment on **Fly.io managed Kubernetes**.  
- **Deployments** manage stateless application replicas to ensure high availability and easy rollouts.  
- **Services** handle both internal and external traffic routing between application components and users.  
- **PersistentVolumes/PersistentVolumeClaims (PVCs)** provide durable storage for the PostgreSQL database, ensuring data persists across pod restarts and updates.  
- **ConfigMaps** store non-sensitive configuration data, while **Secrets** securely manage credentials and API keys.  
- A **basic Horizontal Pod Autoscaler (HPA)** configuration may be added as a stretch goal to demonstrate automated scaling.

### Deployment Provider (Fly.io)

- Host the application on **Fly.io**.  
- Use **Fly Volumes** for database durability across restarts and rollouts.  
- Utilize Fly’s built-in logging and metrics tools for baseline observability and capacity monitoring.

### Database & Persistent Storage

- **PostgreSQL** as the primary relational database.  
- Bind persistent storage via PVC to ensure data survives pod restarts and rolling updates.  
- Add indices on `users.username`, `users.email`, and define foreign keys to ensure fast lookups.  
- See Database Schema section below for details.

### Monitoring & Observability

- **Metrics:** Track CPU, memory, disk, request rate, error rate, and latency percentiles.  
- **Logging:** Use structured JSON logs for easier filtering by request ID and user ID.  
- **Health:** Implement `/health` endpoints for liveness/readiness, with database probes (e.g., `pg_isready`).  
- **Alerts:** Trigger basic alerts (e.g., error rate > 5% for 5 min; p95 latency > 800ms; pod restart storms).

### Planned Advanced Features

We plan to implement three advanced features:  

1. **Serverless Integration & External Services (SendGrid Email API)**  
   - A Fly.io function will run weekly to send users email reminders via SendGrid if they haven’t logged a workout for 7 days.  
   - The function queries the database to identify inactive users.  
   - It triggers an event (via API) to send them a reminder email.  
   - SendGrid handles reliable delivery and templating of reminder or summary emails.  

2. **CI/CD Pipeline (GitHub Actions)**  
   - Build, test, containerize, and deploy to Fly.io Kubernetes on merge to `main`.  

3. **Database Backup & Recovery**  
   - Automated nightly PostgreSQL dumps to cloud object storage with retention for recovery.

### Scope & Feasibility

- **In Scope:** Authentication, workout logging, visualization, Kubernetes orchestration, Fly.io deployment, data persistence, metrics and alerts, CI/CD automation, backup, HTTPS, and secret management.  
- **Out of Scope:** Native mobile applications, social networking features, and complex recommendation systems.

---

## Tentative Plan

Our team of 4 members will split responsibilities as follows:

### Ellen Pan – Backend Developer
- Implement REST API (Node.js/Express or Python Flask).  
- Define database schema (users, workouts, exercises).  
- Integrate with PostgreSQL.

### Luke Ren – Frontend Developer
- Build a simple web interface (React or HTML/CSS/JS).  
- Workout logging form and data visualization (charts).  
- User authentication UI.

### Jake Shi – Deployment & Orchestration
- Containerize the app with Docker.  
- Configure Docker Compose for local development.  
- Set up a Kubernetes deployment on Fly.io with persistent volumes.  
- Implement monitoring and dashboard setup.

### Jiakai Tang – DevOps & Advanced Features
- Set up CI/CD pipeline with GitHub Actions.  
- Implement a serverless email reminder function.  
- Configure automated PostgreSQL backups to cloud storage.

### Team Collaboration

- Weekly syncs to integrate features.  
- Shared GitHub repo with branch-based workflow.  
- Early deployment to the cloud for iterative testing.

### Execution Approach

- Develop locally using Docker Compose (app + DB) with seed data for quick iteration.  
- Validate Kubernetes manifests on Minikube; deploy to Fly.io Kubernetes with persistent volumes.  
- Wire observability (logs/metrics, health checks) and configure CI/CD for repeatable deploys.  
- Implement and verify automated backups and restore.

---

## Appendix

### Database Schema

We use a normalized design to separate users, workouts, and exercises, enabling efficient queries and straightforward extensibility.

#### Tables

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
- Foreign keys enforce ownership and cascade deletes from `workouts` to `exercises` (or soft-delete policy, depending on UX).  
- Indexes on frequent filters (`user_id`, `date`, `name`) to keep pages responsive.  
- Simple audit fields (`created_at`, `updated_at`) support troubleshooting and analytics.

**Representative queries (conceptual)**
- Fetch latest workouts for a user.  
- Aggregate weekly volume.  
- Compute PR candidates by exercise.

---

## System Architecture Overview

- **Frontend (React):** Single Page Application (SPA) managing user authentication, workout forms, and chart visualizations. Communicates securely with the backend API.  
- **Backend API (FastAPI/Express):** Stateless REST service handling authentication, workout CRUD operations, and aggregation endpoints.  
- **PostgreSQL:** Stateful database bound to a persistent volume with a single primary instance.  
- **Kubernetes:** Deployments (frontend, backend), Service objects (ClusterIP/LoadBalancer), PVC/PV for DB, Secrets/ConfigMaps for configuration.  
- **Fly.io:** Execution environment, networking, logs/metrics, and block storage volumes.

The system design prioritizes simplicity and reliability, using a single database instance with regular backups and a horizontally scalable application tier. This approach balances robustness with feasibility for the course timeline.
