#!/bin/bash

tgz_filename=`npm pack`
npm install ${tgz_filename}

# NOTE!
# Current version of browserify (1.13.5) gets the translated require() paths wrong!
# See my patch for my fix/workaround 
# https://github.com/adparadise/node-browserify/commit/bb5754622ea90e34bc7413c1e619e842a5032e08

browserify -r md-plus -o md-plus-web.js
