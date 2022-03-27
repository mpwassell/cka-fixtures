var database = {};

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

var formatDateTime = function( d ){
    var dte = d.split("T")[0].split("-");
    dte = dte[2] + "/" + dte[1] + "/" + dte[0];
    var tim = d.split("T")[1].split(":");
    tim = tim[0] + ":" + tim[1];
    return [dte, tim];
};

var getData = function( done ) {

    $.ajax({
      url: "fixtures.json",
    }).done(function(fixtures) {

        $.ajax({
            url: "teams.json",
        }).done(function(teams) {

            $.ajax({
                url: "clubs.json",
            }).done(function(clubs) {

                $.ajax({
                    url: "venues.json",
                }).done(function(venues) {
                    fixtures = _.filter(fixtures, function(f) { return f.fields.home_score == undefined && f.fields.division != "SERL";});
                    fixtures= _.sortBy(fixtures, function(f) { return f.fields.date;});
                    database.fixtures = fixtures;
                    database.venues=venues;
                    database.teams=teams;
                    database.clubs=clubs;
                    return done();
                });
            });
        });
    });
};

var start = function(){

    getData( function() {

        _.each(database.fixtures, function(fixture) {
            var venue_name = venueName(fixture.fields.venue);
            var h_name = teamName(fixture.fields.home_team);
            var a_name = teamName(fixture.fields.away_team);
            var referee = teamName(fixture.fields.referee_team);
            var datetime = formatDateTime(fixture.fields.date);
            var tr= $("<tr id='" + fixture.pk + "'><td>" + h_name + "</td><td>" + a_name + "</td>" +
                    "<td>" +  datetime + "</td><td>" + referee + "</td><td>" + venue_name + "</td></tr>");
            $("#fixtures").append(tr);
            var td1 = $("<td><div class='btn'>Pending</div></td>").click( function() { showPendingForm(fixture); } );
            tr.append(td1);
            var td2 =  $("<td><div class='btn'>Approved</div></td>").click( function() { showApprovedForm(fixture); } );
            tr.append(td2);

        });
    });

};

var fillMatchDetails = function(d,fixture,canEdit) {
    d.find("#id").val(fixture.pk);
    d.find(".home_team").text( teamName( fixture.fields.home_team ));
    d.find(".away_team").text( teamName( fixture.fields.away_team ));

    var datetime = formatDateTime( fixture.fields.date);

    d.find("#home_team_input").text( teamName( fixture.fields.home_team ));
    d.find("#away_team_input").text( teamName( fixture.fields.away_team ));

    var referee_team = teamName( fixture.fields.referee_team );
    var venue_name = venueName( fixture.fields.venue );
    var home_club = teamClub( fixture.fields.home_team);
    var away_club = teamClub( fixture.fields.away_team);
    var select = d.find("#club_select");
    _.each(database.clubs, function(club) {
        select.append($("<option/>").val(club.pk).text(club.fields.name));
    });

    if(canEdit) {

        d.find( "#datepicker" ).datepicker({ dateFormat : "dd/mm/yy"});
        d.find( "#datepicker" ).datepicker('setDate', datetime[0]);
        d.find(".time").attr( "value", datetime[1] );

        select = d.find("#referee_select");
        _.each(database.teams, function(team) {
            if(team.fields.cka && team.fields.club != home_club && team.fields.club != away_club){
                var op = $("<option/>");
                select.append(op);
                op.val(team.pk).text(team.fields.name);
                if( team.fields.name == referee_team) op.attr("selected","selected");
            }
        });

        select = d.find("#venue_select");
        _.each(database.venues, function(venue) {
             var op = $("<option/>");
            select.append(op);
            op.val(venue.pk).text(venue.fields.name);
            if( venue.fields.name == venue_name ) op.attr("selected","selected");
        });
        $("#approvedMatchDetails").show();
        $("#pendingMatchDetails").hide();
    } else {

        d.find("#date").text( datetime[0] );
        d.find(".time").text( datetime[1] );
        d.find("#venue").text( venue_name );
        d.find("#referee").text( referee_team);
        $("#approvedMatchDetails").hide();
        $("#pendingMatchDetails").show();
    }
};

var showPendingForm = function(fixture) {
    var d = $("#userDialog");
    fillMatchDetails(d, fixture,false);
    d.dialog( { width : 850, height: 500 });

};

var showApprovedForm= function(fixture) {
    var d = $("#userDialog");
    fillMatchDetails( d,fixture,true);
    d.dialog( { width : 850, height: 500});
};

$(document).ready( start );
