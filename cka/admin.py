from django.contrib import admin
from cka.models import Club,Player,PlayerStatus,Period,Fixture,Team,Venue,Match,LeagueTable,PlayerStatistics,FixtureStaging, MatchStaging, StatusPoints,StatusOverride,SERLPlayer


class ClubAdmin(admin.ModelAdmin):
	list_display = ['code', 'name', 'email', 'cka', 'venuecode', 'player_id_range']

class FixtureAdmin(admin.ModelAdmin):
	list_display = ['code', 'season',  'date', 'division','fixtures_live_id' , 'period', 'season_period', 'week', 'season_week','home_team', 'away_team', 'referee', 'referee_team', 'venue']
	list_filter = ['season', 'division', 'period']
	search_fields = ['code']


class PlayerAdmin(admin.ModelAdmin):
    fields = ['id', 'club', 'name', 'sex', 'u18', 'inactive','fl_name']
    list_display = ['id', 'club', 'name', 'fl_name', 'sex', 'u18', 'inactive']
    list_filter = ['club', 'inactive', 'sex']
    search_fields = ['name']


class PlayerStatusAdmin(admin.ModelAdmin):
	list_filter = ['player', 'year', 'period']
	list_display = ['player', 'year', 'period', 'serl_score', 'first_score', 'second_score', 'status', 'tie' ]
	search_fields = ['player']

class PeriodAdmin(admin.ModelAdmin):
	list_display = ['id', 'season', 'number', 'date_from', 'date_to']

class TeamAdmin(admin.ModelAdmin):
	list_display = ['code', 'cka', 'club', 'name', 'short_name', 'first_team', 'second_team', 'dev_team', 'inactive']

class VenueAdmin(admin.ModelAdmin):
	list_display = ['code', 'name', 'fixtures_live']

class MatchAdmin(admin.ModelAdmin):
	list_display = ['fixture_code', 'team', 'player', 'player_id', 'player_num', 'count_code','goals', 'penalties', 'status', 'on_court', 'off_court', 'status_points']
	search_fields = ['fixture_code', 'player__name']

	def player_id(self,obj):
		if obj.player:
			return obj.player.id

class LeagueTableAdmin(admin.ModelAdmin):
	list_display = [ 'id', 'season', 'division', 'seqno', 'team','played', 'score', 'dev_team']

class PlayerStatisticsAdmin(admin.ModelAdmin):
	list_display = ['player', 'division', 'team','season']
	list_filter = [ 'division', 'season']


class FixtureStagingAdmin(admin.ModelAdmin):
	list_display = ['code', 'season', 'date', 'division', 'period', 'home_team', 'away_team', 'referee_team', 'venue' ]
	list_filter = ['season', 'division', 'period']
	search_fields = ['code']

class MatchStagingAdmin(admin.ModelAdmin):
	list_display = ['fixture_code', 'team', 'player', 'player_num', 'count_code', 'goals', 'penalties','status']
	search_fields = ['fixture_code', 'player__name']

class StatusOverrideAdmin(admin.ModelAdmin):
	list_display = ['id', 'year', 'player', 'period', 'status']

class StatusPointsAdmin(admin.ModelAdmin):
	list_display = ['count_code', 'first_team_pt', 'second_team_pt', 'hex_code', 'on_text', 'off_text','on_text_short', 'off_text_short']

class SERLPlayerAdmin(admin.ModelAdmin):
	list_display = ['id', 'season', 'period', 'club', 'name','matches']

admin.site.register(Club,ClubAdmin)
admin.site.register(Player,PlayerAdmin)
admin.site.register(PlayerStatus,PlayerStatusAdmin)
admin.site.register(Period,PeriodAdmin)
admin.site.register(Fixture,FixtureAdmin)
admin.site.register(Team,TeamAdmin)
admin.site.register(Venue,VenueAdmin)
admin.site.register(Match,MatchAdmin)
admin.site.register(LeagueTable,LeagueTableAdmin)
admin.site.register(PlayerStatistics,PlayerStatisticsAdmin)
admin.site.register(FixtureStaging,FixtureStagingAdmin)
admin.site.register(MatchStaging,MatchStagingAdmin)
admin.site.register(StatusOverride,StatusOverrideAdmin)
admin.site.register(StatusPoints,StatusPointsAdmin)
admin.site.register(SERLPlayer,SERLPlayerAdmin)
