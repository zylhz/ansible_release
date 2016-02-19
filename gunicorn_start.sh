#!/bin/bash
 
NAME="dj_pro"                                  # Name of the application
DJANGODIR=/data/Automation/dj                  # Django project directory
IP_PORT=0.0.0.0:12345  # we will communicte using this unix socket
USER=deploy                                        # the user to run as
GROUP=deploy                                     # the group to run as
WAY_START=gevent                                     # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=dj_pro.settings             # which settings file should Django use
DJANGO_WSGI_MODULE=dj_pro.wsgi                     # WSGI module name
 
echo "Starting $NAME as `whoami`"
 
# Activate the virtual environment
cd $DJANGODIR
source ../bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH
 
# Create the run directory if it doesn't exist
 
# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec ../bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  -k $WAY_START \
  --user=$USER --group=$GROUP \
  --bind=$IP_PORT \
  --log-file=-
