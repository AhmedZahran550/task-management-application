# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifest files
COPY package*.json ./

# Install all dependencies required for TypeScript compilation
RUN npm install

# Copy source files
COPY tsconfig.json ./
COPY src/ ./src/
COPY DB/ ./DB/
COPY index.ts ./

# Compile TypeScript code to JS in /app/dist
RUN npm run build

# Stage 2: Production execution stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package manifest files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy compiled JavaScript output from builder stage
COPY --from=builder /app/dist ./dist

# Expose default port (Railway overrides process.env.PORT dynamically)
EXPOSE 5000

# Run Node.js directly for clean process signal handling (SIGTERM/SIGINT)
CMD ["node", "dist/index.js"]
