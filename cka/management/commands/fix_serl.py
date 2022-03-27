##
## Fix SERL
##
import time
from django.core.management.base import NoArgsCommand

from cka.models import Player,Club, Fixture, Period,Match,Team
from cka.season import season

class Command(NoArgsCommand):

    def handle_noargs_old(self, **options):
        '''
        Update SERL fixtures with fixtures live ID
        '''

        filename = r"E:\Mark\CKAWebSite\Fixtures2015\serl.csv"

        with open(filename,"r") as f:
            for line in f:
                if line[:len("CompetitionID")] == "CompetitionID": continue

                data = line.split(",")
                fid = data[1]
                home_id = data[4]
                away_id = data[9]

                home_team = Team.objects.filter(fixtures_live__exact = home_id).all()[0]
                away_team = Team.objects.filter(fixtures_live__exact = away_id).all()[0]

                if home_team.club.cka or away_team.club.cka:

                    fixture_code = home_team.code + away_team.code + "_" + season

                    fixture = Fixture.objects.filter(code__exact = fixture_code).get()
                    if not fixture.fixtures_live_id:
                        print fixture_code, " ", fid
                        fixture.fixtures_live_id = fid
                        fixture.save()


    def handle_noargs(self, **options):
        '''
        Fix count_code information for players not in the starting lineup
        '''

        fixtures = Fixture.objects.filter(season__exact=season, division__exact="SERL").all()

        for f in fixtures:
            
            matches = Match.objects.filter(fixture_code__exact = f.code).all()

            for m in matches:
                if m.player_num > 7 and m.count_code == "1234":
                    print f.code, " ", m.player_num, " ",m.player.name
                    m.count_code="234"
                    m.save()


    def handle_noargs_old2(self, **options):
        '''
        fixtures = Fixture.objects.filter(season__exact=season, division__exact="SERL").all()

        for f in fixtures:
            
            matches = Match.objects.filter(fixture_code__exact = f.code).all()

            g = 0
            b = 0
            for m in matches:
                if m.player_num > 7:
                    continue
                if m.player.sex == 'F':
                        g +=1 
                if m.player.sex == "M":
                        b +=1
            if (g==0 and b==0) or (b==4 and g==4):
                continue
            print f.code, b, g
        '''
        fixtures = Fixture.objects.filter(season__exact=season, division__exact="SERL").all()

        for f in fixtures:
            plist1=[]
            plist2=[]
            matches = Match.objects.filter(fixture_code__exact = f.code).order_by("player_num").all()
            for m in matches:
                s = m.player.name.split(' ')[1]
                plist1.append( s )
                plist2.append( s )

            if plist1:
                plist1.sort()
                if len(plist1) > 8 and plist1 == plist2:

                    print f.code
                    print plist1, plist2