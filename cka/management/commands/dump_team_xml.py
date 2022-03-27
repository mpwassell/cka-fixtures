##
## Dump players by team as XML for scorecard
##
from django.core.management.base import NoArgsCommand

from cka.models import Team

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        filename = "data" + "/teams.xml"

        with open(filename,"w") as f:
            f.write('<?xml version="1.0" encoding="utf-8" ?>\n')

            for team in Team.objects.exclude(inactive__exact = True).order_by('code'):
                f.write('<option value="{}">{}</option>\n'.format(team.code, team.name.strip()))
