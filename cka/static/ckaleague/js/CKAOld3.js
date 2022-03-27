// © Copyright 2000-2001 Nick Armitage

var UploadDirectory = 'Upload';

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function LoadScoreCard(FixtureCode)
//  function PaintFixture(TheDate, TheTime, HomeScore, AwayScore, FixtureCode, Referee)
//  function PaintFixtureBlank()
//  function PaintFixtureTeamName(ClassName, TeamName, WidthFlag)
//  function PaintPageTitle(Title)

//  function PaintFixtureListHeader()
//  function PaintFixtureListRow(ClassName, TeamCodeHome, TeamCodeAway, TeamCodeReferee, 
//                               TheDate, TheTime, Division, 
//                               TeamNameHome, TeamNameAway, TeamNameReferee, 
//                               FixtureCode, HomeScore, AwayScore,
//                               YYYYMMDD)

//  function PaintTableHeader()
//  function PaintTableRow(ClassName, ShortName, P, HW, HD, HL, HGF, HGA, 
//                         AW, AD, AL, AGF, AGA, GD, Pts)

//  function PaintStatisticsHeader()
//  function PaintStatisticsRow(TeamCode, ClassName, Name, ShortName, 
//                              Games, Goals, Penalties, Total, Average)

//  function PaintStatusRow(TeamCode, ClassName, PlayerName, TeamName, 
//                          Games, NLGames, InitialCount, Description)

//  function PaintSeasonHeaderInner(ColWidth, GameDetails, GameNumber)
//  function PaintSeasonHeaderOuter(Mode, ClassName)
//  function PaintSeasonRowBegin(ClassName, PlayerName)
//  function PaintSeasonRowEnd(ClassName, TotalGames, TotalGoals, TotalPens)
//  function PaintSeasonRowInner(GameCount, ImgColWidth, ValColWidth, 
//                               listClassName, listImageName, listGoals, listPens)

//  function PaintScorecardHeaderRow()
//  function PaintScorecardRow1(Division, TheDate, TheTime)
//  function PaintScorecardRow2(TeamNameHome, TeamNameAway, HomeScore, AwayScore)
//  function PaintScorecardPlayerGridHeader()
//  function PaintScorecardPlayerGrid(RowNumber, HomeBackgroundColour, HomePlayerName, 
//                                    HomeGoals, HomePenalties, HomeCards, 
//                                    AwayBackgroundColour, AwayPlayerName, AwayGoals, 
//                                    AwayPenalties, AwayCards)
//  function PaintScorecardSubGridHeader()
//  function PaintScorecardSubGrid(RowNumber, HomeSubFor, HomeSubAt, HomeBackgroundColour, 
//                                 HomePlayerName, HomeGoals, HomePenalties, HomeCards, 
//                                 AwaySubFor, AwaySubAt, AwayBackgroundColour, 
//                                 AwayPlayerName, AwayGoals, AwayPenalties, AwayCards)
//  function PaintScorecardRow3(Notes, HomeCaptain)
//  function PaintScorecardRow4(AwayCaptain)
//  function PaintScorecardRow5(RefereeName, RefereeTeam)

//  function MouseClick(btnName)
//  function MouseOver(btnName)
//  function MouseOut(btnName)
//  function FilterRow(obj, TagName, TeamCode, YYYYMMDD)

//****************************************************************************

//*********************************
function PaintPageTitle(Title)
{
 try
 {
  var s = "";
  
  s += "<TABLE ALIGN=CENTER CELLPADDING=2 FRAME='none' WIDTH=100%>";
  s += " <TR>";
  s += "  <TD class=DivTitle>";
  s += "   " + Title;
  s += "  </TD>";
  s += " </TR>";
  s += "</TABLE>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintPageTitle(Title=' + Title + ')', error.number, error.name, error.message);
 }
}

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
  var sDimensions = "dialogHeight:600px; dialogWidth:860px;"
  var sOptions    = "center:yes; status:no; resizable:yes; help:no";
  var sFeatures   = sDimensions + " " + sOptions;

  //And finally open up the modal dialog
  var ret = window.showModalDialog(sURL, "", sFeatures);
 }
 catch (error)
 {
   CatchError('LoadScoreCard(FixtureCode=' + FixtureCode + ')', error.number, error.name, error.message);
 }
}

function PaintFixtureTeamName(ClassName, TeamName, WidthFlag)
{
 try
 {
  if (WidthFlag == "true")
  {
  	return "<TD class=" + ClassName + " WIDTH=11%>" + TeamName + "</TD>";
  }
  else
  {
  	return "<TD class=" + ClassName + ">" + TeamName + "</TD>";
  }
 }
 catch (error)
 {
   CatchError('PaintFixtureTeamName(ClassName=' + ClassName + ', TeamName=' + TeamName + ', WidthFlag=' + WidthFlag + ')', error.number, error.name, error.message);
 }
}

function PaintFixtureBlank()
{
  return "<TD class=OrangeOnBlack style='font-size:16pt'>X</TD>";
}

function PaintFixture(TheDate, TheTime, HomeScore, AwayScore, FixtureCode, Referee, UploadDir)
{
 try
 {
  var s = "";
    
  s += "<TD>";
  s += " <TABLE style='cellSpacing:0px; cellPadding:0px' CELLSPACING=0 CELLPADDING=0 WIDTH=100% BORDER=0 FRAME='none' BGCOLOR=White>";
  s += "  <TR>";
  s += "   <TD CLASS=FixtureDate WIDTH=70%>" + TheDate + "</TD>";
  s += "   <TD CLASS=FixtureTime WIDTH=30%>" + TheTime + "</TD>";
  s += "  </TR>";
  s += " </TABLE>";
    
  s += " <TABLE style='cellSpacing:0px; cellPadding:0px' CELLSPACING=0 CELLPADDING=0 WIDTH=100% BORDER=0 FRAME='none' BGCOLOR=White>";
  s += "  <TR>";
  s += "   <TD class=FixtureScore WIDTH=55%>";
  if ((HomeScore == "") && (AwayScore == ""))
  {
    //No score for this fixture so output a blank space
    s += "    &nbsp";
  }
  else
  {
    //Output the span for the scoreline
    s += "    <SPAN";
    s += "      OnMouseOver = \"this.style.cursor='hand'\"";
    s += "      OnMouseOut = \"this.style.cursor='auto'\"";
    s += "      OnClick=\"LoadScoreCard('" + FixtureCode + "')\"";
    s += "      style=\"text-decoration:underline\">";
    s += "      " + HomeScore + "-" + AwayScore;
    s += "    </SPAN>";
  }
  s += "   </TD>";
  s += "   <TD CLASS=FixtureRef WIDTH=45% VALIGN=BOTTOM>" + Referee + "</TD>";
  s += "  </TR>";
  s += " </TABLE>";
  s += "</TD>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintFixture(TheDate=' + TheTime + ', TheTime=' + TheTime + ', HomeScore=' + HomeScore + ', AwayScore=' + AwayScore + ', FixtureCode=' + FixtureCode + ', Referee=' + Referee + ')', error.number, error.name, error.message);
 }
}

//*********************************
function PaintFixtureListHeader()
{
 try
 {
  var s = "";
  
  s += "<TR>";
  s += " <TD class=BlackOnOrange WIDTH=20%>Date</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Time</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>Division</TD>";
  s += " <TD class=BlackOnOrange WIDTH=15%>Home Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=15%>Away Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=15%>Referee</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Score</TD>";
  s += "</TR>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintFixtureListHeader()', error.number, error.name, error.message);
 }
}

function PaintFixtureListRow(ClassName, TeamCodeHome, TeamCodeAway, TeamCodeReferee, TheDate, TheTime, Division, TeamNameHome, TeamNameAway, TeamNameReferee, FixtureCode, HomeScore, AwayScore, YYYYMMDD)
{
 try
 {
  var s = "";

  s += "<TR ID=XXX TEAMCODE=" + TeamCodeHome + TeamCodeAway + " REFCODE=" + TeamCodeReferee;
  s += "           TEAMREFCODE=" + TeamCodeHome + TeamCodeAway + TeamCodeReferee;
  s += "           YYYYMMDD=" + YYYYMMDD + ">";
  s += " <TD class=" + ClassName + ">" + TheDate + "</TD>";
  s += " <TD class=" + ClassName + ">" + TheTime + "</TD>";
  s += " <TD class=" + ClassName + ">" + Division + "</TD>";
  s += " <TD class=" + ClassName + " style='text-align:left'>" + TeamNameHome + "</TD>";
  s += " <TD class=" + ClassName + " style='text-align:left'>" + TeamNameAway + "</TD>";
  s += " <TD class=" + ClassName + " style='text-align:left'>" + TeamNameReferee + "</TD>";
  
  if ((HomeScore == "") && (AwayScore == ""))
  {
    s += " <TD class=" + ClassName + "></TD>";
  }
  else
  {
    //Output the span for the scoreline
    s += " <TD class=" + ClassName + ">";
    s += "  <SPAN";
    s += "   OnMouseOver = \"this.style.cursor='hand'\"";
    s += "   OnMouseOut = \"this.style.cursor='auto'\"";
    s += "   OnClick=\"LoadScoreCard('" + FixtureCode + "')\"";
    s += "   style=\"text-decoration:underline\">";
    s += "   " + HomeScore + "-" + AwayScore;
    s += "  </SPAN>";
    s += " </TD>";
  }
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintFixtureListRow(...)', error.number, error.name, error.message);
 }
}

//*********************************
function PaintTableHeader()
{
 try
 {
  var s = "";
  
  s += "<TR style='HEIGHT:8px'>";
  s += " <TD class=BlackOnOrange WIDTH=10% ROWSPAN=2>Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5% ROWSPAN=2>P</TD>";
  s += " <TD class=BlackOnOrange COLSPAN=5>Home</TD>";
  s += " <TD class=BlackOnOrange COLSPAN=5>Away</TD>";
  s += " <TD class=BlackOnOrange COLSPAN=5>Overall</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5% ROWSPAN=2>GD</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5% ROWSPAN=2>Pts</TD>";
  s += "</TR>";
  
  s += "<TR style='HEIGHT:8px'>";
  s += " <TD class=BlackOnOrange WIDTH=5%>W</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>D</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>L</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>F</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>A</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>W</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>D</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>L</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>F</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>A</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>W</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>D</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>L</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>F</TD>";
  s += " <TD class=BlackOnOrange WIDTH=5%>A</TD>";
  s += "</TR>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintTableHeader()', error.number, error.name, error.message);
 }
}

function PaintTableRow(ClassName, ShortName, P, HW, HD, HL, HGF, HGA, AW, AD, AL, AGF, AGA, GD, Pts)
{
 try
 {
  var s = "";
  
  s += "<TR>";
  s += " <TD class=" + ClassName + ">" + ShortName + "</TD>";
  s += " <TD class=" + ClassName + ">" + P + "</TD>";
  s += " <TD class=" + ClassName + ">" + HW + "</TD>";
  s += " <TD class=" + ClassName + ">" + HD + "</TD>";
  s += " <TD class=" + ClassName + ">" + HL + "</TD>";
  s += " <TD class=" + ClassName + ">" + HGF + "</TD>";
  s += " <TD class=" + ClassName + ">" + HGA + "</TD>";
  s += " <TD class=" + ClassName + ">" + AW + "</TD>";
  s += " <TD class=" + ClassName + ">" + AD + "</TD>";
  s += " <TD class=" + ClassName + ">" + AL + "</TD>";
  s += " <TD class=" + ClassName + ">" + AGF + "</TD>";
  s += " <TD class=" + ClassName + ">" + AGA + "</TD>";
  s += " <TD class=" + ClassName + ">" + (HW + AW) + "</TD>";
  s += " <TD class=" + ClassName + ">" + (HD + AD) + "</TD>";
  s += " <TD class=" + ClassName + ">" + (HL + AL) + "</TD>";
  s += " <TD class=" + ClassName + ">" + (HGF + AGF) + "</TD>";
  s += " <TD class=" + ClassName + ">" + (HGA + AGA) + "</TD>";
  s += " <TD class=" + ClassName + ">" + GD + "</TD>";
  s += " <TD class=" + ClassName + ">" + Pts + "</TD>";
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintTableRow(...)', error.number, error.name, error.message);
 }  
}

//*********************************
function PaintStatisticsHeader()
{
 try
 {
  var s = "";

  s += "<TR>";
  s += " <TD class=BlackOnOrange style='text-align:left' WIDTH=30%>Name</TD>";
  s += " <TD class=BlackOnOrange WIDTH=20%>Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Games</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Goals</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Pens</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Total</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>Ave</TD>";
  s += "</TR>";
    
  return s;
 }
 catch (error)
 {
   CatchError('PaintStatisticsHeader()', error.number, error.name, error.message);
 }  
}

function PaintStatisticsRow(TeamCode, ClassName, Name, ShortName, Games, Goals, Penalties, Total, Average)
{
 try
 {
  var s = "";
  
  s += "<TR ID=XXX TEAMCODE=" + TeamCode + ">";
  s += " <TD class=" + ClassName + " style='text-align:left'>" + Name + "</TD>";
  s += " <TD class=" + ClassName + ">" + ShortName + "</TD>";
  s += " <TD class=" + ClassName + ">" + Games + "</TD>";
  s += " <TD class=" + ClassName + ">" + Goals + "</TD>";
  s += " <TD class=" + ClassName + ">" + Penalties + "</TD>";
  s += " <TD class=" + ClassName + ">" + Total + "</TD>";
  s += " <TD class=" + ClassName + ">" + Average + "</TD>";
  s += "</TR>";
	
  return s;
 }
 catch (error)
 {
   CatchError('PaintStatisticsRow(...)', error.number, error.name, error.message);
 }  
}

//*********************************
function PaintStatusRow(TeamCode, ClassName, PlayerName, TeamName, Games, NLGames, InitialCount, Description)
{
 try
 {
  var s = "";
  
  s += "<TR ID=XXX TEAMCODE=" + TeamCode + ">";
  s += " <TD class=" + ClassName + " style='text-align:left'>" + PlayerName + "</TD>";
  s += " <TD class=" + ClassName + ">" + TeamName + "</TD>";
  s += " <TD class=" + ClassName + ">" + Games + "</TD>";
  s += " <TD class=" + ClassName + ">" + NLGames + "</TD>";
  s += " <TD class=" + ClassName + ">" + parseInt(InitialCount/2) + "</TD>";
  s += " <TD class=" + ClassName + ">" + Description + "</TD>";
  s += "</TR>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintStatusRow(...)', error.number, error.name, error.message);
 }  
}

//*********************************
function PaintSeasonHeaderOuter(Mode, ClassName)
{
 try
 {
  var s = "";
  
  if (Mode == 'BEGIN')
  {
    s += "<TR class=" + ClassName + ">";
    s += " <TD WIDTH=10%>Name</TD>";
  }
  else
  {
    s += " <TD WIDTH=3% class=" + ClassName + " style='font-size:7pt; font-weight:normal'>Games</TD>";
    s += " <TD WIDTH=3% class=" + ClassName + " style='font-size:7pt; font-weight:normal'>Goals</TD>";
    s += " <TD WIDTH=3% class=" + ClassName + " style='font-size:7pt; font-weight:normal'>Pens</TD>";
    s += "</TR>";  
  }
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintSeasonHeaderOuter(Mode=' + Mode + ', ClassName=' + ClassName + ')', error.number, error.name, error.message);
 }  
}

function PaintSeasonHeaderInner(ColWidth, GameDetails, GameNumber)
{
 try
 {
  var s = "";
  
  s += " <TD WIDTH=" + ColWidth + "% COLSPAN=3 TITLE='" + GameDetails + "'>" + GameNumber + "</TD>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintSeasonHeaderInner(...)', error.number, error.name, error.message);
 }  
}

function PaintSeasonRowBegin(ClassName, PlayerName)
{
 try
 {
  var s = "";
  
  s += "<TR class=Season>";
  s += " <TD class=" + ClassName + " style='font-size:8pt; font-weight:normal'>" + PlayerName + "</TD>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintSeasonRowBegin(ClassName=' + ClassName + ', PlayerName=' + PlayerName + ')', error.number, error.name, error.message);
 }  
}

function PaintSeasonRowEnd(ClassName, TotalGames, TotalGoals, TotalPens)
{
 try
 {
  var s = "";
  
  s += " <TD WIDTH=3% class=" + ClassName + " style='font-size:7pt; font-weight:normal'>" + TotalGames + "</TD>";
  s += " <TD WIDTH=3% class=" + ClassName + " style='font-size:7pt; font-weight:normal'>" + TotalGoals + "</TD>";
  s += " <TD WIDTH=3% class=" + ClassName + " style='font-size:7pt; font-weight:normal'>" + TotalPens + "</TD>";
  s += "</TR>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintSeasonRowEnd(...)', error.number, error.name, error.message);
 }  
}

function PaintSeasonRowInner(GameCount, ImgColWidth, ValColWidth, listClassName, listImageName, listGoals, listPens)
{
 try
 {
  var i;
  var s = "";
  var iClassNumber, iClassName, iImageName, iImageNumber, iGoals, iPens;
  
  for (i=1; i<=GameCount; i++)
  {
    //Extract the ith Class Number, Image Number, Goals and Penalties
    iClassNumber = ExtractItem(listClassName, i, ";");
    iClassNumber = iClassNumber * 1;
    iImageNumber = ExtractItem(listImageName, i, ";");
    if (iImageNumber != "0")
    {
      iImageName = "<img SRC=../images/" + iImageNumber + ".gif>";
    }
    else
    {
      iImageName = "&nbsp";
    }

    switch (iClassNumber)
    {
      case 1:
        iClassName = "NationalLeague";
      break;
      case 2:
        iClassName = "FirstTeam";
      break;
      case 3:
        iClassName = "DivisionOne";
      break;
      case 4:
        iClassName = "NoStatus";
      break;      
    }
    iClassName = iClassName + "Season";
    
    iGoals = "&nbsp";
    iPens = "&nbsp";
    if (iImageNumber != "0")
    {
      iGoals = ExtractItem(listGoals, i, ";");
      iPens = ExtractItem(listPens, i, ";");
    }
    
    if (i == 1)
    {
      s += " <TD class=" + iClassName + " WIDTH=" + ImgColWidth + "%>" + iImageName + "</TD>";
      s += " <TD class=" + iClassName + " WIDTH=" + ValColWidth + "%>" + iGoals + "</TD>";
      s += " <TD class=" + iClassName + " WIDTH=" + ValColWidth + "%>" + iPens + "</TD>";
    }
    else
    {
      s += " <TD class=" + iClassName + ">" + iImageName + "</TD>";
      s += " <TD class=" + iClassName + ">" + iGoals + "</TD>";
      s += " <TD class=" + iClassName + ">" + iPens + "</TD>";
    }    
  }
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintSeasonRowInner(...)', error.number, error.name, error.message);
 }  
}

//*********************************
function PaintScorecardHeaderRow()
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=4px>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=22%>";
  s += " <TD WIDTH=9%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=1%>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=6%>";
  s += " <TD WIDTH=16%>";
  s += " <TD WIDTH=9%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=5%>";
  s += "</TR>";
  
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
  s += " <TD class=ScorecardTitle COLSPAN=5>Cambridge Korfball League";
  s += " <TD class=Ink COLSPAN=3>Division";
  s += " <TD class=PencilBox>" + Division;
  s += " <TD class=Ink>Date";
  s += " <TD class=PencilBox>" + TheDate;
  s += " <TD class=Ink>Time";
  s += " <TD class=PencilBox COLSPAN=2>" + TheTime;
  s += "</TR>";
  s += "<TR HEIGHT=3px>";
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardRow1(...)', error.number, error.name, error.message);
 }  
}

function PaintScorecardRow2(TeamNameHome, TeamNameAway, HomeScore, AwayScore)
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=6px>";
  s += " <TD class=PencilTeams COLSPAN=3>" + TeamNameHome;
  s += " <TD class=InkFooter VALIGN=BOTTOM>HomeTeam";
  s += " <TD>&nbsp";
  s += " <TD class=PencilBox>" + HomeScore;
  s += " <TD class=Ink COLSPAN=2 style='TEXT-ALIGN:center'>v";
  s += " <TD class=PencilBox>" + AwayScore;
  s += " <TD>&nbsp";
  s += " <TD class=PencilTeams COLSPAN=2>" + TeamNameAway;
  s += " <TD class=InkFooter VALIGN=BOTTOM COLSPAN=2>Away Team";
  s += "</TR>";
  s += "<TR HEIGHT=5px>";
  s += " <TD>&nbsp";
  s += "</TR>";

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
  s += " <TD class=InkBox COLSPAN=3>Goals";
  s += " <TD class=InkBox COLSPAN=2>Player";
  s += " <TD class=InkBox COLSPAN=2>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=2>Goals";
  s += "</TR>";

  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardPlayerGridHeader()', error.number, error.name, error.message);
 }  
}

function PaintScorecardPlayerGrid(RowNumber, HomeBackgroundColour, HomePlayerName, HomeGoals, HomePenalties, HomeCards, AwayBackgroundColour, AwayPlayerName, AwayGoals, AwayPenalties, AwayCards)
{
 try
 {
  var s = "";

  s += "<TR HEIGHT=4px>";
  s += " <TD class=InkBox COLSPAN=2>#" + RowNumber;
  s += " <TD style='background-color:" + HomeBackgroundColour + "' class=PencilBox>" + HomePlayerName;
  s += " <TD class=PencilBox>" + HomePenalties;
  s += " <TD class=PencilBox COLSPAN=3>" + HomeGoals;
  s += " <TD class=InkBox COLSPAN=2>#" + RowNumber;
  s += " <TD style='background-color:" + AwayBackgroundColour + "' class=PencilBox COLSPAN=2>" + AwayPlayerName;
  s += " <TD class=PencilBox>" + AwayPenalties;
  s += " <TD class=PencilBox COLSPAN=2>" + AwayGoals;
  s += " <TD>";
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

  s += "<TR HEIGHT=2px>";
  s += " <TD>&nbsp";
  s += "</TR>";
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=InkBox>For";
  s += " <TD class=InkBox>At";
  s += " <TD class=InkBox>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=3>Goals";
  s += " <TD class=InkBox>For";
  s += " <TD class=InkBox>At";
  s += " <TD class=InkBox COLSPAN=2>Name";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=2>Goals";
  s += "</TR>";
 
  return s;
 }
 catch (error)
 {
   CatchError('PaintScorecardSubGridHeader()', error.number, error.name, error.message);
 }  
}

function PaintScorecardSubGrid(RowNumber, HomeSubFor, HomeSubAt, HomeBackgroundColour, HomePlayerName, HomeGoals, HomePenalties, HomeCards, AwaySubFor, AwaySubAt, AwayBackgroundColour, AwayPlayerName, AwayGoals, AwayPenalties, AwayCards)
{
 try
 {
  var s = "";
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=PencilBox>" + HomeSubFor;
  s += " <TD class=PencilBox>" + HomeSubAt;
  s += " <TD style='background-color:" + HomeBackgroundColour + "' class=PencilBox>" + HomePlayerName;
  s += " <TD class=PencilBox>" + HomePenalties;
  s += " <TD class=PencilBox COLSPAN=3>" + HomeGoals;
  s += " <TD class=PencilBox>" + AwaySubFor;
  s += " <TD class=PencilBox>" + AwaySubAt;
  s += " <TD style='background-color:" + AwayBackgroundColour + "' class=PencilBox COLSPAN=2>" + AwayPlayerName;
  s += " <TD class=PencilBox>" + AwayPenalties;
  s += " <TD class=PencilBox COLSPAN=2>" + AwayGoals;
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
  
  s += "<TR HEIGHT=3px>";
  s += " <TD>&nbsp";
  s += "</TR>";
  
  s += "<TR HEIGHT=4px>";
  s += " <TD class=Ink VALIGN=TOP COLSPAN=2 ROWSPAN=3 style='TEXT-ALIGN:center'>Notes";
  s += "  <img src='../images/pencildraw.gif' WIDTH='57' HEIGHT='100'>";
  s += " </TD>";
  s += " <TD class=Pencil style='font-size:11pt' VALIGN=TOP ROWSPAN=3 COLSPAN=4>" + Notes;
  s += " <TD>";
  s += " <TD class=Ink VALIGN=TOP COLSPAN=2 ROWSPAN=3 style='TEXT-ALIGN:center'>Signed";
  s += "  <img src='../images/featherquill.gif' WIDTH='57' HEIGHT='100'>";
  s += " </TD>";
  s += " <TD class=PencilFooter COLSPAN=3>" + HomeCaptain;
  s += " <TD class=InkFooter COLSPAN=2 VALIGN=BOTTOM>Home Captain";
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
  s += " <TD>";
  s += " <TD class=PencilFooter COLSPAN=3>" + AwayCaptain;
  s += " <TD class=InkFooter COLSPAN=2 VALIGN=BOTTOM>Away Captain";
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
  s += " <TD>"
  s += " <TD class=PencilFooter COLSPAN=3>" + RefereeName + " - " + RefereeTeam;
  s += " <TD class=InkFooter VALIGN=BOTTOM COLSPAN=2 NOWRAP>Referee - Team";
  s += "</TR>";

  return s;  
 }
 catch (error)
 {
   CatchError('PaintScorecardRow5(Referee=' + Referee + ', RefereeTeam=' + RefereeTeam + ')', error.number, error.name, error.message);
 }
}

//*********************************
function MouseClick(btnName)
{
 try
 {
  var obj;

  if ((CurrentButton != '') && (CurrentButton != btnName))
  {
    obj = eval('document.all.' + CurrentButton);
    obj.className = 'TigerButtonsOff';
  }
  CurrentButton = btnName;
  obj = eval('document.all.' + CurrentButton);
  obj.className = 'TigerButtonsOn';
 }
 catch (error)
 {
   CatchError('MouseClick(btnName=' + btnName + ')', error.number, error.name, error.message);
 }
}

function MouseOver(btnName)
{
 try
 {
  var obj;
  obj = eval('document.all.' + btnName);
  if (CurrentButton != btnName)
  {
    obj.className = 'TigerButtons';
  }
 }
 catch (error)
 {
   CatchError('MouseOver(btnName=' + btnName + ')', error.number, error.name, error.message);
 }
}

function MouseOut(btnName)
{
 try
 {
  var obj;
  obj = eval('document.all.' + btnName);
  if (CurrentButton != btnName)
  {
    obj.className = 'TigerButtonsOff';
  }
 }
 catch (error)
 {
   CatchError('MouseOut(btnName=' + btnName + ')', error.number, error.name, error.message);
 }  
}

function FilterRow(obj, TagName, TeamCode, YYYYMMDD)
{
 try
 {
  var i;
  if (obj.length > 0)
  {
    for (i=0;i<obj.length;i++)
    {
      if (YYYYMMDD != null)
      {
        if (YYYYMMDDNow <= eval('obj.item(i).YYYYMMDD'))
        {
          if ((eval('obj.item(i).' + TagName + '.indexOf(TeamCode,0)') != -1) || (TeamCode == 'ALL'))
          {
            obj.item(i).style.display = '';
          }
          else
          {
            obj.item(i).style.display = 'none';
          }
        }
        else
        {
          obj.item(i).style.display = 'none';
        }
      }
      else
      {
        if ((eval('obj.item(i).' + TagName + '.indexOf(TeamCode,0)') != -1) || (TeamCode == 'ALL'))
        {
          obj.item(i).style.display = '';
        }
        else
        {
          obj.item(i).style.display = 'none';
        }
      }
    }
  }
 }
 catch (error)
 {
   CatchError('FilterRow(obj=+, TagName=' + TagName + ', TeamCode=' + TeamCode + ')', error.number, error.name, error.message);
 }
}

function WindowDimensions()
{
  //Get hold of the window dimensions
  var aH = window.screen.availHeight;
  var aW = window.screen.availWidth;
  var sT = window.screenTop;
  var sL = window.screenLeft;
  
  //Calculate the Height, Width, Top and Left values for this window
  var iHeight = (aH - sT);
  var iWidth = (aW - sL);
  var iTop = sT;
  var iLeft = sL;
 
  //Now fill in the dimension properties of this object
  this.Height = iHeight; 
  this.Width  = iWidth;
  this.Top    = iTop;
  this.Left   = iLeft;
}