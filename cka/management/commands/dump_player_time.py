##
## Dump player time for season
##
from django.core.management.base import NoArgsCommand

from cka.models import Player,Match,Fixture
from cka.models import Club
from cka.season import season

class Command(NoArgsCommand):


    def dump_for_season(self,season):
        print ("Doing season {}".format(season))
        filename = "data/player_time_{}.csv".format(season)

        players = dict()

        flist = Fixture.objects.filter(season__exact=season)
        for f in flist:
            mlist = Match.objects.filter(fixture_code__exact=f.code)
            for m in mlist:
                if not (m.player.name in players):
                    players[m.player.name] = 0
                if not m.gametime:
                    gt = 0.25 * len(m.count_code)
                else:
                    gt = m.gametime
                players[m.player.name] += gt

        with open(filename,"w") as f:
            for p in players.keys():
                f.write("{},{}\n".format(p,players[p]))

    def handle_noargs(self, **options):
        for s in [ '2018', '2017', '2016', '2015', '2014']:
            self.dump_for_season(s)
