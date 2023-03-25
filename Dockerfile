FROM mcr.microsoft.com/playwright:bionic
WORKDIR /app

# dependencies will be installed only if the package files change
COPY package.json .
COPY yarn.lock .
COPY playwright.config.ts .
COPY tsconfig.json .

ENV CI=1
RUN yarn

COPY src src
COPY mocks mocks

RUN npm run test:playwright