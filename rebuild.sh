#!/bin/bash

# Remember to make script executable: chmod u+x rebuild.sh

echo "===== Stopping all containers... ====="
docker stop $(docker ps -aq)
echo "===== Removing existing stopped containers... ====="
docker rm $(docker ps -aq)
echo "===== Rebuilding image... ====="
docker build -t amoore1337/demo-image .
echo "===== Starting container... ====="
docker run --name demo-image -p 1337:1337 -p 1338:1338 amoore1337/demo-image
