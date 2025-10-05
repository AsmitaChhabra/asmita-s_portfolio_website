#!/bin/bash
cp /home/site/wwwroot/default /etc/nginx/sites-available/default
nginx -g 'daemon off;'