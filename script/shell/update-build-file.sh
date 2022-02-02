#!bin/sh

## change typeorm-config mapping file to build
sed -i -e "s/src\//dist\//g" ./dist/typeorm-config.js
sed -i -e "s/\.ts/\.js/g" ./dist/typeorm-config.js
