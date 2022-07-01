FROM node:16.6.1-slim

WORKDIR /app

COPY ./package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY jest.config.js .

RUN yarn install --production --frozen-lockfile
RUN yarn build

COPY ./dist ./src

CMD ["node", "./src/index.js"]