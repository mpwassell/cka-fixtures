# coding=utf-8
##
## Load SERL and NL fixtures from a CSV constructed from FixturesLive fixtures page for a team.
## See E:\Mark\CKAWebSite\Fixtures2019\tigers_nl.csv for an example.
## Insturctions on how to get the CSV file:
## 1. Goto to FL fixtures page for the team
## 2. Get hold of the table HTML
## 3. Goto CSV converter http://convertcsv.com/html-table-to-csv.htm
## 4. Copy and paste the HTML. Click 'Remove line breaks'
## 5. The the CSV and copy into a CSV file. Remove junk to get a line like:
## Birmingham City 1,13:15,EKNL EKL,28.10.18 12:45,H,PERS,2161179
##

import time
from django.core.management.base import BaseCommand

from cka.models import Player,Club, Fixture, Period, Team, Venue
from cka.season import season

class Command(BaseCommand):

    # Map from FL venue codes to CKL
    venue_map = { 'The Perse School' : 'PERSE',
                        'HARROW LEISURE CENTRE' : 'HAR',
                        'Bletchely Leisure Centre' : 'BLC',
                        'Cambridge Regional College' : 'CRC',
                        'UEA Sportspark' : 'UEA',
                        'The Perse School for Boys' : 'PERSE',
                        'New Line Learning Academy Kent' : 'NLLAK',
                        'Aylesford School Sports College' : 'AYLESFORD',
                        'PERS' : 'PERSE',
                        'KSC' : 'KSC',
                        'WS' : 'NLAWAY',
                        'ASC' : 'AYLESFORD',
                        'WC' : 'NLAWAY',
                        'TSSC' : 'NLAWAY',
                        'SP' : 'UEA'
                        }

    team_map_serl = { 'Cambridge City 1' : 'Cambridge City SERL',
                    'Cambridge Phoenix 1' : 'Cambridge Phoenix SERL',
                    'Norfolk Dragons 1' : 'Norwich Dragons',
                    'Harrow Vultrix Senior 1st' : 'Harrow Vultrix 1',
                    'Cambridge Tigers 1': 'Cambridge Tigers SERL',
                    'Kingfishers 2' : 'Kingfisher 2',
                    'Tornadoes 2' : 'Kent Tornadoes 2',
                    'KV 2' : 'KwiekVicta 2',
                    'Milton Keynes Lakers 1': 'Milton Keynes Lakers SERL',
                    'Supernova 1' : 'Supernova'
                    }

    team_map = {
            'Tigers 1' : 'Cambridge Tigers NL',
            'Norwich Knights 1' : 'Norwich Knights 1',
            'Tornadoes 1' :  'Kent Tornadoes',
            'Tornadoes 2' :  'Kent Tornadoes 2',
            'Nomads 1' : 'Nomads' ,
            'Kingfisher 1' : 'Kingfisher 1',
            'Bearsted 1' : 'Bearsted 1',
            'Birmingham City 1' : 'Birmingham',
            'Trojans 1' : 'Trojans NL',
            'Bec 1' : 'Bec NL',
            'KV 1' : 'Kwiek',
            'KV 2' : 'KwiekVicta 2',
            'Bristol Thunder 1' : 'Bristol Thunder',
            'Harrow Vultrix Senior 1st'  : 'Harrow',
            'Cambridge City 1' : 'Cambridge City SERL',
            'Highbury 1' : 'Highbury',
            'Cambridge Tigers 2' : 'Cambridge Tigers SERL',
            'Croydon 1' : 'Croydon',
            'Supernova 1' : 'Supernova'
            }

    def handle(self, *args, **options):
        ##
        ##

        team_name = "Cambridge Tigers NL"
        division="NL"
        filename = r"E:\Mark\CKAWebSite\Fixtures" + season + r"\tigers_nl.csv"

        team_name = "Cambridge Tigers SERL"
        division="SERL"
        filename = r"E:\Mark\CKAWebSite\Fixtures" + season + r"\tigers_serl.csv"

        #team_name = "Cambridge City SERL"
        #division="SERL"
        #filename = r"E:\Mark\CKAWebSite\Fixtures" + season + r"\city_serl.csv"

        #Fixture.objects.filter(season__exact=season,division='SERL').delete()

        with open(filename,"r") as f:
            for line in f:
                data = line.split(",")

                date = data[3]
                date = time.strptime(date, '%d.%m.%y %H:%M')
                venue_code = self.venue_map.get(data[5].strip(), data[5].strip())
                fl_code =  data[6].strip()
                if data[4] == 'A':
                    home_name = str(self.team_map.get(data[0], data[0]))
                    away_name = team_name
                else:
                    away_name = str(self.team_map.get(data[0], data[0]))
                    home_name = team_name

                #print "{} {} {} {}".format(home_name,away_name,venue_code, date)

                try:
                    home_team = Team.objects.filter(name__exact = home_name, cka__exact=False).get()
                except Team.MultipleObjectsReturned:
                    print ("MULTIPLE: ", data[3])
                    continue
                except Team.DoesNotExist:
                    print ("NOT FOUND: ", data[3], home_name)
                    continue

                try:
                    away_team = Team.objects.filter(name__exact = away_name, cka__exact=False).get()
                except Team.MultipleObjectsReturned:
                    print ("MULTIPLE: ", away_name)
                    continue
                except Team.DoesNotExist:
                    print ("NOT FOUND: ", away_name)
                    continue

                code = home_team.code + away_team.code + "_" + season

                print ("Code = {} Date={}".format(code, date))
                match = "0"

                week = int(time.strftime("%U", date)) - 38

                if week < 0:
                    week += 36+16

                ds = time.strftime('%Y-%m-%d',date)
                sp = Period.objects.filter(season__exact = season, date_from__lte = ds, date_to__gte = ds).get()

                f = Fixture(code=code,season=season,division=division,match=match,week=week,
                    date=ds,home_team_id=home_team.code,away_team_id=away_team.code,
                    by_hand=False,score_in_fixtures_live=False,
                    cancelled=False,ignore_for_status=False,home_score=None,
                    away_score=None,notes=None,home_score_halftime=None,away_score_halftime=None,
                    venue_id=venue_code, changenotes=None,changestatus="",period=sp.number,
                    fixtures_live_id=fl_code,
                    playoff=False)
                f.save()



    def handle_noargs_old2(self, **options):
        ##
        ## This loads from a CSV file built from a 'screen scrape' of the SERL/NL fixtures
        ## on the FL page
        ## Format expected is for example:
        ## "Sunday, December 17, 2017",14:15,PERS,Cambridge Tigers 1 ,Norwich Knights 1,16:37,2080734

        filename = r"E:\Mark\CKAWebSite\Fixtures" + season + r"\NationalLeague.csv"
        headers="CompetitionID,FixtureID"

        #Fixture.objects.filter(season__exact=season,division='SERL').delete()

        with open(filename,"r") as f:
            for line in f:
                if line[: len(headers)] == headers: continue
                data = line.split(",")

                date = data[0] +  " " + data[1]
                #date = time.strptime(date, '%d.%m.%y %H:%M')
                date = time.strptime(date, '%A %B %d %Y %H:%M')

                venue_code = venue_map.get(data[2].strip(), data[2].strip())
                home_name = str(team_map.get(data[3], data[3]))
                away_name = str(team_map.get(data[4], data[4]))
                print (away_name)

                fl_code =  data[6].strip()
                try:
                    home_team = Team.objects.filter(name__exact = home_name, cka__exact=False).get()
                except Team.MultipleObjectsReturned:
                    print ("MULTIPLE: ", data[3])
                    return
                except Team.DoesNotExist:
                    print ("NOT FOUND: ", data[3], home_name)
                    return

                try:
                    away_team = Team.objects.filter(name__exact = away_name, cka__exact=False).get()
                except Team.MultipleObjectsReturned:
                    print ("MULTIPLE: ", data[4])
                    return
                except Team.DoesNotExist:
                    print ("NOT FOUND: ", data[4], away_name)
                    return

                try:
                    venue = Venue.objects.filter(code__exact = venue_code).get()
                except Venue.MultipleObjectsReturned:
                    print ("MULTIPLE: ", data[6])
                    return
                except Venue.DoesNotExist:
                    print ("NOT FOUND: ", data[6])
                    return

                if not home_team.club.cka and not away_team.club.cka: continue

                code = home_team.code + away_team.code + "_" + str(season)

                week = int(time.strftime("%U", date)) - 38

                if week < 0:
                    week += 36+16

                ds = time.strftime('%Y-%m-%d',date)
                sp = Period.objects.filter(season__exact = season, date_from__lte = ds, date_to__gte = ds).get()

                date = time.strftime('%Y-%m-%d %H:%M',date)

                print (sp.number, week, date, code, fl_code)

                fixture_id = 0
                match = 0

                f = Fixture(code=code,season=season,division='NL',match=match,week=week,
                    date=date,home_team_id=home_team.code,away_team_id=away_team.code,
                    by_hand=False,score_in_fixtures_live=False,
                    cancelled=False,ignore_for_status=False,home_score=None,
                    away_score=None,notes=None,home_score_halftime=None,away_score_halftime=None,
                    venue_id=venue_code, changenotes=None,changestatus="",period=sp.number,
                    fixtures_live_id=fl_code,
                    playoff=False)
                f.save()


    def handle_noargs_old(self, **options):
        ##
        ## This loads from a spreadsheet download from FL. Unfortunately as of 2016
        ## it seems this is no longer possible for someone who isn't SERL admin
        ##

        filename = r"E:\Mark\CKAWebSite\Fixtures" + season + r"\serl.csv"
        headers="CompetitionID,FixtureID"

        Fixture.objects.filter(season__exact=season,division='SERL').delete()

        # Map from FL venue codes to CKL
        venue_map = { 'PERS' : 'PERSE', 'SP' : 'UEA', 'DSC' : 'DAYNES', 'ASC' : 'AYLESFORD', 'HRST' : 'HILLS'}


        with open(filename,"r") as f:
            for line in f:
                if line[: len(headers)] == headers: continue
                data = line.split(",")

                comp_id = data[0]
                fixture_id = data[1]
                date = data[2] +  " " + data[3]
                date = time.strptime(date, '%d/%m/%Y %H:%M')

                home_id = data[4]
                away_id = data[9]
                venue_id = data[12]

                venue_id = venue_map.get(venue_id, venue_id)

                try:
                    home_team = Team.objects.filter(fixtures_live__exact = home_id, cka__exact=False).get()
                except Team.MultipleObjectsReturned:
                    print ("MULTIPLE: ", data[5])
                    return
                except Team.DoesNotExist:
                    print ("NOT FOUND: ", data[5])
                    return

                try:
                    away_team = Team.objects.filter(fixtures_live__exact = away_id, cka__exact=False).get()
                except Team.MultipleObjectsReturned:
                    print ("MULTIPLE: ", data[10])
                    return
                except Team.DoesNotExist:
                    print ("NOT FOUND: ", data[10])
                    return

                if not home_team.club.cka and not away_team.club.cka: continue

                code = home_team.code + away_team.code + "_" + str(season)

                week = int(time.strftime("%U", date)) - 38

                if week < 0:
                    week += 36+16

                ds = time.strftime('%Y-%m-%d',date)
                sp = Period.objects.filter(season__exact = season, date_from__lte = ds, date_to__gte = ds).get()

                date = time.strftime('%Y-%m-%d %H:%M',date)

                print (sp.number, week, date, code)

                f = Fixture(code=code,season=season,division='SERL',match=data[10].rstrip(),week=data[9],fixtures_live_id=fixture_id,
                    date=date,home_team_id=home_team.code,away_team_id=away_team.code,by_hand=False,score_in_fixtures_live=False,
                    cancelled=False,ignore_for_status=False,home_score=None,away_score=None,notes=None,home_score_halftime=None,away_score_halftime=None,
                    venue_id=venue_id, changenotes=None,changestatus="",period=sp.number)
                f.save()
