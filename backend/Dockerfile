FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN curl -fsS https://dotenvx.sh | sh

COPY . .

EXPOSE 3000

RUN dotenvx ext prebuild

CMD ["dotenvx", "node", "npm", "run", "dev"]