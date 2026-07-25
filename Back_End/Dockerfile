# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies required for building)
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code to JavaScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies (keeps image size small)
RUN npm install --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Set standard Node production environment variable
ENV NODE_ENV=production

# The port your application binds to
EXPOSE 5000

# Start the application using the start script in package.json
CMD ["npm", "start"]
