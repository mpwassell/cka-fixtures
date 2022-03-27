from fabric.api import cd, run, env, task, require, put
from string import Template
from tempfile import NamedTemporaryFile
import fabric.api
from fabric.contrib.files import exists,contains
from fabric.contrib import files
from fabric.contrib import django
import os
import re
import sys
from functools import wraps

django.settings_module('settings')
from django.conf import settings
_uses_south = "south" in settings.INSTALLED_APPS


"""
Notes:

* Due to a change in fabric 1.5 we now have a variable as sudo_as_user and not sudo_user
  the parent fabfile will need to chnage
  
* TODO: automate geoip instal
* TODO: have a lessc installer
"""


def use_sudo_user(f):
    " decorator to make a function use the sudo_user, rather than django "
    @wraps(f)
    def wrapper(*args, **kwds):
        saved_user = env.user 
        env.user = env.sudo_as_user               
        ret = f(*args, **kwds)
        env.user = saved_user 
        return ret       
    return wrapper


def get_basepath():
    """
    Some projects might not be at the root of git. env.basepath should be the
    the git root, and env.apppath should be the manage.py dir
    """    
    if 'basepath' in env and env.basepath:
        return env.basepath
    else:
        return env.apppath

def setkey():
    # for the benefit of windows users, we will try looking for a .ssh key
    try:
        os.stat("ssh/deploykey")
        env.key_filename = ["ssh/deploykey"]
    except:
        pass


def virtualenv( command ):
    " Run a specified command inside the virtual env "
    with cd(env.apppath):
        run(env.activate + " && "+ command)


def pip_install_req():
    if exists( env.apppath + "/requirements.txt"):    
        virtualenv('pip install -r requirements.txt')
    # separate requirements for distribution (e.g Postgresql)
    if exists( env.apppath + "/requirements_prod.txt"):
        virtualenv('pip install -r requirements_prod.txt')    
    else: 
        print "skipping production requirements"

@task
def install_less():
    " Install node and lessc "
    if not exists("/usr/local/bin/npm"):
        print "Installing node"
        with cd("/tmp"):
            run("wget http://nodejs.org/dist/v0.8.14/node-v0.8.14.tar.gz")
            run("tar -xvzf node-v0.8.14.tar.gz")
        with cd("/tmp/node-v0.8.14"):
            run("./configure")
            run("make")
            sudo("make install")
    if not exists("/usr/local/bin/lessc"):
        sudo("npm install -g less")
        

@use_sudo_user
def sudo( *arg, **kwargs ):
    " Replacement sudo that switches to SUDO_USER for ssh "
    if env.user != "root" and hasattr(env, 'sudo_as_user'):
        env.user = env.sudo_as_user
    if env.user == "root": # and not 'user' in kwargs:
        # Cope with cases where sudo isn't installed yet
        run( *arg, **kwargs )
    else:
        fabric.api.sudo( *arg, **kwargs )
    
    
def upload_from_template(template, path, use_sudo=False):
    """
    Takes a local file as a python template, fills it it using
    env, and the uploads it to the given path.
    Used to create nginx or gunicorn files
    
    # LATER: move this to use use files.upload_template instead
    """
    saved_user = env.user
    if use_sudo: 
        env.user = env.sudo_as_user
    data = open(template).read()

    # Python Sting.Templates don't cope with undefined things
    required_keys = ['nginx_extra_config']
    for k in required_keys:
        if not hasattr(env, k):
            setattr( env, k, "")
    
    output = Template( data ).substitute( env )
    tmp = NamedTemporaryFile( delete=False)
    tmp.write(output)
    tmp.close()    
    put( tmp.name, path, use_sudo = use_sudo )
    os.unlink(tmp.name)
    env.user = saved_user    


@task
@use_sudo_user
def machine_setup():
    """
    Sets up a Vanilla debian 6 machine with everythign we need to have
    on it. 
    Typical usage:
      fab [-u root] [-H 192.168.1.21] machine_setup
    The user must have ssh access, if not root, must have sudo access
    
    TOOD:?? nginx/debian fix server_names_hash_bucket_size 64;
    """
    # Update system packages and install our minimum set
    sudo("apt-get update")
    sudo("apt-get -y upgrade")
    packages = "nginx postgresql gcc g++ make python-dev libjpeg-dev "\
                       "sudo emacs23-nox python supervisor git python-virtualenv python-pip "\
                       "libpq-dev libncurses-dev memcached "
    try:
        packages += env.extra_packages
    except AttributeError:
        pass
    sudo("apt-get install -y %s" % packages)
    sudo("pip install gunicorn") # we need this globally

    """
    TODO: optimise gzip settings for nginx?
    append this line to /etc/init.d/nginx.conf
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/\
    javascript;
    """
    
    # Compile install node & lessc for django compressor, which unfortunately we need to do
    # from source, which is a pain in the arse
    """
    TODO: install lessc
    if not exists("/usr/local/bin/lessc")
    mkdir /tmp/nodejs && cd $_
    wget -N http://nodejs.org/dist/node-latest.tar.gz
    tar xzvf node-latest.tar.gz && cd `ls -rd node-v*`
    ./configure
    make install
    npm install -g less
    #cp -r /root/.npm/less/1.3.0/package/lib/less  /projects/monitoring/frontend/lib/
    #cp -r /root/.npm/less/1.3.0/package/bin/lessc  /projects/monitoring/frontend/bin/
    #cp /usr/local/bin/node /projects/monitoring/frontend/bin/
    """
    
    # Create django user
    if not contains("/etc/passwd","django"):
        sudo("useradd -ms /bin/bash django")
    
    # Setup sudo for django
    put( 'install/django-supervisor.sudo', '/etc/sudoers.d/django', use_sudo=True, mode=0440 )
    sudo("chown root:root /etc/sudoers.d/django")

    # TODO: create users for annyone who will be running
    # TODO: add an admins file to /etc/sudoers.d if need be allowing sudo user
    # TODO: add ssh keys to django user
    
    if not exists("~django/.ssh", use_sudo=True):
        sudo("mkdir -m 0700 -p ~django/.ssh")    
    if not exists("~django/.ssh/authorized_keys", use_sudo=True):
        sudo("touch ~django/.ssh/authorized_keys")        
        sudo("chmod 0600 ~django/.ssh/authorized_keys")  
         
    # Is there a better way to deal with permissions. This means every dev will have access to a deploybot
    # that will have read access to every project. I don't know how we solve this, but this seems
    # to break our security model.
    put( 'install/deploybot.priv','/home/django/.ssh/id_rsa', use_sudo=True )
    put( 'install/deploybot.pub','/home/django/.ssh/id_rsa.pub', use_sudo=True )    
    sudo("chmod 0600 ~django/.ssh/id_rsa")    
    sudo("chown -R django ~django/.ssh")

    # Is there anything else?
    # TODO: make sure nginx is running and stop apache    
    
        


@task
@use_sudo_user
def add_ssh_key():
    """
    Add an ssh key for django user
    """
    print
    print "Please paste they SSH key you'd like to add for the django user"
    print
    key = raw_input()
    if not re.match('ssh-[a-z]{3}\s\S{30}\S*\s\S+', key):
        print "Invalid key"
        return
    files.append("~django/.ssh/authorized_keys", key, use_sudo=True)
    


@task
def setup():
    """
    Sets up a the project - providing we have our standard OS setup    
    E.g. assumes nginx, supervisor, postgres etc already installed
    """
    require('appname' )
    print
    print "****************************************************"
    print " This is intended to setup the application for the "
    print " first time on on a machine that is already "
    print " configured."
    print " You must have sudo rights on the server to run this"
    print "****************************************************"
    print 
    path = env.apppath
    basepath = get_basepath()

    # All this code is designed to be fully re-entrant and generic
    # across different projects
    if not exists(basepath):
        print "\n* Making Project Directory\n"
        sudo("mkdir -p %s" % basepath)        
        sudo("chown -R %s %s" % (env.user, basepath))

    if not exists(basepath+"/.git"):
        print "\n* Doing initial git clone\n"            
        with cd(basepath):
            run('git clone %s %s' % (env.git_path, basepath))
            run('git submodule init' )
    else:
        # if already exists, we should do a pull to check we have latest
        with cd(basepath):
            run('git pull')
            run('git submodule update')

    if not exists(path+"/bin"):            
        print "\n* Creating virtualenv\n"        
        with cd(path):
            run("virtualenv --distribute ." )
            pip_install_req()

    # Fix any permissions
    sudo("chown -R %s %s" % (env.user, basepath))            

    # create the database
    if not "psql_user" in env or not env.psql_user:
        env.psql_user = "postgres"
    if not "psql_password" in env or not env.psql_password:
        env.psql_password = "jobbie"

    sudo("su postgres -c 'createdb -O %s -e -E utf8 %s  2> /dev/null'||true" % (env.psql_user, env.appname))
    sudo ('echo "ALTER USER %s WITH PASSWORD \'%s\';" | su postgres -c psql template' % (env.psql_user, env.psql_password))
    
    # Before we run gunicorn we must also do an upload now to make sure
    # we have latest code and the DB is setup
    upload( supervisor_restart = False )

    supervisor_cfg_file = "/etc/supervisor/conf.d/%s.conf" % env.appname
    if True or not exists( supervisor_cfg_file ):    
        print "\n* Setting up supervisor\n"
        upload_from_template( 'install/supervisord.template', supervisor_cfg_file, use_sudo=True )
        # TODO: restart supervisor (valid?)
        sudo("supervisorctl reread")
        sudo("supervisorctl add %s" % env.appname )        
    

    nginx_cfg_file = "/etc/nginx/sites-available/"+env.appname
    if True or not exists( nginx_cfg_file ):    
        print "\n* Setting up nginx\n"
        upload_from_template( 'install/nginx.template', nginx_cfg_file, use_sudo=True )
        with cd("/etc/nginx/sites-enabled"):
            sudo( "ln -sf ../sites-available/%s ." % env.appname )
        if not fabric.contrib.files.contains("/etc/nginx/nginx.conf", "server_names_hash_bucket_size" ):
            print "******* WARNING ************"
            print "Debian's nginx is broken, you may need to add the line"
            print "'server_names_hash_bucket_size 64;' inside the http section"
            print "of /etc/nginx/nginx.conf"  
            print "****************************"            
        sudo("/etc/init.d/nginx configtest && /etc/init.d/nginx reload")



@task
def upload(includegeo=True, clonelive=False, supervisor_restart=True):
    " A lower level version of deploy with some extra options"
    require('appname')
    # args get passed as strings from command line, so cope with     
    clonelive = eval(str(clonelive))

    # any new libs we've added we also put into here
    path = get_basepath()
    with cd( path ):
        run('git pull')
        # This is safe even if we don't have any submodules
        run('git submodule init')                
        run('git submodule update')                
        #if not env.live and clonelive:
            # This relies on production and staging being on the same machine
            # run("sudo " +env.apppath +"/install/test_db_from_live.sh") 
    pip_install_req()            
    # TODO: BUG: these are quite nasty as these are not goign to pick up the right environment
    if env.settings_name:
        settings_arg = " --settings=settings.%s" % env.settings_name
    else:
        settings_arg = ""
    virtualenv('python manage.py syncdb --noinput' + settings_arg )
    if _uses_south:
        virtualenv('python manage.py migrate' + settings_arg)
    virtualenv('python manage.py collectstatic --noinput' + settings_arg)
    if supervisor_restart:
        run("sudo supervisorctl restart "+env.appname)            


@task
def ssh_test():
    print "Testing ssh"
    run("uname -a")

@task
def sudo_test():
    print "Testing sudo"
    sudo("wc -c /etc/shadow")
    
@task
def deploy( includegeo=False, clonelive=False):
    " Deploy code to the server "
    require('appname')
    
    if not exists( env.apppath ):
        print "ERROR: the target path %s doesn't exist, do you need to do a fab setup first?" % env.apppath
        return
        
    if env.production:
        print
        print "*************************************************"
        print "THIS WILL UPDATE THE LIVE SITE - ARE YOU SURE?"
        print "*************************************************"
        print 
        sys.stdout.write("Are you sure (type yes)> ")
        a = raw_input()
        if not a == "yes":
            sys.exit()
    print 
    print "*"*80
    print " Updating %s on hosts %s" % (env.webname, ', '.join(env.hosts))
    print "*"*80
    print
    upload(includegeo=includegeo, clonelive=clonelive)


@task
def crontab_entries():
    if not env.cron_entries:
        return

    env.warn_only = True # to avoid suspending execution when there are no existing entries
    cron = run('crontab -l')

    # dump existing entries, if any, to temp file
    current_entries = ""
    if cron.return_code == 0:
        current_entries = cron.stdout

    # append entries to temp file if they are not already there
    new_entries = current_entries
    for entry in env.cron_entries:
        if not entry in current_entries:
            if new_entries:
                new_entries += "\n"
            new_entries += entry

    # since we can only append to crontab from a file:
    run('echo "%s" > ~/crondump' % new_entries)
    # add temp file contents to crontab and remove it
    run('crontab ~/crondump && rm ~/crondump')

