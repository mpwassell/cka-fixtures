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
  //s += " <TD class=" + ClassName + " style='font-size:8pt; font-weight:normal'";
  //s += ' onclick="LoadPlayerInfo(123)">';
  //s += "  " + PlayerName;
  s += " </TD>";
  
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
        iClassName = "SecondTeam";
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
