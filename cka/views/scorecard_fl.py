'''
Read scorecard from fixtures live page
'''
import time,urllib
from bs4 import BeautifulSoup
from cka.models import Player,Club, Fixture, Period, Team
from django.http import HttpResponse,HttpResponseRedirect
from cka.season import season
from cka.views.scorecard import stage_scorecard,check_scorecard
from django.template import RequestContext, loader

class ScoreCard:

    def __init__(self):
        self.home_captain=""
        self.away_captain=""
        self.notes=""
        self.private_notes=""
        self.notes_by=""
        self.sub_date=  time.strftime("%d %b %Y")
        self.ref_home_rating=7
        self.ref_away_rating=7
        self.home_score_halftime=0
        self.away_score_halftime=0
        self.away_players=[]
        self.home_players=[]

    def __unicode__(self):
        return self.home_team + " " + str(self.home_score) + " " + self.away_team + " " + str(self.away_score) + " " + self.ref_name

    def __str__(self):
        return self.__unicode__()

class ScoreCardPlayer:

    def __init__(self):
        self.goals=0
        self.pens=0
        self.name=""
        self.u18=False
        self.for_player=None
        self.when=None
        self.code=None


    def __unicode__(self):
        return self.name + " " + str(self.goals) + " " + str(self.pens) + " " + self.code

    def __str__(self):
        return self.__unicode__()


def index(request,fixture_code):

    card = read_scorecard_fl(fixture_code)

    stage_scorecard(card, fixture_code)

    print (check_scorecard(fixture_code))

    template = loader.get_template('message.html')
    context =  RequestContext(request, {'message' : "OK"})

    #return HttpResponse(template.render(context))
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

def read_scorecard_fl(code):

        fixture = Fixture.objects.filter(code__exact= code).first()

        if not fixture:
            print ("Cannot find fixture")
            return

        card = ScoreCard()
        card.fixture_code = code
        card.division = fixture.division
        card.date = fixture.date


        fl_code = fixture.fixtures_live_id

        if not fl_code:
            print ("No fixtures live ID")

        response = urllib.request.urlopen('http://w.fixtureslive.com/staticAPI.aspx?Operation=LoadData&a=statzone_match.ashx%3ffixtureID%3d{0}&_=1448285998770'.format(fl_code))
        html = response.read()

        soup = BeautifulSoup(html,"html.parser")
        divs = soup.find_all('div',class_="fl_left_half")

        if not divs:
            print ("No divs")
            return

        # Officials
        divs = soup.find_all('div',class_="fl_left_half")
        if divs[-1].contents[0].contents:
            card.ref_name= divs[-1].contents[0].contents[0].contents[0]
        else:
            card.ref_name="Unknown"

        # Team names and scores
        header = soup.find_all('div',class_="fl_layout_header_content")[0]
        header_left = header.find_all('div',class_="fl_left_half")[0]
        #card.home_team = header_left.contents[2].contents[0].contents[0]
        card.home_team = fixture.home_team.name
        card.home_score = header_left.find_all('span',class_='flHeaderScore')[0].contents[0]
        header_right = header.find_all('div',class_="fl_right_half")[0]
        card.away_score = header_right.find_all('span',class_='flHeaderScore')[0].contents[0]
        #card.away_team = header_right.contents[2].contents[0].contents[0]
        card.away_team = fixture.away_team.name

        if card.home_team == 'KV 2': card.home_team = 'KwiekVicta 2'
        if card.away_team == 'KV 2': card.away_team = 'KwiekVicta 2'

        home_team = Team.objects.filter( name__exact= card.home_team).first()
        if home_team and home_team.club.cka:
            card.home_players = process_players(soup,'fl_left_half',home_team.club)

        away_team = Team.objects.filter( name__exact= card.away_team).first()
        if away_team and away_team.club.cka:
            card.away_players = process_players(soup,'fl_right_half',away_team.club)


        print ("Home Team")
        for p in card.home_players:
            print (p)

        print ("Away Team")
        for p in card.away_players:
            print (p)

        return card


def process_players(soup, side,club):

        divs = soup.find_all('div',class_=side)
        players = []
        player_dict = dict()
        sub_players = dict()

        print (divs)

        # Players
        player_table = divs[2].find_all('table',class_='fl_match_data')[0]
        cnt=0
        for player_ele in player_table.children:
            cnt += 1
            name = player_ele.contents[2].contents[0].contents[0]
            player = ScoreCardPlayer()

            db_player = Player.find_player(name,club)
            if db_player:
                player.name = db_player.name
            else:
                player.name = name
            players.append(player)
            player_dict[name]=player

            player.code = "1234" if cnt <= 8 else "234"

        # Scorers
        scorers = divs[1].find_all('table',class_='fl_match_data')[0]

        for scorer_ele in scorers.children:

            name = scorer_ele.contents[1].contents[0].contents[0]
            pen = scorer_ele.contents[2].contents

            goals=None
            if scorer_ele.contents[3].contents:
                goals = scorer_ele.contents[3].contents[0].replace("(","").replace(")","").strip()

            goals_inc = int(goals) if goals else 1

            player = player_dict[name]
            if pen:
                player.pens += 1
            else:
                player.goals += goals_inc

            '''
            p = i.parent.parent

            player = starting_players.get(i['alt'], sub_players.get( i['alt']))

            pen = 1 if 'Pen' in p.contents[2].contents  else 0
            goals = p.contents[3].contents
            if goals:
                goals = int(goals[0][1:][:-1])
            else:
                if pen:
                    goals=0
                else:
                    goals=1


            player.goals += goals
            player.pens += pen

            #print player
            '''
        return players
