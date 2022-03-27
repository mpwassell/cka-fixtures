# Create your views here.

from datetime import datetime
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.core import serializers
import json

from django.shortcuts import render,redirect
from django.core.mail import send_mail,EmailMessage

from cka.models import Club
from cka.models import Fixture
from cka.season import season, season_full

def index(request,show_hidden=False):
    fixture_list =   Fixture.objects.filter( code__contains = season).exclude(playoff=True).order_by('date', 'division','code').all()
    for f in fixture_list:
        print( f.code)
    playoffs = Fixture.objects.filter( code__contains = season, playoff=True).order_by('date', 'division','code').all()
    template = loader.get_template('fixtures.html')
    context = {
        'fixture_list': fixture_list,
        'other_events' : [ ],
                #{ "date" : "12-13th May", "title" : "England Korfball Finals", "venue" : "Copper Box Arena, London"},
                #{ "date" : "19th May", "title" : "Senior Inter Area", "venue" : "TBD"},
                #{ "date" : "8th July", "title" : "National Youth Day", "venue" : "TBD"}],
        'playoffs' : playoffs,
        'season' : season,
        'season_full' : season_full,
        'do_internal' : '_int' if show_hidden else '',
        'last_update' : datetime.now().strftime("%d-%b-%Y %H:%M")
    }
    print (playoffs)
    return HttpResponse(template.render(context))


def played(request):
	played_list =   Fixture.objects.filter( code__contains = season).exclude( home_score__isnull = True).order_by('date', 'division','code').all()

	data = ""
	for p in played_list:
		data += "{}\n".format(p.code)

	return HttpResponse(data, content_type='application/json')



def do_postpone(request):
    code = request.POST.get('id')
    club = request.POST.get('club')
    reason = request.POST.get('reason')
    name = request.POST.get('name')
    email = request.POST.get('email')
    home_team = request.POST.get('home_team')
    away_team = request.POST.get('away_team')

    print (code,club,name,reason)

    template = loader.get_template('message.html')
    context = RequestContext(request, {
        "message" : "OK"
    })

    # Change [new date] [new time] [home team] vs [away team] [venue] [reason]
    # Postpone [home team] vs [away team] [reason]

    msg = "A request to postpone a CKL fixture has been submitted\n{} vs {} {}\n\nSubmitted by {}, {}".format(home_team,away_team,reason,name,club)

    send_email("Postponement request for fixture " + code,msg)

    return HttpResponse(template.render(context))

def do_change(request,fixture_code):
    xml = request.POST['message']


def change_list(request):
    template = loader.get_template('fixtures_change.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def send_email(subject,msg):
    ##
    ## Use stmp_util.py in ./utils directory to run little SMTP server locally for debugging.
    ##

    msg = EmailMessage(subject,
        msg,
        '',
        ['mpwassell@gmail.com'])


    msg.send(fail_silently=False)
