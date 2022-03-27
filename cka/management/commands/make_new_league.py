'''
Copy across league tables from previous season into this season
'''

from django.core.management.base import BaseCommand, CommandError

from cka.models import LeagueTable
from cka.season import season

class Command(BaseCommand):
    def handle(self, *args, **options):

        old_season = int(season)-1
        new_season = int(season)

        for d in range(1,4):
            print (d)
            league_table = LeagueTable.objects.filter( division__exact=d, season__exact = old_season).order_by( 'seqno' )

            for l in league_table:
                print (l.team.name)
                new_l = LeagueTable(id = new_season*100+d*10 + l.seqno, season=new_season, team_id=l.team.code, division=d, seqno=l.seqno)
                new_l.save()
