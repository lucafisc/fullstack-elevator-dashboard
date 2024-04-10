FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm ci 
COPY . .
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

FROM nginx

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

COPY ./ssl/certificate.crt /etc/ssl/certificate.crt
COPY ./ssl/private_key.pem /etc/ssl/private_key.pem

COPY ./nginx/default.prod.conf /etc/nginx/conf.d/default.prod.conf
COPY ./nginx/default.dev.conf /etc/nginx/conf.d/default.dev.conf

RUN if [ "$NODE_ENV" = "production" ]; then \
        mv /etc/nginx/conf.d/default.prod.conf /etc/nginx/conf.d/default.conf; \
        rm /etc/nginx/conf.d/default.dev.conf; \
    else \
        mv /etc/nginx/conf.d/default.dev.conf /etc/nginx/conf.d/default.conf; \
        rm /etc/nginx/conf.d/default.prod.conf; \
    fi

COPY --from=build /usr/src/app/dist /user/share/nginx/html

# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# COPY ./ssl/certificate.crt /etc/ssl/certificate.crt
# COPY ./ssl/private_key.pem /etc/ssl/private_key.pem
