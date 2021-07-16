#!/bin/bash

git checkout www && \
  git merge master && \
  ls -1 static/js/ | awk '{print "static/js/"$1}' | xargs sed -i -r 's/(.*)("\/)[^portfolio\-3d](.*\/)/\1"\/portfolio-3d\/\3/' && \
  yarn build && \
  cp -rf ./build/* . && \
  git add . && \
  git commit -m"updates" && \
  git push && \
  git checkout master
