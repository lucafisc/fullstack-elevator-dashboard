FROM node:18-alpine

WORKDIR /usr/src/server

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build