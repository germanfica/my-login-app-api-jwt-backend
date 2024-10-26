# Phase 1: Build the code base
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile TypeScript code
RUN npm run build

# Phase 2: Create the final production image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the compiled code from the previous phase
COPY --from=builder /app/dist ./dist

# Set the environment variable for production
ENV NODE_ENV=production

# Expose the port on which the application runs
EXPOSE 3000

# Command to start the application
CMD ["node", "dist/index.js"]
