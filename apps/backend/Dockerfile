# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy backend app
COPY apps/backend ./apps/backend

# Copy root tsconfig
COPY tsconfig.json ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the backend
WORKDIR /app/apps/backend
RUN pnpm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy workspace files from builder
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./

# Copy backend app from builder
COPY --from=builder /app/apps/backend ./apps/backend

# Install pnpm globally
RUN npm install -g pnpm

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose the port
EXPOSE 4000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
