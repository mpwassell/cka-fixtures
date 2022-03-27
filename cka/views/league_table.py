
import operator
import time
from datetime import datetime
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import RequestContext, loader
from django.db.models import Q
from cka.models import Club
from cka.models import Player
from cka.models import PlayerStatus
from cka.models import Fixture
from cka.models import FixtureStaging
from cka.models import Team
from cka.models import Match
from cka.models import MatchStaging
from cka.models import LeagueTable
from cka.models import PlayerStatistics
from cka.models import StatusOverride

from cka.season import season
##
## From a fixture, update the league table for the two teams in the fixture
##
def updateLeagueTable( f ):

    # As per league rules and league tables from previous years, we do not count dev teams in any calculation.
    # However player statistics are recorded. See player_statistics.py
    if  f.home_team.dev_team or f.away_team.dev_team:
        return

    print (f.division)

    if f.division in ['NL', 'SERL'] or int(f.division) <= 0:
        return

    t1 = LeagueTable.objects.filter( team_id__exact = f.home_team_id, season__exact = season).get()
    t2 = LeagueTable.objects.filter( team_id__exact = f.away_team_id, season__exact = season).get()

    t1.home_goals_for += f.home_score
    t1.home_goals_aga += f.away_score
    t2.away_goals_for += f.away_score
    t2.away_goals_aga += f.home_score

    if f.home_score == f.away_score:
        t1.home_drawn += 1
        t2.away_drawn += 1
    elif f.home_score > f.away_score:
        t1.home_won += 1
        t2.away_lost += 1
    else:
        t1.home_lost += 1
        t2.away_won += 1

    t1.played += 1
    t2.played += 1

    t1.goal_diff = (t1.home_goals_for + t1.away_goals_for) -  (t1.home_goals_aga + t1.away_goals_aga)
    t2.goal_diff = (t2.home_goals_for + t2.away_goals_for) -  (t2.home_goals_aga + t2.away_goals_aga)

    t1.score = (t1.home_won + t1.away_won)*2 + (t1.home_drawn + t1.away_drawn)
    t2.score = (t2.home_won + t2.away_won)*2 + (t2.home_drawn + t2.away_drawn)

    t1.save()
    t2.save()


##
## Reset the counts in a league table row back to zero
##
def resetLeagueRow(t):

    t.played=0
    t.home_goals_for = 0
    t.home_goals_aga = 0
    t.away_goals_for = 0
    t.away_goals_aga = 0
    t.home_drawn = 0
    t.away_drawn = 0
    t.home_won = 0
    t.away_lost = 0
    t.home_lost = 0
    t.away_won = 0
    t.goal_diff = 0
    t.score = 0
    t.save()

##
## Reset the whole league table
##
def resetLeagueTable():

    rows = LeagueTable.objects.filter(season__exact = season).all()

    for r in rows:
        resetLeagueRow(r)

##
## Reset and reapply the results to the table
##
def redo_league_tables( request ):

    resetLeagueTable()

    fixtures = Fixture.objects.filter( season__exact = season).all()

    for f in fixtures:
        if f.playoff:
            continue
        if f.home_score != None and f.division != '-1' and f.division != '-2':
            updateLeagueTable( f )

    template = loader.get_template('message.html')
    mess = 'League Tables recalculated'
    context = { 'message': mess }

    return HttpResponse( template.render(context))
