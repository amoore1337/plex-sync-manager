#!/bin/bash

if [ $# -lt 2 ]; then
    echo "Please pass in required args"
else
    zip -r "$0" "$1"
fi
