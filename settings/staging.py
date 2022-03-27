from defaults import *
DEBUG = True
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS=['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cka-fixtures-test',
        'USER': 'postgres',
        'HOST': 'localhost',
        'PASSWORD': 'jobbie'
    }
}
