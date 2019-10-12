#!/bin/bash

# Remember to make script executable: chmod u+x docker-push.sh
# Builds prod assets and image bufore pushing to docker hub

echo "===== Build client assets... ====="
cd ./client && npm install && npm run build && cd -
echo "===== Stopping all containers... ====="
docker stop $(docker ps -aq)
echo "===== Removing existing stopped containers... ====="
docker rm $(docker ps -aq)
echo "===== Building new test image... ====="
docker build -t amoore1337/plex-cache-manager:test .
echo "===== Pushing to docker hub... ====="
docker push amoore1337/plex-cache-manager:test
