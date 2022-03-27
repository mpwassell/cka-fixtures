from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader

from django.shortcuts import render,redirect

from datetime import datetime

from cka.season import season


from cka.models import Club,Player,PlayerStatus,Period,Match,Fixture,StatusPoints

def all_players(request):

    players = set()

    for f in Fixture.objects.filter(season__exact=season).all():
        if f.division in ["1","2","3"]:
            for m in Match.objects.filter(fixture_code__exact=f.code).all():
                players.add("{},{},{},{}".format(m.player.name, m.player.sex,m.player.club.name, "Junior" if m.player.u18 else "Senior"))

    return render(request, "all_players.html", {"result": players})

def gametime(request):
    """
    Calculate and show player game time
    """

    data =[]
    for a_club in Club.objects.filter(cka = True,name__exact = "Phoenix"):

        players = dict()
        for a_player in Player.objects.filter(club_id = a_club.code, inactive__exact=False).order_by('name'):
            total = 0
            for a_match in Match.objects.filter(player_id = a_player.id):
                fixture = Fixture.objects.filter(code = a_match.fixture_code).get()
                if not fixture.division in ["1","2","3"]: continue
                if fixture.season != season: continue
                if(a_match.gametime): total += a_match.gametime
            players[ a_player.name ] = total

            data.append( {
                    "name"  : a_player.name,
                    "club"  : a_club.name,
                    "total": total })

        print (players)

    return render(request, "gametime.html", {"data":data})

def gametime2(request):
    """
    Calculate and show player game time
    """

    data =[]
    for a_club in Club.objects.filter(cka = True,name__exact = "Phoenix"):

        for a_player in Player.objects.filter(club_id = a_club.code, inactive__exact=False).order_by('name'):

            for period in range(4):
                teams = [0]*6
                for a_match in Match.objects.filter(player_id = a_player.id):
                    fixture = Fixture.objects.filter(code = a_match.fixture_code).get()
                    if fixture.season != season or (period != 0 and fixture.period != period): continue

                    if fixture.division == -1:
                        teams[0] += 1
                    else:
                        i = int(a_match.team.code[3])
                        teams[i+1] += 1

                data.append( {
                    "name"  : a_player.name,
                    "club"  : a_club.name,
                    "period": period,
                    "serl"  : teams[0],
                    "team1" : teams[1],
                    "team2" : teams[2],
                    "team3" : teams[3],
                    "team4" : teams[4],
                    "team5" : teams[5],
                    "total" : sum(teams)
                })


    return render(request, "gametime.html", {"data":data})

def status(request):
    '''
    Show player status page
    '''

    title=""
    data = []
    period_recs = Period.objects.filter(season__exact = season).all()
    periods = []
    periods_to_show = [0,1,2]
    print (period_recs)
    for p in period_recs:
        print (p.date_from)
        periods.append( (p.date_from.strftime("%Y-%m-%d"), p.date_to.strftime("%Y-%m-%d")))


    for a_club in Club.objects.filter(cka = True):
        print (a_club.name)

        for pi in periods_to_show:
            player_status = PlayerStatus.objects.filter(period = pi+1, player__club_id = a_club.code).order_by('-player__sex','status')
            for p in player_status:
                print (pi, a_club.name,p.player.name,p.status)

                if p.serl_status == 1:
                    team_long = "SERL + 1st Team" if p.cka_status == 1 else "SERL + 2nd Team" if p.cka_status == 2 else "SERL"
                else:
                    team_long = "1st Team" if p.cka_status == 1 else "2nd Team" if p.cka_status == 2 else "No Status"
                if p.tie:
                    team_long += ' - ' + p.tie


                data.append( { "club" : a_club.code,
                    "name" : p.player.name, "club_name":a_club.name,
                    "team": "FirstTeam" if p.status <= 2 else "SecondTeam" if p.status == 3 else "NoStatus",
                    "team_long"     :  team_long,
                    "period":p.period, "first_score":p.first_score, "second_score":p.second_score,
                    "serl_score" : p.serl_score, "serl_indicator" : p.serl_indicator,
                    "first_indicator":p.first_indicator,
                    "second_indicator": p.second_indicator,
                    "tie" : p.tie  })


    # Build data from PlayerStatus records but also enriched with club, text version of status values etc.

    template = loader.get_template('status.html')
    context = {
        'title' : title,
        'data': data,
        'from1' : periods[0][0],
        'to1' : periods[0][1],
        'from2' : periods[1][0],
        'to2' : periods[1][1],
        'from3' : periods[2][0],
        'to3' : periods[2][1],
        'show_period' : 3,
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")

    }
    return HttpResponse(template.render(context))

def recalculate_gametime(request):

    for a_fixture in Fixture.objects.filter(season = season):
        if not a_fixture.division in ["1","2","3"]: continue
        for a_match in Match.objects.filter(fixture_code = a_fixture.code):
            try:
                sp = StatusPoints.objects.filter(on_text_short__exact = a_match.on_court, off_text_short__exact=a_match.off_court).get()
                a_match.gametime = sp.second_team_pt / 4.0
                print (a_match.player.name, " " ,a_match.gametime, " ", a_match.on_court, " ", a_match.off_court)
                a_match.save()
            except StatusPoints.DoesNotExist:
                print ("DNE: " , a_fixture.code, " " , a_match.player.name, " " ,a_match.gametime, " ", a_match.on_court, " ", a_match.off_court)
                return

    return render(request, "message.html", {"message": "Done"})

def scores(request):
    return render(request, "message.html", {"message": "Function not implemented"})
