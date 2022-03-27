var emailerURL = "http://www-dyn.cl.cam.ac.uk/~mpew2/ckafixtures.php";
//if(window.location.host == "localhost:81") emailerURL = "./ckafixtures.php";



var requesterDetails = function( dialog, fixture ) {
    var name = $('#name',dialog).val();
    var club = $('#club',dialog).val();
    var email = $('#email',dialog).val();

    var refTeamCode = fixture.fields.referee_team;
    var refClubEmail = teamContact(refTeamCode);
    var homeTeamCode = fixture.fields.home_team;
    var homeClubEmail = teamContact(homeTeamCode);
    var awayTeamCode = fixture.fields.away_team;
    var awayClubEmail = teamContact(awayTeamCode);

    var sendTo = "fixtures@cambskorfball.co.uk,results@cambskorfball.co.uk," +
                    refClubEmail + "," + homeClubEmail + "," +  awayClubEmail;

    if(name === "" ) return { flag : false, msg : "Your name must be entered." };
    if(club === "" ) return { flag : false, msg : "Your club name must be entered." };
    if(email === "") return { flag : false, msg : "Your email address must be entered."};

    var msg = "Requester name: "  + name  + "\n" +
              "Requester club: "  + club  + "\n" +
              "Requester email: " + email + "\n";
    return { flag : true, msg : msg, email : email, othersendto : sendTo };
};

var submitPendingFixture = function( fixture, reason) {

    var dialog = $('#fixtureChangePendingDialog');
    var rDetails = requesterDetails(dialog,fixture);
    if(reason === "") {
        alert("Reason for pending change must be provided.");
        return;
    }
    if(rDetails.flag) {
        var msg = "Fixture: " + fixture.pk + "\n" +
            "Reason: " + reason + "\n" +  rDetails.msg;

        $.ajax({
            type : "POST",
            url : emailerURL + "?action=pending&sendto=" + rDetails.email + "&othersendto=" + rDetails.othersendto,
            data : msg,
            success :  function( data ) {
                            var result = JSON.parse(data);
                            if(result.errorMsg) {
                                alert(result.errorMsg);
                            } else {
                                dialog.dialog('close');
                        }
                },
            error : function(data, status, errorMsg) {
                console.log(data);
            }
        });
    } else { alert( rDetails.msg ); }

};

var submitAgreedFixture = function( fixture, reason) {

    var dialog =  $('#fixtureChangeAgreedDialog');
    var date = $('#newDatePicker').val();
    var time = $('#newTimePicker').val();
    var venue = $('#newVenue').val();
    var ref = $('#newRef').val();

    if( ! ( date || time || venue || ref)) {
        alert("One of new date, time, venue or ref needs to be entered.");
        return;
    }


    if(reason === "") {
        alert("Reason for change must be provided.");
        return;
    }

    var rDetails = requesterDetails(dialog,fixture);
    if(rDetails.flag) {
        var msg = "The following change has been agreed for fixture: " + fixture.pk + "\n" +
            "New Date: " + date + "\n" +
            "New Time: " + time + "\n" +
            "New Venue: " + venue + "\n" +
            "New Referee: " + ref + "\n" +
            "Reason: " + reason + "\n" + rDetails.msg;

         $.ajax({
            type : "POST",
            url : emailerURL + "?action=agreed&sendto=" + rDetails.email + "&othersendto=" + rDetails.othersendto,
            data : msg,
            success :  function( data ) {
                            var result = JSON.parse(data);
                            if(result.errorMsg) {
                                alert(result.errorMsg);
                            } else {
                                dialog.dialog('close');
                        }
                },
            error : function(data, status, errorMsg) {
                console.log(data);
            }
        });
    } else {
        alert(rDetails.msg);
    }

};

var fillExistingDetails = function(fixture,tab,rowTag,doBlank) {
    var dt = formatDateTime(fixture.fields.date);
    var venue = venueName( fixture.fields.venue );
    var homeName = teamName(fixture.fields.home_team);
    var awayName = teamName(fixture.fields.away_team);
    var refTeam = teamName(fixture.fields.referee_team);
    var blank = doBlank ? "<td>Current</td>" : "";
    tab.append( "<tr id='" + rowTag + "'>" + blank + "<td>" + dt[0] + "</td><td>" + dt[1] + "</td>" +
                            "<td>" + venue + "</td>" +
                            "<td>" + homeName + "</td>" +
                            "<td>" + awayName + "</td>" +
                            "<td>" + refTeam + "</td></tr>"
                            );
};

var pendingFixture = function( fixture ) {
    $('#fixtureChangePendingDialog').dialog({ minWidth : 1200 });
    $('#existingPendingDetails').remove();
    var tab = $('#pendingFixture');

    $('#pendingReason').val('');

    fillExistingDetails(fixture,tab,'existingPendingDetails',false);

    $('#pendingSubmitBtn').button();
    $('#pendingSubmitBtn').off('click');
    $("#pendingSubmitBtn" ).click( function( event ) {
                var reason=$('#pendingReason').val();
                submitPendingFixture( fixture, reason );
            } );
};


var agreedFixture = function( fixture ) {

    $('#fixtureChangeAgreedDialog').dialog({ minWidth : 1200 });
    var tab = $("#agreedFixture");
    $('#existingAgreedDetails').remove();
    $('#newAgreedDetails').remove();
    fillExistingDetails(fixture,tab, 'existingAgreedDetails',true);

    tab.append("<tr id='newAgreedDetails'><td>New</td>" +
               "<td><input id='newDatePicker'></input></td>" +
               "<td><input id='newTimePicker'></input></td>" +
               "<td><input id='newVenue'></input></td>" +
               "<td></td><td></td>" +
               "<td><input id='newRef'></input></td>" +
               "</tr>");
    $('#newDatePicker').datepicker();
    $('#newTimePicker').timepicker();

    $('#agreedSubmitBtn').button();
    $('#agreedSubmitBtn').off('click');
    $("#agreedSubmitBtn" ).click( function( event ) {
                var reason=$('#agreedReason').val();
                submitAgreedFixture( fixture, reason );
            } );
};



var setupPage = function (isScorecard){

    getData( function() {
        var tab = $("#fixtures");
        _.each(database.fixtures, function(fixture) {
            if(fixture.fields.division == "SERL"  || fixture.fields.division == "NL" || fixture.fields.date_received != null) return;
            var actions="";
            if(isScorecard) {
                actions = "<td><div id='scorecardBtn" + fixture.pk + "'>Scorecard</div></td>";
            } else {
                actions = "<td><div id='pendingBtn" + fixture.pk + "'>Pending</div>" +
                              "<div id='agreedBtn" + fixture.pk + "'>Agreed</div></td>";
            }
            var dt = formatDateTime(fixture.fields.date);
            var venue = venueName( fixture.fields.venue );
            var homeName = teamName(fixture.fields.home_team);
            var awayName = teamName(fixture.fields.away_team);
            var refTeam = teamName(fixture.fields.referee_team);
            tab.append( "<tr><td>" + dt[0] + "</td><td>" + dt[1] + "</td>" +
                            "<td>" + venue + "</td>" +
                            "<td>" + fixture.fields.division + "</td>" +
                            "<td>" + homeName + "</td>" +
                            "<td>" + awayName + "</td>" +
                            "<td>" + refTeam + "</td>" + actions +
                            "</tr>");

            if(isScorecard) {
                $( "#scorecardBtn" + fixture.pk ).button();
                $( "#scorecardBtn" + fixture.pk ).click( function( event ) {
                    window.open("scorecard.html?fixture=" + fixture.pk, "_self");
                } );
            } else {
                $( "#pendingBtn" + fixture.pk ).button();
                $( "#pendingBtn" + fixture.pk ).click( function( event ) {
                    pendingFixture( fixture );
                } );
                $( "#agreedBtn" + fixture.pk ).button();
                $( "#agreedBtn" + fixture.pk ).click( function( event ) {
                    agreedFixture( fixture);
                } );
            }
        });
    });

};

var setupPageScorecard = function (){
    setupPage(true);
};
