FROM node:18-buster-slim AS node

# Builder stage
FROM node AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY package*.json ./
RUN pnpm i
COPY . .
RUN pnpm build

# Final stage
FROM node AS final
RUN npm install -g pnpm
RUN mkdir -p /app/dist
WORKDIR /app
COPY package*.json ./
RUN pnpm i --only=production
COPY --from=builder /app/dist ./dist

RUN apt-get update && apt-get install -y git git-lfs
RUN git lfs install
RUN git clone https://huggingface.co/Xenova/bge-base-en-v1.5 /models/Xenova/bge-base-en-v1.5

ENTRYPOINT ["node", "./dist/index.js"]
