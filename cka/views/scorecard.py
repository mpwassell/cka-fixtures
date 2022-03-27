import os,fnmatch
from datetime import datetime,date
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.core.mail import send_mail,EmailMessage,EmailMultiAlternatives
from django.db.models import Q
from django.shortcuts import render,redirect
from django.forms.widgets import to_current_timezone
from django.core import serializers
from django.views.decorators.csrf import csrf_protect
import json
import urllib.request

from cka.models import Match
from cka.models import Fixture
from cka.models import Team
from cka.models import Club
from cka.models import Player
from cka.models import FixtureStaging
from cka.models import MatchStaging
from cka.models import Period
from cka.models import PlayerStatus
from cka.models import NamedPlayerDoesNotExist
from cka.models import StatusPoints

from cka.season import season

from cka.views.league_table import updateLeagueTable
from cka.views.player_statistics import updatePlayerStatistics
from cka.views.scorecardxml import processResultsXMLHelper

from cka.config import  upload_dir

# For email
import smtplib
from email.mime.text import MIMEText

from . import scorecardxml

new_xml = True

import logging
logger = logging.getLogger(__name__)

def index(request,fixture_code,show_hidden=False):
    """ Shows  readonly scorecard for a fixture either the approved one or the unapproved if one has been submitted """
    fixture = Fixture.objects.filter(code__exact= fixture_code).first()

    if 'json' in request.GET:
        template_data = get_template_data(fixture_code, Match, Fixture)
        data = json.dumps(template_data)
        return HttpResponse(data, mimetype='application/json')

    # FIXME Need a better away of determining if match has been played
    if fixture.home_score or fixture.away_score:
        return scorecard_display_helper(request,fixture_code, Match,Fixture,show_hidden)
    else:
        return scorecard_display_helper(request,fixture_code, MatchStaging,FixtureStaging,show_hidden)

def fixtures_approve(request):
    """
    Display the list of pending scorecards that we can edit or approve
    """
    print("FIX")

    fixture_list_staging =   FixtureStaging.objects.filter( code__contains = season ).order_by('date', 'division','code').all()

    fixture_list  =[]

    for staged_fixture in fixture_list_staging:
        f = Fixture.objects.filter(code__exact = staged_fixture.code).get()
        status_valid = staged_fixture.status_valid
        player_valid = staged_fixture.player_valid
        check_ok = check_scorecard_helper(f, MatchStaging)
        if not f.home_score:
            fixture_list.append( {
            'code' : f.code,
            'date' : f.date,
            'time' : f.time_text,
            'division' : f.division_text,
            'home_team' : f.home_team.short_name,
            'away_team' : f.away_team.short_name,
            'referee_team' : "" if not f.referee_team else f.referee_team.short_name,
            'venue' : "" if not f.venue else f.venue.name,
            'score' : str(f.home_score_text) + '-' + str(f.away_score_text),
            'changenotes' : f.changenotes,
            'home_score_text' : f.home_score_text,
            'has_xml_file' : find_xml_file_remote(f.code),
            'has_staging' : True,
            'status_valid' : status_valid,
            'player_valid' : player_valid,
            'check_ok'     : check_ok,
            'ref_home_rating' : f.ref_home_rating,
            'ref_away_rating' : f.ref_away_rating,
            'can_approve' : player_valid == 'T'
            })
            print (f.ref_home_rating)

    template = loader.get_template('scorecard_fixtures.html')
    context = {
        'fixture_list': fixture_list,
        'num_staging' : len( fixture_list_staging),
        'season' : season,
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")
    }
    return HttpResponse(template.render(context))

def clear_staging(request):
    try:
        fixture_s = FixtureStaging.objects.all()
        fixture_s.delete()

        match_s = MatchStaging.objects.all()
        for m in match_s:
            m.delete()
    except:
        pass

    return render(request, "message.html", {"message": "Staging cleared"})

def fixtures(request):
    """
    Display a list of fixtures that we can submit scorecards for.
    """

    fixture_list_staging =   FixtureStaging.objects.filter( code__contains = season ).all()

    fixture_list =   Fixture.objects.filter( code__contains = season, home_score__exact = None, date__lte=date.today() ).order_by('date', 'division','code').all()

    fixture_list_toload = []
    for f in fixture_list:
        print ("Fixture {}".format(f.code))
        try:
            fixture_s = FixtureStaging.objects.filter( code__exact = f.code).get()
            status_valid = fixture_s.status_valid
            player_valid = fixture_s.player_valid
            check_ok = check_scorecard_helper(fixture_s, MatchStaging)
            ref_home = fixture_s.ref_home_rating
            ref_away = fixture_s.ref_away_rating
            private_notes = fixture_s.private_notes
            has_staging=True
        except:
            has_staging=False
            status_valid = f.status_valid
            player_valid = f.player_valid
            ref_home = f.ref_home_rating
            ref_away = f.ref_away_rating
            check_ok = []
            private_notes = f.private_notes

        fixture_list_toload.append( {
            'code' : f.code,
            'date' : f.date,
            'time' : f.time_text,
            'division' : f.division_text,
            'home_team' : f.home_team.short_name,
            'away_team' : f.away_team.short_name,
            'referee_team' : "" if not f.referee_team else f.referee_team.short_name,
            'venue' : "" if not f.venue else f.venue.name,
            'score' : str(f.home_score_text) + '-' + str(f.away_score_text),
            'changenotes' : f.changenotes,
            'home_score_text' : f.home_score_text,
            'has_xml_file' : find_xml_file_remote(f.code),
            'has_staging' : has_staging,
            'status_valid' : status_valid,
            'status_valid_style' : "background:red;color:white" if status_valid == 'F' else "",
            'player_valid' : player_valid,
            'check_ok' : check_ok,
            'player_valid_style' : "background:red;color:white" if status_valid == 'F' else "",
            'ref_home_rating' : ref_home,
            'ref_away_rating' : ref_away,
            'ref_home_rating_style' : "background:red;color:white" if ref_home <= 3 and ref_home > 0 else "",
            'ref_away_rating_style' : "background:red;color:white" if ref_away <= 3 and ref_away > 0 else "",
            'can_approve' : player_valid == 'T',
            'can_load_from_fl' : f.division in ['SERL','NL'] and f.fixtures_live_id,
            'private_notes' : private_notes
            })




    template = loader.get_template('scorecard_fixtures.html')
    context = {
        'fixture_list': fixture_list_toload,
        'num_staging' : len(fixture_list_staging),
        'season' : season,
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")
    }
    return HttpResponse(template.render(context))


class MatchPlayer:
    pass

@csrf_protect
def formxml(request,fixture_code):

    template = loader.get_template('scorecardentryxml.html')

    context =  {
        'fixture_code' : fixture_code
    }

    return HttpResponse(template.render(context))


def form(request,fixture_code):
    """
    Present form for submitting or editing score card
    """

    fixture = Fixture.objects.filter(code__exact= fixture_code).first()

    template = loader.get_template('scorecardedit.html')

    template_data = get_template_data(fixture_code, MatchStaging, FixtureStaging)

    home_team = fixture.home_team
    home_players = Player.objects.filter(club__exact = home_team.club, inactive__exact = False).order_by('name').all()

    away_team = fixture.away_team
    away_players = Player.objects.filter(club__exact = away_team.club, inactive__exact = False).order_by('name').all()

    ref_players = Player.objects.filter(inactive__exact = False).order_by('name').all()

    template_data['home_players'] = home_players
    template_data['away_players'] = away_players
    template_data['ref_players'] = ref_players

    template_data['referer'] = request.META.get('HTTP_REFERER')

    template_data['teams'] = []

    context = RequestContext(request, template_data )

    context_dict = context.flatten()
    return HttpResponse(template.render(context_dict))


def formentry(request,fixture_code):
    """ Present form for entry"""

    template = loader.get_template('scorecardentry.html')
    context = RequestContext(request, { "fixture_code" : fixture_code } )
    return HttpResponse(template.render(context))

def check_gender_subs( code, homeTeam, matchClass):

    print("Checking {}".format(code))

    problems = []

    players = matchClass.objects.filter(fixture_code__exact = code, home_team=homeTeam)
    players_list = []

    for p in players:
        players_list.append(p)

    for p in players:
        if p.player_num > 7:
            if p.sub_for_player is None:
                problems.append("Missing sub_for_player for '{}'".format(p.player.name))
            else:
                pfor = players_list[p.sub_for_player - 1]
                if p.player and p.player.sex != pfor.player.sex:
                    problems.append("Mismatch gender '{}'' '{}'".format( p.player.name, pfor.player.name ))
    return problems

def check_scorecard_helper( fixture, matchClass ):

    problems = []

    if fixture.home_score is None:
        problems.append("No home score")
    if fixture.home_score_halftime is None:
        problems.append("No home halftime score")
    if fixture.away_score is None:
        problems.append("No away score")
    if fixture.away_score_halftime is None:
        problems.append("No away halftime score")

    if fixture.home_score and fixture.home_score_halftime and fixture.home_score_halftime > fixture.home_score:
        problems.append("Home half-time score more than full time score")

    if fixture.away_score and fixture.away_score_halftime and fixture.away_score_halftime > fixture.away_score:
        problems.append("Away half-time score more than full time score")

    # Check that the gender of swapping players is correct
    p = check_gender_subs( fixture.code, True, matchClass)
    if p != []: problems.append(p)
    p = check_gender_subs( fixture.code, False, matchClass)
    if p != []: problems.append(p)

    return problems

def check(request, fixture_code):
    """ Check a scorecard in staging for completeness and self-consistency """

    messages = check_scorecard(fixture_code)

def check_scorecard(fixture_code):

    fixture = FixtureStaging.objects.filter( code__exact = fixture_code ) .get()

    check_scorecard_helper(fixture, MatchStaging)


def check_scorecards_helper(request,fixtureClass):

    flist = fixtureClass.objects.filter(season__exact = season).all()
    all_messages = []
    for f in flist:
        if f.home_score is  None: continue
        if f.division in ["SERL", "NL"]: continue
        mess = check_scorecard_helper(f, Match)
        if mess != []:
            all_messages.append( (f.code, f.period, mess) )

    template = loader.get_template('ref_rating.html')

    context =  {
            'result': all_messages
    }
    return HttpResponse(template.render(context))

def check_scorecards(request):
    """
    Check all scorecards for this season and present a report
    """

    return check_scorecards_helper(request,Fixture)

def check_scorecards_pending(request):
    return check_scorecards_helper(request,FixtureStaging)

def recalculate_status_valid(request):

    played_fixtures =   Fixture.objects.filter( code__contains = season).exclude( home_score__isnull = True).order_by('date', 'division','code').all()

    invalid = []
    invalid_string = []

    for fixture in played_fixtures:
        is_valid = is_match_status_valid(fixture,Match)
        fixture.status_valid = is_valid
        fixture.save()
        if is_valid != 'T':
            invalid.append(fixture)
            invalid_string.append( { "code": fixture.code, "flag" : is_valid })

    return render(request, "simple_table.html", {"data": invalid_string})


def is_match_status_valid( fixture, matchClass ):

    if fixture.home_team.dev_team or fixture.away_team.dev_team: return 'T'

    home_players = matchClass.objects.filter(fixture_code__exact = fixture.code, home_team__exact = True).all()
    away_players = matchClass.objects.filter(fixture_code__exact = fixture.code, home_team__exact = False).all()

    home = is_team_valid(fixture,fixture.home_team, home_players)
    away = is_team_valid(fixture,fixture.away_team, away_players)

    print ("Validity: ", home,away)
    if home == 'T' and away == 'T': return 'T'
    if home == 'F' or away == 'F': return 'F'
    return 'M'


def is_team_valid(fixture, team, players):


    if fixture.division in ['SERL', 'NL' ] or team.level <= 1: return 'T'

    print ("is_team_valid ", team.name, " ", team.level)

    t1_count =0
    t2_count=0

    for p in players:
        if p.status == 1 or p.status == 2:
            t1_count += 1
        elif p.status == 3:
            t2_count += 1

    print (fixture.code, " ", t1_count, " ", t2_count)

    # If there are subs and more than the required number of players we flag
    # this is a 'Maybe'
    if team.level == 2:
        if t1_count <= 2: return 'T'
        if len(players) <= 8: return 'F'
        return 'M'
    elif team.level == 3:
        if t1_count > 0: return 'F'
        if t1_count == 0 or t2_count <= 2: return 'T'
        if len(players) <= 8: return 'F'
        return 'M'
    else:
        if t1_count == 0 and t2_count == 0:
            return 'T'
        else:
            return 'F'

    return 'T'


def approve(request,fixture_code):
    """
    Approve a scorecard. This copies information from the staging tables into the main tables
    as well as updating player statistics and the appropriate league table.
    """

    template = loader.get_template('message.html')
    mess = 'OK Approved'
    context = RequestContext( request, {
            'message': mess
    })

    # Copy to Fixture
    f = FixtureStaging.objects.filter( code__exact = fixture_code ) .get()
    f_actual = Fixture.objects.filter( code__exact = fixture_code ) .get()
    f_actual.home_score = f.home_score
    f_actual.away_score = f.away_score

    f_actual.home_captain_id = f.home_captain_id
    f_actual.away_captain_id = f.away_captain_id
    f_actual.referee_id = f.referee_id

    f_actual.home_score_halftime = f.home_score_halftime
    f_actual.away_score_halftime = f.away_score_halftime
    f_actual.notes = f.notes
    f_actual.private_notes = f.private_notes
    f_actual.notes_by = f.notes_by
    f_actual.date_received = f.date_received
    # ENH Add date approved
    f_actual.by_hand = f.by_hand

    f_actual.match_result = f.match_result
    f_actual.ref_home_rating = f.ref_home_rating
    f_actual.ref_away_rating = f.ref_away_rating

    f_actual.save()

    players = MatchStaging.objects.filter( fixture_code__exact = fixture_code).all()

    for p in players:
        print (p.player.name)

        match_actual = Match(fixture_code = p.fixture_code, player_num = p.player_num, home_team =p.home_team, team_id = p.team_id,
            goals = p.goals, penalties = p.penalties, yellow_card = p.yellow_card, red_card = p.red_card, sub_for_player = p.sub_for_player,
            sub_at = p.sub_at, count_code = p.count_code, u18 = p.u18, player_id = p.player_id,status = p.status,
            status_points = p.status_points, on_court = p.on_court, off_court = p.off_court, gametime=p.gametime)

        match_actual.save()

    # We don't update league table if either is a dev team
    if f.away_team.dev_team or f.home_team.dev_team:
        updatePlayerStatistics( players )
        context_dict = context.flatten()
        return HttpResponse( template.render(context_dict))

    if not f_actual.playoff:
        # Update league and player stats
        print ("{0} {1}".format(f_actual.code, f_actual.division))
        if f_actual.division != '-1' and f_actual.division != '-2':
            updateLeagueTable( f )
        updatePlayerStatistics( players )

    return HttpResponseRedirect("/cka/scorecard/approve")

def revert(request,fixture_code):
    """
    Revert the  scorecard. NB This will not recalculate/reset player and league statistics
    """

    fixture = Fixture.objects.filter(code__exact = fixture_code).get()
    fixture.home_score= None
    fixture.away_score= None
    fixture.save()

    matches = Match.objects.filter(fixture_code__exact = fixture_code).all()
    for m in matches:
        m.delete()

    return render(request, "message.html", {"message": "Scorecard reverted"})



def scorecard_display_pending(request,fixture_code):

    return scorecard_display_helper(request,fixture_code, MatchStaging,FixtureStaging,False)

def scorecard_display_helper(request, fixture_code, matchClass, fixtureClass,show_hidden):
    """
    Display a scorecard as readonly - either approved or pending depending on the class arguments
    passed through
    """

    template = loader.get_template('scorecard.html')

    template_data = get_template_data(fixture_code, matchClass, fixtureClass,show_hidden)

    context = template_data
    return HttpResponse(template.render(context))


def get_template_data(fixture_code, matchClass, fixtureClass,show_hidden=False):
    """
    Provides data both for display of blank score card form, editable scorecard and display of non-editable score card
    """

    # Fixme - exception if no fixture with this code
    fixture_scheduled = Fixture.objects.filter( code__exact= fixture_code).get()

    try:
        fixture = fixtureClass.objects.filter(code__exact= fixture_code).get()
    except fixtureClass.DoesNotExist:
        fixture = None

    rows = []
    is_valid=True

    #home_players = matchClass.objects.filter( fixture_code__exact = fixture_code, team_id__exact = fixture.home_team.code ).order_by('player_num')
    #away_players = matchClass.objects.filter( fixture_code__exact = fixture_code, team_id__exact = fixture.away_team.code ).order_by('player_num')

    print (fixture_code, " ", fixture_scheduled.home_team.code)

    for i in range(8):

        try:
            home_player = matchClass.objects.filter( fixture_code__exact = fixture_code, team_id__exact = fixture_scheduled.home_team.code, player_num__exact = i).get()
        except matchClass.DoesNotExist:
            home_player = None

        print ("Home player", home_player)

        try:
            away_player = matchClass.objects.filter( fixture_code__exact = fixture_code, team_id__exact = fixture_scheduled.away_team.code, player_num__exact = i).get()
        except matchClass.DoesNotExist:
            away_player = None

        if away_player == None:
            print (i)

        print (away_player)

        hps = 'White'
        aps = 'White'

        o = {
            "player" : i+1,
            "home_name"      : "",
            "home_goals"     : "",
            "home_penalties" : "",
            "home_status"    : "",
            "away_name"      : "",
            "away_goals"     : "",
            "away_penalties" : "",
            "away_status"    : ""
        }

        if home_player != None:
            #FIXME This needs to be encapsulated elsewhere
            hps = "Gold" if home_player.status in [1,2] else "YellowGreen" if home_player.status == 3 else "White"

            # Allows for case in staging where we don't have a record for player
            if home_player.player_id == 0:
                o['home_name']      = home_player.player_name + " *" # + ( " (U18)" if home_player.u18 else "")
                is_valid=False
            else:
                o['home_name']      = home_player.player.name # + ( " (U18)" if home_player.u18 else "")
            o['home_goals']     = bz( home_player.goals )
            o['home_penalties'] = bz( home_player.penalties )
            o['home_status']    = hps
            o["home_u18"]       = 'true' if home_player.u18  else 'false'

            if show_hidden:
                o["home_extra_info"] = 'U18 ' if home_player.u18  else ''
                o["home_extra_info"] += home_player.on_court + "-" + home_player.off_court + " " + str(home_player.status_points)
                o["home_extra_info"]  = " (" +  o["home_extra_info"]  + ")"
        else:
            o["home_u18"]       = 'false'

        if away_player != None:
            aps = "Gold" if away_player.status in [1,2] else "YellowGreen" if away_player.status == 3 else "White"
            if away_player.player_id == 0:
                o["away_name"]      = away_player.player_name + " *" # + ( " (U18)" if away_player.u18 else "")
                is_valid=False
            else:
                o["away_name"]      = away_player.player.name # + ( " (U18)" if away_player.u18 else "")
            o["away_goals"]     = bz( away_player.goals )
            o["away_penalties"] = bz( away_player.penalties )
            o["away_status"]    = aps
            o["away_u18"]       = 'true' if away_player.u18  else 'false'

            if show_hidden:
                o["away_extra_info"] = 'U18 ' if away_player.u18  else ''
                o["away_extra_info"] +=  away_player.on_court + "-" + away_player.off_court + " " + str(away_player.status_points)
                o["away_extra_info"]  = " (" +  o["away_extra_info"]  + ")"
        else:
            o["away_u18"]       = 'false'

        rows.append( o )

    sub_rows = []

    # Allow the case where there are more than 4 subs but if there are less than four, print blank lines up to four.
    for i in range(10):
        try:
            home_player = matchClass.objects.filter( fixture_code__exact = fixture_code, team_id__exact = fixture_scheduled.home_team.code,
                player_num__exact = i+8).get()
        except matchClass.DoesNotExist:
            home_player = None

        try:
            away_player = matchClass.objects.filter( fixture_code__exact = fixture_code, team_id__exact = fixture_scheduled.away_team.code,
                player_num__exact = i+8).get()
        except matchClass.DoesNotExist:
            away_player = None

        if i >= 4 and away_player == None and home_player == None: break

        hps = "White"
        aps = "White"
        if home_player != None:
            if home_player.player_id == None:
                hn = "n/a"
            elif home_player.player_id == 0:
                hn = home_player.player_name + " *"
                is_valid=False
            else:
                hn = home_player.player.name  # + ( " (U18)" if home_players[i+8].u18 else "")
            hg = bz(home_player.goals)
            hp = bz(home_player.penalties)
            hf = str(bz(home_player.sub_for_player)) # TODO Removed # but should keep on  readonly form
            ha = bz(home_player.sub_at)
            hu = 'true' if home_player.u18  else 'false'
            hps = "Gold" if home_player.status in [1,2] else "YellowGreen" if home_player.status == 3 else "White"
            h_extra=""
            if show_hidden:
                h_extra = 'U18 ' if home_player.u18  else ''
                h_extra +=  home_player.on_court + "-" + home_player.off_court + " " + str(home_player.status_points)
                h_extra = " (" +  h_extra  + ")"
        else:
            hn = ""
            hg = ""
            hp = ""
            hf = ""
            ha = "&nbsp;"
            hu = 'false'
            h_extra=""

        if away_player != None:
            if away_player.player_id == 0:
                an = away_player.player_name + " *"
                is_valid=False
            else:
                an = away_player.player.name  # + ( " (U18)" if away_players[i+8].u18 else "")
            ag = bz(away_player.goals)
            ap = bz(away_player.penalties)
            af = str(bz(away_player.sub_for_player))
            aa = bz(away_player.sub_at)
            au = 'true' if away_player.u18  else 'false'
            aps = "Gold" if away_player.status in [1,2] else "YellowGreen" if away_player.status == 3 else "White"
            a_extra=""
            if show_hidden:
                a_extra = 'U18 ' if away_player.u18  else ''
                a_extra += away_player.on_court + "-" + away_player.off_court + " " + str(away_player.status_points)
                a_extra = " (" +  a_extra  + ")"
        else:
            an = ""
            ag = ""
            ap = ""
            af = ""
            aa = ""
            au = 'false'
            a_extra=""

        o = {
            "player" : i+1+8,
            "home_name"      : hn,
            "home_goals"     : hg,
            "home_penalties" : hp,
            "home_for"       : hf,
            "home_at"        : ha,
            "home_u18"       : hu,
            "home_status"    : hps,
            "home_extra_info" : h_extra,

            "away_name"      : an,
            "away_goals"     : ag,
            "away_penalties" : ap,
            "away_for"       : af,
            "away_at"        : aa,
            "away_u18"       : au,
            "away_status"    : aps,
            "away_extra_info" : a_extra
        }
        sub_rows.append( o )

    template_fixture = {
        'code'      : fixture_scheduled.code,
        'date'      : str(fixture_scheduled.date),
        'division'  : fixture_scheduled.division,
        'home_team' : { 'short_name' : fixture_scheduled.home_team.short_name, 'code' : fixture_scheduled.home_team.code },
        'away_team' : { 'short_name' : fixture_scheduled.away_team.short_name, 'code' : fixture_scheduled.away_team.code },
        'is_valid'  : is_valid
    }

    fs = fixture if fixture else fixture_scheduled

    template_fixture['home_score'] = bz(fs.home_score)
    template_fixture['away_score'] = bz(fs.away_score)
    template_fixture['home_score_halftime'] = bz(fs.home_score_halftime)
    template_fixture['away_score_halftime'] = bz(fs.away_score_halftime)
    template_fixture['ref_home_rating'] = fs.ref_home_rating
    template_fixture['ref_away_rating'] = fs.ref_away_rating
    template_fixture['notes'] = fs.notes.replace("\n","").replace("\r","") if fs.notes else ""
    template_fixture['home_captain'] = { 'name' : fs.home_captain.name if fs.home_captain else "" }
    template_fixture['away_captain'] = { 'name' : fs.away_captain.name if fs.away_captain else "" }
    template_fixture['referee'] = { 'name' : fs.referee.name if fs.referee else "" }
    template_fixture['referee_team'] = { 'name' : fs.referee_team.name if fs.referee_team else "" }
    template_fixture['notes_by'] = fs.notes_by if fs.notes_by else ""

    #print "NOTES"
    #print fs.notes.replace("\n","")
    #print template_fixture['notes']

    ratings = [ "EXEMPLARY - attitude and sportsmanship was exemplary",
                "VERY GOOD - Attitude and sportsmanship was very good",
                "GOOD - Attitude and sportsmanship was good",
                "OK - Attitude and sportsmanship was ok",
                "POOR - A few incidents of poor attitude or bad sportsmanship",
                "VERY POOR - There were several incidents of poor attitude and bad sportsmanship",
                "UNACCEPTABLE - The attitude and sportsmanship was at an unacceptably bad level"]

    hr = fs.ref_home_rating if fs.ref_home_rating else 1
    ar = fs.ref_away_rating if fs.ref_away_rating else 1
    template_fixture['ref_home_rating_text'] = ratings[ 7 - hr ]
    template_fixture['ref_away_rating_text'] = ratings[ 7 - ar ]

    if show_hidden:
        template_fixture['home_rating'] =  " (" + template_fixture['ref_home_rating_text'] + ")"
        template_fixture['away_rating'] = " (" + template_fixture['ref_away_rating_text'] + ")"

    print (rows)

    return {
        'fixture': template_fixture,
        'fixture_time' :  { "date" : to_current_timezone(fixture_scheduled.date).strftime("%a %d %b %Y"),
                            "time" : to_current_timezone(fixture_scheduled.date).strftime("%H:%M") },
        'rows' : rows,
        'sub_rows': sub_rows
    }



class ScoreCard:
    pass

class ScoreCardPlayer:
    pass


def postxml(request,fixture_code):
    """
    Handle POST containing XML of scorecard

    To test locally:
       Start papercut (if on windows/machine with no smtp server)
       wget http://localhost:8000/cka/scorecard/postxml/PHO1PHO3_2018
    """

    if 'txtXML' in request.POST:
        xml = request.POST['txtXML']
    else:
        xml=""

    xml_upload_dir = upload_dir + "tst"

    # Save to file
    xml_filename = os.path.join(xml_upload_dir, fixture_code + ".xml")
    with open(xml_filename, "w") as xml_file:
        xml_file.write(xml)

    # Email out. Requires access to real SMTP server, which I don't have, and email out is
    # not really necessary.
    '''
    me = "mpwassell@gmail.com"
    you = "mpwassell@gmail.com"
    msg = MIMEText("If you have received this email in error please contact mpwassell@gmail.com.\n" + xml)
    msg['Subject'] =  "CKA League: Fixture Scorecard {}".format(fixture_code)
    msg['To'] = me

    s = smtplib.SMTP('localhost')
    s.sendmail(me, [you], msg.as_string())
    s.quit()
    '''

    template = loader.get_template('message.html')
    context =  RequestContext(request, {'message' : "OK"})
    return HttpResponse(template.render(context))

@csrf_protect
def upload_xml_raw(request,fixture_code):
    """
    Handle POST containing XML of scorecard
    """
    xml = request.POST['txtXML']

    card = processResultsXMLHelper(xml)

    stage_scorecard(card, fixture_code)

    print (check_scorecard(fixture_code))

    template = loader.get_template('message.html')
    context =  RequestContext(request, {'message' : "OK"})
    return HttpResponse(template.render(context))

def loadxml(request,fixture_code):

    code = fixture_code.split('_')[0]

    '''
    for file in os.listdir(upload_dir):
        if fnmatch.fnmatch(file, '*_' + code + ".xml"):
            with open (upload_dir + '/' + file, "r") as myfile:
                xml=myfile.read()
            break
    '''

    xml = load_xml_file_remote(fixture_code)

    card = processResultsXMLHelper(xml)

    stage_scorecard(card, fixture_code)

    print (check_scorecard(fixture_code))

    template = loader.get_template('message.html')
    context =  RequestContext(request, {'message' : "OK"})

    #return HttpResponse(template.render(context))
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


def post(request, fixture_code):
    """
    Handle the submision of scorecard form.
    """

    card = ScoreCard()

    card.fixture_code = fixture_code

    card.home_team = request.POST['cboHome_Team']
    card.away_team = request.POST['cboAway_Team']

    card.home_score = request.POST['txtHome_Score_FT']
    card.away_score = request.POST['txtAway_Score_FT']

    card.home_score_halftime = request.POST['txtHome_Score_HT']
    card.away_score_halftime = request.POST['txtAway_Score_HT']

    card.division = request.POST['cboDivision']

    card.date = request.POST['txtDate']
    card.time = request.POST['txtTime']

    card.home_players = []
    for i in range(1,13):
        p = ScoreCardPlayer()
        p.name  = request.POST[ "cboPlayerH{0}".format(i) ]
        if p.name:
            p.u18   = "Y" if  "chkH{0}U18".format(i) in request.POST else "N"
            p.goals = iz(request.POST[ "txtH{0}Goals".format(i)])
            p.pens  = iz(request.POST[ "txtH{0}Pens".format(i)])

            if i >= 9:
                p.for_player = request.POST[ "txtH{0}For".format(i)]
                p.when = request.POST[ "cboH{0}When".format(i)]
            else:
                p.for_player = None
                p.when = None

        card.home_players.append(p)

    card.away_players = []
    for i in range(1,13):
        p = ScoreCardPlayer()
        p.name  = request.POST[ "cboPlayerA{0}".format(i) ]
        if p.name:
            p.u18   = "Y" if  "chkA{0}U18".format(i) in request.POST else "N"
            p.goals = iz(request.POST[ "txtA{0}Goals".format(i)])
            p.pens  = iz(request.POST[ "txtA{0}Pens".format(i)])

            if i >= 9:
                p.for_player = request.POST[ "txtA{0}For".format(i)]
                p.when = request.POST[ "cboA{0}When".format(i)]
            else:
                p.for_player = None
                p.when = None
        card.away_players.append(p)

    card.home_captain = request.POST['txtHome_Captain']
    card.away_captain = request.POST['txtAway_Captain']
    card.ref_name = request.POST['txtReferee']
    print ("REF ", card.ref_name)

    card.notes = request.POST['txtNotes']
    card.private_notes = request.POST['txtPrivateNotes']
    if request.POST['txtWritten_By']:
        card.notes_by = request.POST['txtWritten_By']
    else:
        card.notes_by = request.POST['txtReferee']

    card.ref_home_rating = request.POST['cboRefHomeRating']
    card.ref_away_rating = request.POST['cboRefAwayRating']
    card.email = request.POST['txtEmailAddress']

    card.sub_date = datetime.now().strftime("%d %b %Y")

    for k in request.POST:
        print ("{0} {1}".format(k,request.POST[k]))

    stage_scorecard(card, fixture_code)

    print (check_scorecard(fixture_code))

    send_card( card )

    return HttpResponseRedirect(request.POST['referer'])

    '''
    template = loader.get_template('message.html')
    context =  RequestContext(request, {})
    return HttpResponse(template.render(context))
    '''

def send_card(card):
    """
    Send scorecard by email
    """

    xml = card_as_xml(card)

    from_email = card.email if card.email else 'CKA.Results@Email4Groups.com'

    print (xml)

    msg = EmailMessage('TEST: CKA Results ' + card.fixture_code,
        '',
        from_email,
        ['CKA.Results@Email4Groups.com', 'mpwassell@gmail.com'])

    fixture = Fixture.objects.filter(code__exact= card.fixture_code).first()
    filename =  "{0}_{1}{2}.xml".format(fixture.date.strftime("%Y%m%d"),card.home_team,card.away_team)

    msg.attach( filename, xml, "text/xml")

    try:
        msg.send(fail_silently=False)
    except Exception:
        print ("PROBLEM SENDING MAIL")


def card_as_xml(card):
    """ Convert the scorecard to xml """

    home_team_name = Team.objects.filter( code__exact = card.home_team).first().name
    away_team_name = Team.objects.filter( code__exact = card.away_team).get().name

    xml = "<xml>\n"
    xml += "<Division>{0}</Division>\n".format( card.division )
    xml += "<Date>{0}</Date>\n".format( card.date)
    xml += "<Time>{0}</Time>\n".format( card.time)
    xml += "<HomeTeam>{0}</HomeTeam>\n".format( home_team_name )
    xml += "<AwayTeam>{0}</AwayTeam>\n".format( away_team_name )

    xml += "<FullTime>{0}-{1}</FullTime>\n".format(card.home_score, card.away_score )
    xml += "<HalfTime>{0}-{1}</HalfTime>\n".format(card.home_score_halftime, card.away_score_halftime )

    for i in range(13):
        if i < len(card.home_players) and card.home_players[i].name:
            p = card.home_players[i]

            if i <= 7:
                xml += "<H{0}>{1}, {2}, {3}, {4}</H{0}>\n".format(i+1,
                    p.name, p.u18,p.pens,p.goals)
            else:
                xml += "<H{0}>{1}, {2}, {3}, {4}, {5}, {6}</H{0}>\n".format(i+1,
                    p.name, p.u18,p.pens,p.goals,p.for_player, p.when)
        else:
            xml += "<H{0}></H{0}>\n".format(i)

    for i in range(13):
        if i < len(card.away_players) and card.away_players[i].name:
            p = card.away_players[i]
            if i <= 7:
                xml += "<A{0}>{1}, {2}, {3}, {4}</A{0}>\n".format(i+1,
                    p.name, p.u18,p.pens,p.goals)
            else:
                xml += "<A{0}>{1}, {2}, {3}, {4}, {5}, {6}</A{0}>\n".format(i+1,
                    p.name, p.u18,p.pens,p.goals,p.for_player,p.when)
        else:
            xml += "<A{0}></A{0}>\n".format(i)


    xml += "<HomeCaptain>{0}</HomeCaptain>\n".format( card.home_captain )
    xml += "<AwayCaptain>{0}</AwayCaptain>\n".format( card.away_captain )
    xml += "<Referee>{0}</Referee>\n".format( card.ref_name)
    xml += "<Notes>{0}</Notes>\n".format( card.notes)
    xml += "<NotesBy>{0}</NotesBy>\n".format( card.notes_by )
    xml += "<SubmittedDate>{0}</SubmittedDate>\n".format(card.sub_date)
    xml += "<RefHomeRating>{0}</RefHomeRating>\n".format( card.ref_home_rating )
    xml += "<RefAwayRating>{0}</RefAwayRating>\n".format( card.ref_away_rating )
    xml += "<SubmittedEmail>{0}</SubmittedEmail>\n".format( card.email )
    xml += "</xml>\n"

    return xml

'''
Checks that scores on scorecard align with divisions
'''
def scorecard_check_fixture_aux(fcode):

    home_players = Match.objects.filter(fixture_code__exact = fcode, home_team__exact = True).all()
    away_players = Match.objects.filter(fixture_code__exact = fcode, home_team__exact = False).all()

    if len(home_players) == 0:
        return True

    if len(home_players) > 8 or len(away_players) > 8:
        #print("Match has subs. Skipping")
        return True

    home_1 = 0
    home_2 = 0
    for h in home_players:
        if h.player_num < 4:
            home_1 += h.goals + h.penalties
        else:
            home_2 += h.goals + h.penalties

    away_1 = 0
    away_2 = 0
    for h in away_players:
        if h.player_num < 4:
            away_1 += h.goals + h.penalties
        else:
            away_2 += h.goals + h.penalties

    print("{} - H1={} H2={} A1={} A2={}".format(fcode,home_1,home_2,away_1,away_2))

    d = (home_1 + away_2) - (home_2 + away_1)
    if (0 <= d) and (d <= 2):
        print("  d={}. ok".format(d))
        return True
    else:
        print("  d={}. fail".format(d))
        return False

def stage_scorecard(card, fixture_code):
    """ Load scorecard into staging area """

    t1_name = card.home_team
    t2_name = card.away_team

    print("Teams {} {}".format(t1_name,t2_name))

    try:
        t1 = Team.objects.filter( code__exact = t1_name).get()
    except Team.DoesNotExist:
        try:
            t1 = Team.objects.filter( code__exact = t1_name + " (Dev)").get()
        except Team.DoesNotExist:
            try:
                t1 = Team.objects.filter( name__exact = t1_name).get()
            except Team.DoesNotExist:
                t1 = Team.objects.filter( name__exact = t1_name + " (Dev)").get()


    try:
        t2 = Team.objects.filter( code__exact= t2_name).get()
    except Team.DoesNotExist:
        try:
            t2 = Team.objects.filter( code__exact = t2_name + " (Dev)").get()
        except Team.DoesNotExist:
            t2 = Team.objects.filter( name__exact = t2_name).get()

    div =  card.division
    dt  =  card.date

    # FIXME - Hack to handle SERL post december split.
    fixture = Fixture.objects.filter( code__exact = fixture_code ).get() # division__exact = div, home_team__exact = t1.code, away_team__exact = t2.code, season__exact = season).get()

    if fixture.referee_team:
        logger.info("Referee {0}".format(fixture.referee_team.club_id))

    home_cap_name = card.home_captain
    away_cap_name = card.away_captain

    logger.info("Home cap: {0} Away cap: {1}".format(home_cap_name, away_cap_name))
    logger.info("T2.club_id {0}".format(t2.club_id))

    if home_cap_name:
        home_cap = Player.objects.filter( name__exact= home_cap_name, club_id__exact = t1.club_id).get()

    if away_cap_name:
        away_cap = Player.objects.filter( name__exact= away_cap_name, club_id__exact = t2.club_id, inactive__exact = False).get()


    ref_name = card.ref_name
    print("REF is {}".format(ref_name))
    ref = None
    if fixture.referee_team:
        try:
            ref = Player.objects.filter( name__exact= ref_name, club_id__exact = fixture.referee_team.club_id, inactive__exact = False).get()
        except Player.DoesNotExist:
            # Might be from a club not original down to ref match
            try:
                ref = Player.objects.filter( name__exact= ref_name,  inactive__exact = False).get()
            except Player.DoesNotExist:
                pass

    notes = card.notes
    private_notes = card.private_notes
    notes_by = card.notes_by

    sub_date = card.sub_date
    rh_rate  = card.ref_home_rating
    ra_rate  = card.ref_away_rating

    if sub_date:
        sub_date = datetime.strptime(sub_date,"%d %b %Y")
    else:
        sub_date = datetime.strptime('01 Jan 2017',"%d %b %Y")

    # Clean any existing match and fixture staging records.
    # TODO: Check this rolls back if something goes wrong

    try:
        fixture_s = FixtureStaging.objects.filter(code=fixture.code).all()
        fixture_s.delete()

        match_s = MatchStaging.objects.filter(fixture_code__exact = fixture.code).all()
        for m in match_s:
            m.delete()
    except:
        pass


    # Might only have got one side of match results if this is a SERL match
    fixture_s = FixtureStaging(code=fixture.code, match=fixture.match, week=fixture.week,
        division=div,
        date=fixture.date,
        home_team_id = t1.code, away_team_id = t2.code,
        season=season, referee_team_id = fixture.referee_team_id,
        venue_id = fixture.venue_id,
        notes = notes, notes_by= notes_by,
        private_notes = private_notes,
        by_hand = True,
        date_received = sub_date, ref_home_rating = rh_rate, ref_away_rating = ra_rate)

    if card.home_score:
        fixture_s.home_score = card.home_score
    if card.away_score:
        fixture_s.away_score = card.away_score

    if card.home_score_halftime:
        fixture_s.home_score_halftime = card.home_score_halftime
    else:
        fixture_s.home_score_halftime = None

    if card.away_score_halftime:
        fixture_s.away_score_halftime = card.away_score_halftime
    else:
        fixture_s.away_score_halftime = None

    if home_cap_name:
        fixture_s.home_captain_id = home_cap.id

    if away_cap_name:
        fixture_s.away_captain_id = away_cap.id

    if ref:
        fixture_s.referee_id = ref.id

    logger.info(str( fixture_s))

    fixture_s.save()

    stagePlayers(card.home_players,"H",t1,fixture,1)
    stagePlayers(card.away_players,"A",t2,fixture,0)

    fixture_s.status_valid = is_match_status_valid(fixture_s,MatchStaging)
    fixture_s.player_valid = is_match_player_valid(fixture_s,MatchStaging)

    print ("fixture_S.status_Valid ", fixture_s.status_valid)
    fixture_s.save()

    return ["OK"]
    '''
    if not scorecard_check_fixture(fixture_s,MatchStaging):
        return ["Problem with scorecard. Check divisions"]
    else:
        return ["OK"]
    '''

def is_match_player_valid(fixture, matchClass):

    players = matchClass.objects.filter(fixture_code__exact = fixture.code).all()

    for p in players:
        if p.player_id == 0:
            return 'F'

    return 'T'

def stagePlayers( players, tag, team,fixture,home_team):
    """ Create staging record for the players in a match """

    plist = []

    # In the Match table player numbers start from 0
    p  = -1

    for player in players:
        p+=1

        # Could be a blank spot on the score card.
        if not player.name:
            continue

        pl = None
        try:
            if fixture.division != 'SERL' :
                pl = Player.objects.filter( name__exact= player.name, club_id__exact = team.club_id, inactive__exact = False).get()
            else:
                # FIXME - Need this as some SERL players play for another team in CKL
                try:
                  pl = Player.objects.filter( name__exact= player.name, club_id__exact = team.club_id, inactive__exact = False).get()
                except Player.DoesNotExist:
                  print ("StagePlayer ", player.name)
                  try:
                    pl = Player.objects.filter( name__exact= player.name, inactive__exact = False).get()
                  except Player.DoesNotExist:
                    print ("Using fl name for", player.name)
                    p1 = Player.objects.filter( fl_name__exact= player.name, inactive__exact = False).get()
                    print ("Found ", player.name)
        except Player.DoesNotExist:
            # If player doesn't exist in player list then apply player name to staging record. This will need
            # to be addressed before card is approved
            print ("USING TEMP PLAYER", player.name)
            pass
            #raise NamedPlayerDoesNotExist(player.name, team.name)

        status = 0
        if pl:

            logger.info( "Player id={0}".format(pl.id) )

            # Calculate status value for player based on period in which the fixture falls.
            sp = Period.objects.filter(season__exact = season, date_from__lte = fixture.date, date_to__gte = fixture.date).get()
            try:
                print ("Player id={}".format(pl.id))
                player_status = PlayerStatus.objects.filter( period = sp.number, year = season, player_id = pl.id).get()
                status = player_status.status
            except PlayerStatus.DoesNotExist:
                status=0

        goal = player.goals if player.goals else 0
        pen = player.pens if player.pens else 0
        player_s = MatchStaging(fixture_code = fixture.code, player_num = p,
            team_id = team.code, home_team= home_team,
            goals = goal, penalties=pen,status=status, yellow_card=False,red_card=False)

        if pl:
            player_s.player_id = pl.id
        else:
            player_s.player_name = player.name
            player_s.player_id = 0

        if player.u18 == 'Y':
            player_s.u18 = 1
            logger.info("player u18")
        else:
            player_s.u18 = 0

        player_s.on_court = 'start'
        player_s.off_court = 'end'
        player_s.status_points=0
        player_s.count_code = '1234'

        # This player was a sub. Calculate count code for this player and the player they are
        # subbing for.
        #
        # NEW: Update on_court and off_court for player coming off and on.
        # NOTE: Assume that 'for_player' points back directly to the player coming off and NOT
        # 'on court position'

        # For SERL matches we might not have correct for_player / when information we do
        # know that players after the 8th are subs.
        if p > 7 and fixture.division == 'SERL':
            player_s.count_code='234'

        if player.for_player:
            sub_for = player_s.sub_for_player = player.for_player

        if player.when:
            sub_at = player_s.sub_at = player.when
            if sub_at == "1st":
                cc1 = "1"
                cc2 = "234"
            elif sub_at == "HT":
                cc1 = "12"
                cc2 = "23"
            else:
                cc1 = "123"
                cc2 = "4"

            player_s.on_court = sub_at

            logger.info("Count Code cc1={0} cc2={1}".format(cc1,cc2))

            # Update the count code for the other player
            player_s.count_code = cc2
            j = int(sub_for)

            # Player might have come on to fill a blank space so we need to check there is a player
            # for sub_for
            if len(plist) > j-1 and plist[j-1] != None:
                plist[ j-1 ].count_code = cc1
                plist[ j-1 ].off_court = sub_at
                plist[ j-1 ].save()

        player_s.save()
        plist.append( player_s )

    # Now calculate status points accrued
    if team.code[-1] == '1' or team.code[-1] == '2':
        for p in plist:
            if p is None: continue

            print ("Calculating status points for {} {} {}".format(p.player.name, p.on_court, p.off_court))
            sp = StatusPoints.objects.filter(on_text_short__exact = p.on_court, off_text_short__exact=p.off_court).get()
            if team.code[-1] == '1':
                p.status_points = sp.first_team_pt
            elif team.code[-1] == '2':
                p.status_points = sp.second_team_pt
            else:
                p.status_points = 0
            print ("   points={}".format(p.status_points))
            p.gametime = sp.second_team_pt / 4.0
            p.save()

    return ""


def ref_rating(request,season,period):

    ratings = [ "EXEMPLARY - attitude and sportsmanship was exemplary",
                "VERY GOOD - Attitude and sportsmanship was very good",
                "GOOD - Attitude and sportsmanship was good",
                "OK - Attitude and sportsmanship was ok",
                "POOR - A few incidents of poor attitude or bad sportsmanship",
                "VERY POOR - There were several incidents of poor attitude and bad sportsmanship",
                "UNACCEPTABLE - The attitude and sportsmanship was at an unacceptably bad level"]


    clubs = Club.objects.filter(cka__exact = True)
    result = ["Period,Club,Team,Date,Code,Rating,Comments,Referee"]
    result = ["Period,Club,Team,Date,Code,Rating,Referee"]

    for c in clubs:
        teams = Team.objects.filter(club__name = c.name)
        for t in teams:
            fixtures = Fixture.objects.filter(Q(home_team__code = t.code)|Q(away_team__code = t.code),season__exact = season).exclude(division__exact = 'SERL').order_by("date")


            for f in fixtures:
                if not f.division in ['1','2','3']:
                    continue
                if str(f.season_period) != str(period):
                    continue
                ref_name =  f.referee.name if f.referee else "unknown"
                if f.home_team.code == t.code:
                    if not f.ref_home_rating or f.ref_home_rating  == 0:
                        continue
                    comment = ratings[7-f.ref_home_rating]
                    if not f.referee:
                        print (f.code)
                    result.append( "{},{},{},{},{},{},{}".format(f.period,c.name,
                        t.name, f.date.strftime("%d-%b-%Y %H:%M"),
                        f.code,f.ref_home_rating,ref_name))
                else:
                    if not f.ref_away_rating or f.ref_away_rating  == 0:
                        continue
                    comment = ratings[7-f.ref_away_rating]
                    result.append( "{},{},{},{},{},{},{},".format(f.period,c.name,
                        t.name, f.date.strftime("%d-%b-%Y %H:%M"),
                        f.code,f.ref_away_rating,ref_name))

    return render(request, "ref_rating.html", {"result": result})

def bz( i ):
    return i if i != "0" else ""


def iz( i ):
    return i if i else 0

def find_xml_file( fixture_code):
    '''
    Look for XML scorecard file in upload directory and return string it contains or None
    '''

    code = fixture_code.split('_')[0]
    for file in os.listdir(upload_dir):
        print("File = ",file)
        if fnmatch.fnmatch(file, '*_' + code + ".xml"):
            print ("FOUND")
            return True

    return False

def find_xml_file_remote(fixture_code):
    '''
    Look for XML scorecard file on remote server
    '''

    filename = fixture_code + ".xml"

    base_url = "http://www.cambskorfball.co.uk/results/server/scorecards_xml/"
    url =  base_url +  filename
    try:
        with urllib.request.urlopen(url ) as response:
            print ("FOUND REMOTE")
            return True
    except urllib.error.URLError:
            print ("NOT FOUND REMOTE " , url)
            return False

def load_xml_file_remote(fixture_code):
    '''
    Load XML scorecard file from remote server
    '''

    filename = fixture_code + ".xml"

    base_url = "http://www.cambskorfball.co.uk/results/server/scorecards_xml/"
    url =  base_url +  filename
    with urllib.request.urlopen(url ) as response:
        return response.read()
