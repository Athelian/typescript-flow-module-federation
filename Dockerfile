# build by latest base
FROM asia.gcr.io/zenport-183806/web-app-base:latest AS building
ARG BUILDTYPE
WORKDIR /usr/src/app
COPY . .
RUN yarn build:$BUILDTYPE

# copy to nginx
FROM nginx:alpine

RUN apk add --no-cache --quiet curl bash

WORKDIR /app

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=building /usr/src/app/build/. .

EXPOSE 80 443
