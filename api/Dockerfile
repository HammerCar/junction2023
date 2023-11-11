FROM node:20-alpine AS node

# Builder stage
FROM node AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm i
COPY . .
RUN pnpm build

# Final stage
FROM node AS final
RUN mkdir -p /app/dist
WORKDIR /app
COPY package*.json ./
RUN pnpm i --only=production
COPY --from=builder /app/dist ./dist

WORKDIR /models
RUN git lfs install
RUN git clone https://huggingface.co/Xenova/bge-base-en-v1.5

WORKDIR /app
ENTRYPOINT ["node", "./dist/index.js"]
