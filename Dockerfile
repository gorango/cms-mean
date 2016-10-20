# Build:
# docker build -t clearmysnow/cms .
#
# Run:
# docker run -it clearmysnow/cms
#
# Compose:
# docker-compose up -d

FROM ubuntu:latest
MAINTAINER clearmysnow

# 80 = HTTP, 443 = HTTPS, 3000 = clearmysnow server, 35729 = livereload, 8080 = node-inspector
EXPOSE 80 443 3000 35729 8080

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq curl \
 wget \
 aptitude \
 htop \
 vim \
 git \
 traceroute \
 dnsutils \
 curl \
 ssh \
 tree \
 tcpdump \
 nano \
 psmisc \
 gcc \
 make \
 build-essential \
 libfreetype6 \
 libfontconfig \
 libkrb5-dev \
 ruby \
 sudo \
 apt-utils \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install clearmysnow Prerequisites
RUN npm install --quiet -g gulp bower yo mocha karma-cli pm2 && npm cache clean

RUN mkdir -p /opt/clearmysnow/public/lib
WORKDIR /opt/clearmysnow

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/clearmysnow/package.json
RUN npm install --quiet && npm cache clean

# Install bower packages
COPY bower.json /opt/clearmysnow/bower.json
COPY .bowerrc /opt/clearmysnow/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

COPY . /opt/clearmysnow

# Run clearmysnow server
CMD ["npm", "start"]
