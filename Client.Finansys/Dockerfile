#stage 1
FROM node:latest as node
WORKDIR /app
EXPOSE 80 443
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/client.finansys /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/nginx.conf
