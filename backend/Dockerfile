FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /logs && touch /logs/app.log

EXPOSE 3001

CMD ["npm", "run", "dev"]
