from django.conf import settings
from django.urls import include, path,re_path
import django.contrib.staticfiles
from django.views.static import serve
import os
from cka import views
from cka.views import api
from cka.views import manage_players
from cka.views import auth
from cka.views import database
from cka.views import index
from cka.views import fixtures
from cka.views import division
from cka.views import player
from cka.views import scorecard
from cka.views import player_status
from cka.views import team_goals
from cka.views import scorecard_fl
from cka.views import status_usage
from cka.views import week_report

urlpatterns = [

	# Authentication
	#re_path(r'^login$',  django.contrib.auth.views.login, {'template_name': 'login.html'}),
	#path(r'^logout$', 'django.contrib.auth.views.logout',{'template_name': 'logout.html'}),
	re_path('^$', include('django.contrib.auth.urls')),

	# Main page
    re_path(r'^$', views.index.index, name='index'),

	re_path(r'^fixtures$',                           views.fixtures.index, name='fixtures'),
	re_path(r'^fixtures_int$',                           views.fixtures.index, { 'show_hidden' : True}, name='fixtures'),
	re_path(r'^fixtures/played$',                    views.fixtures.played, name='fixtures_played'),
	re_path(r'^fixtures_change$',                           views.fixtures.change_list, name='fixtures_change_list'),
	re_path(r'^division/(?P<division>\d+)$',         views.division.index,   name='league_table'),
	re_path(r'^division/scorers/(?P<division>[A-Z0-9]+)$', views.division.scorers,   name='league_table'),

	re_path(r'^player/scores$', views.player.scores,   name='player_score'),
	re_path(r'^player/status$', views.player.status,   name='player_status'),
	re_path(r'^player/gametime$', views.player.gametime,   name='player_gametime'),
	re_path(r'^player/status_usage$',    views.status_usage.index,     name='status_usage'),
	re_path(r'^player/all_players$',    views.player.all_players,     name='all_players'),

	re_path(r'^week/(?P<week>\d+)$',        views.week_report.index,   name='week_report'),

	re_path(r'^season/all', team_goals.index, name='team_goals_all'),
	re_path(r'^season/header', team_goals.header, name='team_goals_header'),
	re_path(r'^season/(?P<team_code>[A-Z_0-9]+)$', team_goals.team_stats, name='team_goals'),


	# Request fixture postponement and change
    re_path(r'^fixture/do_postpone',  views.fixtures.do_postpone, name='fixtures_do_postpone'),
	re_path(r'^fixture/do_change/(?P<fixture_code>[A-Z_0-9]+)$',    views.fixtures.do_change, name='fixtures_do_change'),

	# All of these display a scorecard. We have the aliases to enable us to generate
	# static pages that are located in a Upload directory
 	re_path(r'^scorecard/(?P<fixture_code>[A-Z_0-9]+)$',          views.scorecard.index, name='scorecard_display'),
    re_path(r'^Upload/(?P<fixture_code>[A-Z_0-9]+).htm$',         views.scorecard.index, name='scorecard_display'),
    re_path(r'^results/Upload/(?P<fixture_code>[A-Z_0-9]+)_int.htm$', views.scorecard.index, { 'show_hidden' : True }, name='scorecard_display'),
    re_path(r'^results/Upload/(?P<fixture_code>[A-Z_0-9]+).htm$', views.scorecard.index, name='scorecard_display'),
    re_path(r'^cka/results/Upload/(?P<fixture_code>[A-Z_0-9]+).htm$', views.scorecard.index, name='scorecard_display'),
    re_path(r'^cka/results/Upload/(?P<fixture_code>[A-Z_0-9]+)_int.htm$', views.scorecard.index, { 'show_hidden' : True }, name='scorecard_display_internal', ),

	# Scorecard submission and management
	re_path(r'^scorecard/fixtures$',                             views.scorecard.fixtures, name='scorecard_fixtures'),
	re_path(r'^scorecard/form/(?P<fixture_code>[A-Z_0-9]+)$',    views.scorecard.form,     name='scorecard_form'),
	re_path(r'^scorecard/formentry/(?P<fixture_code>[A-Z_0-9]+)$', views.scorecard.formentry,     name='scorecard_newform'),
	re_path(r'^scorecard/formxml/(?P<fixture_code>[A-Z_0-9]+)$', views.scorecard.formxml,     name='scorecard_formxml'),
	re_path(r'^scorecard/loadxml/(?P<fixture_code>[A-Z_0-9]+)$', views.scorecard.loadxml,     name='scorecard_loadxml'),
	re_path(r'^scorecard/approve/(?P<fixture_code>[A-Z_0-9]+)$', views.scorecard.approve,  name='scorecard_approve'),
	re_path(r'^scorecard/approve',                               views.scorecard.fixtures_approve,  name='scorecard_fixtures_approve'),
	re_path(r'^scorecard/post/(?P<fixture_code>[A-Z_0-9]+)$',    views.scorecard.post,     name='scorecard_post'),
	re_path(r'^scorecard/postxml/(?P<fixture_code>[A-Z_0-9]+)$',    views.scorecard.upload_xml_raw,     name='scorecard_upload_xml_raw'),
	re_path(r'^scorecard/revert/(?P<fixture_code>[A-Z_0-9]+)$',    views.scorecard.revert,     name='scorecard_revert'),
	re_path(r'^scorecard/clear_staging$',    views.scorecard.clear_staging,     name='scorecard_revert'),
	re_path(r'^scorecard/ref_rating/(?P<season>\d+)/(?P<period>\d+)$',    views.scorecard.ref_rating,     name='ref_rating'),
	re_path(r'^scorecard/load_fl/(?P<fixture_code>[A-Z_0-9]+)$',    views.scorecard_fl.index,     name='load_fl'),

 	# Management pages
 	re_path(r'^view/manage/players/(?P<club_id>[A-Z]+)$',     views.manage_players.index,       name='show_players'),
 	re_path(r'^view/manage/players/add/(?P<club_id>[A-Z]+)$', views.manage_players.add_player,  name='add_player'),
 	re_path(r'^view/manage/players/edit/(?P<player_id>\d+)$', views.manage_players.edit_player, name='edit_player'),
 	re_path(r'^view/manage/players/merge$', views.manage_players.merge_players, name='merge_players'),

 	re_path(r'^view/manage/redo_player_statistics$', views.player_statistics.redo_player_statistics, name='edit_player'),
 	re_path(r'^view/manage/redo_league_tables$', views.league_table.redo_league_tables, name='edit_player'),
 	re_path(r'^view/manage/redo_player_status$', views.player_status.redo_player_status, name='edit_player'),
 	re_path(r'^view/manage/redo_match_status$',  views.player_status.redo_match_status, name='edit_player'),

 	re_path(r'^view/manage/redo_status_valid$',  views.scorecard.recalculate_status_valid, name='status_valid'),

 	re_path(r'^view/manage/recalculate_match_status_points$',  views.player_status.recalculate_match_status_points, name='status_valid'),

    re_path(r'^view/manage/recalculate_player_gametime$',  views.player.recalculate_gametime, name='gametime'),

    re_path(r'^view/manage/check_scorecards$',  views.scorecard.check_scorecards, name='check_scorecards'),
    re_path(r'^view/manage/check_scorecards_pending$',  views.scorecard.check_scorecards_pending, name='check_scorecards_pending'),

 	# Data as JSON
 	re_path(r'^fixtures.json$', views.database.fixtures, name='fixtures_json'),
 	re_path(r'^teams.json$',    views.database.teams, name='teams_json'),
 	re_path(r'^venues.json$',   views.database.venues, name='venues_json'),
 	re_path(r'^matches.json$',  views.database.matches, name='matches_json'),
 	re_path(r'^clubs.json$',    views.database.clubs, name='clubs_json'),
 	re_path(r'^player_statistics.json$',   views.database.player_statistics, name='player_statistics_json'),
 	re_path(r'^players.json$',   views.database.players, name='players_json'),
 	re_path(r'^league_tables.json$',   views.database.league_tables, name='league_tables_json'),

 	# Access and update records
 	re_path(r'^api/([^/]+)$',                        views.api.table, name='table'),
	re_path(r'^api/([^/]+)/([^/]+)/equals/([^/]+)$', views.api.table, name='table_query'),

	re_path(r'^images/(?P<path>.*)$', django.views.static.serve, { 'document_root' : os.path.join(settings.ROOTDIR,"cka", "static", "ckaleague", "images")})
]
