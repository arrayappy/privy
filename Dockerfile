# Use Ubuntu 22.04 as the base image for both build and runtime
FROM ubuntu:22.04 as builder

# Install build dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl \
    build-essential \
    protobuf-compiler \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Set the working directory
WORKDIR /app

# Copy the entire project structure
COPY . .

# Build the project
RUN cd grpc-server && cargo build --release

# Use the same Ubuntu 22.04 as the final image
FROM ubuntu:22.04

# Install runtime dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    libssl3 \
    ca-certificates \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -ms /bin/bash appuser

# Copy the binary from the builder
COPY --from=builder /app/grpc-server/target/release/grpc-server /usr/local/bin/grpc-server

# Set ownership and permissions
RUN chown appuser:appuser /usr/local/bin/grpc-server

USER appuser

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/grpc-server"]