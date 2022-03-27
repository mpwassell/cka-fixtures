##
## Load fixtures from 'Output Website' sheet of scheduling spreadsheet.
##
## Format is:
## Date, Time, Div, Home, Away, Ref, Venue, Week
## "Sun, 17-Oct-2021", "4:00 PM"	2	CIT5	UNI2	PHO	IMP	1

import time
from django.core.management.base import BaseCommand, CommandError

from cka.models import Player,Club, Fixture, Period
from cka.season import season

def convert_code(tm):
    if tm == 'TIG3':
        return 'TIG1'
    elif tm == 'TIG4':
        return 'TIG2'
    elif tm == 'TIG5':
        return 'TIG3'
    elif tm == 'TIG6':
        return 'TIG4'
    else:
        return tm


class Command(BaseCommand):
    def handle(self, *args, **options):

        filename = r"D:\Mark\CKAWebSite\Fixtures2021\Fixtures.csv"

        Fixture.objects.filter(season__exact=season).delete()

        with open(filename,"r") as f:
            for line in f:
                print(line)
                if line[:8] == ",<ERROR>" or line[:8] == ",,,,,,,," or line[:5] == ",,Div": continue

                if "Christmas" in line: continue
                if "Easter" in line: continue

                data = line.split(",")

                # Calculate match date
                date=data[1].replace('"','')
                print("Date = {}".format(date))
                date=date.strip()
                date = date + " " +data[2]   

                print("Date = {}".format(date))
                
                date = time.strptime(date, '%d-%b-%Y %I:%M %p')

                # Team information
                home_team = convert_code(data[4])
                away_team = convert_code(data[5])
                match_code = data[4] + data[5] + "_" + str(season)
                ref_team = data[6] + "1"

                # Calculate period
                ds = time.strftime('%Y-%m-%d',date)
                sp = Period.objects.filter(season__exact = season, date_from__lte = ds, date_to__gte = ds).get()
                sp = sp.number
                division = data[3]
                week=int(data[8])

                print ("FIXTURE ", match_code, date)                

                date = time.strftime('%Y-%m-%d %H:%M',date)
                print("Date = {}".format(date))
                print("Ref = {}".format(ref_team))

                f = Fixture(code=match_code,season=season,division=division,
                    match=match_code,week=week,
                    date=date,
                    home_team_id=home_team,away_team_id=away_team,
                    by_hand=False,score_in_fixtures_live=False,
                    cancelled=False,ignore_for_status=False,home_score=None,away_score=None,notes=None,home_score_halftime=None,away_score_halftime=None,
                    referee_team_id=ref_team,venue_id=data[7], changenotes=None,changestatus="",period=sp, playoff=False)
                f.save()

                print ("Check DST timezone handled correctly.")
