# Parameterized multi-stage build for the Module Federation microfrontends.
# Build a single app with: docker build --build-arg APP=<shell|cart|bikes|orders> .
# docker-compose builds all four using this same Dockerfile.

# ---------- Build stage ----------
FROM node:24-alpine AS build
WORKDIR /workspace

# Install dependencies first for better layer caching.
# `npm install` (not `npm ci`) is used because the committed lock file can be
# out of sync with platform-specific optional dependencies on Linux.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# Copy the rest of the workspace and build the requested app for production.
COPY . .

ARG APP
RUN test -n "$APP" || (echo "ERROR: build-arg APP is required" && exit 1)
RUN npx nx build "$APP" --configuration=production

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

ARG APP
COPY --from=build /workspace/dist/apps/${APP} /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
