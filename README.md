# ECE1779
ECE1779 Course Project


# SweatSync — Runbook
1) Local development (Docker Compose)
```
docker compose up --build
```

Frontend: http://localhost:3000

Backend: http://localhost:8000/health

2) Start Kubernetes (Minikube)
```
minikube start --driver=docker
kubectl config use-context minikube
kubectl cluster-info
```

3) Apply Kubernetes manifests
```
kubectl apply -f k8s/namespace.yaml
kubectl -n sweatsync apply -f k8s/configmap.yaml -f k8s/secret.yaml
kubectl -n sweatsync apply -f k8s/postgres-pvc.yaml
kubectl -n sweatsync apply -f k8s/postgres-deployment.yaml
kubectl -n sweatsync apply -f k8s/backend-deployment.yaml -f k8s/service-backend.yaml
kubectl -n sweatsync apply -f k8s/frontend-deployment.yaml -f k8s/service-frontend.yaml
```

4) Point Deployments to GHCR images
```
kubectl -n sweatsync set image deploy/backend  backend=ghcr.io/shijake/sweatsync-backend:latest
kubectl -n sweatsync set image deploy/frontend frontend=ghcr.io/shijake/sweatsync-frontend:latest
```

5) Verify rollout & pod status
```
kubectl -n sweatsync rollout status deploy/postgres
kubectl -n sweatsync rollout status deploy/backend
kubectl -n sweatsync rollout status deploy/frontend
kubectl -n sweatsync get pods -o wide
```

6) Open the app (Minikube Service URL)
```
minikube -n sweatsync service frontend --url
```


Open the printed URL in your browser.