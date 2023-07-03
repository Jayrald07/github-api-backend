FROM node:19.6.0-alpine

WORKDIR /app

COPY . .

RUN npm install -g typescript
RUN npm install
RUN npm run build
RUN rm -rf src

CMD [ "npm", "start" ]