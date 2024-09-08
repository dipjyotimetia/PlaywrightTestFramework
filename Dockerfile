FROM mcr.microsoft.com/playwright:bionic
WORKDIR /app

# Copy all necessary files in one command
COPY package.json yarn.lock playwright.config.ts reportConfig.ts tsconfig.json src/ mocks/ ./

# Set environment variable
ENV CI=1

# Install dependencies
RUN yarn

# Run tests
RUN npm run test:playwright