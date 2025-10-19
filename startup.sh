#!/bin/bash
cp /home/site/wwwroot/default /home/site/default
export NGINX_CONF_FILE=/home/site/default
/usr/sbin/nginx -c $NGINX_CONF_FILE -g 'daemon off;'