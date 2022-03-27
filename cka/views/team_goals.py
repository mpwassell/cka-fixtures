##
## This is the code for the 'goals across season' page (the one with the pies)
##

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

from os import listdir
from os.path import isfile, join
from django.db import connection

from cka.season import season

def index(request):

    template = loader.get_template('SeasonFrame.html')

    context = {
    }
    return HttpResponse(template.render(context))

def header(request):

    template = loader.get_template('SeasonHeader.html')

    context = {
    }
    return HttpResponse(template.render(context))

def index(request):

    template = loader.get_template('SeasonFrame.html')

    context = {
    }
    return HttpResponse(template.render(context))

def do_player(team_code,fixtures,players,p):

    # FIXME should use player statistics table?
    first=1
    goals=0
    penalties=0
    games=0
    for f in fixtures:

        try:
            m = Match.objects.filter( player_id = p.id, fixture_code = f.code, team_id = team_code).first()
            if m:
                playtime=  m.count_code
                status= "2" if m.status == 1 else "2" if m.status == 2 else "3" if m.status == 3 else "4"
                goal = str(m.goals)
                pen = str(m.penalties)
                goals += m.goals
                penalties += m.penalties
                games += len(m.count_code) * 0.25
            else:
                playtime= "0"
                status="4"
                goal = "0"
                pen = "0"
        except Match.DoesNotExist:
            playtime= "0"
            status="4"
            goal = "0"
            pen = "0"
        except  Match.MultipleObjectsReturned as e:
            print ("Multiple objects returned for {0} {1}". format(f.code, p.name))
            raise e

        if first:
            playlist = playtime
            goallist = goal
            statuslist=status
            penlist = pen
        else:
            playlist += ";" + playtime
            goallist += ";" + goal
            statuslist += ";" + status
            penlist += ";" + pen
        first=0

    #games_str = "%.2f" % games
    pp = { "name" : p.name, "statuslist" : statuslist, "playlist" : playlist, "num_matches" : len(fixtures),
            "goallist" : goallist, "penlist" : penlist, "goals":goals, "penalties":penalties, "games":games }
    print (pp)
    players.append(pp)


def team_stats(request, team_code):

    template = loader.get_template('season.html')

    t = Team.objects.filter(code = team_code).get()
    team_long_name = t.name
    team_compact_name = t.class_name

    fixtures = Fixture.objects.filter(season__exact = season,code__contains = team_code).order_by( 'date').all()

    fixtures_summary = []
    i = 1
    null_playlist=""
    statuslist_no_matches=""
    for  f in fixtures:
        hs = str(f.home_score) if f.home_score else ""
        ass = str(f.away_score) if f.away_score else ""
        sname = f.home_team.short_name if f.home_team_id != team_code else f.away_team.short_name
        fixtures_summary.append( { "text" : f.home_team.name + " " + hs + " - " + ass + " " + f.away_team.name + " (" + f.date.strftime("%d-%b-%Y %H:%M") + ") ", "index" : sname })
        i +=1
        statuslist_no_matches += ";4" if i > 2 else "4"

        null_playlist += ";0" if i > 2 else "0"

    num_matches = i-1

    #
    # Get all players who have played for this team. Split into male/female and sort by name
    #
    male = set()
    female = set()

    players = Match.objects.filter(team_id__exact = team_code, fixture_code__contains = season).all()

    for p in players:
        #print p.player_id

        if p.team_id == team_code:
            if p.player.sex == 'M':
                male.add( p.player )
            else:
                female.add(p.player)

    male=sorted(male,key=lambda x: x.name)
    female=sorted(female,key=lambda x: x.name)

    for p in male:
        print (p.name)
    for p in female:
        print (p.name)

    players = []
    for p in male:
        do_player(team_code,fixtures,players, p)
    for p in female:
        do_player(team_code,fixtures,players, p)


    if len(players) == 0:
        players.append( { "name" : "No Players Yet", "statuslist" : statuslist_no_matches, "num_matches" : num_matches, "playlist" : null_playlist, "goallist" : "", "penlist" : "", "goals":"", "penalties": "", "games": "" })

    print ("FIXTURES")
    print (fixtures_summary)

    context = {
        'colspan' : num_matches*3+4,
        'team_long_name' : team_long_name,
        'team_compact_name' : team_compact_name,
        'fixtures' : fixtures_summary,
        'players' : players,
        'last_update': datetime.now().strftime("%d-%b-%Y %H:%M")
    }
    return HttpResponse(template.render(context))

def ref_rating( request ):


    cursor = connection.cursor()
    sql = '''
select
    c.name club_name, t.short_name, date, f.code,
    case when t.code = f.home_team_id then
        ref_home_rating
    else
        ref_away_rating
    end  rating,
    r.description
from cka_fixture f, cka_team t, cka_club c, cka_ref_rating r
where
    season = '2013' and date_received is not null and
    c.code = t.club_id and
    (t.code = f.home_team_id or t.code = f.away_team_id) and f.division :: integer > 0 and
    r.score = ( case when t.code = f.home_team_id then
        ref_home_rating
    else
        ref_away_rating
    end)
order by c.name, t.name,date asc;
'''
    cursor.execute( sql)

    teams = []
    last_name = ""
    last_team_name=""
    for r in cursor.fetchall():
        clas = 'rating_bad' if r[4] > 0 and r[4] <= 3 else ''
        #name = r[0] if r[0] <> last_name else ""
        #team_name = r[1] if r[1] <> last_team_name else ""
        name = r[0]
        team_name = r[1]
        teams.append({ 'class':clas,'name' : name, 'team':team_name,'date':r[2],'fixture':r[3], 'rating':r[4], 'description':r[5] })

    do_pdf=1

    if do_pdf:
         return render_to_pdf(
            'cka/ref_rating.html',
            {
                'pagesize':'A4',
                'teams': teams,
            }
        )
    else:
        template = loader.get_template('cka/ref_rating.html')
        mess = 'OK'
        context = RequestContext( request, {
            'teams': teams
        })

    return HttpResponse(template.render(context))
