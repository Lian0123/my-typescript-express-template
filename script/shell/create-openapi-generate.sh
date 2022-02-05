#!/bin/sh

if [ ! -f ../envs/.env ] ; then
  export $(cat ./envs/.env | grep SERVICE_MAPPING_PORT | xargs)
  curl $SERVICE_MAPPING_PORT/api-docs/swagger.json --output ./docs/swagger.json
  unset SERVICE_MAPPING_PORT

  docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
      -i "/local/docs/swagger.json" \
      -g typescript-axios \
      -o /local/openapi-build/typescript-axios
else
  echo -e "\033[1;31m"
  echo -e "Error: envs/.env file is not exsit\n"
  echo -e "\033[0m"
fi
