FROM node:14.15-alpine

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

CMD ["npm", "start"]