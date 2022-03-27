# Create your views here.
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader


def check_login(request):
	if request.user.is_authenticated():
		return HttpResponse("Logged in but don't have permission")
	else:
		return HttpResponseRedirect("/cka/login?next=" + request.GET['next'])

def login_view(request):
	user = authenticate(username='leagueadmin', password='k0rfb@ll')
	print (user.user_permissions.all())
	print ("AUTO login")
	next = request.GET['next']
	if user is not None:
		if user.is_active:
			login(request, user)
			return HttpResponseRedirect(next)
		else:
        	# Return a 'disabled account' error message
			return HttpResponse("Disabled account.")

def logout_view(request):
	logout(request)
	next = request.GET.get('next')
	if next:
		return HttpResponseRedirect(next)
	else:
		return HttpResponse("Logged out")
