FROM node:18-alpine

WORKDIR /backend

COPY package*.json .
RUN apk add python3
RUN npm install pm2 -g
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]