var database = {};

var url_prefix="../Upload/";

if(window.location.host == "localhost:81") url_prefix="../cka_data/";

var venueName = function(id) {
    var venue= _.find(database.venues, function(venue) { return venue.pk == id; });
    return venue.fields.name;
};

var teamName = function(id) {
    var team= _.find(database.teams, function(team) { return team.pk == id; });
    return team.fields.name;
};

var teamClub = function(id) {
    var team= _.find(database.teams, function(team) { return team.pk == id; });
    return team.fields.club;
};

var teamContact = function( id ) {
    var team= _.find(database.teams, function(team) { return team.pk == id; });
    var club = _.find(database.clubs, function(club) { return club.pk == team.fields.club; })
    return club.fields.email;
}

var clubForTeamName = function(teamName) {
    var team = _.find(database.teams, function(t) { return t.fields.name == teamName;});
    return _.find(database.clubs, function(c) { return c.pk == team.fields.club; });
};

var teamShortName = function(teamName) {
    var team = _.find(database.teams, function(t) { return t.fields.name == teamName;});
    return team.pk;
};

var formatDateTime = function( d ){
    var dte = d.split("T")[0].split("-");
    dte = dte[2] + "/" + dte[1] + "/" + dte[0];
    var tim = d.split("T")[1].split(":");
    tim = tim[0] + ":" + tim[1];
    return [dte, tim];
};

var playerByID= function(playerID) {
    return _.find( database.players, function(p) {
        return p.pk == playerID;
    });
};

var getFixture= function(fixtureCode) {
    return _.find( database.fixtures, function(p) {
        return p.pk == fixtureCode;
    });
};

var findLastMatch = function(teamName) {
    teamName = teamShortName(teamName);
    var fixtures = _.filter(database.fixtures, function(f) {

        if((f.fields.home_team == teamName) || (f.fields.away_team == teamName)) {
  
        }
        return ((f.fields.home_team == teamName) || (f.fields.away_team == teamName));
    });

    var fixture = fixtures[ fixtures.length - 1];

    var players = _.filter(database.matches, function(m){
        return ( m.fields.fixture_code == fixture.pk && m.fields.team == teamName );
    });

    players = _.map(players, function(m) {
        return playerByID( m.fields.player );
    });

    return players;

};

var getData = function( done ) {

    
    $.ajax({
      url: url_prefix + "fixtures.json",
    }).done(function(fixtures) {

        $.ajax({
            url: url_prefix + "teams.json",
        }).done(function(teams) {

        $.ajax({
            url: url_prefix + "matches.json",
        }).done(function(matches) {
            $.ajax({
                url: url_prefix + "clubs.json",
            }).done(function(clubs) {

            $.ajax({
                url: url_prefix + "players.json",
            }).done(function(players) {

                $.ajax({
                    url: url_prefix + "venues.json",
                }).done(function(venues) {
                    //fixtures = _.filter(fixtures, function(f) { return f.fields.home_score == undefined && f.fields.division != "SERL";});
                    fixtures= _.sortBy(fixtures, function(f) { return f.fields.date;});
                    database.fixtures = fixtures;
                    database.venues=venues;
                    database.teams=teams;
                    database.clubs=clubs;
                    database.players=players;
                    database.matches=matches;
                    return done();
                });
            });
            });
            });
        });
    });
};