FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 4002

CMD ["node", "dist/main.js"]
