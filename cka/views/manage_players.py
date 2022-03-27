from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import render,redirect
import django_tables2 as tables
from django_tables2   import RequestConfig
from django import forms

from cka.models import Player,Club,Match
from django_tables2.utils import A  # alias for Accessor

def club_edit_authorised(request,club_id):
	user = request.user

	print (user.is_authenticated)

	#print user.user_permissions.all()
	#print user.groups.all()[0].permissions.all()

	return user.is_authenticated and user.has_perm("cka.club_admin_" + club_id)



class PlayerTable(tables.Table):
	class Meta:
		attrs = {"class": "paleblue"}

	id = tables.Column()
	name = tables.Column()
	u18 = tables.Column()
	status = tables.Column()
	sex = tables.Column()
	edit = tables.LinkColumn('edit_player', args=[A('id')])

class PlayerForm(forms.Form):
	name = forms.CharField(max_length=100)
	sex = forms.CharField(max_length=1)
	u18  = forms.BooleanField( required=False)#  help_text="Indicates that player is U18.")
	inactive = forms.BooleanField(required=False) # help_text="Indicates that player is currently inactive.")

def index(request,club_id):
	"""
	Show players for a club
	"""

	if not club_edit_authorised(request,club_id):
		return redirect('/cka/login?next=/cka/view/manage/players/' + club_id)

	active_player_recs   = Player.objects.filter(club = club_id, inactive=False)
	active_players = []
	for p in active_player_recs:
		active_players.append( { 'id' : p.id, 'name' : p.name, 'u18' : p.u18, 'edit' : "Edit" } )

	inactive_player_recs   = Player.objects.filter(club = club_id, inactive=True)
	inactive_players = []
	for p in inactive_player_recs:
		inactive_players.append( { 'id' : p.id, 'name' : p.name, 'u18' : p.u18, 'edit' : "Edit" } )

	table1 = PlayerTable(active_players, order_by_field='name',prefix="active-")
	table2 = PlayerTable(inactive_players, order_by_field='name',prefix="inactive-")
	table1.paginate(page=request.GET.get('page', 1), per_page=25)
	table2.paginate(page=request.GET.get('page', 1), per_page=25)

	config = RequestConfig(request)
	config.configure(table1)
	config.configure(table2)

	inactive_players = Player.objects.filter(club = club_id, inactive=True)
	return render(request, "manage_players.html", { "club_id" : club_id, "active_players" : table1, "inactive_players" : table2 })


def edit_player(request,player_id):
	"""
	Edit a player
	"""

	player = Player.objects.get(id=player_id)

	if not club_edit_authorised(request,player.club.code):
		return HttpResponse('Unauthorized', status=401)

	if request.method == 'POST':
		form = PlayerForm(request.POST)

		if form.is_valid():

			player.name = form.cleaned_data['name']
			player.u18 = form.cleaned_data['u18']
			player.sex = form.cleaned_data['sex']
			player.inactive = form.cleaned_data['inactive']
			player.save()

			return redirect('show_players',club_id= player.club.code )
		else:
			return render(request, 'player_details.html', {
				'form': form, 'player' : player
		})

	else:
		form = PlayerForm(initial={ 'name' : player.name, 'u18' : player.u18, 'inactive' : player.inactive, 'sex' : player.sex})
		return render(request, 'player_details.html', {
			'form': form, 'player' : player
		})


class MergePlayerForm(forms.Form):
	from_player_id = forms.IntegerField()
	to_player_id = forms.IntegerField()

def merge_players(request):
	"""
	Merge matches details from FROM PLAYER into INTO PLAYER
	"""

	if request.method == 'POST':
		form = MergePlayerForm(request.POST)

		if form.is_valid():

			from_player_id = form.cleaned_data['from_player_id']
			to_player_id = form.cleaned_data['to_player_id']

			from_player = Player.objects.filter(id__exact = from_player_id).get()
			to_player =  Player.objects.filter(id__exact = to_player_id).get()

			matches = Match.objects.filter(player_id__exact = from_player_id).all()

			for m in matches:
				m.player_id = to_player_id
				m.save()
				print ("Changed {}".format(m.fixture_code))

			return render(request, 'message.html', {
				'message': 'Players merged. {} --> {}.Please recalculate player statistics and status'.format(from_player.name, to_player.name)
			})
		else:
			return render(request, 'message.html', {
				'message': 'Error with form'
			})

	else:
		form = MergePlayerForm(initial={ 'from_player_id' : '', 'to_player_id':''})
		return render(request, 'merge_players.html', {
			'form': form
		})


def add_player(request,club_id):
	"""
	Add a player
	"""

	if not club_edit_authorised(request,club_id):
		return HttpResponse('Unauthorized', status=401)

	if request.method == 'POST':
		form = PlayerForm(request.POST)
		if form.is_valid():

			club = Club.objects.get(code=club_id)

			# Calculate new player ID
			max_player = Player.objects.filter(club=club_id, id__lt = club.player_id_range+1000).order_by('-id').first()

			new_player = Player(id=max_player.id+1, club_id=club_id, sex = form.cleaned_data['sex'],name= form.cleaned_data['name'], u18=form.cleaned_data['u18'],
						        nl=False,inactive=False, referee=False, top_four=False)

			print (new_player.id)

			new_player.save()

			return redirect('show_players',club_id= club_id)
		else:
			return render(request, 'player_details.html', {
				'form': form, 'player' :  { 'id' : '' }
			})
	else:
		form = PlayerForm()
		return render(request, 'player_details.html', {
			'form': form, 'player' : { 'id' : '' }
		})
