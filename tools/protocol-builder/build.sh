rm -rf $(dirname "$0")/output-src/*
node $(dirname "$0")/index.js -s $(dirname "$0")/../protocol-updater/dofus-src -o $(dirname "$0")/output-src/
