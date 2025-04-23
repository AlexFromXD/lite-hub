FROM node:22-alpine as build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm install

COPY . /build/
RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /build/dist /app/dist

CMD [ "npm", "start" ]
