FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm ci 

COPY . .

RUN npm run build

# EXPOSE 4242

# CMD ["npx", "http-server", "./dist", "-p", "4242"]
