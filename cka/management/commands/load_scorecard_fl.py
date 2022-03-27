##
## Load scorecard from fixtures live
##
import time,urllib2
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand

from cka.models import Player,Club, Fixture, Period, Team
from cka.season import season



class Command(BaseCommand):

    def add_arguments(self,parser):
        parser.add_argument('code', nargs='+', type=str)

    def handle(self,*args,**options):

        fixtures = Fixture.objects.filter(season__exact= '2015').all()

        #self.read_scorecard('BEA1VIK0_2015')
        #return

        for f in fixtures:
            if f.fixtures_live_id:
                print "**" + f.code
                self.read_scorecard_fl(f.code)
