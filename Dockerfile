FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy full source and build client + server
COPY . .
RUN npm run build

# Production runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled bundles, static assets, and default seed data
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data

EXPOSE 3000

CMD ["npm", "start"]
