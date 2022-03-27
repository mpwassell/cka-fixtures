from defaults import *
DEBUG = False
TEMPLATE_DEBUG = DEBUG
ALLOWED_HOSTS=['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cka-fixtures',
        'USER': 'postgres',
        'HOST': 'localhost',
        'PASSWORD': 'jobbie'
    }
}
