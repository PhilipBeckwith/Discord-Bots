#!/bin/bash

echo "Log of post merge hook" > /tmp/test.txt
echo "$USER" >> /tmp/test.txt
echo "$PWD" >> /tmp/test.txt

docker-compose down >> /tmp/test.txt

docker-compose build >> /tmp/test.txt

docker-compose up -d >> /tmp/test.txt

