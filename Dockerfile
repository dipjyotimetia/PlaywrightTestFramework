FROM node:10-slim

#Adding chrome installation path to environment need to change when pupeeteer updates
ENV CHROME_BIN="/app/node_modules/puppeteer/.local-chromium/linux-624492/chrome-linux/chrome"

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

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

#Copy the source to container
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
COPY reports /app/reports
COPY log/results.log /app/log/results.log
COPY trace.json /app/trace.json
COPY results.har /app/results.har
WORKDIR /app

#npm install in the container
RUN npm install

#Providing all necessary permission to the user jenkins
RUN groupmod -g 999 node && \
   usermod -u 999 node

RUN groupadd -g 1000 jenkins && \
   useradd -u 1000 -g 1000 -m -s /bin/bash jenkins

#Providing the write permission to the specific folders
RUN chown jenkins /app/allure-results
RUN chown jenkins /app/log
RUN chown jenkins /app/trace.json
RUN chown jenkins /app/results.har
RUN chown jenkins /app/reports/junit.xml

USER jenkins

ENTRYPOINT ["dumb-init", "--"]
CMD npm run test

