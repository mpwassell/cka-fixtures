##
## Dump match results to CSV
##
from django.core.management.base import NoArgsCommand
import datetime
import django.utils.timezone
from cka.models import Fixture
from cka.models import Club
from cka.season import season

class Command(NoArgsCommand):
    """
    Dumps fixtures 
    """
    
    def handle_noargs(self, **options):

        for div in range(1,4):
            self.dump_division(div)

    def dump_division(self,div):

        filename =  r"E:\Mark\CKAWebSite\Upload2017\\fixtures.csv"
        gmt = django.utils.timezone.get_current_timezone()

        with open(filename,"w") as f:
            flist = Fixture.objects.filter().order_by("date")

            f.write("Season,Division,Date,Time,Home Team,Away Team,Home Halftime Score,Away Halftime Score,Home Fulltime Score,Away Fulltime Score,Referee,Home Ref Rating,Away Ref Rating\n")
            for fixture in flist:
                dt = fixture.date.astimezone(gmt)
                if not fixture.season in [ "2017", "2016", "2015", "2014", "2013"]:
                    continue
                if not fixture.division in ["1", "2", "3"]:
                    continue

                print fixture.code, fixture.season, dt
                f.write( "{},{},{},{},{},{},{},{},{},{},{},{}\n".format(
                    fixture.season, fixture.division,dt.strftime("%d/%m/%Y,%H:%M") , fixture.home_team, fixture.away_team,
                    fixture.home_score_halftime, fixture.away_score_halftime, fixture.home_score, fixture.away_score,
                    fixture.referee,  fixture.ref_home_rating, fixture.ref_away_rating))