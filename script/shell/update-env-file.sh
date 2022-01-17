#!/bin/sh

shellName="update-env-file.sh"
author="Lian0123"
version="0.0.0"
envPath="./envs/"

function showHelp(){
    echo "Shell Name: $shellName"
    echo "  Update .env file"
    echo "  Usage: update-env-file [options] [env-name]"
    echo -e "\033[1;32m"
    echo -e "options:"
    echo -e "  -h, --help"
    echo -e "      show for help"
    echo -e ""
    echo -e "  -a, --author"
    echo -e "      show shell author"
    echo -e ""
    echo -e "  -v, --version"
    echo -e "      show update-env-file version"
    echo -e ""
    echo -e "  -c, --change"
    echo -e "      change .env file to [env-name]"
    echo -e "\033[0m"
    echo -e "\033[1;35m"
    echo -e "env-name: local|ci|dev|stage|test|prod"
    echo -e "  local: \".env.local\" local development"
    echo -e "  ci:    \".env.ci\"    github CI or gitlab CI"
    echo -e "  dev:   \".env.dev\"   development server"
    echo -e "  stage: \".env.stage\" stage server"
    echo -e "  test:  \".env.test\"  test server"
    echo -e "  prod:  \".env.prod\"  prod server"
    echo -e ""
    echo -e "\033[0m"
}

function showAuthor(){
    echo -e "\033[1;32m"
    echo -e "Shell Author: $author"
    echo -e "\033[0m"
}

function  showVersion(){
    echo -e "\033[1;32m"
    echo -e "Version: $version"
    echo -e "\033[0m"
}

function changeEnvFile(){
    if [ "$#" == "0" ]; then
        echo -e "\033[1;31m"
        echo -e "Error: Not find \"env-name\" value\n"
        echo -e "\033[0m"
        showHelp
        exit
    elif ! [ "$1" == "local" ] && ! [ "$1" == "ci" ] && ! [ "$1" == "dev" ] && ! [ "$1" == "test" ] && ! [ "$1" == "prod" ]; then 
        echo -e "\033[1;31m"
        echo -e "Error: env-name only have local, ci, dev, test, prod\n"
        echo -e "\033[0m"
        showHelp
        exit
    elif ! [ -e ${envPath}.env.$1 ]; then 
        echo -e "\033[1;31m"
        echo -e "Error: ${envPath}.env.$1 file is not exsit\n"
        echo -e "\033[0m"
        showHelp
        exit
    fi

    cp -f ${envPath}.env.$1 ${envPath}.env
    echo -e "\033[1;32m"
    echo -e "The .env file is change to ${envPath}.env.$1\n"
    echo -e "\033[0m"
    showHelp

}

case "$1" in
    --help);&
        -h)
            showHelp
            exit
            ;;
    --author);&
        -a)
            showAuthor
            exit
            ;;
    --version);&
        -v)
            showVersion
            exit
            ;;
    --change);&
        -c)
            changeEnvFile $2
            exit
            ;;
    *)
        echo -e "\033[1;32m"
        echo -e "Error: Not find options \"$1\" value\n"
        echo -e "\033[0m"
        showHelp
esac