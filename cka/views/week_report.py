from datetime import datetime
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader

from django.shortcuts import render,redirect

from cka.models import Team
from cka.models import Fixture
from cka.models import LeagueTable
from cka.models import PlayerStatistics

from django.db.models import Q

from cka.season import season, season_full

def index(request, week):

    division1 =  Fixture.objects.filter( code__contains = season, week__exact = week, division__exact = "1" ).all()
    division2 =  Fixture.objects.filter( code__contains = season, week__exact = week, division__exact = "2" ).all()

    template = loader.get_template('week.html')
    context = {
            'week': week,
            'division1' : division1,
            'division2' : division2,
            'message' : ''
    }

    return HttpResponse(template.render(context))
