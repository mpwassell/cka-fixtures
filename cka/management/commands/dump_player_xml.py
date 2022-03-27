##
## Dump players by team as XML for scorecard
##
from django.core.management.base import NoArgsCommand

from cka.models import Player
from cka.models import Club
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        filename = "data" + "/players.xml"

        with open(filename,"w") as f:
            f.write('<?xml version="1.0" encoding="utf-8" ?>\n<complete>\n')

            for player in Player.objects.filter(inactive__exact = False).order_by('name'):
                f.write('<option value="{}">{}</option>\n'.format(player.id, player.name.strip()))

            f.write("</complete>\n")
