# Running from node
from node:lts-alpine3.11

run apk add python make g++ ffmpeg

COPY ./ ./

run npm install

#Starting the file
CMD ["index.js"]
