// © Copyright 2000-2001 Nick Armitage

var UploadDirectory = 'Upload';

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function LoadScoreCard(FixtureCode)
//  function PaintScorecardHeaderRow()
//  function PaintScorecardRow1(Division, TheDate, TheTime)
//  function PaintScorecardRow2(TeamNameHome, TeamNameAway, HomeScore, AwayScore, HomeScoreHT, AwayScoreHT)
//  function PaintScorecardPlayerGridHeader()
//  function PaintScorecardPlayerGrid(RowNumber, HomeBackgroundColour, HomePlayerName, 
//                                    HomeGoals, HomePenalties, HomeCards, 
//                                    AwayBackgroundColour, AwayPlayerName, AwayGoals, 
//                                    AwayPenalties, AwayCards, HomeU18, AwayU18)
//  function PaintScorecardSubGridHeader()
//  function PaintScorecardSubGrid(RowNumber, HomeSubFor, HomeSubAt, HomeBackgroundColour, 
//                                 HomePlayerName, HomeGoals, HomePenalties, HomeCards, 
//                                 AwaySubFor, AwaySubAt, AwayBackgroundColour, 
//                                 AwayPlayerName, AwayGoals, AwayPenalties, AwayCards,
//                                 HomeU18, AwayU18)
//  function PaintScorecardRow3(Notes, HomeCaptain)
//  function PaintScorecardRow4(AwayCaptain)
//  function PaintScorecardRow5(RefereeName, RefereeTeam)
//
//****************************************************************************

//*********************************
function LoadScoreCard(FixtureCode)
{
 try
 {
  if (FixtureCode == "")
  {
    //No fixture code specified so leave now
    return;
  }
    
  //Setup the parameters to window.showModalDialog()
  var sURL = '../' + UploadDirectory + '/' + FixtureCode + '.htm';
  var sDimensions = "dialogHeight:650px; dialogWidth:860px;"
  var sOptions    = "center:yes; status:no; resizable:yes; help:no; scroll:yes";
  var sFeatures   = sDimensions + " " + sOptions;

  //And finally open up the modal dialog
  var ret = window.showModalDialog(sURL, "", sFeatures);
 }
 catch (error)
 {
   CatchError('LoadScoreCard(FixtureCode=' + FixtureCode + ')', error.number, error.name, error.message);
 }
}

function PaintSpacerRow(pHeight)
{
  var s = "";

  s += "<TR HEIGHT=" + pHeight + "px>";
  s += " <TD COLSPAN=16></TD>";
  s += "</TR>";
  
  return s;
}

//*********************************
function PaintScorecardHeaderRow()
{
 try
 {
  var s = "";
  
  s += "<COL WIDTH=4%>";  //#1  For
  s += "<COL WIDTH=4%>";  //#2  At
  s += "<COL WIDTH=24%>"; //#3  Name
  s += "<COL WIDTH=10%>"; //#4  Pens
  s += "<COL WIDTH=4%>";  //#5  FTHome
  s += "<COL WIDTH=4%>";  //#6  HTHome
  
  s += "<COL WIDTH=4%>";  //#7  HTAway
  s += "<COL WIDTH=4%>";  //#8  FTAway
  s += "<COL WIDTH=9%>";  //#9  Date
  s += "<COL WIDTH=15%>"; //#10 25 Feb 2005
  s += "<COL WIDTH=10%>"; //#11 Pens
  s += "<COL WIDTH=8%>";  //#12 Goals
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardHeaderRow()', error.number, error.name, error.message);
 }  
}

function PaintScorecardRow1(Division, TheDate, TheTime)
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=4px>";  
  s += " <TD class=ScorecardTitle COLSPAN=5>Cambridge Korfball League</TD>";
  s += " <TD class=Ink COLSPAN=2 style='text-align:right'>Division&nbsp;</TD>";
  s += " <TD class=PencilFooter>" + Division + "</TD>";
  s += " <TD class=Ink style='text-align:right'>Date&nbsp;</TD>";
  s += " <TD class=PencilFooter>" + TheDate + "</TD>";
  s += " <TD class=Ink style='text-align:right'>Time&nbsp;</TD>";
  s += " <TD class=PencilFooter>" + TheTime + "</TD>";
  s += "</TR>";
  
  s += PaintSpacerRow(3);

  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardRow1(...)', error.number, error.name, error.message);
 }  
}

function PaintScorecardRow2(TeamNameHome, TeamNameAway, HomeScore, AwayScore, HomeScoreHT, AwayScoreHT)
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=6px>";
  s += " <TD class=PencilTeams COLSPAN=4>" + TeamNameHome + "</TD>";
  s += " <TD class=PencilBoxFT>" + HomeScore + "</TD>";
  s += " <TD class=PencilHT COLSPAN=2 VALIGN=BOTTOM>";
  if (HomeScoreHT == null)
  {
    s += "&nbsp;";
  }
  else
  {
    s += HomeScoreHT;
  }
  s += "-";
  
  if (AwayScoreHT == null)
  {
    s += "&nbsp;";
  }
  else
  {
    s += AwayScoreHT;
  }
  s += "</TD>"
  s += " <TD class=PencilBoxFT>" + AwayScore + "</TD>";
  s += " <TD class=PencilTeams COLSPAN=4>" + TeamNameAway + "</TD>";
  s += "</TR>";
  
  s += "<TR HEIGHT=4px VALIGN=TOP>";
  s += " <TD class=InkFooter COLSPAN=2 style='text-align:left'>Home Team</TD>";
  s += " <TD COLSPAN=3>&nbsp;</TD>";
  s += " <TD class=InkFooter COLSPAN=2 style='text-align:center'>Half Time</TD>";
  s += " <TD COLSPAN=4>&nbsp;</TD>";
  s += " <TD class=InkFooter>Away Team</TD>";
  s += "</TR>";
  
  s += PaintSpacerRow(5);
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardRow2(...)', error.number, error.name, error.message);
 }  
}

function PaintScorecardPlayerGridHeader()
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=InkBox COLSPAN=2>Player";
  s += " <TD class=InkBox>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=2>Goals";
  s += " <TD class=InkBox COLSPAN=2>Player";
  s += " <TD class=InkBox COLSPAN=2>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox>Goals";
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardPlayerGridHeader()', error.number, error.name, error.message);
 }  
}

function PaintScorecardPlayerGrid(RowNumber, HomeBackgroundColour, HomePlayerName, HomeGoals, HomePenalties, 
  HomeCards, AwayBackgroundColour, AwayPlayerName, AwayGoals, AwayPenalties, AwayCards, HomeU18, AwayU18)
{
 try
 {
  var s = "";

  s += "<TR HEIGHT=4px>";
  s += " <TD class=InkBox COLSPAN=2 VALIGN=CENTER style='background-color:#e0e0e0'>#" + RowNumber + "</TD>";
  s += " <TD style='background-color:" + HomeBackgroundColour + "' class=PencilBox>" + HomePlayerName;
  if (HomeU18 == true)
  {
    s += " (U18)";
  }
  s += " <TD class=PencilBox>" + HomePenalties;
  s += " <TD class=PencilBox COLSPAN=2>" + HomeGoals;
  s += " <TD class=InkBox COLSPAN=2 VALIGN=CENTER style='background-color:#e0e0e0'>#" + RowNumber + "</TD>";
  s += " <TD style='background-color:" + AwayBackgroundColour + "' class=PencilBox COLSPAN=2>" + AwayPlayerName;
  if (AwayU18 == true)
  {
    s += " (U18)";
  }
  s += " <TD class=PencilBox>" + AwayPenalties;
  s += " <TD class=PencilBox>" + AwayGoals;
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardPlayerGrid(...)', error.number, error.name, error.message);
 }
}

function PaintScorecardSubGridHeader()
{
 try
 {
  var s = "";

  s += PaintSpacerRow(2);
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=InkBox>For";
  s += " <TD class=InkBox>At";
  s += " <TD class=InkBox>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=2>Goals";
  s += " <TD class=InkBox>For";
  s += " <TD class=InkBox>At";
  s += " <TD class=InkBox COLSPAN=2>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox>Goals";
  s += "</TR>";
 
  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardSubGridHeader()', error.number, error.name, error.message);
 }  
}

function PaintScorecardSubGrid(RowNumber, HomeSubFor, HomeSubAt, HomeBackgroundColour, HomePlayerName, HomeGoals, HomePenalties, HomeCards, AwaySubFor, AwaySubAt, AwayBackgroundColour, AwayPlayerName, AwayGoals, AwayPenalties, AwayCards, HomeU18, AwayU18)
{
 try
 {
  var s = "";

  s += "<TR HEIGHT=4px>";
  s += "<TD class=PencilBox>" + HomeSubFor;
  s += "<TD class=PencilBox>" + HomeSubAt;
  s += "<TD style='background-color:" + HomeBackgroundColour + "' class=PencilBox>" + HomePlayerName;
  if (HomeU18 == true)
  {
    s += " (U18)";
  }
  s += "<TD class=PencilBox>" + HomePenalties;
  s += "<TD class=PencilBox COLSPAN=2>" + HomeGoals;
  s += "<TD class=PencilBox>" + AwaySubFor;
  s += "<TD class=PencilBox>" + AwaySubAt;
  s += "<TD style='background-color:" + AwayBackgroundColour + "' class=PencilBox COLSPAN=2>" + AwayPlayerName;
  if (AwayU18 == true)
  {
    s += " (U18)";
  }
  s += "<TD class=PencilBox>" + AwayPenalties;
  s += "<TD class=PencilBox>" + AwayGoals;
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardSubGrid(...)', error.number, error.name, error.message);
 }
}

function PaintScorecardRow3(Notes, HomeCaptain)
{
 try
 {
  var s = "";

  s += PaintSpacerRow(3);
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=Ink VALIGN=TOP COLSPAN=2 ROWSPAN=3 style='TEXT-ALIGN:center'>Notes";
  s += "  <img src='../images/pencildraw.gif' WIDTH='57' HEIGHT='100'>";
  s += " </TD>";
  s += " <TD class=Pencil style='font-size:9pt; font-weight:normal' VALIGN=CENTER ROWSPAN=3 COLSPAN=4>" + Notes;
  s += " </TD>";
  s += " <TD class=Ink VALIGN=TOP COLSPAN=2 ROWSPAN=3 style='TEXT-ALIGN:center'>Signed";
  s += "  <img src='../images/featherquill.gif' WIDTH='57' HEIGHT='100'>";
  s += " </TD>";
  s += " <TD class=PencilSigned COLSPAN=3>" + HomeCaptain;
  s += " <TD class=InkFooter VALIGN=BOTTOM style='BORDER-BOTTOM: black 1px solid'>Home Captain";
  s += "</TR>";
    
  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardRow3(Notes=' + Notes + ', HomeCaptain=' + HomeCaptain + ')', error.number, error.name, error.message);
 }
}

function PaintScorecardRow4(AwayCaptain)
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=PencilSigned COLSPAN=3>" + AwayCaptain;
  s += " <TD class=InkFooter VALIGN=BOTTOM style='BORDER-BOTTOM: black 1px solid'>Away Captain";
  s += "</TR>";
    
  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardRow4(AwayCaptain=' + AwayCaptain + ')', error.number, error.name, error.message);
 }  
}

function PaintScorecardRow5(RefereeName, RefereeTeam)
{
 try
 {
  var s = "";

  s += "<TR HEIGHT=4px>";
  s += " <TD class=PencilSigned COLSPAN=3>" + RefereeName + " - " + RefereeTeam;
  s += " <TD class=InkFooter VALIGN=BOTTOM NOWRAP style='BORDER-BOTTOM: black 1px solid'>Referee - Team";
  s += "</TR>";

  return s;  
 }
 catch (error)
 {
   CatchError('PaintScorecardRow5(Referee=' + Referee + ', RefereeTeam=' + RefereeTeam + ')', error.number, error.name, error.message);
 }
}
