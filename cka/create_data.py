
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from cka.models import Club,Team,Player,Venue,StatusPoints,PlayerStatus

#
# See https://docs.djangoproject.com/en/dev/ref/applications/#django.apps.AppConfig.ready
# for how to do this in 1.7
#
# Not using whatever facilities South has for migration as this is a learning curve
#


def create_data():
	"""
	Create data from CKA database
	"""
	return

	print ("Creating data...")

	content_type = ContentType.objects.get_for_model(Club)

	clubs = Club.objects.filter(cka__exact = True).all()

	for a_club in clubs:
		(group, created) = Group.objects.get_or_create(name= "Club Admin - " + a_club.name)
		(perm, created)  = Permission.objects.get_or_create(codename= "club_admin_" +a_club.code ,name= group.name, content_type=content_type)

		#print group, perm
		#print group.permissions.add(perm)
		#print group.permissions.all()

	(grp,created) = Group.objects.get_or_create(name="League Administrator")
	(perm,created) = Permission.objects.get_or_create(codename="league_admin", name="League Administrator",content_type=content_type)
	grp.permissions.add(perm) # Doesn't matter if this gets added > 1

	(grp,created) = Group.objects.get_or_create(name="Match Referee")
	(perm,created) = Permission.objects.get_or_create(codename="match_referee", name="Match Referee",content_type=content_type)
	grp.permissions.add(perm)

	Club.import_data(open("cka/data/club.csv")) # Model has changed
	Team.import_data(open("cka/data/team.csv"))
	Venue.import_data(open("cka/data/venue.csv"))
	Player.import_data(open("cka/data/player.csv"))
	StatusPoints.import_data(open("cka/data/statuspoints.csv"))
	PlayerStatus.import_data(open("cka/data/playerstatus.csv"))



#create_data()
