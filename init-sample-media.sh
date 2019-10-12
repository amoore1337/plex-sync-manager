#!/bin/bash

# Remember to make script executable: chmod u+x init-sample-media.sh
# Creates a sample media directory structure for testing

echo "Cleanup existing media dir..."
rm -rf ./media
echo "Create new content..."
mkdir -p ./media/movies ./media/tv_shows
touch ./media/tv_shows/test_tv.txt ./media/movies/test_movie.txt
