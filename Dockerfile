FROM node:22-bookworm

WORKDIR /app

# Install pnpm and Playwright dependencies in one layer
RUN npm install -g pnpm && \
    npx -y playwright@1.57.0 install --with-deps

# Copy package.json and pnpm-lock.yaml first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the files
COPY playwright.config.ts reportConfig.ts tsconfig.json src/ mocks/ ./

# Set environment variable
ENV CI=1

# Run tests
RUN pnpm run test:playwright