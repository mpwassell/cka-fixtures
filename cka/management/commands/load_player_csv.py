##
## Load players from CSV
##
from django.core.management.base import NoArgsCommand

from cka.models import Player
from cka.models import Club
from cka.season import season

class Command(NoArgsCommand):
    def handle_noargs(self, **options):
        self.load_player_updates()

    def load_new_players(self):
        filename = r"E:\Mark\CKAWebSite\Players2016\lakers.csv"
        club_name="MKL"
        do_update=False
        start_id=9000

        num=1
        with open(filename,"rb") as f:

            for line in f:
                data = line.rstrip().split(",")

                new_player = Player(id=start_id + num, club_id=club_name, sex = data[1],name= data[0], 
                                u18=data[2] == 'Y',
                                nl=False,inactive=False, referee=False, top_four=False)
                new_player.save()
                num=num+1


    def load_player_updates(self):
        dir=r"E:\Mark\CKAWebSite\CKAServer\cka-fixtures\data\2018\\"
        #filename = r"E:\Mark\CKAWebSite\Players2017\lions.csv"
        #filename = r"E:\Mark\CKAWebSite\Players2017\vikings.csv"
        #filename = r"E:\Mark\CKAWebSite\Players2017\tigers.csv"
        #filename = r"E:\Mark\CKAWebSite\Players2017\lakers.csv"
        filename = dir + "tigers.csv"
        club_name="TIG"
        do_update=True

        with open(filename,"rb") as f:
            currentPlayer=True
            do_process=False
            print "** Current Players **"
            for line in f:
                data = line.rstrip().split(",")
                print data

                if data[0] == 'ID': 
                    do_process=True
                    print "Switching to process"
                    continue
                else:
                    if not do_process: 
                        print "Skipping"
                        continue

                if len(data) < 5: continue

                if len( data[0] ) == 0:
                    print "** New Players **"
                    currentPlayer = False
                else:
                    currentPlayer=True

                if currentPlayer:

                    try:
                        p = Player.objects.filter(id__exact = data[0], club_id__exact=club_name).get()
                    except Player.DoesNotExist:
                        print "Missing player ",data[1]
                    except Player.MultipleObjectsReturned:
                        print "Multiple entries ",data[1]

                    #print data
                    if len(data) == 6 and len(data[5]) > 0:
                        print p.name, " Message: ", data[5]

                    if data[1] != p.name:
                        print p.name, " Name change to ", data[1]
                        p.name = data[1]

                    if data[2] != p.sex:
                        print p.name, " Sex change to ", data[2]
                        p.sex = data[2]

                    if (data[3] == 'TRUE') != p.u18:
                        print p.name, " U18 change to ", data[3]
                        p.u18 = (data[3] == 'TRUE')

                    if (data[4] == 'FALSE') != p.inactive:
                        print p.name, " Activity change to ", data[4]
                        p.inactive = (data[4] == 'FALSE')

                    if do_update:
                        p.save()

                else:
                    p = None
                    try:
                        p = Player.objects.filter(name__exact = data[1], club_id__exact=club_name).get()
                    except Player.DoesNotExist:
                        pass

                    if p:
                        print "New player exists ", p.id, p.name
                        continue

                    p = Player(name=data[1], club_id=club_name, u18=data[3], inactive=False, sex=data[2],referee=False,nl=False,
                        top_four=False)
                    if do_update:
                        p.save()
                    print "  Add player ", data[1]


class Command2015(NoArgsCommand):
    def handle_noargs(self, **options):
        filename = r"E:\Mark\CKAWebSite\Players2015\phoenix.csv"
        club_name="PHO"
        do_update=True

        with open(filename,"rb") as f:
            for line in f:
                data = line.rstrip().split(",")
                if data[0] == 'Name': continue
                
                if len(data) < 4: continue

                try:
                    p = Player.objects.filter(name__exact = data[0], club_id__exact=club_name).get()
                except Player.DoesNotExist:
                    print "Missing player ",data[0]
                except Player.MultipleObjectsReturned:
                    print "Multiple entries ",data[0]

                change = data[3].lower()

                if change == "new":
                    print "New player", data[0]
                    continue

                if (p.u18 and change == "o18"):
                    print "Should be O18 ", data[0]
                    if do_update:
                        p.u18 = False
                        p.save()

                if not p.u18 and change == "u18":
                    print "Should be U18 ", data[0]
                    if do_update:
                        p.u18 = True
                        p.save()

                if not p.inactive and change == "inactive":
                    print "Deactivate ", data[0]
                    if do_update:
                        p.inactive = True
                        p.save()

                if p.inactive and change == "":
                    print "Should be active ", data[0]

