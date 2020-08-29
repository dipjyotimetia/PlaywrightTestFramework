FROM ubuntu:bionic-20200311

# Install nodejs lts
ENV NODE_VERSION=12.16.2
RUN apt-get update && \
    apt-get install wget curl ca-certificates rsync -y
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

# 3. Install Chromium dependencies

RUN apt-get install -y libnss3 \
                       libxss1 \
                       libasound2

# 4. Install Firefox dependencies

RUN apt-get install -y libdbus-glib-1-2 \
                       libxt6

# 5. Install ffmpeg to bring in audio and video codecs necessary for playing videos in Firefox.

RUN apt-get install -y ffmpeg

# 6. Add user so we don't need --no-sandbox in Chromium
RUN groupadd -r pwuser && useradd -r -g pwuser -G audio,video pwuser \
    && mkdir -p /home/pwuser/Downloads \
    && chown -R pwuser:pwuser /home/pwuser

# 7. (Optional) Install XVFB if there's a need to run browsers in headful mode
RUN apt-get install -y xvfb

# Run everything after as non-privileged user.
USER pwuser

ENTRYPOINT ["dumb-init", "--"]
