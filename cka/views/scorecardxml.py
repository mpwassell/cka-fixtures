from xml.dom import minidom

import logging
logger = logging.getLogger(__name__)

def getElementText( dom, tag ):
	es = dom.getElementsByTagName(tag)
	if es.length > 0:
		return getText( es[0].childNodes )
	else:
		return ""

def getText(nodelist):
    rc = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc.append(node.data)
    return ''.join(rc)


class ScoreCard:
    pass

class ScoreCardPlayer:
    pass

def processResultsXMLHelper(xml_string ):
	""" Turn scorecard XML into intermediate object. The latter can be used when scorecards are entered directly"""

	card = ScoreCard()

	dom = minidom.parseString(xml_string)

	card.home_team = getElementText(dom,"HomeTeam")
	card.away_team = getElementText(dom,"AwayTeam")

	card.home_score = getElementText(dom,"FullTime").split("-")[0]
	card.away_score = getElementText(dom,"FullTime").split("-")[1]
	card.home_score_halftime = getElementText(dom,"HalfTime").split("-")[0]
	card.away_score_halftime = getElementText(dom,"HalfTime").split("-")[1]

	card.division =  getElementText(dom,"Division")
	card.date =  getElementText(dom,"Date")

	card.home_captain = getElementText(dom,"HomeCaptain")
	card.away_captain = getElementText(dom,"AwayCaptain")

	card.ref_name = getElementText(dom, "Referee")

	card.notes = getElementText(dom, "Notes")
	card.notes_by = getElementText(dom, "NotesBy")
	card.private_notes = getElementText(dom, "PrivateNotes")

	card.sub_date = getElementText(dom, "SubmittedDate")
	card.ref_home_rating  = getElementText(dom, "RefHomeRating")
	card.ref_away_rating  = getElementText(dom, "RefAwayRating")

	card.home_players = processXMLPlayers(dom,"H")
	card.away_players = processXMLPlayers(dom,"A")

	return card


def processXMLPlayers(dom, tag ):
	plist = []

	# Note that player number (ie p) starts from 0
	for p in range(16):

		pdata = getElementText(dom,tag+str(p+1)).split(",")
		player = ScoreCardPlayer()

		if len(pdata) > 1:
			logger.info("Player data {} ".format( str(pdata) ))
			player.name = pdata[0]
			player.u18  = pdata[1].strip()
			player.pens  = pdata[2].strip()
			player.goals = pdata[3].strip()

			print (pdata)

			if len(pdata) > 4:
				player.for_player = pdata[4].strip()
				if len(pdata) > 5: player.when  = pdata[5].strip()  # For SERL scorecards this is currently optional
				else: player.when = None
			else:
				player.for_player = None
				player.when = None
		else:
			player.name = None

		plist.append(player)

	return plist
