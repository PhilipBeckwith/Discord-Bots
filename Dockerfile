# Running from node
from node:lts-alpine3.11

# Set time zone - default of America/Phoenix
ARG TZ='America/Phoenix'
ENV DEFAULT_TZ ${TZ}
RUN apk add -U tzdata \
	&& cp /usr/share/zoneinfo/${DEFAULT_TZ} /etc/localtime \
	&& apk del tzdata

# Install build depenacies
RUN apk add make gcc g++

# Install run depenacies
RUN apk add python ffmpeg

# Copy over and build app
COPY ./ ./
run npm install

#Clean up build dependancies and apk cache
RUN apk del make gcc g++ \
	&& rm -rf /var/cache/apk/*

#Starting the file
CMD ["index.js"]
