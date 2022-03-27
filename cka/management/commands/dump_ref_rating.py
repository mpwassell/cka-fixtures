import time
from django.core.management.base import NoArgsCommand

from cka.models import Player,Club, Fixture, Period
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        for season in ['2015']:
            fnum=0
            fsame=0
            fixtures = Fixture.objects.filter(season__exact= season).order_by("date")
            for f in fixtures:
                fnum+=1
                if f.referee and f.ref_home_rating == f.ref_away_rating:
                    fsame+=1
                    print f.code, f.referee.name, f.ref_home_rating, f.ref_away_rating
            #print season, fnum,fsame