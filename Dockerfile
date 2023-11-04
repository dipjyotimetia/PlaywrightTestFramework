FROM mcr.microsoft.com/playwright:bionic
WORKDIR /app

COPY package.json yarn.lock playwright.config.ts reportConfig.ts tsconfig.json ./

ENV CI=1
RUN yarn

COPY src/ src/
COPY mocks/ mocks/

RUN npm run test:playwright