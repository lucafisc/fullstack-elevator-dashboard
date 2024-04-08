FROM node:18-alpine

WORKDIR /usr/src/server

COPY ./package*.json ./

RUN npm ci

COPY . .

# ARG NODE_ENV

# ENV NODE_ENV=${NODE_ENV}

RUN npm run build