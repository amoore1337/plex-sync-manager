#!/bin/bash

# Remember to make script executable: chmod u+x docker-run.sh
# Builds and runs docker images
# NOTE: Add the "--no-compile" flag to prevent compiling client assets

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

echo "===== Creating sample data... ====="
# This feels dumb.
# TODO: Find a more clever way to do this at some point.
sh ./init-sample-media.sh
cd ./media/movies
movie_path=$(pwd)
cd ../tv_shows
tv_path=$(pwd)
cd ../..

echo "===== Starting container... ====="
docker run --name demo-image -p 1337:1337 -p 1338:1338 -v $movie_path:/movies -v $tv_path:/tv_shows amoore1337/demo-image
