FROM node:10-slim

ENV CHROME_BIN="google-chrome-unstable"

RUN apt-get update && apt-get install -yq libgconf-2-4

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-unstable'})
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true


COPY src /app/src
COPY .babelrc /app/.babelrc
COPY .eslintrc.js /app/..eslintrc.js
COPY Jenkinsfile /app/Jenkisfile
COPY jest.config.js /app/jest.config.js
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY puppeteer_environment.js /app/puppeteer_environment.js
COPY setup.js /app/setup.js
COPY teardown.js /app/teardown.js
COPY allure-results /app/allure-results
WORKDIR /app

RUN npm install
RUN npm install puppeteer
EXPOSE 3000

EXPOSE 3000

RUN groupmod -g 999 node && \
  usermod -u 999 node

RUN groupadd -g 1000 jenkins && \
  useradd -u 1000 -g 1000 -m -s /bin/bash jenkins

RUN chown jenkins /app/allure-results

USER jenkins

ENTRYPOINT ["dumb-init", "--"]
CMD npm run test