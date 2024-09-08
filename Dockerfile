FROM mcr.microsoft.com/playwright:bionic
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all necessary files in one command
COPY package.json pnpm-lock.yaml playwright.config.ts reportConfig.ts tsconfig.json src/ mocks/ ./

# Set environment variable
ENV CI=1

# Install dependencies
RUN pnpm install

# Run tests
RUN pnpm run test:playwright