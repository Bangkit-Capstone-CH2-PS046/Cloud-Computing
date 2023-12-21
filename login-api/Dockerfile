FROM node:latest
WORKDIR /account

COPY . .
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm install

CMD [ "npm", "run", "start"]