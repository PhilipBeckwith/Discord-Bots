# Running from node
from node:lts-alpine3.11

# Set time zone - default of America/Phoenix
ARG TZ='America/Phoenix'
ENV DEFAULT_TZ ${TZ}

# Set timezone, install build and run depenacies
RUN apk add -U tzdata \
	&& cp /usr/share/zoneinfo/${DEFAULT_TZ} /etc/localtime \
	&& apk del tzdata \
  && apk add make gcc g++ \
  && apk add python ffmpeg

# Copy over app
COPY ./ ./

#Build App and clean up build dependancies and apk cache
run npm install \
  && apk del make gcc g++ \
	&& rm -rf /var/cache/apk/*

#Starting the file
CMD ["index.js"]
