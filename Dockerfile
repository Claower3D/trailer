# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod ./
RUN go mod download
COPY backend/ ./
RUN go build -o main .

# Final image
FROM alpine:latest
WORKDIR /app
COPY --from=backend-builder /app/backend/main ./
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV STATIC_DIR="./frontend/dist"
EXPOSE 8080

CMD ["./main"]
