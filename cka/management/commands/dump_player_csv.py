##
## Dump players by team as CSV
##
from django.core.management.base import NoArgsCommand

from cka.models import Player,Match,Club
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        for club in Club.objects.filter(cka__exact = True):
            filename = "data" + "/" + club.name.lower() + ".csv"
            print "Dumping players for club ", club.name, " to file ",filename

            with open(filename,"w") as f:
                f.write("Please check existing players and make changes. Do not change the ID column!\n")
                f.write("If player is not playing, please put False in the last column.\n")
                f.write("If a U18 player is now over 18 please change the entry in the U18 columns.\n")
                f.write("At the end of the sheet, leave one line gap and add any new players. Leave ID blank.\n")

                f.write("ID,Name,Sex,U18,Active\n")
                for player in Player.objects.filter(club__exact = club, inactive__exact = False).order_by('name'):

                    matches = Match.objects.filter(player_id__exact = player.id).all()
                    cnt = 0
                    for m in matches:
                        try:
                            if m.fixture_code.index('2015'):
                                cnt += 1
                        except:
                            pass

                    f.write( str(player.id) + "," + player.name.strip() + "," + player.sex.strip()+ "," + str(player.u18).strip() + "," + str(not player.inactive) + "\n" )