#!/bin/bash

# Remember to make script executable: chmod u+x init-sample-media.sh
# Creates a sample media directory structure for testing

if [ ! -d "./media" ]; then
  echo "Create new media content..."
  mkdir -p ./media/movies ./media/movies/test_movie ./media/tv_shows ./media/tv_shows/test_show ./media/tv_shows/test_show/season_01
  touch ./media/tv_shows/test_show/season_01/test_tv.txt ./media/movies/test_movie/test_movie.txt
fi
