#!/bin/bash

# Harp compiles pages to HTML in situ, rather than moving them to their own
# directory. This causes links that work during `harp serve` to break on
# compilation.

# This script finds any html file not called `index.html`, moves it to a new
# directory and renames it to preserve links.

BUILD_DIR=${1:-./www}

find $BUILD_DIR -name "*.html" | while read file; do
    filename=$(basename "$file" .html)
    if [ $filename != 'index' ]; then
        new_dir="$(dirname $file)/$filename"
        mkdir $new_dir
        mv $file $new_dir/index.html
        echo "Moving $file to $new_dir/index.html"
    fi
done
