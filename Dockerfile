FROM node:10.15

RUN apt-get update && apt-get install -y wget --no-install-recommends \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge --auto-remove -y curl \
  && rm -rf /src/*.deb

RUN apt-get update -y -q
RUN apt-get install -y -q xvfb libgtk2.0-0 libxtst6 libxss1 libgconf-2-4 libnss3 libasound2

RUN apt-get update && \
  apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

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
WORKDIR /app

RUN npm install
RUN npm install puppeteer
EXPOSE 3000

RUN groupmod -g 999 node && \
  usermod -u 999 node

RUN groupadd -g 1000 jenkins && \
  useradd -u 1000 -g 1000 -m -s /bin/bash jenkins

USER jenkins

ENTRYPOINT ["dumb-init", "--"]
CMD npm run test