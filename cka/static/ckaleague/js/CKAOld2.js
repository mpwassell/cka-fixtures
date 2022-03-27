// © Copyright 2000-2001 Nick Armitage

var UploadDirectory = 'Upload';

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function CatchError(Routine, ErrorNumber, ErrorName, ErrorMessage)
//  function CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage)

//  function LoadScoreCard(FixtureCode)
//  function PaintFixture(TheDate, TheTime, HomeScore, AwayScore, FixtureCode, Referee)
//  function PaintFixtureBlank()
//  function PaintFixtureTeamName(ClassName, TeamName, WidthFlag)
//  function PaintPageTitle(Title)

//  function PaintFixtureListHeader()
//  function PaintFixtureListRow(ClassName, TeamCodeHome, TeamCodeAway, TeamCodeReferee, 
//                               TheDate, TheTime, Division, 
//                               TeamNameHome, TeamNameAway, TeamNameReferee, 
//                               FixtureCode, HomeScore, AwayScore)

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
//  function FilterRow(obj, TagName, TeamCode)
//  function SubstMessageParams(sMessage, sSubst, sParams)
//  function AddValues(Val1, Val2)
//  function AddValuesF(Val1, Val2)
//  function ReplaceString(Source, Find, Replace)
//  function PaintMessage(iMsgNo, iMsgCount, sMsgType, sMsgText, iButtons, iDefaultButton, 
//                        sMsgParams, sDialogInCentreOf, iMsgDlgHeight, iMsgDlgWidth)
//****************************************************************************

//*********************************
function CatchError(Routine, ErrorNumber, ErrorName, ErrorMessage)
{
  var MsgNo = 0;
  var MsgCount = '';
  var MsgType = '?';
  var MsgText = CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage);
  var Buttons = 0;
  var DefaultButton = 1;
  var MsgArray = new Array();
  MsgArray = [MsgNo, MsgCount, MsgType, MsgText, Buttons, DefaultButton];
  
  var dlgHeight = 285;
  var dlgWidth = 550;
  var dlgTop = (((window.screen.height)/2) - (dlgHeight/2));
  var dlgLeft = (((window.screen.width)/2) - (dlgWidth/2));

  //Declare the URL to be used to fire off the error box
  var sURL = "ErrorBox.htm";
  
  //Now set up the dialog features (dimensions + options)
  var sDimensions, sOptions, sFeatures;
  sDimensions = "dialogHeight:" + dlgHeight + "px; dialogWidth:" + dlgWidth + "px; dialogTop:" + dlgTop + "px; dialogLeft:" + dlgLeft + "px;"
  sOptions    = "center:yes; status:no; resizable:no; help:no";
  sFeatures   = sDimensions + " " + sOptions;

  var ret = window.showModalDialog(sURL, MsgArray, sFeatures);  
  return ret;
}

function CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage)
{
  var s;
  s = "<TABLE BORDER=0 WIDTH=100%>";
  s+= "<TR>";
  s+= "  <TD ALIGN=CENTER>";
  s+= "   <B>Dr Korfball</B> has detected the following error:<BR><BR>";
  s+= "  </TD>";
  s+= " </TR>";
  
  s+= "<TR>"
  s+= "  <TD>"
  s+= "    <TABLE BORDER=1 CELLSPACING=0 CELLPADDING=1 WIDTH=100%>"
  s+= "      <TR>"
  s+= "        <TD WIDTH=20% ALIGN=CENTER>"
  s+= "          <B>Routine</B>"
  s+= "        </TD>"
  s+= "        <TD WIDTH=80% ALIGN=LEFT>"
  s+= "          " + Routine
  s+= "        </TD>"
  s+= "      </TR>"

  s+= "      <TR>"
  s+= "        <TD WIDTH=20% ALIGN=CENTER>"
  s+= "          <B>Number</B>"
  s+= "        </TD>"
  s+= "        <TD WIDTH=80% ALIGN=LEFT>"
  s+= "          " + ErrorNumber
  s+= "        </TD>"
  s+= "      </TR>"

  s+= "      <TR>"
  s+= "        <TD WIDTH=20% ALIGN=CENTER>"
  s+= "           <B>Name</B>"
  s+= "        </TD>"
  s+= "        <TD WIDTH=80% ALIGN=LEFT>"
  s+= "          " + ErrorName
  s+= "        </TD>"
  s+= "      </TR>"

  s+= "      <TR>"
  s+= "        <TD WIDTH=20% ALIGN=CENTER>"
  s+= "          <B>Message</B>"
  s+= "        </TD>"
  s+= "        <TD WIDTH=80% ALIGN=LEFT>"
  s+= "          <INPUT type=text id=FV style='background-color:white' SIZE=56 value='" + ErrorMessage + "'>"
  s+= "        </TD>"
  s+= "      </TR>"

  s+= "    </TABLE>"
  s+= "  </TD>"
  s+= "</TR>"
  s+= "</TABLE>"
  
  return s;
}

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
  s += " <TABLE WIDTH=100% BGCOLOR=Black FRAME=BOX CELLPADDING=0 BORDER=0 CELLSPACING=0 COLS=2 RULES=NONE>";
  s += "  <TR>";
  s += "   <TD CLASS=FixtureDate WIDTH=70%>" + TheDate + "</TD>";
  s += "   <TD CLASS=FixtureTime WIDTH=30%>" + TheTime + "</TD>";
  s += "  </TR>";
  s += " </TABLE>";
    
  s += " <TABLE WIDTH=100% BGCOLOR=Black FRAME=BOX CELLPADDING=0 BORDER=0 CELLSPACING=0 COLS=2 RULES=NONE>";
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
  s += " <TD class=OrangeOnBlack WIDTH=20%>Date</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Time</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>Division</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=15%>Home Team</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=15%>Away Team</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=15%>Referee</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Score</TD>";
  s += "</TR>";
  
  return s;
 }
 catch (error)
 {
   CatchError('PaintFixtureListHeader()', error.number, error.name, error.message);
 }
}

function PaintFixtureListRow(ClassName, TeamCodeHome, TeamCodeAway, TeamCodeReferee, TheDate, TheTime, Division, TeamNameHome, TeamNameAway, TeamNameReferee, FixtureCode, HomeScore, AwayScore)
{
 try
 {
  var s = "";
  
  s += "<TR ID=XXX TEAMCODE=" + TeamCodeHome + TeamCodeAway + " REFCODE=" + TeamCodeReferee;
  s += "           TEAMREFCODE=" + TeamCodeHome + TeamCodeAway + TeamCodeReferee + ">";
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
  
  s += "<TR>";
  s += " <TD class=OrangeOnBlack WIDTH=10% ROWSPAN=2>Team</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5% ROWSPAN=2>P</TD>";
  s += " <TD class=OrangeOnBlack COLSPAN=5>Home</TD>";
  s += " <TD class=OrangeOnBlack COLSPAN=5>Away</TD>";
  s += " <TD class=OrangeOnBlack COLSPAN=5>Overall</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5% ROWSPAN=2>GD</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5% ROWSPAN=2>Pts</TD>";
  s += "</TR>";
  
  s += "<TR>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>W</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>D</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>L</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>F</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>A</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>W</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>D</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>L</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>F</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>A</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>W</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>D</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>L</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>F</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=5%>A</TD>";
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
  s += " <TD class=OrangeOnBlack style='text-align:left' WIDTH=30%>Name</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=20%>Team</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Games</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Goals</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Pens</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Total</TD>";
  s += " <TD class=OrangeOnBlack WIDTH=10%>Ave</TD>";
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
  s += " <TD class=" + ClassName + ">" + InitialCount + "</TD>";
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
  
  s += "<TR HEIGHT=4>";
  s += " <TD WIDTH=2%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=22%>";
  s += " <TD WIDTH=8%>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=1%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=6%>";
  s += " <TD WIDTH=16%>";
  //s += " <TD WIDTH=4%>";
  s += " <TD WIDTH=8%>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=5%>";
  s += " <TD WIDTH=2%>";
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
  
  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=ScorecardTitle COLSPAN=6>Cambridge Korfball League";
  s += " <TD class=Ink COLSPAN=2>Division";
  s += " <TD class=Pencil>" + Division;
  s += " <TD class=Ink>Date";
  s += " <TD class=Pencil>" + TheDate;
  s += " <TD class=Ink>Time";
  s += " <TD class=Pencil COLSPAN=2>" + TheTime;
  s += " <TD>";
  s += "</TR>";
  s += "<TR HEIGHT=3>";
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
  
  s += "<TR HEIGHT=6>";
  s += " <TD>";
  s += " <TD class=PencilTeams COLSPAN=4>" + TeamNameHome;
  s += " <TD>&nbsp";
  s += " <TD class=PencilBox>" + HomeScore;
  s += " <TD class=Ink COLSPAN=2 style='TEXT-ALIGN:center'>v";
  s += " <TD class=PencilBox>" + AwayScore;
  s += " <TD>&nbsp";
  s += " <TD class=PencilTeams COLSPAN=4>" + TeamNameAway;
  s += " <TD>";
  s += "</TR>";
  s += "<TR HEIGHT=5>";
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
  
  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=InkBox COLSPAN=2>Player";
  s += " <TD class=InkBox>Name";
  s += " <TD class=InkBox>Cards";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=2>Goals";
  s += " <TD class=InkBox COLSPAN=2>Player";
  s += " <TD class=InkBox COLSPAN=2>Name";
  s += " <TD class=InkBox>Cards";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox>Goals";
  s += " <TD>";
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

  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=InkBox COLSPAN=2>#" + RowNumber;
  s += " <TD style='background-color:" + HomeBackgroundColour + "' class=PencilBox>" + HomePlayerName;
  s += " <TD class=PencilBox>" + HomeCards;
  s += " <TD class=PencilBox>" + HomePenalties;
  s += " <TD class=PencilBox COLSPAN=2>" + HomeGoals;
  s += " <TD class=InkBox COLSPAN=2>#" + RowNumber;
  s += " <TD style='background-color:" + AwayBackgroundColour + "' class=PencilBox COLSPAN=2>" + AwayPlayerName;
  s += " <TD class=PencilBox>" + AwayCards;
  s += " <TD class=PencilBox>" + AwayPenalties;
  s += " <TD class=PencilBox>" + AwayGoals;
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

  s += "<TR HEIGHT=2>";
  s += " <TD>&nbsp";
  s += "</TR>";
  
  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=InkBox>For";
  s += " <TD class=InkBox>At";
  s += " <TD class=InkBox>Name";
  s += " <TD class=InkBox>Cards";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox COLSPAN=2>Goals";
  s += " <TD class=InkBox>For";
  s += " <TD class=InkBox>At";
  s += " <TD class=InkBox COLSPAN=2>Name";
  s += " <TD class=InkBox>Cards";
  s += " <TD class=InkBox>Pens";
  s += " <TD class=InkBox>Goals";
  s += " <TD>";
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
  
  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=PencilBox>" + HomeSubFor;
  s += " <TD class=PencilBox>" + HomeSubAt;
  s += " <TD style='background-color:" + HomeBackgroundColour + "' class=PencilBox>" + HomePlayerName;
  s += " <TD class=PencilBox>" + HomeCards;
  s += " <TD class=PencilBox>" + HomePenalties;
  s += " <TD class=PencilBox COLSPAN=2>" + HomeGoals;
  s += " <TD class=PencilBox>" + AwaySubFor;
  s += " <TD class=PencilBox>" + AwaySubAt;
  s += " <TD style='background-color:" + AwayBackgroundColour + "' class=PencilBox COLSPAN=2>" + AwayPlayerName;
  s += " <TD class=PencilBox>" + AwayCards;
  s += " <TD class=PencilBox>" + AwayPenalties;
  s += " <TD class=PencilBox>" + AwayGoals;
  s += " <TD>";
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
  
  s += "<TR HEIGHT=3>";
  s += " <TD>&nbsp";
  s += "</TR>";
  
  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=Ink COLSPAN=2 style='TEXT-ALIGN:left'>Notes";
  s += " <TD class=Pencil style='font-size:11pt' VALIGN=TOP ROWSPAN=3 COLSPAN=4>" + Notes;
  s += " <TD>";
  s += " <TD class=Ink COLSPAN=3 style='TEXT-ALIGN:left'>Home Captain";
  s += " <TD class=PencilFooter COLSPAN=4>" + HomeCaptain;
  s += " <TD>";
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
  
  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=Ink COLSPAN=2>";
  s += " <TD>";
  s += " <TD class=Ink COLSPAN=3 style='TEXT-ALIGN:left'>Away Captain";
  s += " <TD class=PencilFooter COLSPAN=4>" + AwayCaptain;
  s += " <TD>";
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

  s += "<TR HEIGHT=4>";
  s += " <TD>";
  s += " <TD class=Ink COLSPAN=2>";
  s += " <TD>";
  s += " <TD class=Ink COLSPAN=3 style='TEXT-ALIGN:left'>Referee";
  s += " <TD class=PencilFooter>" + RefereeName;;
  s += " <TD class=Ink>Team";
  s += " <TD class=PencilFooter COLSPAN=2>" + RefereeTeam;
  s += " <TD>";
  s += "</TR>";
  
  s += "<TR HEIGHT=2>";
  s += " <TD>&nbsp";
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

function FilterRow(obj, TagName, TeamCode)
{
 try
 {
  var i;
  if (obj.length > 0)
  {
    for (i=0;i<obj.length;i++)
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
 catch (error)
 {
   CatchError('FilterRow(obj=+, TagName=' + TagName + ', TeamCode=' + TeamCode + ')', error.number, error.name, error.message);
 }
}

//*********************************
function SubstMessageParams(sMessage, sSubst, sParams)
{
 try
 {
  var sFinalMessage = '';
  var sCurSub = null;
  var lPo0s = 0;
  var i = 0;
  var cnt;

  cnt = CountItems(sParams);
	
  for (i=1; i<=cnt; i++)
  {
    sCurSub=ExtractItem(sParams, i);
		
    lPos = sMessage.indexOf(sSubst);
		
    if (lPos > -1)
    {	
      sFinalMessage = sFinalMessage + sMessage.substring(0, lPos);
      sFinalMessage = sFinalMessage + sCurSub;
      sMessage = sMessage.substring(lPos+2);
    }
  }

  sFinalMessage = sFinalMessage + sMessage;
  return sFinalMessage;
 }
 catch (error)
 {
   CatchError('SubstMessageParams(sMessage=' + sMessage + ', sSubst=' + sSubst + ', sParams=' + sParams + ')', error.number, error.name, error.message);
 }
}

function AddValues(Val1, Val2)
{
	return (parseInt(parseInt(Val1,10) + parseInt(Val2,10)));
}

function AddValuesF(Val1, Val2)
{
	return (parseFloat(parseFloat(Val1) + parseFloat(Val2)));
}

function ReplaceString(Source, Find, Replace)
{
 try
 {
  var SLen = Source.length;
  var FLen = Find.length;
  var RLen = Replace.length;
  var s;
  var OutStr;
  var TestStr;
	
  s = 0;
  OutStr = '';
  while (s<=(SLen - FLen))
  {
    TestStr = Source.substr(s, FLen);
    if (TestStr == Find)
    {
      OutStr += Replace;
      s = AddValues(s, FLen);
    }
    else
    {
      OutStr += Source.substr(s, 1);
      s = AddValues(s, 1);
    }
  }	

  while (s<SLen)
  {
    OutStr += Source.substr(s, 1);
    s = AddValues(s, 1);
  }
	
  return OutStr;
 }
 catch (error)
 {
   CatchError('ReplaceString(Source=' + Source + ', Find=' + Find + ', Replace=' + Replace + ')', error.number, error.name, error.message);
 }
}

//Declare the default dimensions for the Message Box window and the title
var MESSAGE_BOX_HEIGHT = 210;
var MESSAGE_BOX_WIDTH  = 290;
var MESSAGE_BOX_TITLE = "CKA Message&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

function PaintMessage(iMsgNo, iMsgCount, sMsgType, sMsgText, iButtons, iDefaultButton, sMsgParams, sDialogInCentreOf, iMsgDlgHeight, iMsgDlgWidth)
{
 try
 {
  //Declare the URL to be used to fire off the message box
  var sURL = "ErrorBox.htm";

  //Create an array from the message parameters passed in
  var MsgArray = new Array();
  
  //Substitute the message parameters (if there are any)
  if (sMsgParams != null)
  {
    sMsgText = SubstMessageParams(sMsgText, "%%", sMsgParams);
  }
  //Replace all %/% with HTML line breaks
  sMsgText = ReplaceString(sMsgText, "%/%", "<BR>");
  
  //And construct the message array
  MsgArray = [iMsgNo, iMsgCount, sMsgType, sMsgText, iButtons, iDefaultButton];
  
  //Set up the default dialog position to be in the center of the Assistant
  var dlgPosition = "ASSISTANT";
  
  //Use the dialog in centre of value if it has been passed in
  if (sDialogInCentreOf != null) {dlgPosition = sDialogInCentreOf;}

  //Set up the default dimensions for the dialog box
  var dlgHeight = MESSAGE_BOX_HEIGHT;
  var dlgWidth  = MESSAGE_BOX_WIDTH;
  
  //Use the dialog box dimensions if they have been passed in
  if (iMsgDlgHeight != null) {dlgHeight = iMsgDlgHeight;}
  if (iMsgDlgWidth  != null) {dlgWidth  = iMsgDlgWidth;}

  //Now set up the dialog features (dimensions + options)
  var sDimensions, sOptions, sFeatures;
  sDimensions = "dialogHeight:" + dlgHeight + "px; dialogWidth:" + dlgWidth + "px;";   

  switch (dlgPosition)
  {    
    case "SCREEN":
      //User wants the messages to be painted in the middle of the screen so
      //calculate the dialog Top and Left values to achieve this
      var dlgTop = (((window.screen.height)/2) - (dlgHeight/2));
      var dlgLeft = (((window.screen.width)/2) - (dlgWidth/2));
      
      //And tag these values onto the dialog dimensions string
      sDimensions += " dialogTop:" + dlgTop + "px; dialogLeft:" + dlgLeft + "px;";
    break;
  }

  //Now set up the Options and Features for the dialog box
  sOptions  = "center:yes; status:no; resizable:no; help:no";
  sFeatures = sDimensions + " " + sOptions;
  
  //Finally open up the modal dialog
  var ErrorsWin = window.showModalDialog(sURL, MsgArray, sFeatures);
  
  //And pass the return value back to the calling routine
  return ErrorsWin;
 }
 catch (error)
 {
   CatchError('PaintMessage(...)', error.number, error.name, error.message);
 }
}