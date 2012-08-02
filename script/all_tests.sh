#!/bin/bash

find test -type f  | grep -e '_test.js' | xargs nodeunit 