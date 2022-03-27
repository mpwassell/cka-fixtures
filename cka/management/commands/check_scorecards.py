import time
from django.core.management.base import BaseCommand, CommandError

from cka.models import Player,Club, Fixture, Period
from cka.season import season
from cka.views.scorecard import scorecard_check_fixture_aux

class Command(BaseCommand):
    def handle(self, *args, **options):
        for f in Fixture.objects.filter( code__contains = season).exclude(playoff=True):
            if not f.division in ['1','2','3']:
                continue
            scorecard_check_fixture_aux(f.code)
