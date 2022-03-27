##
## Dump players by team as CSV
##
from django.core.management.base import NoArgsCommand

from cka.models import Player,Match
from cka.models import Club
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        filename = "data" + "/players_all.csv"

        with open(filename,"w") as f:
            for club in Club.objects.filter(cka__exact = True):
            
                print "Dumping players for club ", club.name, " to file ",filename
            
                f.write("Club,Name,Sex,U18\n")
                for player in Player.objects.filter(club__exact = club, inactive__exact = False).order_by('name'):

                    matches = Match.objects.filter(player_id__exact = player.id).all()
                    cnt = 0
                    for m in matches:
                        try:
                            if m.fixture_code.index(season):
                                cnt += 1
                        except:
                            pass

                    f.write( club.name + "," + player.name.strip() + "," + player.sex.strip()+ "," + str(player.u18).strip() + "," + str(cnt) + "\n" )