##
## Load fixture changes from 'Output Website' sheet of scheduling spreadsheet.
##
import time
from django.core.management.base import BaseCommand
import django.utils.timezone
from cka.models import Player,Club, Fixture, Period
from cka.season import season

class Command(BaseCommand):

    def add_arguments(self,parser):
        parser.add_argument('update', nargs='+', type=bool)

    def handle(self,*args,**options):

        if len(args) == 0:
            do_update=False
        else:
            do_update = (args[0]=='update')

        filename = r"E:\Mark\CKAWebSite\Fixtures2016\Fixtures_2016_web_17042600.csv"
        gmt = django.utils.timezone.get_current_timezone()

        print "The following changes have been detected:"

        with open(filename,"r") as f:
            for line in f:
                if line[:8] == ",<ERROR>" or line[:8] == ",,,,,,,," or line[:9] == "Date,Time": continue
                data = line.split(",")

                code = data[4] + data[5] + "_" + str(season)

                fixture = Fixture.objects.filter(code__exact = code).get()
                date = data[1][:-1].strip() + " " + data[2]
                ref = data[6]

                # FIXME This is rather clunky
                dt = fixture.date.astimezone(gmt)
                h = dt.hour if dt.hour <= 12 else dt.hour-12
                dt_str = '{dt:%d}-{dt:%b}-{dt.year} {h}:{dt:%M} {dt:%p}'.format(dt=dt,h=h)

                venue = data[7]

                changed=True

                if dt_str != date:
                    print code, "Date different ", dt_str, "> <", date, ">", data[11], data[12].strip()
                    fixture.changestatus = data[11].strip()
                    fixture.changenotes = data[12].strip()
                    new_date =  time.strptime(date, '%d-%b-%Y %I:%M %p')

                    ds = time.strftime('%Y-%m-%d',new_date)
                    sp = Period.objects.filter(season__exact = season, date_from__lte = ds, date_to__gte = ds).get()

                    fixture.date= time.strftime('%Y-%m-%d %H:%M',new_date)
                    fixture.period = sp.number
                    fixture.week = data[9]

                elif ref != fixture.referee_team.code:
                    print code, "Ref different ", code, ref, fixture.referee_team.code, data[11], data[12].strip()
                    ixture.changestatus = "RS"
                    fixture.changenotes = "Referee Change"
                    fixture.referee_team_id = ref
                elif venue != fixture.venue.code:
                    print code, dt, "Venue different New:", venue, " Old:", fixture.venue.code
                    fixture.venue_id = venue
                else:
                    changed = False

                #elif data[11] == "CA":
                #    print code, "Unknown approved change", data[12].strip()
                #    fixture.changestatus = data[11].strip()
                #    fixture.changenotes = data[12].strip()

                #    print "**" , date, code, data[11], data[12]

                if do_update and changed:
                    print "Doing update"
                    fixture.save()



