#!/bin/bash

# do this or else aliases don't work
shopt -s expand_aliases
. ~/.bash_aliases

# use this to make shell environment have the directory of watchers.sh
cd "${0%/*}"

# node-sass gives a lot of source map comments, might be messing with firefox
sass --source-map true -w ./public/stylesheets/scss/ -o ./public/stylesheets
# add ES7 transpiler here

