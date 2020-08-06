# Running from node
FROM node:lts-alpine3.11
ARG NEW_RELIC_NO_CONFIG_FILE=true
ENV NR_NATIVE_METRICS_NO_BUILD=true

RUN apk add python=2.7.18-r0 make g++ ffmpeg

COPY ./ ./

RUN npm install 

#Starting the file
CMD ["index.js"]
