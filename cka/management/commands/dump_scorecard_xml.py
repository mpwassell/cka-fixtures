##
## Dump XML for scorecard web site
##
from django.core.management.base import NoArgsCommand

from cka.models import Player
from cka.models import Club
from cka.models import Team
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        print "Dumping all players as XML"

        print "Dumping all teams as XML"