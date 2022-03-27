import operator
import time
from decimal import *
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
## Clear and recalculate player statistics
##
def redo_player_statistics(request):

    matches = Match.objects.filter( fixture_code__contains = season).all()

    stats = PlayerStatistics.objects.all()
    for s in stats:
        s.delete()

    updatePlayerStatistics( matches )

    template = loader.get_template('message.html')
    mess = 'Player Statistics Updated'
    context = {
            'message': mess
    }

    return HttpResponse( template.render(context))

##
## Update player statistics from list of match results
##
def updatePlayerStatistics( matches ):

    for m in matches:

        #if m.fixture.playoff:
        #    continue

        if m.player == None:
            continue
        #print ("Update statistics for {} goals={} code={}".format( m.player.name, m.goals, m.count_code ))

        try:
            league = LeagueTable.objects.filter(team_id = m.team_id, season__exact=season).get()
            div = league.division
        except LeagueTable.DoesNotExist:  # A SERL team
            print ("Team is ", m.team)
            if m.team.code == "TIGNL":
                div = "NL"
            else:
                div = "SERL"

        try:
            ps = PlayerStatistics.objects.filter( player_id__exact = m.player_id, season__exact = season, team_id = m.team_id).get()
        except PlayerStatistics.DoesNotExist:
            ps = PlayerStatistics( player_id = m.player_id, team_id = m.team_id, division = div, season=season,
                first_team = m.team.first_team)

        #ps.games += 1
        #ps.games += Decimal( len(m.count_code) * 0.25)
        ps.games += len(m.count_code) * 0.25
        ps.goals += m.goals
        ps.penalties += m.penalties
        ps.total = ps.goals + ps.penalties
        ps.goal_avg = round(ps.total*1.0 / float(ps.games), 2)

        ps.save()
