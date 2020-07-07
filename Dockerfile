# Running from node
from node:lts-alpine3.11

COPY ./ ./

run npm install

#Starting the file
CMD ["index.js"]