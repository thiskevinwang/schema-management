# dockerfile for basic go web server

FROM --platform=arm64 golang:1.23.3-bookworm AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o /go/bin/app

FROM --platform=arm64 debian:bookworm-slim

COPY --from=builder /go/bin/app /app

CMD ["/app"]