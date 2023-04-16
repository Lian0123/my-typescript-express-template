#!/bin/sh

if [ ! -f ../envs/.env ] ; then
  export $(cat ./envs/.env | grep SERVICE_HOST | xargs)
  export $(cat ./envs/.env | grep SERVICE_PORT | xargs)

  date=$(date '+%Y_%m_%d_%H_%M_%S')
  docker run --net=host --rm -v "${PWD}:/local" --user $UID  -i grafana/k6 run /local/script/javascript/k6.js \
          --out json=/local/k6/report_$date.json \
          -e SERVICE_HOST=$SERVICE_HOST \
          -e SERVICE_PORT=$SERVICE_PORT
  
  unset SERVICE_HOST
  unset SERVICE_POSRT

else
  echo -e "\033[1;31m"
  echo -e "Error: envs/.env file is not exsit\n"
  echo -e "\033[0m"
fi
