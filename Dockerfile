FROM node:12.4-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

RUN apk update && apk add --no-cache zip

WORKDIR /home/node/app

COPY --chown=node:node ./app ./app
COPY --chown=node:node ./config ./config
COPY --chown=node:node ./.docker_env ./.env
COPY --chown=node:node ./index-*.js ./
COPY --chown=node:node ./package*.json ./

COPY --chown=node:node ./client/dist ./client/dist
COPY --chown=node:node ./client/public ./client/public

USER node

RUN npm install

VOLUME /tv_shows
VOLUME /movies

EXPOSE 1337:1337 1338:1338

CMD ["npm", "start"]
