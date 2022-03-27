##
## Loads CKA league match scorecard into Fixtures Live. A username and password is required.
##
from django.core.management.base import NoArgsCommand
from django.core.management.base import BaseCommand
from cka.season import season
from cka.models import Fixture,Match,Team,Player
from cka.views.scorecard import is_match_status_valid

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import selenium.webdriver.support.ui as ui
from selenium.webdriver.support.select import Select


def find_id( driver, id):
    return ui.WebDriverWait(driver,10).until(lambda driver: driver.find_element_by_id( id ))

def fixname( n ):

    s = "University of Cambridge "
    try:
        i = n.index(s)
        return "Cambridge University " + n[i+len(s):]
    except:
        return n

class Command(BaseCommand):

    def add_arguments(self,parser):
        parser.add_argument('login', nargs='+', type=str, required=True)
        parser.add_argument('password', nargs='+', type=str, required=True)

    def handle(self,*args,**options):

        if len(args) < 2:
            print "Login/password needed"
            return

        login_id="cphContent_cphContent_cphContent_login1_tbUserName"
        pwd_id="cphContent_cphContent_cphContent_login1_tbPassword"
        login_btn_id="btnLogin"

        driver = webdriver.Firefox()
        driver.get("https://w.fixtureslive.com/redirect.aspx?element=login")

        # Login
        login_ele = driver.find_element_by_id(login_id)
        login_ele.send_keys( args[0])

        pwd_ele=driver.find_element_by_id(pwd_id)
        pwd_ele.send_keys( args[1] )

        btn = driver.find_element_by_id(login_btn_id)
        btn.click()

        # Open the results entry page
        e = driver.find_element_by_id("slbMyAccounts")
        e.click()

        e = ui.WebDriverWait(driver,10).until(lambda driver: driver.find_element_by_xpath("//img[@alt='Post-match Details Editor']"))
        e.click()

        s = "Post match details I am editing"
        e = find_id(driver,"_ctl0_hlkFixtureListWithNoData") 
        #e = find_id(driver, "_ctl0_HyperLink3")
        #e = ui.WebDriverWait(driver,10).until(lambda driver: driver.find_element_by_xpath("//a[@alt='Post-match Details Editor']"))
        e.click()

        # List out the fixtures here
        e = find_id(driver, "_ctl0_cphPageDetails_grdFixtures")

        # idx=1 is the first entry in the list
        idx=1
        l = e.find_elements_by_class_name("datagridlist")[idx:]

        for f in l:
            players = show_fixture(driver,f)

            if players[0].home_team:
                e = find_id(driver,"_ctl0_cphPageDetails_grdFixtures__ctl" + str(idx+1) + "_btnHomeTeamLink")
            else:
                e = find_id(driver,"_ctl0_cphPageDetails_grdFixtures__ctl" + str(idx+1) + "_btnAwayTeamLink")
            e.click()

            load_fixture(driver, players)
            load_goals(driver,players)

            # Only does the first. Rerun to repeat.
            break

        e = find_id(driver, "_ctl0_HyperLink3")


def show_fixture(driver,f):
    m = f.find_elements_by_tag_name("td")
    print "HT '", m[3].text, "'' AT '" , m[5].text , "'"

    ht_name = fixname(m[3].text)
    at_name = fixname(m[5].text)

    print at_name, ht_name

    home_team = Team.objects.filter(cka__exact = True, name__startswith = ht_name).get()
    away_team = Team.objects.filter(cka__exact = True, name__startswith = at_name).get()
    fcode = home_team.code + away_team.code + "_" + season
    print fcode

    players = Match.objects.filter(fixture_code__exact = fcode).all()
    players_list = []
    for p in players:
        if p.team.club.name == "Phoenix":
            print p.player.name
            players_list.append(p)
    
    return players_list



def load_fixture(driver,players):


    # Visting the fixture for the first time 
    try:
        e = find_id(driver, "_ctl0_cphPageDetails_chkAcceptConditions")
        e.click()

        e = find_id(driver,"_ctl0_cphPageDetails_btnProceed")
        e.click()
    except:
        pass

    e = find_id(driver,"_ctl0_cphPageDetails_lnkTeamList")
    e.click()

    #e = driver.find_element_by_id("_ctl0_cphPageDetails_grdTeamSheet__ctl3_btnAdd")
    #e.click()
    e = find_id(driver,"_ctl0_cphPageDetails_rdoPlayerList_2")
    e.click()

    for p in players:

        if p.player.fl_name:
            pname = p.player.fl_name
        else:
            pname = p.player.name
        parts = pname.split(' ')
        pname = ' '.join(parts[1:]) + ", " + parts[0]

        select = driver.find_element_by_xpath("//select[@title='Type first letter of name to find a player quickly']")

        Select(select).select_by_visible_text(pname)
        e = driver.find_element_by_xpath("//input[@value='* add>']")
        e.click()

    e  = find_id(driver,"_ctl0_cphPageDetails_lnkBack")
    e.click()



def load_goals(driver,players):

    e = find_id(driver,"_ctl0_cphPageDetails_lnkScorers")
    e.click()

    for p in players:
        if p.goals + p.penalties == 0: continue

        if p.player.fl_name:
            pname = p.player.fl_name
        else:
            pname = p.player.name

        print pname, p.goals, p.penalties
        parts = pname.split(' ')
        pname = ' '.join(parts[1:]) + ", " + parts[0]

        select = driver.find_element_by_xpath("//select[@title='Type first letter of name to find a player quickly']")

        Select(select).select_by_visible_text(pname)

        e = driver.find_elements_by_class_name("datagridlist")[-1]
        e = e.find_element_by_tag_name("input")

        #import code
        #code.InteractiveConsole(locals=locals()).interact()

        e.send_keys( "\b" + str(p.goals + p.penalties) )

        e = driver.find_element_by_xpath("//input[@value='* add>']")
        e.click()

    e  = find_id(driver,"_ctl0_cphPageDetails_lnkBack")
    e.click()

