// Important: This is hosted on Mark's University account.

var emailerURL = "http://www-dyn.cl.cam.ac.uk/~mpew2/ckaresults.php";
if(window.location.host == "localhost:81") emailerURL = "./ckaresults.php";

var homeTeamPrompt = "Choose the home team";
var awayTeamPrompt = "Choose the away team";

var changeTeam = function(isHomeTeam) {

    var prefix="#playerNameAwaySelect_";
    var clubName = "";
    if(isHomeTeam) {
        prefix = "#playerNameHomeSelect_";
        teamName = $( "#cboHome_Team option:selected" ).text();
        if(teamName == homeTeamPrompt) return;
        club = clubForTeamName(teamName);
        clubName = club.pk;
        cap="#homeCaptain";
        subrow="#playerSubNameHomeSelect_";
    } else {
        teamName = $( "#cboAway_Team option:selected" ).text();
        if(teamName == awayTeamPrompt) return;
        club = clubForTeamName(teamName);
        clubName = club.pk;
        cap="#awayCaptain";
        subrow="#playerSubNameAwaySelect_";
    }
    for(var i=8; i>0;i--) {
        var s = $(prefix + i);
        s.html('');
        s.append($('<option/>'));
    }

    // Get players from last match of this team and put at the front
    // of the list.
    var lastMatchPlayers = findLastMatch(teamName);

    lastMatchPlayers = _.map(lastMatchPlayers, function(p) {
        return p.fields.name;
    } );

    var players = [];
    _.each(database.players, function(player) {
        if(player.fields.inactive || player.fields.club != clubName ||
            _.contains( lastMatchPlayers,player.fields.name)) return;
        players.push(player.fields.name);
    });
    players.sort();

    players = lastMatchPlayers.concat( players );

    options=[];
    _.each(players,function(player) {
        options.push( { name : player });
    });

    for(var i=8; i>0;i--) {
        var s = $(prefix + i)[0].selectize;
        if(s){
            s.clearOptions();
            s.addOption( options );
        }
    }

    for(var i=8; i>0;i--) {
        var s = $(subrow + i)[0].selectize;
        if(s){
            s.clearOptions();
            s.addOption( options );
        }
    }

    var s = $(cap)[0].selectize;
    if(s){
        s.clearOptions();
        s.addOption( options );
    }

    /*
    shc = $(cap);
    shc.html('');
    shc.append($('<option/>'));
    _.each(players,function(player) {
        shc.append($('<option>', { value : player, text:player }) );
    });

    shc = $(subrow);
    shc.html('');
    shc.append($('<option/>'));
    _.each(players,function(player) {
        shc.append($('<option>', { value : player, text:player }) );
    });


    var lst = $('#sortable2');
    lst.html('');
    _.each(players,function(player){
        lst.append($('<li>').toggleClass('ui-state-highlight').
            append( $('<table>').toggleClass('player-table').append($('<tr>').
              append($('<td>', { text : player, style : 'width:90%'})).
              append($('<td>', { style : 'width:10%', text : 'X'}).toggleClass('delete-hide')))));
    });
    */

};

var setupForm = function() {

    getData( function() {

        $('#txtDate').datepicker(  { dateFormat: 'dd-mm-yy' } );
        $('#txtTime').timepicker();

        var h = $("#playerHeader");
        pr = $("#playerRow");
        pr.find(".player-num").text(i);
        pr.find(".playerNameHome").html("<select id='playerNameHomeSelect_" + 8 + "' class='player-select' tabindex='20080'/>");
        pr.find(".playerNameAway").html("<select id='playerNameAwaySelect_" + 8 + "' class='player-select' tabindex='30080'/>");
        pr.find(".playerU18Home").attr('id', 'playerU18Home_' + 8);
        pr.find(".playerU18Home").attr('tabindex', '20081');
        pr.find(".playerU18Away").attr('id', 'playerU18Away_' + 8);
        pr.find(".playerU18Away").attr('tabindex', '30081');
        pr.find(".playerPenaltiesHome").attr('id', 'playerPenaltiesHome_' + 8);
        pr.find(".playerPenaltiesHome").attr('tabindex', '20082');
        pr.find(".playerPenaltiesAway").attr('id', 'playerPenaltiesAway_' + 8);
        pr.find(".playerPenaltiesAway").attr('tabindex', '30082');
        pr.find(".playerGoalsHome").attr('id', 'playerGoalsHome_' + 8);
        pr.find(".playerGoalsHome").attr('tabindex','20083');
        pr.find(".playerGoalsAway").attr('id', 'playerGoalsAway_' + 8);
        pr.find(".playerGoalsAway").attr('tabindex','30083');



        for(var i=7; i>0;i--) {
            var pr_clone = pr.clone();
            pr_clone.find(".player-num").text(i);
            pr_clone.find(".playerNameHome").html("<select id='playerNameHomeSelect_" + i +
                        "' class='no-border player-select' tabindex='200" + (i*10) + "' />");
            pr_clone.find(".playerNameAway").html("<select id='playerNameAwaySelect_" + i +
                        "' class='no-border player-select' tabindex='300" + (i*10) + "' />");
            pr_clone.find(".playerU18Home").attr('id', 'playerU18Home_' + i);
            pr_clone.find(".playerU18Home").attr('tabindex', '200' + (i*10+1));
            pr_clone.find(".playerU18Away").attr('id', 'playerU18Away_' + i);
            pr_clone.find(".playerU18Away").attr('tabindex', '300' + (i*10+1));
            pr_clone.find(".playerPenaltiesHome").attr('id', 'playerPenaltiesHome_' + i);
            pr_clone.find(".playerPenaltiesHome").attr('tabindex', '200' + (i*10+2));
            pr_clone.find(".playerPenaltiesAway").attr('id', 'playerPenaltiesAway_' + i);
            pr_clone.find(".playerPenaltiesAway").attr('tabindex', '300' + (i*10+2));
            pr_clone.find(".playerGoalsHome").attr('id', 'playerGoalsHome_' + i);
            pr_clone.find(".playerGoalsHome").attr('tabindex', '200' +(i*10+3));
            pr_clone.find(".playerGoalsAway").attr('id', 'playerGoalsAway_' + i);
            pr_clone.find(".playerGoalsAway").attr('tabindex', '300' +(i*10+3));

            if(i<=4) {
                pr_clone.find(".playerPenaltiesHome").attr( 'placeholder' , '       First Attack' );
            }
            if(i>4) {
                pr_clone.find(".playerPenaltiesAway").attr( 'placeholder' , '       First Attack' );
            }

            h.after(pr_clone);
        }
        $("#playerPenaltiesAway_8").attr( 'placeholder' , '       First Attack' );

        var h = $("#playerSubHeader");
        pr = $("#playerSubRow");
        pr.find(".player-num").text(i);
        pr.find(".playerSubForHome").attr('id', 'playerSubForHome_' + 8);
        pr.find(".playerSubForHome").attr('tabindex', '20181' );
        pr.find(".playerSubForAway").attr('id', 'playerSubForAway_' + 8);
        pr.find(".playerSubForAway").attr('tabindex', '30181' );
        pr.find(".playerSubWhenHome").attr('id', 'playerSubWhenHome_' + 8);
        pr.find(".playerSubWhenHome").attr('tabindex', '20182' );
        pr.find(".playerSubWhenAway").attr('id', 'playerSubWhenAway_' + 8);
        pr.find(".playerSubWhenAway").attr('tabindex', '30182' );

        pr.find(".playerSubNameHome").html("<select id='playerSubNameHomeSelect_" + 8 + 
            "' class='player-select' tabindex='20183' />");
        pr.find(".playerSubNameAway").html("<select id='playerSubNameAwaySelect_" + 8 + 
            "' class='player-select' tabindex='30183' />");
        pr.find(".playerSubU18Home").attr('id', 'playerSubU18Home_' + 8);
        pr.find(".playerSubU18Home").attr('tabindex', '20184');
        pr.find(".playerSubU18Away").attr('id', 'playerSubU18Away_' + 8);
        pr.find(".playerSubU18Away").attr('tabindex', '30184');
        pr.find(".playerSubPenaltiesHome").attr('id', 'playerSubPenaltiesHome_' + 8);
        pr.find(".playerSubPenaltiesHome").attr('tabindex', '20185');
        pr.find(".playerSubPenaltiesAway").attr('id', 'playerSubPenaltiesAway_' + 8);
        pr.find(".playerSubPenaltiesAway").attr('tabindex', '30185');
        pr.find(".playerSubGoalsHome").attr('id', 'playerSubGoalsHome_' + 8);
        pr.find(".playerSubGoalsHome").attr('tabindex', '20186');
        pr.find(".playerSubGoalsAway").attr('id', 'playerSubGoalsAway_' + 8);
        pr.find(".playerSubGoalsAway").attr('tabindex', '30186');

        for(var i=7; i>0;i--) {
            var pr_clone = pr.clone();
            var j=i+10;
            pr_clone.find(".player-num").text(i);

            pr_clone.find(".playerSubForHome").attr('id', 'playerSubForHome_' + i);
            pr_clone.find(".playerSubForHome").attr('tabindex', '20' + (j*10+1) );
            pr_clone.find(".playerSubForAway").attr('id', 'playerSubForAway_' + i);
            pr_clone.find(".playerSubForAway").attr('tabindex', '30' + (j*10+1) );
            pr_clone.find(".playerSubWhenHome").attr('id', 'playerSubWhenHome_' + i);
            pr_clone.find(".playerSubWhenHome").attr('tabindex', '20' + (j*10+2) );
            pr_clone.find(".playerSubWhenAway").attr('id', 'playerSubWhenAway_' + i);
            pr_clone.find(".playerSubWhenAway").attr('tabindex', '30' + (j*10+2) );

            pr_clone.find(".playerSubNameHome").html("<select id='playerSubNameHomeSelect_" + i + 
                "' class='no-border player-select' tabindex='20" + (j*10+3) + "' />");
            pr_clone.find(".playerSubNameAway").html("<select id='playerSubNameAwaySelect_" + i + 
                "' class='no-border player-select' tabindex='30" + (j*10+3) + "' />");
            pr_clone.find(".playerSubU18Home").attr('id', 'playerSubU18Home_' + i);
            pr_clone.find(".playerSubU18Home").attr('tabindex', '20' + (j*10+4));
            pr_clone.find(".playerSubU18Away").attr('id', 'playerSubU18Away_' + i);
            pr_clone.find(".playerSubU18Away").attr('tabindex', '30' + (j*10+4));
            pr_clone.find(".playerSubPenaltiesHome").attr('id', 'playerSubPenaltiesHome_' + i);
            pr_clone.find(".playerSubPenaltiesHome").attr('tabindex', '20' + (j*10+5));
            pr_clone.find(".playerSubPenaltiesAway").attr('id', 'playerSubPenaltiesAway_' + i);
            pr_clone.find(".playerSubPenaltiesAway").attr('tabindex', '30' + (j*10+5));
            pr_clone.find(".playerSubGoalsHome").attr('id', 'playerSubGoalsHome_' + i);
            pr_clone.find(".playerSubGoalsHome").attr('tabindex', '20' + (j*10+6));
            pr_clone.find(".playerSubGoalsAway").attr('id', 'playerSubGoalsAway_' + i);
            pr_clone.find(".playerSubGoalsAway").attr('tabindex', '30' + (j*10+6));
            h.after(pr_clone);
        }


        var ss = $(".player-select").selectize( {create : true, valueField : 'name', labelField:'name', searchField:'name' });

        $("#cboHome_Team").change( function() {
            changeTeam(true);
        });

        $("#cboAway_Team").change( function() {
            changeTeam(false);
        });


        //$('#playerNameHomeSelect_1').selectize({ create : true,
        //    options : [ { name : "Fred", "Mark", "Bob" ] });
        /*
                        {id: 1, title: 'Spectrometer', url: 'http://en.wikipedia.org/wiki/Spectrometers'},
                        {id: 2, title: 'Star Chart', url: 'http://en.wikipedia.org/wiki/Star_chart'},
                         {id: 3, title: 'Star2 Chart', url: 'http://en.wikipedia.org/wiki/Star_chart'},
                          {id: 4, title: 'Star1 Chart', url: 'http://en.wikipedia.org/wiki/Star_chart'} ] });

*/
        // Get fixture off href if there is one
        var s = window.location.href.split('?');
        var homeTeam = "";
        var awayTeam = "";
        if (s.length > 1) {
            var fixtureCode = s[1].split('=')[1];
            fixture = getFixture(fixtureCode);
            homeTeam = fixture.fields.home_team;
            awayTeam = fixture.fields.away_team;

            $('#cboDivision').val(fixture.fields.division);

            var dte = formatDateTime(fixture.fields.date);
            $('#txtDate').val(dte[0]);
            $('#txtTime').val(dte[1]);
        }

        _.each(database.teams, function(team) {
            if(!team.fields.cka)return;
            var s= $("#cboHome_Team");
            if(homeTeam == team.pk) {
                s.append($('<option>', { value : team.pk, text:team.fields.name, selected:'selected' }) );
            } else {
                s.append($('<option>', { value : team.pk, text:team.fields.name}) );
            }
            s= $("#cboAway_Team");
            if(awayTeam == team.pk) {
                s.append($('<option>', { value : team.pk, text:team.fields.name, selected:'selected' }) );
            } else {
                s.append($('<option>', { value : team.pk, text:team.fields.name }) );
            }
        });

        if(!homeTeam) {
            $("#cboHome_Team").append($('<option >', { selected:'selected', text: homeTeamPrompt }) );
            $("#cboAway_Team").append($('<option >', { selected:'selected', text: awayTeamPrompt }) );
        }

        changeTeam(true);
        changeTeam(false);

        _.each(database.clubs, function(club){
            var s = $('#txtReferee_Club');
            s.append($('<option>', { value : club.fields.name, text:club.fields.name }) );
        });

        //$( "#cboHome_Team" ).combobox();
        //
        $( "#sortable1, #sortable2" ).sortable({
        connectWith: ".connectedSortable",
         receive: function( event, ui ) {
            ui.item
          .find('.delete-hide').toggleClass('delete-show');
        }}).disableSelection();


/*
       $( ".draggable" ).draggable();
       $( ".droppable" ).droppable({
        drop: function( event, ui ) {
        $( this )
          .addClass( "ui-state-highlight" )
          .append( $('<div>')).toggleClass('player-delete-x').text('+');

      }
    });*/
    });

    $('.addSubRow').button();

    $('#submit').button();
    $('#submit').off('click');
    $('#submit').click( validateAndSubmit );

   

};

var validateForm = function() {

    // Check blanks
    var blankCheck = [
        ['Fixture Date needs to be entered' , '#txtDate'],
        ['Fixture Time needs to be entered' , '#txtTime'],
        ['Home rating needs to be entered', '#cboRefHomeRating'],
        ['Away rating needs to be entered', '#cboRefAwayRating'],
        ['Fulltime Home Score is blank', '#txtHome_Score_FT'],
        ['Fulltime Away Score is blank', '#txtAway_Score_FT'],
        ['Halftime Home Score is blank', '#txtHome_Score_HT'],
        ['Halftime Away Score is blank', '#txtAway_Score_HT'],
        ['Referee is blank', '#txtReferee'],
        ['Referee email is blank', '#txtEmailAddress']
    ];
    var msgs = [];
    var ok=true;
    _.each( blankCheck, function( d ) {
        if( $(d[1]).val() === "") { msgs.push( d[0]); }
    });

    if( $('#cboDivision').find(":selected").text() == "" )
        msgs.push('Division needs to be entered');

    if ($('#cboHome_Team').find(":selected").text() == homeTeamPrompt)
        msgs.push('Home team needs to be selected');

    if ($('#cboAway_Team').find(":selected").text() == awayTeamPrompt)
        msgs.push('Away team needs to be selected');

    if ($('#homeCaptain').find(":selected").text() == "")
        msgs.push('Home captain needs to be entered');
    
    if ($('#awayCaptain').find(":selected").text() == "")
        msgs.push('Away captain needs to be entered');

    var sumGoals = function(tag) {
        var sum=0;
        for (var i =1; i <= 8; i++) {
            var goals =  $('#' + tag + '_' + i).val();
            if( goals === "") goals=0;
            if (isNaN( parseInt(goals))){
                msgs.push("Goals/penalties needs to be a positive number or blank");
                return 0;
            } else {
                goals =parseInt(goals);
                if( goals < 0) {
                    msgs.push("Goals/penalties needs to be a positive number or blank");
                    return 0;
                } else {
                    sum += goals;
                }
            }
        }
        return sum;
    };

    var checkGoals = function(tag) {
        totalGoals = sumGoals('playerGoals' + tag) + sumGoals('playerSubGoals' + tag) +
            sumGoals('playerPenalties' + tag) + sumGoals('playerSubPenalties' + tag);
        goalsText = $('#txt' + tag + '_Score_FT').val();
        if(goalsText === "") return;
        if( parseInt(goalsText) < 0 || isNaN(parseInt(goalsText))) {
            msgs.push("Invalid entry for full time " + tag + " goals");
        } else {
            if ( totalGoals != parseInt(goalsText)) {
                msgs.push("Goals for " + tag + " team don't add up");
            }
        }
    };
    checkGoals('Home');
    checkGoals('Away');

    // Email is valid. Checked on server as well.
    var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
    var emailFilter = /\S+@\S+\.\S+/;
    var email = $('#txtEmailAddress').val();

    if (!emailFilter.test(email)) {
        msgs.push("Email address has invalid format");
    }

    if(msgs.length > 0)
    {
        var tab = $('#warningList');
        tab.html('');
        _.each( msgs, function(msg) {
            tab.append("<li>" + msg  );
        });

        var dialog = $('#warningDialog').dialog( { title : "Problems With Scorecard", width:"1000" });

        $('#cancelBtn').button();
        $('#cancelBtn').click( function() { 
            $('#warningDialog').dialog('close'); 
        } );

        $('#warningDialogSubmit').button();
        $('#warningDialogSubmit').off('click');
        $('#warningDialogSubmit').click( function() { 
            $('#warningDialog').dialog('close'); 
            submit(); 
        } );
        return false;
    }

    return true;
};

var validateAndSubmit = function() {
    if( ! validateForm() ) { return;}
    submit();
};

var submit = function() {

    var add =function(tag,children) {
        var xml = "<" + tag + ">";
        _.each(children, function(child) {
            xml += child;
        });
        return xml + "</" + tag + ">\n";
    };

    var player = function(tag,pretag,i) {
        var goals =  $('#player' + pretag + 'Goals' + tag + '_' + i).val();
        var penalties = $('#player' + pretag + 'Penalties' + tag + '_' + i).val();
        var name = $('#player' + pretag + 'Name' + tag + 'Select_' + i + '-selectized').prev().text();
        if(name === "") return "";
        var subinfo="";
        if(pretag == "Sub") {
            var subfor = $('#player' + pretag  + "For" + tag + '_' + i).val();
            var when = $('#player' + pretag + 'When' + tag + '_' + i).find(":selected").val();
            if(subfor && when) subinfo=", " + subfor + ", " + when;
        }
        return    name + ", " +
                 ( ($('#player' + pretag + 'U18' + tag + '_' + i).is(':checked')) ? 'Y' : 'N')  + ", " +
                  (penalties?penalties:"0")+ ", " +
                  (goals ? goals : "0") + subinfo;
    };

    var homeTeam='';
    var awayTeam='';
    for (var i =1; i <= 8; i++) {
        homeTeam += add('H' + i, [ player('Home',"",i) ]);
        awayTeam += add('A' + i, [ player('Away',"",i) ]);
    }
    for (var i =1; i <= 8; i++) {
        homeTeam += add('H' + (i+8), [ player('Home',"Sub",i) ]);
        awayTeam += add('A' + (i+8), [ player('Away',"Sub",i) ]);
    }

    homeTeamCode = $('#cboHome_Team').find(":selected").val();
    awayTeamCode = $('#cboAway_Team').find(":selected").val();
    var fixtureCode= homeTeamCode + awayTeamCode + "_2017";

    var xml= add('xml', [
        add('Division',[ $('#cboDivision').find(":selected").text() ]),
        add('Date',[ $('#txtDate').val()  ]),
        add('Time',[ $('#txtTime').val() ]),
        add('HomeTeam',[ $('#cboHome_Team').find(":selected").text() ]),
        add('AwayTeam',[ $('#cboAway_Team').find(":selected").text()]),
        add('FullTime',[ $('#txtHome_Score_FT').val() + "-" + $('#txtAway_Score_FT').val() ] ),
        add('HalfTime',[ $('#txtHome_Score_HT').val() + "-" + $('#txtAway_Score_HT').val()] ),
        homeTeam,
        awayTeam,
        add('HomeCaptain',[ $('#homeCaptain').find(":selected").text() ]),
        add('AwayCaptain',[ $('#awayCaptain').find(":selected").text() ]),
        add('Referee',[ $('#txtReferee').val()]),
        add('Notes',[ $('#txtNotes').val() ]),
        add('PrivateNotes', [ $('#txtPrivateNotes').val() ]),
        add('NotesBy',[ $('#txtWritten_By').val() ]),
        add('SubmittedDate',[]),
        add('RefHomeRating',[ $('#cboRefHomeRating').find(":selected").val() ]),
        add('RefAwayRating',[ $('#cboRefAwayRating').find(":selected").val()]),
        add('SubmittedEmail',[  $('#txtEmailAddress').val() ]),
        add('FixtureCode' , [ fixtureCode ])
    ]);


    // This relies on appropriate configuration to allow cross-domain POST
    $.ajax({
            type : "POST",
            url : emailerURL + "?action=scorecard",
            data : xml,
            success : function( data ) {
                        data = JSON.parse(data);
                        $("#submitMsg" ).html( data.msg );
                        $("#submitXML").text(data.xml);
                        $("#submitOutcomeDialog").dialog( { title : "Submit Outcome", width:"1000"});
                        $('#submitOutcomeDialogClose').button();
                        $('#submitOutcomeDialogClose').click( function() {
                            $("#submitOutcomeDialog").dialog('close');
                        });
            },
            error : function(data, status, errorMsg) {
                $("#submitMsg" ).html( "A problem occured submitting the scorecard. Please try again or copy and paste the data below and send to the CKA results officer" );
                $("#submitXML").text(xml);
                $("#submitOutcomeDialog").dialog( { title : "Submit Outcome", width:"1000"});
                $('#submitOutcomeDialogClose').button();
                $('#submitOutcomeDialogClose').click( function() {
                    $("#submitOutcomeDialog").dialog('close');
                });
            }
    });
};

