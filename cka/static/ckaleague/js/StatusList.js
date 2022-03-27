function PaintStatusListHeader()
{
  var s = "";

  s += "<TR>";
  s += " <TD class=BlackOnOrange WIDTH=20%>Club</TD>";
  s += " <TD class=BlackOnOrange style='text-align:left' WIDTH=40%>Name</TD>";
  s += " <TD class=BlackOnOrange WIDTH=20%>Status</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>1st Team</TD>";
  s += " <TD class=BlackOnOrange WIDTH=10%>2nd Team</TD>";
  s += "</TR>";

  return s;
}

function PaintStatusListRow(ClubCode, StatusClassName, PlayerName, ClubName, Status, Period, Games0, Games1, Games2, Match0, Match1, Match2)
{
  var s = "";

  //Assume a default text color of black
  var textColor = " style='color:black'";
  
  //If there is a "-" in Match1 or Match2 then this is a calculated theoretical status
  if ( (Match1.indexOf("-", 0) != -1) || (Match2.indexOf("-", 0) != -1) )
  {
    //And so the text color should change to red
    textColor = " style='color:red'";
  }
  
  s += "<TR ID='" + RowID + RowCount++ + "' class=" + ClubCode + "_" + Period + ">";
  s += " <TD class=" + StatusClassName + textColor + ">" + ClubName + "<\/TD>";
  s += " <TD class=" + StatusClassName + textColor + "; text-align:left'>" + PlayerName + "<\/TD>";
  s += " <TD class=" + StatusClassName + textColor + "'>" + Status + "<\/TD>";
  s += " <TD class=" + StatusClassName + textColor + "' title=" + Match0 + ">" + Games0 + "<\/TD>";
  s += " <TD class=" + StatusClassName + textColor + "' title=" + Match1 + ">" + Games1 + "<\/TD>";
  s += " <TD class=" + StatusClassName + textColor + "' title=" + Match2 + ">" + Games2 + "<\/TD>";
  s += "<\/TR>";

  return s;
}

function FilterRow()
{
  //Determine the current team code from the CurrentButton
  var TeamCode = CurrentButton.slice(3,6);

  //Add on the Period
  TeamCode += "_" + CurrentPeriod;
  
  for (var i=1; i<RowCount; i++)
  {
    var x = document.getElementById(RowID + i);
    var clubCode = x.className;

    if ( (TeamCode == 'ALL') || (clubCode.indexOf(TeamCode,0) != -1) )
    {
      x.style.display = '';
    }
    else
    {
      x.style.display = 'none';
    }
  }
}

function FilterRowByPeriod(Period)
{
  //Update the global variable
  CurrentPeriod = Period;

  //Determine the current team code from the CurrentButton
  var TeamCode = CurrentButton.slice(3,6);

  //Add on the Period
  TeamCode += "_" + CurrentPeriod;  
  
  for (var i=1; i<RowCount; i++)
  {
    var x = document.getElementById(RowID + i);
    var clubCode = x.className;

    if ( TeamCode.indexOf(clubCode,0) != -1 )
    {
      x.style.display = '';
    }
    else
    {
      x.style.display = 'none';
    }
  }
  
  var obj;
  
  //De-select all the Period Buttons
  for (var i=1; i<=3; i++)
  {
    obj = document.getElementById("btnPeriod" + i);
    obj.className = "TigerButtonsOff";
  }
  
  //And highlight the period we've clicked on
  obj = document.getElementById("btnPeriod" + Period);
  obj.className = "TigerButtonsOn";
  
  //Also need to update the Report From and To dates
  obj = document.getElementById("ReportFrom");
  obj.innerHTML = arrReportFrom[Period];

  obj = document.getElementById("ReportTo");
  obj.innerHTML = arrReportTo[Period];
}