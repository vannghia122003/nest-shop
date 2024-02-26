FROM node:18-alpine as build

WORKDIR /frontend

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.24.0-alpine

COPY --from=build /frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]