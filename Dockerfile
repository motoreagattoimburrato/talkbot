FROM python:2.7
LABEL Name="Talkbotv14"
# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# make sure apt is up to date
RUN apt-get update --fix-missing
RUN apt-get install -y curl libssl-dev libprotobuf-dev protobuf-compiler

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.15.0

RUN mkdir -p $NVM_DIR
# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# replaced with npmrc file
# RUN npm config set python python2.7


RUN npm install pm2 -g
RUN npm install node-gyp -g

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY .npmrc /usr/src/app
COPY . /usr/src/app
RUN chmod +x /usr/src/app/command.sh

RUN npm install
RUN npm rebuild