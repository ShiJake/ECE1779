# Stage 1: Build (Vite + React + TS)
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite’s prod build outputs to /dist by default
RUN npm run build

# Stage 2: Serve static assets via Nginx
FROM nginx:1.25
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
