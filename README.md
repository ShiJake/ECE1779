

# SweatSync

SweatSync is a lightweight, cloud-native web application for fitness enthusiasts to log workouts, track progress, and visualize trends. It emphasizes simplicity, data persistence, and scalability using Kubernetes and Fly.io.

***

<details>
<summary><strong>Table of Contents</strong></summary>

- [SweatSync](#sweatsync)
  - [Team Information](#team-information)
  - [Motivation](#motivation)
  - [Objectives](#objectives)
  - [Technical Stack](#technical-stack)
  - [Features](#features)
  - [User Guide](#user-guide)
  - [Development Guide](#development-guide)
  - [Deployment Information](#deployment-information)
  - [Individual Contributions](#individual-contributions)
  - [Lessons Learned and Concluding Remarks](#lessons-learned-and-concluding-remarks)

</details>

***

## Team Information

The project team consists of four members, each with a unique role spanning backend, frontend, deployment, and product management. All email addresses are active and may be used for clarification requests during grading.

- **Jiakai Tang** (1002689487) – [jiakai.tang@mail.utoronto.ca](mailto:jiakai.tang@mail.utoronto.ca)
- **Jake Shi** (1007861431) – [jake.shi@mail.utoronto.ca](mailto:jake.shi@mail.utoronto.ca)
- **Ruoming (Luke) Ren** (1005889013) – [luke.ren@mail.utoronto.ca](mailto:luke.ren@mail.utoronto.ca)
- **Ellen Pan** (1002159353) – [ellen.pan@mail.utoronto.ca](mailto:ellen.pan@mail.utoronto.ca)

***

## Motivation

Students, casual gym-goers, and working professionals often struggle to consistently log workouts because many fitness apps are bloated, subscription-locked, or treat user data as a closed asset. SweatSync addresses this by focusing on fast workout logging, accessible history, and clear progress trends in a simple, web-based interface.

From a learning perspective, the project delivers hands-on experience with a full cloud-native stack, including containerization, orchestration, persistent storage, deployment, monitoring, and CI/CD. This combination of real user value and strong pedagogical value makes the project worth pursuing.

***

## Objectives

The primary objective of SweatSync is to design and deploy a fully cloud-native workout tracking system that demonstrates how modern applications can remain **stateful, scalable, and resilient** in real-world environments. From a user perspective, the project aims to provide a simple, reliable platform where individuals can log workouts, review past activity, and visualize long-term progress without the complexity or constraints of commercial fitness apps.

From a systems engineering perspective, the project seeks to apply the full lifecycle of a cloud-native architecture:  
- **Containerization** for reproducible development environments,  
- **Kubernetes orchestration** for service management and horizontal scalability,  
- **Persistent storage** to maintain per-user data across deployments,  
- **Continuous integration and deployment** to ensure consistent delivery, and  
- **Observability** to monitor system health and behavior in production.

Additionally, the project aims to explore **event-driven extensions** to a traditional web app—such as scheduled recap and reminder emails—by integrating serverless-style CronJobs with third-party services like SendGrid.

Overall, the objective is to build an application that not only solves a meaningful user problem but also showcases strong engineering practices across deployment, scalability, reliability, and maintainability in a modern cloud environment.


***

## Technical Stack

The project adopts a Kubernetes (K8s)–based orchestration approach rather than Docker Swarm, to mirror modern production environments and support strong scalability and availability guarantees. Core technologies are summarized below.


| Layer | Technology \& Rationale |
| :-- | :-- |
| Frontend | React.js SPA for authentication, workout logging, and charts, responsive on web. |
| Backend | Node.js REST API for authentication, workout CRUD, and analytics endpoints. |
| Database | PostgreSQL with indices and foreign keys, backed by PersistentVolumes/PVCs in K8s. |
| Orchestration | Kubernetes (Minikube locally, Fly.io in production) with Deployments, Services, ConfigMaps, Secrets, and health probes. |
| Hosting | Fly.io for execution environment, networking, logging, metrics, and block storage volumes. |
| Email | SendGrid for weekly recap emails via a scheduled Kubernetes CronJob. |
| CI/CD | GitHub Actions for build, test, containerization, and deploy on merges to main. |


***

## Features

SweatSync offers a set of core and advanced features designed to meet the project’s functional and non-functional objectives.

### Core Technical functionalities

- **Containerization & Local Development**  
  Dockerized backend and PostgreSQL database with a reproducible multi-container setup using Docker Compose.

- **Stateful PostgreSQL Storage**  
  PostgreSQL backed by Kubernetes PersistentVolumes/PVCs to ensure durable, crash-safe data storage across restarts and deployments.

- **Deployment Provider (Fly.io)**  
  Full application deployment on Fly.io, including runtime environment, networking, logging, metrics, and block-storage volumes.

- **Kubernetes Orchestration**  
  Kubernetes Deployments, Services, ConfigMaps, Secrets, PVCs, and liveness/readiness probes manage scaling, configuration, and application health (Minikube locally, Fly.io in production).

- **Monitoring & Logs**  
  Integrated Fly.io metrics and logs for CPU, memory, and request tracing, enabling observability and basic alerting.

- **Frontend (Optional but Implemented)**  
  React.js SPA for sign-in/up, workout logging, and analytics charts, responsive on desktop and mobile.

---
### Advanced Features

- **Serverless Scheduled Emails (K8s CronJob + SendGrid)**  
  Automated weekly workout-recap and reminder emails using Kubernetes CronJobs and SendGrid integration.

- **Security Enhancements**  
  Secure authentication (hashed passwords + tokens), HTTPS via Fly.io, and secrets managed through Kubernetes Secrets.

- **CI/CD Pipeline (GitHub Actions)**  
  Automated build, test, containerization, and deployment workflows triggered on merges to `main`.

- **External Service Integrations**  
  Email delivery via SendGrid with extensibility for additional third-party service integrations.


## User Guide

**Sign Up**

- Open the landing page and create an account with email, and password.
- Passwords are stored securely with hashing and validated server-side.

**Log In**

- Log in with your email and password to start a new authenticated session.
- A session or JWT-based mechanism keeps you logged in during normal browsing.

**Log a Workout**

- Click “Add Entry” to create a workout entry for a chosen date.
- Add one or more exercises specifying activity type, quantity, and dates, then save to persist.

**View History \& Charts**

- Navigate to the dashboard to view recent workouts, filter by date or exercise, and inspect charts showing training volume and trends.

**Email Recaps/Reminders**

- Periodically, users receive recap emails generated by the SendGrid integration every Sunday night at 9pm.

***

## Development Guide

This section explains how to set up the development environment, including database, storage, and local testing.

### Prerequisites

- Docker and Docker Compose
- Minikube and `kubectl` configured for local Kubernetes
- Node.js and npm (for local debugging of services if needed)
- Access to GHCR images referenced by Kubernetes manifests
- Valid SendGrid API key stored in a Kubernetes Secret


### Local Development with Docker Compose

Run the full stack locally without Kubernetes:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend health check: http://localhost:8000/health

This brings up frontend, backend, and PostgreSQL in a single command for rapid feature iteration.

### Local Kubernetes (Minikube)

**Start Minikube and Configure Context**

```bash
minikube start --driver=docker
kubectl config use-context minikube
kubectl cluster-info
```

**Apply Kubernetes Manifests**
From the project root:

```bash
kubectl apply -f k8s/namespace.yaml

kubectl -n sweatsync apply -f k8s/configmap.yaml -f k8s/secret.yaml

kubectl -n sweatsync apply -f k8s/postgres-pvc.yaml
kubectl -n sweatsync apply -f k8s/postgres-deployment.yaml

kubectl -n sweatsync apply -f k8s/backend-deployment.yaml -f k8s/service-backend.yaml
kubectl -n sweatsync apply -f k8s/frontend-deployment.yaml -f k8s/service-frontend.yaml

kubectl -n sweatsync apply -f k8s/weekly-email-cron.yaml
kubectl -n sweatsync apply -f k8s/sendgrid-secret.yaml
```

These manifests create the namespace, configuration, secrets, database PVC and Deployment, backend and frontend Deployments and Services, the weekly email CronJob, and the SendGrid secret.

**Set Container Images from GHCR**

```bash
kubectl -n sweatsync set image deploy/backend backend=ghcr.io/shijake/sweatsync-backend:latest
kubectl -n sweatsync set image deploy/frontend frontend=ghcr.io/shijake/sweatsync-frontend:latest
```

**Check Rollouts and Pod Status**

```bash
kubectl -n sweatsync rollout status deploy/postgres
kubectl -n sweatsync rollout status deploy/backend
kubectl -n sweatsync rollout status deploy/frontend

kubectl -n sweatsync get pods -o wide
```

**Access the App via Minikube**

```bash
minikube -n sweatsync service frontend --url
```

Open the returned URL in your browser to interact with the app running on Minikube.

### Database Schema, Storage, and Local Access

The database schema is backed by Kubernetes PersistentVolumes to ensure data survives pod restarts.

- `users`: `id` (UUID PK), `username` (unique, indexed), `email` (unique, indexed), `password_hash`, `created_at`
- `workouts`: `id` (UUID PK), `user_id` (FK to users.id), `date` (indexed), `notes`, `created_at`, `updated_at`
- `exercises`: `id` (UUID PK), `workout_id` (FK to workouts.id), `name` (indexed), `sets`, `reps`, `weight`

For a Docker-based local DB, you can inspect tables with:

```bash
docker exec -it sweatsync-db psql -U user -d sweatsync
sweatsync=# \dt
sweatsync=# SELECT * FROM users;
```

PVC-backed storage in Kubernetes ensures data durability across redeployments and rolling updates.

### CI/CD and Testing

GitHub Actions pipelines run builds and tests on pushes and pull requests, then build and push Docker images to GHCR when changes are merged to main. This guarantees a consistent container image for Fly.io deployment and reduces manual deployment errors.

***

## Deployment Information

SweatSync is designed to run on Fly.io using either a Fly-managed Kubernetes setup or Fly’s app model with attached volumes. The environment hosts frontend, backend, and PostgreSQL with block storage volumes for persistent data.

- **Production Host**: Fly.io.
- **Live URL**: https://sweatsync-frontend.fly.dev/
- **Monitoring**: https://sweatsync-backend.fly.dev/health

SendGrid-based weekly emails are executed as scheduled tasks (e.g., CronJobs) in the cluster.

***

## Individual Contributions

Roles and contributions align with the project proposal but have been refined to match actual implementation and git history.

- **Ellen Pan – Backend Developer**
Implemented the Node.js REST API, designed and created the PostgreSQL database schema, integrated database access, and built authentication and workout CRUD endpoints.
- **Ruoming (Luke) Ren – Frontend Developer \& SendGrid Email**
Developed the React-based user interface—including authentication flows, workout logging forms, and analytics dashboards—and implemented the serverless email functionality by creating a Kubernetes CronJob that triggers weekly recap emails. Integrated custom SendGrid email templates into the backend email service to deliver personalized, data-driven summaries to users.
- **Jake Shi – Deployment, Orchestration, CI/CD \& Fly.io**
Containerized the application with Docker, built and maintained Docker Compose for local development, authored Kubernetes manifests (Deployments, Services, PVCs, namespace), and set up Minikube and Fly.io deployments with health checks and monitoring, as well as implementing and maintaining GitHub Actions CI/CD pipelines for building, testing, and deploying containers to Fly.io.
- **Jiakai Tang – Product Management \& SendGrid Email**
Led product definition, requirements scoping, and feature prioritization to align the app with target user needs and course objectives, coordinated team planning and UX flows, and helped design and validate the SendGrid-based weekly recap and reminder email workflows, including content strategy and trigger logic.

These contributions correspond to branches and commits in the shared GitHub repository.

***

## Video Demo
[https://youtu.be/8oCx1yJxHec](https://youtu.be/8oCx1yJxHec)
***

## Lessons Learned and Concluding Remarks

Working with Kubernetes PVCs and Fly.io volumes revealed the importance of designing explicitly for stateful workloads from the start. Integrating CI/CD with GitHub Actions and GHCR produced reliable, repeatable deployments but required careful secret and configuration management across environments.

The SendGrid integration and scheduled Fly functions demonstrated how serverless patterns can complement a containerized core while emphasizing the need for robust observability and alerting for asynchronous jobs. Overall, SweatSync provided a realistic, end-to-end experience in designing, deploying, and operating a modern cloud-native web application focused on actual user problems.
