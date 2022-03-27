function PaintSquadListRow(ClubCode, ClassName, PlayerName, ClubName, SquadNumber, TopFour)
{
  var s = "";

  s += "<TR ID='XXX" + RowCount++ + "' class=" + ClubCode + ">";
  s += " <TD class=" + ClassName + " style='text-align:left'>" + PlayerName + "<\/TD>";
  s += " <TD class=" + ClassName + ">" + ClubName + "<\/TD>";
  s += " <TD class=" + ClassName + ">" + SquadNumber + "<\/TD>";
  s += " <TD class=" + ClassName + ">" + TopFour + "<\/TD>";
  s += "<\/TR>";

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
