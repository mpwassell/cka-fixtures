This is the top level directory for the CKA League Management System. It is based on the Python Django framework.

There is some documentation in the ./doc directory.

To start the server in this directory do

python manage.py runserver

And then navigate to the page 

http://localhost:8000/cka

(you should login as 'admin' to be able to access the full range of pages)

To access the Django admin pages that can be used to make modifications to the dabase table, go the page

http://localhost:8000/admin/cka/

A number of utility commands are implemented using the Django mechanism for this.

Run 

python manage.py 

and look int the section [cka] for these commands


Mark Wassell
September 2015