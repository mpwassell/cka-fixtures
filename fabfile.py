# NOTE: Copy this into your main project and name it fabfilye.py

from __future__ import with_statement
from fabric.api import cd, run, env, task, require, put
from install.fab_common import *

import os

# fabric looks in higher level directories for fabfiles, so make sure
# we know which dir it was running ing
ROOTDIR = os.path.dirname(__file__)
os.chdir(ROOTDIR)


# Load up ssh keys if there
setkey()
# common settings
# sudo_as_user needs to be "root" or a user with the right permissions
# this default will get current local user
env.sudo_as_user = env.user
env.user = "django"
env.git_path = "gitolite@server.atwiss.com:cka-fixtures"

# settings files need to be inside a "settings" module
# and this should be the default settings file or changed per environment
env.settings_name = "defaults"

# Default host if not specified with a -H argument
if not env.hosts: env.hosts = ['server.atwiss.com']

# Extra packages to be installed on machine_setup() by apt-get. Separate packages names with a space.
# look in fab_commom.machine_setup() for a list of the default packages
env.extra_packages = ""

# Project dir structure:
# requirements files need to go inside the apppath if it is different from basepath
# if we have the django root in a subdir, we need:
#    env.basepath = /project/root
#    env.apppath  = /project/root/django_root (where we have manage.py)


# uncomment if you want to change the defaults
# Note: database name = env.appname
#env.psql_user = "postgres"
#env.psql_password = "jobbie"

@task
def production():
    env.production = True
    env.appname = "cka-fixtures"
    env.webname = "cka-fixtures.atwiss.com"
    env.apppath = "/projects/"+env.appname
    env.activate = 'source %s/bin/activate' % env.apppath
    env.settings_name = "production"



@task
def staging():
    env.production = False
    env.appname = "cka-fixtures-test"
    env.webname  = "cka-fixtures-test"
    env.apppath = "/projects/"+env.appname
    env.activate = 'source %s/bin/activate' % env.apppath
    env.settings_name = "staging"    

@task
def load_data():
    for fname in [ "clubs.json", "fixtures.json", "postmatch.json"]:
        run("source /projects/cka-fixtures-test/bin/activate && python /projects/cka-fixtures-test/manage.py loaddata /projects/cka-fixtures-test/data/{} --settings=settings.staging".format(fname))

# default to staging if nothing else provided
staging()



