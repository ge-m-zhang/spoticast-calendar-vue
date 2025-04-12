# Base Node image
FROM node:20-slim AS base
RUN apt-get update && apt-get upgrade -y

# Builder stage
FROM base AS builder
WORKDIR /app

# Check yarn version and install if needed
RUN yarn --version || npm install -g yarn@1.22.22

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application and build
COPY . .
RUN yarn build

# Runner stage with NGINX
FROM nginxinc/nginx-unprivileged:1.26.2 AS runner
WORKDIR /app

USER root

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy NGINX configuration and scripts
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/entrypoint.sh /app/entrypoint.sh
COPY --from=builder /app/public/env.js /usr/share/nginx/html/env.js

# Set permissions
RUN chmod +x /app/entrypoint.sh
RUN chown -R 101:101 /app /usr/share/nginx/html

# Switch to non-root user
USER 101

# Configure the container
ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]