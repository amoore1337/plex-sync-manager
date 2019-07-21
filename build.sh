#!/bin/bash

# Remember to make script executable: chmod u+x build.sh

echo "===== Build client assets... ====="
cd ./client && npm install && npm run build && cd -
echo "===== Starting docker build steps... ====="
./rebuild.sh
