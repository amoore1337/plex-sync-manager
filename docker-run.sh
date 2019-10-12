#!/bin/bash

# Remember to make script executable: chmod u+x docker-run.sh
# Builds and runs docker images
# NOTE: Add the "--full" flag to also build prod assets

if [ "$1" != "--no-compile" ]; then
  echo "===== Build client assets... ====="
  cd ./client && npm install && npm run build && cd -
fi

echo "===== Stopping all containers... ====="
docker stop $(docker ps -aq)
echo "===== Removing existing stopped containers... ====="
docker rm $(docker ps -aq)
echo "===== Rebuilding image... ====="
docker build -t amoore1337/demo-image .
echo "===== Starting container... ====="
docker run --name demo-image -p 1337:1337 -p 1338:1338 -v /Users/amoore/Downloads:/media amoore1337/demo-image
