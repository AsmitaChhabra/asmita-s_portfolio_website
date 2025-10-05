#!/bin/bash

# 1. Copy the custom config file (default) to the writeable directory
cp /home/site/wwwroot/default /home/site/default

# 2. Tell NGINX to use the custom config file from the writeable path
export NGINX_CONF_FILE=/home/site/default

# 3. Start NGINX using the standard command
# This command is often what App Service uses internally to start the web server.
/usr/sbin/nginx -c $NGINX_CONF_FILE -g 'daemon off;'