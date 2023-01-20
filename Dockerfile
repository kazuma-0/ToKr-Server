FROM node:18.10-alpine3.15

WORKDIR /usr/src/app

# copy package json and lockfiles
COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install

COPY . .

RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]