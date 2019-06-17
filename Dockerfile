FROM node:12.4-slim

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

#Providing all necessary permission to the user jenkins
RUN groupmod -g 999 node && \
   usermod -u 999 node

RUN groupadd -g 1000 jenkins && \
   useradd -u 1000 -g 1000 -m -s /bin/bash jenkins

USER jenkins

ENTRYPOINT ["dumb-init", "--"]
