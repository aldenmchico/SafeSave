#!/bin/bash

find . -name 'package.json' -not -path '*node_modules*' | while read packageFile; do
    dir=$(dirname "$packageFile")
    echo "Installing npm packages in $dir"
    (cd "$dir" && npm install)
done
