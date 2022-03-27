function PaintPageTitle(Title)
{
  var s = "";
  
  s += "<TABLE ALIGN=CENTER CELLPADDING=2 FRAME='none' BORDER=0 WIDTH=100%>";
  s += " <TR>";
  s += "  <TD class=DivTitle>";
  s += "   " + Title;
  s += "  </TD>";
  s += " </TR>";
  s += "</TABLE>";
  
  return s;
}

function FixtureMouseClick(btnName)
{
  if (btnName.value == 'ALL')
  {
    btnName.value = 'Now';
    FilterRow(XXX, 'TEAMCODE', 'ALL');
  }
  else
  {
    btnName.value = 'ALL';
    FilterRow(XXX, 'TEAMCODE', 'ALL', 'YYYYMMDD');
  }
  MouseClick(btnName.id);
}

function WindowDimensions()
{
  //Get hold of the window dimensions
  var aH = window.screen.availHeight;
  var aW = window.screen.availWidth;
  var sT = (window.screenTop) ? (window.screenTop) : (window.screenY);
  var sL = (window.screenLeft) ? (window.screenLeft) : (window.screenX);
  
  //Calculate the Height, Width, Top and Left values for this window
  var iHeight = (aH - sT);
  var iWidth = (aW - sL);
  var iTop = sT;
  var iLeft = sL;
 
  //Now fill in the dimension properties of this object
  this.availHeight = aH;
  this.availWidth  = aW;
  this.screenTop   = sT;
  this.screenLeft  = sL;
  this.Height = iHeight; 
  this.Width  = iWidth;
  this.Top    = iTop;
  this.Left   = iLeft;
}

function PaintFixtureListHeader()
{
  var s = "";
  
  s += "<TR>";
  s += " <TD class=BlackOnOrange WIDTH=16%>Date</TD>";
  s += " <TD class=BlackOnOrange WIDTH=8%>Time</TD>";
  s += " <TD class=BlackOnOrange WIDTH=6%>Division</TD>";
  s += " <TD class=BlackOnOrange WIDTH=12%>Home Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=12%>Away Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=12%>Referee</TD>";
  s += " <TD class=BlackOnOrange WIDTH=24%>Venue</TD>";
  s += " <TD id='ScoreTD' class=BlackOnOrange WIDTH=10%>Score</TD>";
  s += "</TR>";
  
  return s;
}

function PaintFixtureListRow(ClassName, TeamCodeHome, TeamCodeAway, TeamCodeReferee, TheDate, TheTime, Division, TeamNameHome, TeamNameAway, TeamNameReferee, FixtureCode, HomeScore, AwayScore, YYYYMMDD, Venue, Period, Month)
{
  var s = "";
  
  if ( (HomeScore == "") && (AwayScore == "") )
  { 
    //No home or away score so this is NOT a Result
    var Result = "RESULT_FALSE";
  }
  else
  {
    //There is a home or away score so this IS a Result
    var Result = "RESULT_TRUE";
  }
  
  //<TR ID='R1' class='TEAMCODE_CIT2CIT1 REFCODE_LIT1 TEAMREFCODE_CIT2CIT1LIT1 YYYYMMDD_20060927'>
  var idTR = "R" + RowCount
  
  s += "<TR ID='" + idTR + "' class='ALL_TRUE TEAMCODE_" + TeamCodeHome + TeamCodeAway + " REFCODE_" + TeamCodeReferee + " TEAMREFCODE_" + TeamCodeReferee + " YYYYMMDD_" + YYYYMMDD + " DIVISION_" + Division + " " + Result + " PERIOD_" + Period + " MONTH_" + Month + "'>";
  s += " <TD ID='" + idTR + "C1' class=" + ClassName + ">" + TheDate + "</TD>";
  s += " <TD ID='" + idTR + "C2' class=" + ClassName + ">" + TheTime + "</TD>";
  s += " <TD ID='" + idTR + "C3' class=" + ClassName + ">" + Division + "</TD>";
  s += " <TD ID='" + idTR + "C4' class=" + ClassName + " style='text-align:left'>" + TeamNameHome + "</TD>";
  s += " <TD ID='" + idTR + "C5' class=" + ClassName + " style='text-align:left'>" + TeamNameAway + "</TD>";
  s += " <TD ID='" + idTR + "C6' class=" + ClassName + " style='text-align:left'>" + TeamNameReferee + "</TD>";
  s += " <TD ID='" + idTR + "C7' class=" + ClassName + " style='text-align:left'>" + Venue + "</TD>";
  
  //Increase the row count now we've output the row
  RowCount++;
  
  if ((HomeScore == "") && (AwayScore == ""))
  {
    s += " <TD ID='" + idTR + "C8' class=" + ClassName + "></TD>";
  }
  else
  {
    //Output the span for the scoreline
    s += " <TD ID='" + idTR + "C8' class=" + ClassName + ">";
    s += "  <SPAN";
    s += "   OnMouseOver = \"this.style.cursor='pointer'\"";
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

