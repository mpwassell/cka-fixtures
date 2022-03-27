from socket import gethostname

if gethostname() == "server.atwiss.com":
    from production import *
else:
    from . import dev
