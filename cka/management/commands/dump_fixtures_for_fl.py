##
## Dump fixtures for Fixtures Live Import
##
from django.core.management.base import NoArgsCommand
import datetime
import django.utils.timezone
from cka.models import Fixture
from cka.models import Club
from cka.season import season

class Command(NoArgsCommand):
    """
    Dumps fixtures for each division into CSV for import into Fixtures Live.
    In fixtures live, download the spreadsheed from fixtures live and copy and paste the CSV into the 'Fixtures' tab
    """
    
    def handle_noargs(self, **options):

        for div in range(1,4):
            self.dump_division(div)

    def dump_division(self,div):

        filename =  r"E:\Mark\CKAWebSite\Upload2017\\" + str(div) + "_fixtures.csv"
        gmt = django.utils.timezone.get_current_timezone()

        with open(filename,"w") as f:
            flist = Fixture.objects.filter(season__exact=season, division__exact=div).order_by("date")

            for fixture in flist:
                home = "{}".format(fixture.home_team.name)
                home = home.replace("(Dev)","").strip()
                home = home[:-2] + '-' + home[-1]
                away = "{}".format(fixture.away_team.name)
                away = away.replace("(Dev)","").strip()
                away = away[:-2] + '-' + away[-1]
                
                dt = fixture.date.astimezone(gmt)

                if not fixture.venue.fixtures_live:
                    print "WARNING: Venue {} doesn't have FL code".format(fixture.venue.name)
                f.write( "{} ({})".format(home,fixture.home_team.fixtures_live) + ",{} ({})".format(away,fixture.away_team.fixtures_live) + ","  + dt.strftime("%d/%m/%Y,%H:%M") + "," + str(fixture.venue.fixtures_live) + "\n")