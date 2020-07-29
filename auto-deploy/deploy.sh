#!/bin/sh

echo "In the DEPLOY_SCRIPT"

cd /deploy

if [ -f /run/secrets/git_url_with_auth ]; then
	export GITLAB_URL=$(cat /run/secrets/git_url_with_auth)
  git pull "$GITLAB_URL"
fi


