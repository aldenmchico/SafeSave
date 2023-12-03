# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.8.1

FROM node:latest

# Use production node environment by default.
ENV NODE_ENV production

# Install dockerize
RUN apt-get update && apt-get install -y wget \
    && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

WORKDIR /usr/src/app

# Print npm version and registry for debugging
RUN npm --version && npm config get registry

# Download dependencies for middleware as a separate step.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN ls -lah /usr/src/app

RUN chown -R node:node /usr/src
# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.

# Run the application.
CMD node --experimental-modules checkAuth.mjs
