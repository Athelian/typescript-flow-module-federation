# Base Image pre-install node_modules
FROM node:8
WORKDIR /usr/src/app
RUN npm i -g yarn
COPY scripts scripts
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN chmod a+rwx /usr/local/lib/node_modules/yarn/bin/yarn*
RUN chmod a+rwx /usr/local/bin/yarn*
RUN yarn install
