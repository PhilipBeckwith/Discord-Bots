# Running from node
from node:lts-alpine3.11

RUN apk add git

# Copy over and build app
COPY ./ ./
run npm install

#Starting the file
CMD ["auto-deploy.js"]

