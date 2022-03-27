# Create your views here.

from datetime import datetime
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader

from django.shortcuts import render,redirect

from cka.models import Club,Team
from cka.models import Fixture,Match
from cka.season import season

def index(request):

    team_list = []
    clubs = Club.objects.filter( cka__exact = True).all()
    for a_club in clubs:
        print (a_club.name, a_club.code)
        teams = Team.objects.filter( cka__exact = True, club_id__exact = a_club.code).exclude( inactive__exact = True).all()

        for a_team in teams:
            if not a_team.level in [2,3]: continue

            check_status = [1,2] if a_team.level == 2 else [3]

            print ("  ",a_team.name)

            num_matches=0
            usage = 0.0
            for a_fixture in Fixture.objects.filter(season__exact = season, home_team_id__exact = a_team.code).all():
                num_matches += 1
                print ("     ", a_fixture.code)
                for a_player in Match.objects.filter( fixture_code__exact = a_fixture.code).all():
                    if a_player.status in check_status:
                        usage += len( a_player.count_code )/4.0

            for a_fixture in Fixture.objects.filter(season__exact = season, away_team_id__exact = a_team.code).all():
                num_matches += 1
                print ("     ", a_fixture.code)
                for a_player in Match.objects.filter( fixture_code__exact = a_fixture.code).all():
                    if a_player.status in check_status:
                        usage += len( a_player.count_code )/4.0


            team_list.append( { 'name' : a_team.name,
                                'num_matches' : num_matches, 'usage' : usage } )

    print (team_list)

    template = loader.get_template('status_usage.html')
    context = RequestContext(request, {
        'team_list': team_list,
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")
    })
    return HttpResponse(template.render(context))
