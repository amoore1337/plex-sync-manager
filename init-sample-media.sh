#!/bin/bash

# Remember to make script executable: chmod u+x init-sample-media.sh
# Creates a sample media directory structure for testing

if [ ! -d "./media" ]; then
  echo "Create new media content..."
  mkdir -p ./media/movies ./media/tv_shows
  touch ./media/tv_shows/test_tv.txt ./media/movies/test_movie.txt
fi
