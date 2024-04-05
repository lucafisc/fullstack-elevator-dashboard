FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm ci 
COPY . .
RUN npm run build

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./ssl/certificate.crt /etc/ssl/certificate.crt
COPY ./ssl/private_key.pem /etc/ssl/private_key.pem
COPY --from=build /usr/src/app/dist /user/share/nginx/html