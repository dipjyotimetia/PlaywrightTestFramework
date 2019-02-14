FROM node:10.13.0-alpine

RUN apk update && apk upgrade 
RUN apk --no-cache add chromium
# Shush
RUN apk --no-cache add libpq curl
RUN apk update && apk add bash

RUN curl -sL -o /usr/local/bin/shush \
    https://github.com/realestate-com-au/shush/releases/download/v1.3.4/shush_linux_amd64 \
 && chmod +x /usr/local/bin/shush




ENV CHROME_BIN="/usr/bin/chromium-browser"
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true