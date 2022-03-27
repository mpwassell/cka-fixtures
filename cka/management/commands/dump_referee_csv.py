##
## Dump referee summary. Dumps referees by season and number of matches reffed in that season
##
from django.core.management.base import NoArgsCommand

from cka.models import Player
from cka.models import Fixture
from cka.season import season
from django.db.models import Count

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        filename = "data/referees.csv"
        with open(filename,"w") as fout:

            season_query = Fixture.objects.values('season').annotate(rcount=Count('season'))

            for a_season in season_query:

                query = Fixture.objects.filter(season__exact= a_season['season']).values('referee').annotate(rcount=Count('referee'))

                for f in query:

                    if f['referee']:
                        p = Player.objects.filter(id__exact = f['referee']).get()
                        fout.write(a_season['season'] + "," + p.name + "," +  str(f['rcount']) + "\n")
  