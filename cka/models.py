from django.db import models
from django.forms.widgets import to_current_timezone
from cka.cka_import import CKAImport
from cka.season import season

STATUS_CHOICES = (
        ('NONE', 'NONE'), ('1ST', '1ST'), ('2ND', '2ND'))

class Email(models.Model):
    """
    A simple table for capturing emails informing us of status tie resolutions, fixture changes etc.
    """
    id = models.IntegerField(primary_key=True)
    date = models.DateField()
    sender = models.CharField(max_length=32)
    text = models.TextField(null=True)


class Club(models.Model,CKAImport):
    """
    A club either in CKA league or a league CKA clubs play in.
    """
    code = models.CharField(max_length=8,primary_key=True)
    name = models.CharField(max_length=128)
    nl = models.BooleanField(default=False)
    cka = models.BooleanField(default=False,help_text="Club is in the CKA")
    venuecode = models.CharField(max_length=8)
    player_id_range = models.IntegerField(null=True,default=0)
    email=models.CharField(max_length=128)

    def __unicode__(self):
	    return self.name

    def __str__(self):
        return self.__unicode__()

    @classmethod
    def from_csv(self,row):
        print (row)
        row[4] = nullBlank( row[4] )
        row[2] = row[2] == 'TRUE'
        return { 'code' : row[0], 'name' : row[1], 'nl':row[2],'venuecode' : row[3], 'player_id_range':row[4]}

class Player(models.Model,CKAImport):
    """
    A player who plays in the CKA league or a league CKA clubs play in (such as SERL)
    """
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=16)
    club = models.ForeignKey(Club, on_delete=models.DO_NOTHING)
    nl =models.BooleanField()
    name = models.CharField(max_length=32)
    fl_name = models.CharField(max_length=32,blank=True,default="",help_text="Alternative name as might be in FL")
    sex = models.CharField(max_length=1)
    referee = models.BooleanField()
    inactive = models.BooleanField()
    initial_status = models.CharField(default='NONE', choices = STATUS_CHOICES,max_length=4)
    squad = models.IntegerField(default=0)
    top_four = models.BooleanField()
    u18 = models.BooleanField(help_text="Player is under 18 at start of the season.")
    transfer_to = models.IntegerField(null=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()

    @classmethod
    def find_player(self,name,club):
        try:
            return self.objects.filter( name__exact= name, club_id__exact = club.code).get()
        except Player.DoesNotExist:
            try:
                return self.objects.filter( fl_name__exact=name, club_id__exact = club.code).get()
            except Player.DoesNotExist:
                print ("Cannot find player {}".format(name))

    @classmethod
    def from_csv(self,row):

        print (row)

        row[3] = row[3] == 'TRUE'
        row[7] = row[7] == 'TRUE'
        row[8] = row[8] == 'TRUE'
        row[11] = row[11] == 'TRUE'
        row[12] = row[12] == 'TRUE'


        return { 'id' : row[0], 'code' : row[1], 'club_id':row[2], 'nl' : row[3], 'name' : row[4], 'sex' : row[5],
                 'email' : row[6], 'referee' : row[7] , 'inactive' : row[8], 'initial_status' : row[9],
                 'squad' : row[10] , 'top_four' : row[11], 'u18' : row[12], 'dob' : row[13], 'transfer_to' : None if row[14] == '' else row[14] }

class NamedPlayerDoesNotExist(Exception):

    def __init__(self,name,team):
        self.name = name
        self.team = team

    def __str__(self):
        return "Player {0}, {1} not in database".format(self.name, self.team)


class PlayerStatus(models.Model,CKAImport):
    """
    The status of a player in the CKA league.
    """
    player = models.ForeignKey(Player, related_name='+',null=True,on_delete=models.DO_NOTHING)
    year = models.IntegerField()
    period = models.IntegerField()

    # This is combined SERL/CKA and will determine ordering
    status = models.IntegerField(null=True,help_text="1 indicates 1st team status, 2 indicates 2nd team status")

    # Status split into SERL and CKA
    cka_status = models.IntegerField(null=True,help_text="1 indicates 1st team status, 2 indicates 2nd team status")
    serl_status= models.IntegerField(null=True,help_text="1 indicates has SERL status, 0 otherwise")

    serl_score  = models.IntegerField()
    first_score = models.IntegerField()
    second_score = models.IntegerField()
    serl_indicator = models.CharField(max_length=8)
    first_indicator = models.CharField(max_length=8)
    second_indicator = models.CharField(max_length=8)
    tie = models.CharField(max_length=8)

    @classmethod
    def from_csv(self,row):
        return { "id" : row[0], "player_id" : row[1], "year":row[2], "period":row[3], "status":row[4]}

class StatusOverride(models.Model):
    """
    Used to override status calculations. Typically used to resolve status ties.
    """
    id = models.IntegerField(primary_key=True)
    player = models.ForeignKey(Player, related_name='+',null=True,on_delete=models.DO_NOTHING)
    year = models.IntegerField()
    period = models.IntegerField()
    status = models.IntegerField(help_text="1 indicates 1st team status, 2 indicates 2nd team status")
    email = models.ForeignKey(Email, related_name='+',null=True,blank=True,on_delete=models.DO_NOTHING)


class StatusPoints(models.Model,CKAImport):
    """
    Table to capture how status points are calculated based on count_code as per CKA league rules.
    """
    id = models.IntegerField(primary_key=True)
    count_code = models.CharField(max_length=4,null=True)
    first_team_pt = models.IntegerField(help_text="First team status points.")
    second_team_pt = models.IntegerField(help_text="Second team status points.")
    hex_code = models.CharField(max_length=1,null=True)
    on_text = models.CharField(max_length=32,null=True)
    off_text = models.CharField(max_length=32,null=True)
    on_text_short = models.CharField(max_length=32,null=True)
    off_text_short = models.CharField(max_length=32,null=True)

    @classmethod
    def from_csv(self,row):
        return {"count_code":row[0], "first_team_pt":row[1], "second_team_pt":row[2],
            "id":row[3],"hex_code":row[4],"on_text":row[5], "off_text":row[6] }



class Team(models.Model,CKAImport):
    """
    A team that plays in the CKA league or a league CKA clubs play in.
    """

    code = models.CharField(max_length=16,primary_key=True)
    club = models.ForeignKey(Club,on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=32)
    short_name = models.CharField(max_length=32)
    first_team = models.BooleanField()
    second_team = models.BooleanField()
    class_name = models.CharField(max_length=16)
    cka = models.BooleanField(help_text="Indicates that team is in CKA league.")
    fixtures_live = models.IntegerField(null=True,help_text="ID of team in Fixtures Live")
    dev_team = models.BooleanField(help_text="Indicates that team is a development team. Matches involving this team do not count toward league points.")
    inactive = models.BooleanField(default=False,help_text="Indicates that team is not to be shown in picklists for teams for scroecards etc for current season")

    def matches(self):
        return Fixture.objects.filter( division__exact = self.division, home_team__exact = self.code)

    def __unicode__(self):
        return self.club.name + " " + self.name

    def __str__(self):
        return self.__unicode__()

    @property
    def level(self):
        if len(self.code) < 4:
            return 0
        return int(self.code[3])

    @classmethod
    def from_csv(self,row):
        print (row)
        row[8] = nullBlank( row[8] )

        return { "code" : row[0], "club_id" : row[1], "name" : row[2], "short_name" : row[3],
        "first_team" : row[4] == "TRUE", "division" : row[5],
        "class_name" : row[6], "cka" : row[7]=="TRUE", "fixtures_live" : row[8], "dev_team" : row[9] == "TRUE"}


class Venue(models.Model,CKAImport):
    """
    Venue details.
    """
    code = models.CharField(max_length=16,primary_key=True)
    name = models.CharField(max_length=32)
    fixtures_live = models.IntegerField(null=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()

    @classmethod
    def from_csv(self,row):
        row[2] = nullBlank( row[2] )
        return {"code" : row[0], "name" : row[1], "fixtures_live" : row[2] }


class Period(models.Model):
    """
    Status period details for a season.
    """
    id =  models.IntegerField(primary_key=True)
    season = models.CharField(max_length=4)
    number = models.IntegerField()
    date_from = models.DateField()
    date_to = models.DateField()

# Had to delete most of foreign key constraints for this table so that data from old DB could be loaded.
class Fixture(models.Model):
    """
    A fixture in the league. Once a fixture is played the remaining fields are filled in from the scorecard.
    """
    code = models.CharField(max_length=16,primary_key=True)
    season = models.CharField(max_length=4,help_text="Season fixture occurs in e.g. 2013 for the 2013-2014 season.")
    division = models.CharField(max_length=16)
    match = models.CharField(max_length=24)
    week = models.IntegerField(null=True)
    date = models.DateTimeField()
    time = models.DateTimeField(null=True, blank=True)
    period = models.IntegerField(default=1,null=True,blank=True)

    home_team = models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    away_team = models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    referee_team = models.ForeignKey(Team, related_name='+',null=True,blank=True,on_delete=models.DO_NOTHING)
    home_captain = models.ForeignKey(Player, related_name='+',null=True,blank=True,on_delete=models.DO_NOTHING)
    away_captain = models.ForeignKey(Player, related_name='+',null=True,blank=True,on_delete=models.DO_NOTHING)
    referee = models.ForeignKey(Player, related_name='+',null=True,blank=True,on_delete=models.DO_NOTHING)

    home_score = models.IntegerField(default=0,null=True,blank=True)
    away_score = models.IntegerField(default=0,null=True,blank=True)
    home_score_halftime = models.IntegerField(default=0,null=True,blank=True)
    away_score_halftime = models.IntegerField(default=0,null=True,blank=True)
    notes = models.TextField(null=True,blank=True)
    private_notes = models.TextField(null=True,blank=True)
    notes_by = models.CharField(max_length=128,null=True,blank=True)
    date_received = models.DateField(null=True,blank=True)
    by_hand = models.BooleanField()

    venue = models.ForeignKey(Venue,related_name='+',null=True,on_delete=models.DO_NOTHING)
    match_result = models.IntegerField(default=0,null=True,blank=True)
    ref_home_rating = models.IntegerField(default=0,null=True,blank=True)
    ref_away_rating = models.IntegerField(default=0,null=True,blank=True)

    fixtures_live_id = models.IntegerField(null=True,blank=True)
    score_in_fixtures_live = models.BooleanField()
    cancelled= models.BooleanField()

    # Match is a inter-division playoff match.
    playoff = models.BooleanField()

    # Ignore this match when considering player status.
    ignore_for_status= models.BooleanField()

    changestatus = models.CharField(max_length=9,null=True,blank=True,help_text='Blank, "CP" - Change Pending, "CA" - Change Approved')
    changenotes = models.TextField(null=True,blank=True,help_text="If this fixture was changed and why")

    status_valid =  models.CharField(max_length=1, default='M', help_text="Do both teams comply with status rules")
    player_valid  = models.CharField(max_length=1,default='M',help_text="Do all players exist in the database")

    @property
    def home_score_text(self):
        if self.cancelled:
            return "Cancelled"
        else:
            return "" if self.home_score == None else self.home_score

    @property
    def away_score_text(self):
            return "" if self.away_score == None else self.away_score

    @property
    def home_score_halftime_text(self):
        return "" if self.home_score_halftime == None else self.home_score_halftime

    @property
    def away_score_halftime_text(self):
        return "" if self.away_score_halftime == None else self.away_score_halftime


    @property
    def division_text(self):
        return "NL" if self.division == "NL" else "SERL" if self.division == "-1" or self.division == "-2" else self.division

    def time_text(self):
        t = to_current_timezone(self.date).strftime("%H:%M")
        return "" if t == "00:00" else t

    def date_text(self):
        t = to_current_timezone(self.date).strftime("%d-%b-%Y")
        return t

    # When updating record via admin, it puts in NULL for this field which comes out as None and not blank
    @property
    def changestatus_text(self):
        return ("" if self.changestatus == None else self.changestatus)

    @property
    def season_period(self):
        period = Period.objects.filter(season__exact = self.season,date_from__lte = self.date, date_to__gte = self.date).get()
        return period.number

    @property
    def season_week(self):
        season_start = Period.objects.filter(season__exact = self.season,number__exact=1).get().date_from
        diff = self.date.date() - season_start
        return diff.days/7 + 1

    '''
    def __unicode__(self):
        return self.time.strftime("%a %d-%b-%y %H:%M") + ", " + self.home_team.__unicode__() + " vs " + self.away_team.__unicode__()
    '''
    def __str__(self):
        return self.code


class LeagueTable(models.Model):
    """
    CKA league table.
    """
    id =  models.IntegerField(primary_key=True)

    season = models.IntegerField(default=2014)

    seqno = models.IntegerField(default=0)

    team =  models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    division = models.CharField(max_length=16)
    played = models.IntegerField(default=0)

    home_won  = models.IntegerField(default=0)
    home_drawn  = models.IntegerField(default=0)
    home_lost  = models.IntegerField(default=0)
    home_goals_for = models.IntegerField(default=0)
    home_goals_aga = models.IntegerField(default=0)

    away_won  = models.IntegerField(default=0)
    away_drawn  = models.IntegerField(default=0)
    away_lost  = models.IntegerField(default=0)
    away_goals_for = models.IntegerField(default=0)
    away_goals_aga = models.IntegerField(default=0)

    goal_diff  = models.IntegerField(default=0)
    score = models.IntegerField(default=0)

    dev_team = models.BooleanField(default=False)

    @property
    def dev_team_score(self):
        return 1 if self.dev_team else 0

class PlayerStatistics(models.Model):
    """
    Player statistics for the season.
    """
    player = models.ForeignKey(Player, related_name='+',on_delete=models.DO_NOTHING)
    team =  models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    division = models.CharField(max_length=16)
    first_team = models.BooleanField()
    initial_count = models.IntegerField(default=0)
    count = models.IntegerField(default=0)
    games = models.FloatField(default=0)
    nl_count = models.IntegerField(default=0)
    nl_games = models.IntegerField(default=0)
    status = models.CharField(default='NONE', choices = STATUS_CHOICES,max_length=4)
    goals = models.IntegerField(default=0)
    penalties = models.IntegerField(default=0)
    total= models.IntegerField(default=0)
    nl_goals= models.IntegerField(default=0)
    nl_penalties = models.IntegerField(default=0)
    nl_total = models.IntegerField(default=0)
    season = models.CharField(max_length=4)
    goal_avg = models.FloatField(default=0)

    @property
    def games_text(self):
        return "%.2f" % self.games

#
class Match(models.Model):
    """
    Individual player performance for a fixture that has been played.
    We allow player to be none as this record might indicate a sub off but
    no player went on; for example an injured player not replaced.
    """

    fixture_code = models.CharField(max_length=16,null=True)
    player_num = models.IntegerField(default=0)
    home_team = models.BooleanField()
    player = models.ForeignKey(Player, related_name='+',on_delete=models.DO_NOTHING,blank=True, null=True)
    team = models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    goals= models.IntegerField(null=True)
    status= models.IntegerField(null=True,help_text="Player status at the time the match was played.")
    penalties = models.IntegerField(null=True)
    yellow_card = models.BooleanField()
    red_card = models.BooleanField()
    sub_for_player = models.IntegerField(null=True,blank=True)
    sub_at = models.CharField(max_length=3,null=True,blank=True)
    count_code = models.CharField(max_length=4,null=True,help_text="Indicator of the quarters of the match played in.")
    u18 = models.BooleanField()

    # New fields to handle new substitution rule starting 2017 season.
    on_court = models.CharField(max_length=10,null=True,blank=True, help_text="When player came onto court")
    off_court = models.CharField(max_length=10,null=True,blank=True, help_text="When player left court")
    status_points = models.IntegerField(null=True,help_text="Status points accured")
    gametime = models.FloatField(default=1, help_text="Fraction of game player was on court for")

#
# These tables hold match results that are being 'staged' before
# we approve them and push them into the main tables
#
class FixtureStaging(models.Model):
    """
    Fixture staging table for loading of scorecards.
    """

    # Before the match
    code = models.CharField(max_length=16,primary_key=True)
    season = models.CharField(max_length=4)
    division = models.CharField(max_length=16)
    match = models.CharField(max_length=16)
    week = models.CharField(max_length=16)
    date = models.DateTimeField()
    time = models.DateTimeField(null=True)
    period = models.IntegerField(default=1,null=True)
    referee_team = models.ForeignKey(Team, related_name='+',null=True,on_delete=models.DO_NOTHING)
    venue = models.ForeignKey(Venue,related_name='+',null=True,on_delete=models.DO_NOTHING)

    home_team = models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    away_team = models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)

    # After the match
    home_captain = models.ForeignKey(Player, related_name='+',null=True,on_delete=models.DO_NOTHING)
    away_captain = models.ForeignKey(Player, related_name='+',null=True,on_delete=models.DO_NOTHING)
    referee = models.ForeignKey(Player, related_name='+',null=True,on_delete=models.DO_NOTHING)

    home_score = models.IntegerField(default=0,null=True)
    away_score = models.IntegerField(default=0,null=True)
    home_score_halftime = models.IntegerField(default=0,null=True)
    away_score_halftime = models.IntegerField(default=0,null=True)
    notes = models.TextField(null=True)
    private_notes = models.TextField(null=True,blank=True)
    notes_by = models.CharField(max_length=128,null=True)
    date_received = models.DateField(null=True)
    by_hand = models.BooleanField()

    match_result = models.IntegerField(default=0,null=True)
    ref_home_rating = models.IntegerField(default=0,null=True)
    ref_away_rating = models.IntegerField(default=0,null=True)

    status_valid =  models.CharField(max_length=1, default='M', help_text="Do both teams comply with status rules")
    player_valid  = models.CharField(max_length=1,default='M',help_text="Do all players exist in the database")


    @property
    def home_score_halftime_text(self):
        return "" if self.home_score_halftime == None else self.home_score_halftime

    @property
    def away_score_halftime_text(self):
        return "" if self.away_score_halftime == None else self.away_score_halftime

    @property
    def division_text(self):
        return "SERL" if self.division == "-1" else self.division

class MatchStaging(models.Model):
    """
    Match staging table for loading of scorecards.
    """

    fixture_code = models.CharField(max_length=16,null=True)
    player_num = models.IntegerField(default=0)
    home_team = models.BooleanField()
    player = models.ForeignKey(Player, related_name='+',null=True,blank=True,on_delete=models.DO_NOTHING)
    team = models.ForeignKey(Team, related_name='+',on_delete=models.DO_NOTHING)
    goals= models.IntegerField(null=True)
    penalties = models.IntegerField(null=True)
    yellow_card = models.BooleanField()
    red_card = models.BooleanField()
    sub_for_player = models.IntegerField(null=True)
    sub_at = models.CharField(max_length=3,null=True)
    count_code = models.CharField(max_length=4,null=True)
    u18 = models.BooleanField()
    status= models.IntegerField(null=True)
    player_name = models.CharField(max_length=32,null=True,help_text="Used if player does not appear in player list")

    on_court = models.CharField(max_length=10,null=True,blank=True, help_text="When player came onto court")
    off_court = models.CharField(max_length=10,null=True,blank=True, help_text="When player left court")
    status_points = models.IntegerField(null=True,help_text="Status points accured")
    gametime = models.FloatField(default=1, help_text="Fraction of game player was on court for")

class ChangeLog(models.Model):
    """
    Changes changes to fixtures once they have been locked in at start of season.
    """

    id = models.IntegerField(primary_key=True)
    fixture_code = models.CharField(max_length=16,help_text="Code for fixture being changed")
    requester = models.CharField(max_length=64,help_text="Person requesting change")
    submit_date = models.DateTimeField()
    status = models.CharField(max_length=16,null=True,help_text="One of 'Pending', 'Approved', 'Rejected' , 'Withdrawn' ")
    change_type = models.CharField(max_length=16,null=True,help_text="One of 'Date Change', 'Venue Change', 'Ref Change'")
    change_description =  models.TextField(null=True)
    home_approved_date = models.DateTimeField(null=True,help_text="Date home team approved change.")
    away_approved_date = models.DateTimeField(null=True,help_text="Date away team approved change.")
    ref_approved_date = models.DateTimeField(null=True,help_text="Date ref team approved change.")
    cka_approved_date = models.DateTimeField(null=True,help_text="Date CKA officers approved change.")

    old_date = models.DateTimeField(null=True)
    old_venue = models.CharField(max_length=16,null=True)
    old_referee = models.CharField(max_length=16,null=True)

    new_date = models.DateTimeField(null=True)
    new_venue = models.CharField(max_length=16,null=True)
    new_referee = models.CharField(max_length=16,null=True)

def nullBlank( s ):
    return None if s == "" else s



class SERLPlayer(models.Model,CKAImport):
    """
    Tracking SERL/NL matches a player plays for calculate status points for period
    """
    id =  models.IntegerField(primary_key=True)
    season = models.CharField(max_length=4)
    club = models.CharField(max_length=8)
    name = models.CharField(max_length=128)
    period = models.IntegerField()
    matches = models.IntegerField()