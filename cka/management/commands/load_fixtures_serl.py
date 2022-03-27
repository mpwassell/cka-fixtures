##
## As of 2019. Use load_fixture_fl to get fixtures from FL data
##
import time
from django.core.management.base import NoArgsCommand

from cka.models import Player,Club, Fixture, Period
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        filename = r"E:\Mark\CKAWebSite\Fixtures2017\fixtures_serl_prem.csv"

        Fixture.objects.filter(season__exact=season, division__exact="SERL").delete()



        with open(filename,"r") as f:
            for line in f:
                if line[:8] == ",<ERROR>" or line[:8] == ",,,,,,,," or line[:9] == "Date,Time": continue
                data = line.split(",")

                code = data[3] + data[4] + "_" + str(season)
                date = data[0].strip() + " " + (data[1].strip() if data[1] else "1:00 PM")

                if data[2] != "SERL":
                    continue

                print "DATE <", date, ">"

                date = time.strptime(date, '%d-%m-%y %H%M')

                ds = time.strftime('%Y-%m-%d',date)
                sp = Period.objects.filter(season__exact = season, date_from__lte = ds, date_to__gte = ds).get()

                date = time.strftime('%Y-%m-%d %H:%M',date)

                print "FIXTURE {} {} <{}>".format( code, date, data[5].strip())

                f = Fixture(code=code,season
                    =season,division=data[2],
                    match=1,
                    date=date,home_team_id=data[3],away_team_id=data[4],by_hand=False,score_in_fixtures_live=False,
                    cancelled=False,ignore_for_status=False,home_score=None,away_score=None,notes=None,home_score_halftime=None,away_score_halftime=None,
                    venue_id=data[5].strip(),
                    changenotes=None,changestatus="",period=sp.number, playoff=False)
                f.save()

                print "Check DST timezone handled correctly."
