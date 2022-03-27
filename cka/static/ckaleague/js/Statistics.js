function PaintStatisticsHeader()
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

function PaintStatisticsRow(TeamCode, ClassName, Name, ShortName, Games, Goals, Penalties, Total, Average)
{
  var s = "";
  
  s += "<TR ID='XXX" + RowCount++ +"' class=" + TeamCode + ">";
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

function FilterRow(obj, TagName, TeamCode)
{
  for (var i=1; i<RowCount; i++)
  {
    var x = document.getElementById(obj + i);
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

