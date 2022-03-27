from datetime import datetime
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader

from django.shortcuts import render,redirect

from cka.models import Team
from cka.models import Fixture
from cka.models import LeagueTable
from cka.models import PlayerStatistics

from cka.season import season, season_full

def index(request, division):
##
## This is the division results matrix and standings table
##
#
    league_table = LeagueTable.objects.filter( division__exact=division, season__exact = season).order_by( 'seqno' )

    team_list = []
    for t in league_table.all():
        team_list.append( t.team )

    #team_list =   Team.objects.filter(division__exact=division).order_by('dev_team')

    #
    # Unfortunately Django's template language is deliberately lacking in expressiveness (MVC and all that)
    # so we have to build the JavaScript blocks we need here
    #
    row_list = []
    for t_home in team_list:

        print (t_home.code)

        s = "document.write(PaintFixtureTeamName('{0}','{1}','false'));".format( t_home.class_name, t_home.short_name)
        for t_away in team_list:
            print (t_away.code)

            if t_home.code == t_away.code:
                s += " document.write(PaintFixtureBlank());\n"
            else:
                #print "{} {} {} {}".format( t_home.code, t_away.code, division, season)
                result = Fixture.objects.filter(division__exact=division, home_team__exact = t_home.code,
                         away_team__exact = t_away.code, season__exact= season)
                if len(result) > 0:
                    result = result[0]
                    if result.cancelled:
                        hs = "Cancelled"
                        aws = ""
                    else:
                        hs = "" if result.home_score == None else result.home_score
                        aws = "" if result.away_score == None else result.away_score
                    print ("<{0}>".format(hs))
                    s += "document.write(PaintFixture('{0}','{1}','{2}','{3}','{4}','{5}'));\n".format( result.date_text(),
                        result.time_text(), hs, aws, result.code,result.referee_team.short_name)
                else:
                    s += " document.write(PaintFixture('-','','','','-','-'));\n"
        row_list.append( s )

    league_table = LeagueTable.objects.filter( division__exact=division, season__exact = season).order_by( 'dev_team','-score', '-goal_diff' )
    for i in league_table:
        print (i.dev_team, i.score)

    template = loader.get_template('results.html')
    context = {
        'season_start' : season,
        'season_end' : str( int(season)+1),
        'division' : division,
        'team_list': team_list,
        'row_list' : row_list,
        'league_table' : league_table,
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")
    }
    return HttpResponse(template.render(context))


def scorers(request,division):

    players = PlayerStatistics.objects.filter(division__exact=division, season__exact = season).order_by('-total')

    division_text = 'SERL' if division == '-1' else division

    league_table = LeagueTable.objects.filter( division__exact=division, season__exact = season).order_by( 'seqno' )

    team_list = []
    for t in league_table.all():
        team_list.append( t.team )

    if division == "NL":
        t = Team.objects.filter(code='TIGNL').get()
        team_list.append( t )
    elif division == "SERL":
        t = Team.objects.filter(code='TIG0').get()
        team_list.append( t )
        t = Team.objects.filter(code='CIT0').get()
        team_list.append( t )

    print (team_list)

    template = loader.get_template('goals.html')
    context = {
        'players': players,
        'division' : division_text,
        'teams' : team_list,
        'season_full' : season_full,
        'last_update' :  datetime.now().strftime("%d-%b-%Y %H:%M")
    }
    return HttpResponse(template.render(context))
