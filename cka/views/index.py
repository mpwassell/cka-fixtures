# Create your views here.
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader

from cka.models import Club

def index(request):

	clubs = Club.objects.filter(cka__exact = True).all()

	is_club_admin = False
	club_id=''

	for a_club in clubs:
		if request.user.has_perm("cka.club_admin_" + a_club.code):
			club_id = a_club.code
			is_club_admin = True
			break

	print ("is_club_admin",is_club_admin)

	template = loader.get_template('index.html')
	context = {
		'user'         : request.user,
		'club_admin'   : is_club_admin,
		'referee'      : request.user.has_perm('cka.match_referee'),
		'league_admin' : request.user.has_perm('cka.league_admin'),
		'club_id'      : club_id,
	}
	print ("Name = ", request.user.username, request.user.has_perm('cka.club_admin'))
	return HttpResponse(template.render(context))



@permission_required('cka.referee',login_url='/cka/check_login')
def submit_scorecard(request):
	return HttpResponse("A page viewable by refeee")
