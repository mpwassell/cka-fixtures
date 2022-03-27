import time
from django.core.management.base import NoArgsCommand

from cka.models import Player,Club, Fixture, Period
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        fixtures = Fixture.objects.filter(season__exact=season, code__startswith="VIK",date__gt= '2019-01-01').all()

        for f in fixtures:

            print f.code, " ", f.date

            if False:
                if f.date.hour == 17 and f.date.minute == 30 :
                    f.date = f.date.replace(hour=18,minute=15)

                if f.date.hour == 18 and f.date.minute == 30 :
                    f.date = f.date.replace(hour=19,minute=15)

                print f.code, " ", f.date

                f.save()