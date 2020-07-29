#!/bin/bash

# cd to script location
cd "${0%/*}"

# go to project home
cd ..

# create post-merge hook
cp ./auto-deploy/rebuild-and-deploy.sh ./.git/hooks/post-merge

