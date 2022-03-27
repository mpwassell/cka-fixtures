
import time
from django.core.management.base import BaseCommand, CommandError

from cka.models import Player,Club, Fixture, Period, Match
from cka.season import season

from cka.models import LeagueTable
from cka.season import season

class Command(BaseCommand):
    def handle(self, *args, **options):

        filename = r"E:\Mark\Korfball\CKA\Player Lists\U18.csv"
        u18_fl = []

        with open(filename,"r") as f:
            for line in f:

                data = line.split(",")
                fname = data[1]
                sname = data[2]

                u18_fl.append(fname + " " + sname)

                try:
                    p = Player.objects.filter(name__exact = fname + " " + sname,inactive__exact = False).get()

                    if not p.u18:
                        print( "Player not tagged as U18 {} {}".format(fname,sname))
                        #p.u18 = True
                        #p.save()

                except Player.DoesNotExist:
                    1
                    #print( "Couldn't find {} {}".format(fname,sname))
                except Player.MultipleObjectsReturned:
                    1
                    #print( "Multiple entries for {} {}".format(fname,sname))

        # See which players tagged as U18 in CKA and have played this season are
        # not in FL.

        u18_cka = Player.objects.filter(u18__exact = True).all()

        for p in u18_cka:

            matches = Match.objects.filter(player_id__exact = p.id).all()
            ok = False
            for m in matches:
                f = Fixture.objects.filter(season__exact = season, code__exact = m.fixture_code).all()
                if len(f) == 1:
                    ok = True
                    f = Fixture.objects.filter(season__exact = season, code__exact = m.fixture_code).get()
                    if not m.u18 and f.division in ['1','2','3']:
                        print("Player {} not tagged as U18 in match {} {}".format(p.name, m.fixture_code,f.division))

            if not ok:
                continue
            if (p.name in u18_fl) or (p.fl_name in u18_fl):
                None
            else:
                print ("Player {} not in FL?".format( p.name))
