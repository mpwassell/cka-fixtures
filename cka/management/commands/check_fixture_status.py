##
## Check status for matches
##
from django.core.management.base import NoArgsCommand
from cka.season import season
from cka.models import Fixture,Match
from cka.views.scorecard import is_match_status_valid

class Command(NoArgsCommand):
    def handle_noargs(self, **options):

        fl = Fixture.objects.filter(season__exact = season).filter(date_received__isnull=False).order_by('code').all()

        bad_matches = []

        for f in fl:
            v = is_match_status_valid(f,Match)
            if not v:
                bad_matches.append(f.code)

        print bad_matches
           
