from django.core.management.base import BaseCommand

from cka.models import LeagueTable
from cka.season import season

class Command(BaseCommand):
    def handle(self, *args, **options):

        filename = r"D:\Mark\CKAWebSite\CKAServer\cka-fixtures\cka\data\divisions2021.csv"
        old_season = int(season)-1
        new_season = int(season)

        LeagueTable.objects.filter(season__exact=new_season).delete()
        seqno=1
        with open(filename,"r") as f:
            for line in f:

                data = line.split(",")

                print(data)
                div=int( data[0].strip() )
                tcode=data[1].strip()

                new_l = LeagueTable(id = new_season*100+div*10 + seqno, season=new_season, team_id= tcode, division= div, seqno=seqno)
                new_l.save()
                seqno += 1