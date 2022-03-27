from datetime import datetime
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.core import serializers
import json
from django.core.serializers.json import DjangoJSONEncoder

import pytz


from django.shortcuts import render,redirect

from cka.models import Club,Fixture,Team,Venue,Match,PlayerStatistics,Player,LeagueTable
from cka.season import season

# Custom encoder to workaround problem with timezone mess.
# Time in database is inverted America/Chicago, so we need to fiddle it
# to be in Z timezone
class CKAJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            tz = pytz.timezone('America/Chicago')
            s = obj.astimezone(tz).isoformat(' ')
            s = list(s)
            s[10]='T'
            s[19]='Z'
            s = "".join(s[:20])
            #print("Got date ", obj, obj.isoformat(' '), s)
            return s
        return super().default(obj)

def fixtures(request):
    fixture_list =   Fixture.objects.filter( code__contains = season).order_by('date', 'division','code').all()
    data = serializers.serialize("json", fixture_list,cls=CKAJSONEncoder)
    return HttpResponse( data, content_type="application/json")

def teams(request):
    team_list =   Team.objects.all()
    data = serializers.serialize("json", team_list)
    return HttpResponse( data, content_type="application/json")

def venues(request):
    venue_list =   Venue.objects.all()
    data = serializers.serialize("json", venue_list)
    return HttpResponse( data, content_type="application/json")

def matches(request):
    match_list =  Match.objects.filter( fixture_code__contains = season).all()
    data = serializers.serialize("json", match_list)
    return HttpResponse( data, content_type="application/json")

def clubs(request):
    club_list =  Club.objects.filter( cka__exact=True).all()
    data = serializers.serialize("json", club_list)
    return HttpResponse( data, content_type="application/json")

def player_statistics(request):
    stats_list =  PlayerStatistics.objects.filter( season__contains = season).all()
    data = serializers.serialize("json", stats_list)
    return HttpResponse( data, content_type="application/json")

def players(request):
    player_list =  Player.objects.filter( inactive__exact = False).all()
    data = serializers.serialize("json", player_list, fields=('name','club'))
    return HttpResponse( data, content_type="application/json")

def league_tables(request):
    t_list =  LeagueTable.objects.filter( season__contains = season).all()
    data = serializers.serialize("json", t_list)
    return HttpResponse( data, content_type="application/json")
