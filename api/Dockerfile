FROM node:20-alpine AS node

# Builder stage
FROM node AS builder

# Use /app as the CWD
WORKDIR /app            

# Copy package.json and package-lock.json to /app
COPY package*.json ./   

# Install all dependencies
RUN pnpm i               

# Copy the rest of the code
COPY . .                

# Invoke the build script to transpile code to js
RUN pnpm build       


# Final stage
FROM node:20-alpine AS final

# Prepare a destination directory for js files
RUN mkdir -p /app/dist                  

# Use /app as CWD
WORKDIR /app                            

# Copy package.json and package-lock.json
COPY package*.json ./                   

# Install only production dependencies
RUN pnpm i --only=production             

# Copy transpiled js from builder stage into the final image
COPY --from=builder /app/dist ./dist

# Use js files to run the application
ENTRYPOINT ["node", "./dist/index.js"]
