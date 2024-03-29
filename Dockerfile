FROM node:lts

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm test

RUN npm run build

RUN npm install -g serve