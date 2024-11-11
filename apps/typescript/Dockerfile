# https://docs.docker.com/compose/how-tos/file-watch/#path-and-target

# Run as a non-privileged user
FROM --platform=arm64 node:20-bookworm-slim
# RUN useradd -ms /bin/sh -u 1001 app
# USER app

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Copy source files into application directory
COPY . /app