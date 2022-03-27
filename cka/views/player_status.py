import operator
import time
from datetime import datetime
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.db.models import Q
from django.shortcuts import render,redirect
from cka.models import Club
from cka.models import Player
from cka.models import PlayerStatus
from cka.models import Fixture
from cka.models import Team
from cka.models import Match
from cka.models import LeagueTable
from cka.models import PlayerStatistics
from cka.models import StatusOverride
from cka.models import Period
from cka.models import StatusPoints
from cka.season import season, season_full

import logging
logger = logging.getLogger(__name__)


'''
TODO:
Create a class for this - or maybe different ones depending on period, SERL team or not ...
'''

##
## Player Status Calculation
##
"""
serl_status = 1 if player has played 4 or more full match equivalent SERL matches
cka_status  = 1 if player is 1st team player status (will be by ranking)
            = 2 if player has 2nd team player status (by ranking)

status = ? - Is used but overlaps with 'team'

{serl,first,second}_indicator - code indicating proportion of last 6 (SERL) or 5 matches (1st and 2nd) played
{serl,first,second}_score - Counts of matches with appropriate weights.

team - Text string used to calculated CSS class
team_long - Text string to display on page indicating status.

Should be:
Colour indicates status - 1st, 2nd or None
'Team' column indicates team  (that feeds status)

Need to construct the data so that it is robust under rule changes.

                        1st Status                                      2nd Status
SERL this season        Order: 4+ SERL matches then 1st team matches    Order: 1st + 2nd team points
                        Pick Off: 4 Players                             Order: 3 players

Not this / Last         Order: 4+ SERL matches then 1st team matches    Order: 4+ SERL, then 1st + 2nd points
                        Pick Off: 3 players                             Pick Off: 3 players

Not this or last        Order: 1st team matches                         Order:1st + 2nd matches
                        Pick Off: 3                                     Order: 3 players


"""

class PlayerStatusTemp:

    def __init__(self,name,sex,serl_skip, first_skip, second_skip,id,season,period):
        self.id = id
        self.name = name
        self.serl_score =0
        self.first_score = 0
        self.second_score = 0
        self.first_score_new = 0
        self.second_score_new = 0
        self.sex = sex
        self.tie = ""
        self.team="NoStatus"         #FIXME Not needed and confusing. Just use status
        self.team_long = "No Status"
        self.serl_indicator = ""
        self.first_indicator = ""
        self.second_indicator = ""
        self.first_count_code = []
        self.second_count_code = []
        self.first_sp = dict()
        self.second_sp = dict()
        self.serl_status=0
        self.cka_status=0
        print ("TIE check for " , name)
        self.tie1 = 0.5 if statustie(id, season,period,1) else 0.0
        self.tie2 = 0.5 if statustie(id, season,period,2) else 0.0
        for i in range(serl_skip):
            self.serl_indicator += "0"
        for i in range(first_skip):
            self.first_indicator += "0"
        for i in range(second_skip):
            self.second_indicator += "0"

    def __unicode__(self):
        return self.__str__()

    def __str__(self):
        return self.club + " " + self.name + " " + str(self.serl_score) + " " + str(self.first_score) + " " + str(self.second_score) + " " + self.team + " " + self.sex + " " + self.first_indicator + " " + self.second_indicator + " " + str(self.tie1) + " " + str(self.tie2) + " " + str(self.team)


def status_overrides(request):
    """
    Display status over ride table
    """

    status_overrides =  StatusOverride.objects.order_by('id').all()
    template = loader.get_template('cka/status_overrides.html')
    context = RequestContext(request, {
        'records': status_overrides
    })
    return HttpResponse(template.render(context))

def redo_player_status(request):
    """
    Recalculate status of players.
    """

    return calculate_player_status(request)



def statustie(id,season,period,status):
    st = StatusOverride.objects.filter( player_id__exact = id).filter(year__exact = season).filter( period__exact = period).filter( status__exact = status).all()
    print ("st {0} {1} {2} {3}".format(id,season,period,status))
    for s in st:
        logger.info("Status tie id={} s={} period={}".format(id,s,period))
        print ("Found tie")
        return 1
    return 0

def check_ties(sorted_players, restof, label, fn, tie_fn):

    # Go down list, record potential tie value
    # If players on this side of boundary have this value then tie is needed
    # Go through list again and mark off players with tie value

    # Can happen if club has low number of players and they all have status
    if restof == len(sorted_players):
        return

    print ("check_tie ", sorted_players[restof-1].name, " ", sorted_players[restof].name)
    print (" " , fn(sorted_players[restof-1]), " ~~ ", fn(sorted_players[restof]))

    if( fn(sorted_players[restof-1]) == fn(sorted_players[restof])):
        tie_value = fn(sorted_players[restof] )

        print ("TIE VALUE ", tie_value)

        for p in sorted_players:
            if( fn(p) == tie_value):
                p.tie = label + ( "*" if tie_fn(p) == 0.5 else "")

    """
    for i in range(restof,0,-1):
        print "Checking  {} and {} ".format(sorted_players[i-1].name, sorted_players[restof].name)
        if fn(sorted_players[i-1]) == fn(sorted_players[restof]):
            print "  TIED"
            sorted_players[i-1].tie = label + ( "*" if tie_fn(sorted_players[i-1]) == 0.5 else "")
            sorted_players[restof].tie= label + ( "*" if tie_fn(sorted_players[restof]) == 0.5 else "")
    if sorted_players[restof].tie == label:
        for i in range(restof, len(sorted_players)-1):
            if fn(sorted_players[restof]) == fn(sorted_players[i+1]):
                sorted_players[i+1].tie = label  + ( "*" if tie_fn(sorted_players[i+1]) == 0.5 else "")
    """

def process_players_periodN(sorted_players, data, show_ties):
    """
    For a list of players assign team status
    """

    def sort_fn(x):
        return x.first_score + x.tie1

    sorted_players.sort(key= sort_fn , reverse=True)

    num_first_team=3
    for m in sorted_players[:num_first_team]:
        m.team="FirstTeam"
        m.team_long="1st Team"
        m.cka_status=1
        data.append( m)

    if show_ties:
        check_ties(sorted_players,num_first_team,"T1", lambda x: x.first_score, lambda x: x.tie1)


    sorted_players = sorted_players[num_first_team:]
    sorted_players.sort(key=lambda x: x.first_score + x.second_score +x.tie2, reverse=True)

    num_second_team=3
    for m in sorted_players[:num_second_team]:
        if m.team == "NoStatus":
            m.team="SecondTeam"
            m.team_long="2nd Team"
            m.cka_status=2
        data.append( m)

    if show_ties:
        check_ties(sorted_players,num_second_team,"T2", lambda x: x.first_score + x.second_score, lambda x: x.tie2)


    sorted_players = sorted_players[num_second_team:]
    sorted_players.sort(key=lambda x: x.first_score + x.second_score + x.tie2, reverse=True) # ENH Needed?
    data.extend( sorted_players )

    # FIXME - this will look at data for 1st period
    for p in data:
        if p.period > 1 and p.serl_score >= 4:
            p.serl_status=1
            p.team="SERL"
            p.team_long="SERL"



def process_players_period0(sorted_players, data, show_ties, club):
    """
    For a list of players, assign team status for status period0
    """

    # NB This assignment is duplicated below. FIXME
    has_serl  = club in [ "VIK", "TIG", "CIT"]
    serl_only_last_year  = club in [ ]

    print ("process_players_period0 ", has_serl, serl_only_last_year)
    def sort_fn(x):
        if x.serl_score >= 4:
            return x.serl_score*100 + x.first_score + x.tie1
        else:
            return x.first_score + x.tie1

    def tie_fn(x):
        if x.serl_score >= 4:
            return x.serl_score*100 + x.first_score
        else:
            return x.first_score

    sorted_players.sort(key= sort_fn , reverse=True)

    # If has SERL this season, then pick off 4 otherwise 3
    pick_off = 4 if has_serl else 3

    print ("  pick_off=", pick_off)

    for m in sorted_players[:pick_off]:
        print ("  1st team " , m.name)
        m.team = "FirstTeam"
        m.team_long = "1st Team"
        if m.serl_score >= 4:
            m.serl_status = 1
        else:
            m.cka_status = 1
        data.append( m)
    restof=pick_off

    if show_ties:
        #if sorted_players[0].serl_score > 0: check_ties(sorted_players,restof,"T1", lambda x: x.serl_score, lambda x: x.tie1)
        check_ties(sorted_players,pick_off,"T1", tie_fn, lambda x: x.tie1)


    def sort_fn2(x):
        if serl_only_last_year and x.serl_score >= 4:
            return x.serl_score*100 + x.first_score + x.second_score
        else:
            return x.first_score + x.second_score + x.tie2

    sorted_players = sorted_players[restof:]
    sorted_players.sort(key=sort_fn2, reverse=True)

    num_second_status=3
    for m in sorted_players[:num_second_status]:
        print ("Second team status ", m.name)
        if m.team == "NoStatus":
            m.team="SecondTeam"
            m.team_long="2nd Team"
            m.cka_status=2
        data.append( m)

    if show_ties:
        check_ties(sorted_players,num_second_status,"T2", lambda x: x.first_score + x.second_score, lambda x: x.tie2)


    sorted_players = sorted_players[num_second_status:]
    sorted_players.sort(key=lambda x: x.first_score + x.second_score + x.tie2, reverse=True) # ENH Needed?
    data.extend( sorted_players )

def first_team_code( club_code ):
    if int(season) >= 2021 and club_code == 'CIT':
        return club_code + '2'
    else:
        return club_code + '1'

def second_team_code(club_code):
    if int(season) >= 2021 and club_code == 'CIT':
        return club_code + '3'
    else:
        return club_code + '2'

def process_serl_file(season,period,club,player_scores):
    ##
    ## Read file with players and number of SERL/NL matches they have played.
    ##

    import csv
    with open("D:\Mark\MyDocuments\Korfball\CKA\serl_players.csv") as fp:
        reader = csv.reader(fp, delimiter=",", quotechar='"')
        next(reader, None)  # skip the headers
        data_read = [row for row in reader]
    
    for rec in data_read:
        # See if there is an entry for this club in the file and add to player_scores
        #print(rec,season,period,club)
        if rec[0] == str(season) and rec[1] == str(period+1) and rec[2] == club:
            name = rec[3]
            matches = rec[4]

            print(name,matches)

            player_rec = Player.objects.filter(club_id = club, name = name ).get()
            print(player_rec)
            p = PlayerStatusTemp(name, player_rec.sex,0,0,0, player_rec.id,season,period+1)
            p.serl_score = int(matches)

            player_scores[name]=p
 
def updateFirstTeamStatusPoints( p ):
    print ("Calculating status points for {} {} {}".format(p.player.name, p.on_court, p.off_court))
    sp = StatusPoints.objects.filter(on_text_short__exact = p.on_court, off_text_short__exact=p.off_court).get()
    p.status_points = sp.first_team_pt
    p.save()

def updateSecondTeamStatusPoints( p ):
    print ("Calculating status points for {} {} {}".format(p.player.name, p.on_court, p.off_court))
    sp = StatusPoints.objects.filter(on_text_short__exact = p.on_court, off_text_short__exact=p.off_court).get()
    p.status_points = sp.second_team_pt
    p.save()    
  

def calculate_player_status(request):
    """
    When calculating status at the end of the period with all outstanding cards submitted then matches without scorecards are
    ignored when counting back over the last 5 or 6. As per rules, we don't count walkovers where there was no match played.

    FIXME: To aid calculation part way through the period, we should not ignore matches without scorecards but use a walkover/match not played
    flag and skip those.

    The main body of this method assigns status points to players. The logic of sorting the lists and assigning status
    is done in process_players_period0 (for the first period of the season) and process_players_periodN (for second and third)

    """

    print ("NEED TO FILTER OUT PLAY OFF MATCHES.")
    #return

    show_ties = 1

    # period numbers start from 0
    status_periods_to_calc = [1,2]

    indicator = {  "1234" : "F", "234" : "E", "34" : "C" , "4" : "8", "123" : "7", "23" : "6", "12" : "3", "2" : "2", "1" : "1"}
    points = { "1234" : 4, "234" : 3, "34" : 2 , "4" : 1, "123" : 3, "23" : 2 , "3" : 1 , "4" : 1, "12" : 2, "2" : 1 }

    # FIXME - Make same as order of buttons on page
    clubs = [ "CIT" , "LIT", "PHO", "TIG", "UNI", "VIK"]    
    #clubs = [ "CIT"]
    clubs_full = { "PHO" : "Phoenix", "CIT" : "City", "VIK":"Vikings","TIG":"Tigers","LIT":"Lions", "UNI":"University"}

    period_recs = Period.objects.filter(season__exact = season).all()
    periods = []
    for p in period_recs:
        periods.append( (p.date_from.strftime("%Y-%m-%d"), p.date_to.strftime("%Y-%m-%d")))

    logger.info("         ****   Calculating Player Status ****")

    # Number of previous matches we look at
    ckl_status_length = 5
    serl_status_length = 6

    data = []
    for c in clubs:

        # NB This assignment is duplicated above. FIXME
        has_serl  = c in ["CIT", "VIK", "TIG"]
        serl_only_last_year  = c in []

        club_data = []
        logger.info("** CLUB {}".format(c))

        for pi in status_periods_to_calc:
            logger.info("* Period {}".format(pi))
            skip_m=0
            period = periods[pi]
            print ("Period = ", period)
            #do_period0 = c in ["CIT", "VIK"] and pi == 0
            do_period0 =  pi == 0
            print (do_period0,  period == 0)
            player_scores = dict()

            do_serl = has_serl or (pi == 0 and serl_only_last_year)
            use_serl_file = True
            #
            # SERL matches. At some point we will need to filter out second team SERL matches. It doesn't
            # need to be done in 2016/2017 season but we should change datamodel now.
            #

            if do_serl:
                if use_serl_file:
                    process_serl_file(season,pi,c,player_scores)
                else:
 
                    serl_matches = Fixture.objects.filter(date__lt = period[0] ).filter(date_received__isnull=False,
                    division__exact = "SERL", code__contains = c, ignore_for_status__exact = False ).order_by( '-date').all()[:serl_status_length]
                    nl_matches = Fixture.objects.filter(date__lt = period[0] ).filter(date_received__isnull=False,
                    division__exact = "NL", code__contains = c, ignore_for_status__exact = False ).order_by( '-date').all()[:serl_status_length]

                    matches = []
                    for m in serl_matches:
                        matches.append(m)
                    for m in nl_matches:
                        matches.append(m)
                    serl_matches= matches
               

                    for m in serl_matches:
                        logger.info("SERL team match {} {} {}".format( m.code, m.date,m.date_received))

                        fixture_players = Match.objects.filter( fixture_code__exact = m.code ).filter( team__code__contains = c )
                        fp = []
                        for a_fixture_player in fixture_players:

                            # ENH: Skip if team is a second SERL team

                            # Only count players in starting line up.
                            if a_fixture_player.player_num >= 8: continue

                            # Ignore if player is member of another club
                            if a_fixture_player.player.club.code != c:
                                print ("Skipping non-club member " , a_fixture_player.player.name)
                                continue

                            pname = a_fixture_player.player.name

                            if pname in [ 'Female Guest 1', 'Male Guest 1','Female Guest 2', 'Male Guest 2']: continue

                            logger.info("SERL Player {} Num {}".format(pname, a_fixture_player.player_num))

                            if( not pname in player_scores):
                                p = PlayerStatusTemp(pname, a_fixture_player.player.sex, skip_m,0,0, a_fixture_player.player.id,season,pi+1)
                                player_scores[ pname ] = p
                            else:
                                p = player_scores[ pname ]

                            p.serl_score += 1
                            p.serl_indicator = "F" + p.serl_indicator
                            fp.append( pname )
                            logger.info("SERL score {}".format(p.serl_score))

                        for name,player in player_scores.items():
                            if not name in fp:
                                player.serl_indicator = "0" + player.serl_indicator

                        skip_m += 1

            print ("PLAYER SCORES")
            print (player_scores)

            #
            # First team matches
            #

            team_code = first_team_code(c)

            first_team_matches = Fixture.objects.filter(date__lt = period[0] ).filter(date_received__isnull=False,code__contains = team_code ,
                ignore_for_status__exact = False ).order_by( '-date').all()[:ckl_status_length]

            skip_m = 0
            for m in first_team_matches:

                logger.info("First team match {} {} {}".format( m.code, m.date,m.date_received))

                fixture_players = Match.objects.filter( fixture_code__exact = m.code ).filter( team__code__contains = team_code)
                fp = []
                for a_fixture_player in fixture_players:

                    updateFirstTeamStatusPoints(a_fixture_player)

                    pname = a_fixture_player.player.name
                    if( not pname in player_scores):
                        p = PlayerStatusTemp(pname, a_fixture_player.player.sex, 0,skip_m,0, a_fixture_player.player.id,season,pi+1)
                        player_scores[ pname ] = p
                    else:
                        p = player_scores[ pname ]

                    cc = a_fixture_player.count_code
                    if not m.code in p.first_sp:
                        p.first_sp[m.code]=0

                    if m.season == "2016":
                        pt = points[ cc ]  if( cc in points) else 0
                        p.first_score += 2*pt
                        p.first_sp[m.code] += 2*pt
                    else:
                        p.first_score += a_fixture_player.status_points
                        p.first_sp[m.code] += a_fixture_player.status_points

                    #p.first_indicator = (indicator[cc] if (cc in indicator) else "?") + p.first_indicator
                    fp.append( pname )

                for name,player in player_scores.items():
                    if not name in fp:
                        #player.first_indicator = "0" + player.first_indicator
                        player.first_sp[m.code]=0
                    player.first_indicator = str(player.first_sp[m.code]) + player.first_indicator

                skip_m += 1



            #
            # Second team matches
            #

            team_code = second_team_code(c)

            second_team_matches = Fixture.objects.filter(date__lt = period[0] ).filter(date_received__isnull=False,code__contains = team_code, ignore_for_status__exact = False ).order_by( '-date').all()[:ckl_status_length]
            skip_m = 0
            for m in second_team_matches:

                logger.info("Second team match {} {} {}".format( m.code, m.date, m.date_received))

                fp = []
                fixture_players = Match.objects.filter( fixture_code__exact = m.code ).filter( team__code__contains = team_code)
                for a_fixture_player in fixture_players:

                    updateSecondTeamStatusPoints(a_fixture_player)

                    pname = a_fixture_player.player.name
                    if( not pname in player_scores):
                        p = PlayerStatusTemp(pname, a_fixture_player.player.sex,0,ckl_status_length, skip_m, a_fixture_player.player.id,season,pi+1)
                        player_scores[ pname ] = p
                    else:
                        p = player_scores[ pname ]

                    cc = a_fixture_player.count_code
                    if not m.code in p.second_sp:
                        p.second_sp[m.code]=0
                    if m.season == "2016":
                        pt = points[ cc ]  if( cc in points) else 0
                        p.second_score += pt
                        p.second_sp[m.code] += pt
                    else:
                        p.second_score += a_fixture_player.status_points
                        p.second_sp[m.code] += a_fixture_player.status_points

                    # This is not going to be accurate
                    #p.second_indicator = (indicator[cc] if (cc in indicator) else "?") + p.second_indicator
                    fp.append(pname)

                for name,player in player_scores.items():
                    if not name in fp:
                        player.second_sp[m.code]=0
                        #player.second_indicator = "0" + player.second_indicator
                    player.second_indicator = str(player.second_sp[m.code]) + player.second_indicator

                skip_m += 1

            sort_all = []

            #
            # Have two lists - one for male players and one for female.
            # Sort lists by first team score and strip off first three from each. These are first team status players.
            # Sort lists by sum of first and second team score and strip off first three from each. These are second team status players.
            # The remainder are the no status players
            #

            sort_male = []
            sort_female = []

            for name,player in player_scores.items():
                if player.sex == 'M':
                    sort_male.append( player )
                else:
                    sort_female.append( player )
                player.club = c
                player.club_name = clubs_full[c]
                player.period = pi+1

            if do_period0:
                process_players_period0(sort_male, data,show_ties,c)
                process_players_period0(sort_female, data,show_ties,c)
            else:
                process_players_periodN(sort_male, data,show_ties)
                process_players_periodN(sort_female, data,show_ties)

    title = ""
    for d in data:
        if d.tie != "":
            d.team_long += " - " + d.tie


    #
    # Check to see if any player statuses have changed.
    #
    do_status_check=0
    if do_status_check:
        for p in data:
            try:
                ps = PlayerStatus.objects.filter(player_id = p.id, year=season, period = p.period).get()
                status = 1 if p.team == "FirstTeam" else 2
                if ps.status != status:
                    print (ps)
                    template = loader.get_template('cka/message.html')
                    mess = 'Status value changed for player {} year={} period={} old={} new={} id={}'.format(ps.player.name,ps.year,ps.period,ps.status,status,p.id)
                    context = RequestContext( request, {
                        'message': mess
                    })
                    return HttpResponse(template.render(context))

            except PlayerStatus.DoesNotExist:
                pass

    do_update_status = 1
    if do_update_status:

        PlayerStatus.objects.all().delete()

        # Data is the list of calculated player statuses
        for p in data:

            ps = PlayerStatus(player_id = p.id, year=season, period = p.period,
                    status= (1 if p.team == "SERL" else 2 if p.team == "FirstTeam" else 3 if p.team == "SecondTeam" else 4), #FIXME
                    serl_status = p.serl_status,
                    cka_status=p.cka_status,
                    serl_score = p.serl_score,
                    first_score = p.first_score, second_score = p.second_score,tie=p.tie,
                    serl_indicator = p.serl_indicator,
                    first_indicator = p.first_indicator, second_indicator=p.second_indicator)
            ps.save()

    for p in data:
        print (p)

    context = RequestContext(request, {
        'title' : title,
        'data': data,
        'from1' : periods[0][0],
        'to1' : periods[0][1],
        'from2' : periods[1][0],
        'to2' : periods[1][1],
        'from3' : periods[2][0],
        'to3' : periods[2][1],
        'show_period' : 2,   # Actual place where this is set is in player.py/status
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")

    })

    return render(request, "message.html", {"message": "Status recalculated"})


#
# Update player status on matches this season
#
def redo_match_status(request):
    update_player_status_helper()
    return render(request, "message.html", {"message": "Player Status Updated On Matches"})

def update_player_status_helper():

    matches = Match.objects.filter( fixture_code__contains = season).all()

    for m in matches:

        print (m.fixture_code, m.player.name)

        f = Fixture.objects.filter( code__exact = m.fixture_code).get()
        d = f.date

        print (d)

        sp = Period.objects.filter(season__exact = season, date_from__lte = d, date_to__gte = d).get()

        print ("Period Number: ", sp.number)

        try:
            player_status = PlayerStatus.objects.filter( period = sp.number, year = season, player_id = m.player_id).get()
            print ("Player Status: ", player_status.status)
            m.status = player_status.status
            m.save()
        except PlayerStatus.DoesNotExist:
            print ("No Player Status")
            pass


def check_match_status( f ):

    home_first = 0
    home_second = 0
    away_first = 0
    away_second=0

    if f.home_team_id[3] == '0' or f.away_team_id[3] == '0':
        return True

    players = Match.objects.filter( fixture_code__exact = f.code)
    for p in players:

        if p.home_team:
            if p.status == 1:
                home_first += 1
            elif  p.status == 2:
                home_second +=1
        else:
            if p.status == 1:
                away_first += 1
            elif  p.status == 2:
                away_second +=1

    if f.home_team.dev_team:
        home_ok = True
    elif f.home_team_id[3] == '1':
        home_ok = True
    elif f.home_team_id[3] == '2':
        home_ok = home_first <= 2
    elif f.home_team_id[3] == '3':
        home_ok = (home_first == 0 and home_second <= 2)
    else:
        home_ok = (home_first == 0 and home_second == 0)

    if f.away_team.dev_team:
        away_ok = True
    elif f.away_team_id[3] == '1':
        away_ok = True
    elif f.away_team_id[3] == '2':
        away_ok = away_first <= 2
    elif f.away_team_id[3] == '3':
        away_ok = (away_first == 0 and away_second <= 2)
    else:
        away_ok = (away_first == 0 and away_second == 0)

    if not (away_ok and home_ok):
        logger.info("{} Home First={} Home Second={} OK={} Away First={} Away Second={} OK={}".format(f.code,home_first,home_second,home_ok,away_first, away_second,away_ok))

    return away_ok and home_ok

#
# Check that all matches are status compliant
#
def check_status(request):

    update_player_status_helper()

    # For all fixtures, for each side, count number of t1 and t2 status players and check that these against
    # the level of the team

    # FIXME: Need to handle case with subs

    fixtures = Fixture.objects.filter( season = season, date_received__isnull=False)

    mess = ""
    for f in fixtures:
        if not check_match_status( f ):
            mess += "Match {} not status compliant</br>".format( str(f))

    mess = "All good" if mess == "" else mess

    template = loader.get_template('cka/message.html')
    context = RequestContext( request, {
            'message': mess
    })
    return HttpResponse(template.render(context))

#
# Calculate status_point field on match records
#
def recalculate_match_status_points(request):

    fixtures = Fixture.objects.filter( season = season, date_received__isnull=False)

    for f in fixtures:
        print ("Fixture {}".format(f.code))
        matches = Match.objects.filter( fixture_code__exact = f.code)

        # Calculate starting players for this fixture
        start_names = set()
        for m in matches:
            if m.player_num < 8:
                start_names.add( m.player.name)

        for m in matches:
            if True:
                sp = StatusPoints.objects.filter(on_text_short__exact = m.on_court, off_text_short__exact=m.off_court).get()
                if m.team.code[-1] == '1':
                    m.status_points = sp.first_team_pt
                elif m.team.code[-1] == '2':
                    m.status_points = sp.second_team_pt
                else:
                    m.status_points = 0
                print ("  Fixing for {} pts={}".format(m.player.name, m.status_points))
            else:
                # Experimenting with simpler status point calculation
                if m.team.code[-1] == '1':
                    if m.player_num < 8:
                        m.status_points=8
                    elif not m.player.name in start_names:
                        m.status_points=4
                        start_names.add(m.player.name)
                    else:
                        m.status_points=0
                elif m.team.code[-1] == '2':
                    if m.player_num < 8:
                        m.status_points=4
                    elif not m.player.name in start_names:
                        m.status_points=2
                        start_names.add(m.player.name)
                    else:
                        m.status_points=0
                else:
                    m.status_points = 0
                print ("  New calculation - Fixing for {} pts={}".format(m.player.name, m.status_points))
            m.save()

    return render(request, "message.html", {"message": "Status points recalculated"})
