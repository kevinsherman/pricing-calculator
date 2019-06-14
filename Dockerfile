FROM alpine as builder

LABEL maintainer="kevin.r.sherman@gmail.com"

RUN apk add --update nodejs nodejs-npm
COPY ./src /app/src
COPY ./package.json /app
COPY ./tsconfig.json /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM alpine as app
RUN apk add --update nodejs nodejs-npm
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/tests/test-data ./test-data

RUN ls ./test-data -al

ENTRYPOINT [ "node", "dist/tests/index.js"]