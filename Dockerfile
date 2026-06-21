# Build backend
FROM golang:alpine AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod ./
RUN go mod download
COPY backend/ ./
RUN go build -o main .

# Final image
FROM alpine:latest
WORKDIR /app
COPY --from=backend-builder /app/backend/main ./
# We copy the pre-built dist folder directly from the source code
COPY frontend/dist ./frontend/dist

ENV STATIC_DIR="./frontend/dist"
EXPOSE 8080

CMD ["./main"]
