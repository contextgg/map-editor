FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY --from=builder /app/dist ./dist
COPY src/server ./src/server
COPY maps ./maps
EXPOSE 8080
ENV PORT=8080
CMD ["npm", "start"]
