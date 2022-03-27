// © Copyright 2002+ Nick Armitage

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function AddDiaryEvent(EventDate, EventType, EventStart, EventEnd, EventWhere, EventWho, EventWhat)
//  function ButtonClick(btnName)
//  function ButtonOut(btnName)
//  function ButtonOver(btnName)
//  function ChangeDate(Direction)
//  function DaysInMonth(Year, Month)
//  function DateButton(Number)
//  function Format(Number, FieldWidth)
//  function FormatWindowReturnValue()
//  function HandleButtonClick(btnName, btnNumber)
//  function IsLeapYear(Year)
//  function ShowCalendar(Year, Month, Day)
//  function ShowDiaryEvent(TDName, EventDay)
//  function ShowEvent(TDName, EventType, EventStart, EventEnd, EventWhere, EventWhat)
//  function UpdateDiaryEvent()
//  function UpdateTheCalendar()
//  function UpdateTheDate()
//
//****************************************************************************

//****************************************************************************
var CurrentBtnName = '';
var DiaryEvents = new Array();

//Declare the main page variables
var TheYear, TheMonth, TheDay, TheDOW, TheFormat;
var OriginalDate;

//No date specified so get today's date
var RightNow = new Date();
TheYear = RightNow.getFullYear();
TheMonth = RightNow.getMonth()+1; //For some reason getMonth(): {0 to 11}
TheDay = RightNow.getDate();
TheDOW = AdjustDOW(RightNow.getDay());
TheFormat = "UK";
  
//Save the original values passed in and let this be the default return value
OriginalDate = FormatWindowReturnValue();
window.returnValue = OriginalDate;
  
//Declare the day, month and days in month arrays
var arrDays = new Array();
var arrMonths = new Array();
var arrDaysInMonth = new Array();

//Day and month string (one based) arrays
arrDays   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
arrMonths = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
arrDaysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//If the day passed in is invalid for this month, adjust accordingly
if (TheDay > DaysInMonth(TheYear, TheMonth))
{
  TheDay = DaysInMonth(TheYear, TheMonth);
}

//This is where all the diary events are added
AddAllDiaryEvents();

//****************************************************************************
function AdjustDOW(DOW)
{
 try
 {
  //DOW coming in: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  //DOW going out: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  
  //This function simply starts the week on Monday rather than Sunday which is returned by getDay()
  var retDOW = DOW - 1;
  if (retDOW < 0)
  {
    retDOW = retDOW + 7;
  }
  
  return retDOW;
 }
 catch (error)
 {
   CatchError('AdjustDOW(DOW=' + DOW + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function ButtonClick(btnName)
{
 try
 {
  if ((CurrentBtnName != '') && (CurrentBtnName != btnName.id))
  {
    //If we have a current button and it's not the one we've clicked then
    //we need to deselect it
    eval(CurrentBtnName).className = 'DiaryButtonsOut';
  }
  //Update the current button to be the one we've just clicked on and select it
  CurrentBtnName = btnName.id;
  btnName.className = 'DiaryButtonsOver';
 }
 catch (error)
 {
   CatchError('ButtonClick(btnName=' + btnName + ')', error.number, error.name, error.message);
 }
}
  
//****************************************************************************
function HandleButtonClick(btnName, btnNumber)
{
 try
 {
  //Process the Button click for this button and update the day and date objects
  ButtonClick(btnName);
  TheDay = parseInt(btnNumber);
  TheDate.innerHTML = UpdateTheDate();
  UpdateDiaryEvent();
 }
 catch (error)
 {
   CatchError('HandleButtonClick(btnName=' + btnName + ', btnNumber=' + btnNumber + ')', error.number, error.name, error.message);
 }  
}
  
//****************************************************************************
function ButtonOver(btnName)
{
 try
 {
  if (CurrentBtnName != btnName.id)
  {
    //If we are moving over a button that is not the current one
    switch (btnName.className)
    { 
      //We need to temporarily select it if it is not already selected
      case 'DiaryButtonsOut':
        btnName.className = 'DiaryButtonsHover';
      break;
    }
  }
 }
 catch (error)
 {
   CatchError('ButtonOver(btnName=' + btnName + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function ButtonOut(btnName)
{
 try
 {
  if (CurrentBtnName != btnName.id)
  {
    //If we are moving off a button that is not the current one
    switch (btnName.className)
    {
      //We need to deselect it if it is currently selected
      case 'DiaryButtonsHover':
        btnName.className = 'DiaryButtonsOut';
      break;
    }
  }
 }
 catch (error)
 {
   CatchError('ButtonOut(btnName=' + btnName + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function IsLeapYear(Year)
{
 try
 {
  //Assume the Year passed in is not a leap year
  ret = 0;
  
  //If the year is divisible by 4 and not 100 OR it's divisible by 400
  if (((Year % 4 == 0) && (Year % 100 != 0)) || (Year % 400 == 0))
  {
    //Then it is a leap year
    ret = 1;
  }
  return ret;
 }
 catch (error)
 {
   CatchError('IsLeapYear(Year=' + Year + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function DaysInMonth(Year, Month)
{
 try
 {
  if (Month == 2)
  {
    //Only need to check for leap year if the month is 2 (February)
    return arrDaysInMonth[Month] + IsLeapYear(Year);
  }
  else
  {
    return arrDaysInMonth[Month];
  }
 }
 catch (error)
 {
   CatchError('DaysInMonth(Year=' + Year + ', Month=' + Month + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function DateButton(Number)
{
 try
 {
  var s = "";
  var Visibility = "visible";
  var ID = "btn" + Number;
  var OnClick = "HandleButtonClick(this, " + Number + ")";
  var TheClass = "DiaryButtonsOut";
  var EventWhat = "";
  
  if ((Number < 1) || (Number > DaysInMonth(TheYear, TheMonth)))
  {
    //Not a valid day so hide the button and change the label to btnBlank
    Visibility = "hidden";
    ID = "btnBlank";
    TheClass = "DiaryButtonsBlank";
  }
  else
  {
    EventWhat += "<BR>" + ShowDiaryEvent('EVENT', Number);
  }
 
  if (Number == TheDay)
  {
    TheClass = "DiaryButtonsOver";
    CurrentBtnName = ID;
  }
 
  s += "<TD VALIGN=TOP WIDTH=14%";
  s += " id=" + ID;
  s += " style='visibility:" + Visibility + "'";
  s += " class=" + TheClass;
  s += " onmouseover='ButtonOver(this)'";
  s += " onmouseout='ButtonOut(this)'";
  s += " onclick='HandleButtonClick(this, " + Number + ")'";
  s += ">";
  s += Number + EventWhat;
  
  return s;
 }
 catch (error)
 {
   CatchError('DateButton(Number=' + Number + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function ShowCalendar(Year, Month, Day)
{
 try
 {
  var i;
  var s = "";
  var col;
    
  //Let's work out what day the 1st of this month is on
  //Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  var ADay = new Date(Year, Month-1, 1);
  var ADOW = AdjustDOW(ADay.getDay());
  
  s += "<TABLE BORDER='0' RULES='NONE' WIDTH='100%' HEIGHT='66%' CELLSPACING='1' CELLPADDING='1'>";
  s += " <TR WIDTH=100% HEIGHT=16% ALIGN=CENTER>"

  //Work out Sunday in the first week
  Start = 1 - ADOW;
  End = Start + 41;
    
  col = 0;
  for (i=Start; i<=End; i++)
  {
    s += "   " + DateButton(i);
    col = col + 1;
    if (col == 7)
    {
      s += " <\/TR><TR WIDTH=100% HEIGHT=16% ALIGN=CENTER>";
      col = 0;
    }
  }
  s += " </TR>";
  s += "</TABLE>";
    
  return s;
 }
 catch (error)
 {
   CatchError('ShowCalendar(Year=' + Year + ', Month=' + Month + ', Day=' + Day + ')', error.number, error.name, error.message);
 }  
}
  
//****************************************************************************
function Format(Number, FieldWidth)
{
 try
 {
  var s;
  var i;

  s = Number + '';
  if (s.length < FieldWidth)
  {
   for (i=s.length; i < FieldWidth; i++)
   {
    s = '0' + s;
   }
  }
  return s;
 }
 catch (error)
 {
   CatchError('Format(Number=' + Number + ', FieldWidth=' + FieldWidth + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function FormatWindowReturnValue()
{
 try
 {
  var ret = "";
  switch (TheFormat)
  {
    case "YYYYMMDD":
      //Return the specified date in YYYYMMDD format (default format)
      ret = Format(TheYear,4) + Format(TheMonth,2) + Format(TheDay,2);  
    break;
    
    case "US": 
      //Return the specified date in mm/dd/yyyy format
      ret = Format(TheMonth,2) + "/" + Format(TheDay,2) + "/" + Format(TheYear);
    break;
  
    case "UK": 
      //Return the specified date in dd/mm/yyyy format
      ret = Format(TheDay,2) + "/" + Format(TheMonth,2) + "/" + Format(TheYear);
    break;
      
    case "ALL":
      //Return the specified date in all formats (YYYYMMDD;mm/dd/yyyy;dd/mm/yyyy)
      ret  = Format(TheYear,4) + Format(TheMonth,2) + Format(TheDay,2);
      ret += ";";
      ret += Format(TheMonth,2) + "/" + Format(TheDay,2) + "/" + Format(TheYear);
      ret += ";";
      ret += Format(TheDay,2) + "/" + Format(TheMonth,2) + "/" + Format(TheYear);
    break;
  }
  
  return ret;
 }
 catch (error)
 {
   CatchError('FormatWindowReturnValue()', error.number, error.name, error.message);
 }  
}  

//****************************************************************************
function UpdateTheDate()
{
 try
 {
  //Work out the Day of Week of the date we are about to update
  var NewDate = new Date();
  NewDate.setFullYear(TheYear, TheMonth-1, TheDay);
  TheDOW = AdjustDOW(NewDate.getDay());
    
  return arrDays[TheDOW] + " " + TheDay + " " + arrMonths[TheMonth] + " " + TheYear;
 }
 catch (error)
 {
   CatchError('UpdateTheDate()', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function UpdateTheCalendar()
{
 try
 {
  return ShowCalendar(TheYear, TheMonth, TheDay);
 }
 catch (error)
 {
   CatchError('UpdateTheCalendar()', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function ChangeDate(Direction)
{
 try
 {
  switch (Direction)
  {
    case "UP":
      //Increase the month by one and adjust the year if gone off the end
      TheMonth = parseInt(TheMonth) + 1;
      if (TheMonth == 13)
      {
        TheMonth = 1;
        TheYear = parseInt(TheYear) + 1;
      }
    break;
      
    case "UPUP":
      //Increase the year by one
      TheYear = parseInt(TheYear) + 1;
    break;

    case "DOWN":
      //Decrease the month by one and adjust the year if gone off the end
      TheMonth = parseInt(TheMonth) - 1;
      if (TheMonth == 0)
      {
        TheMonth = 12;
        TheYear = parseInt(TheYear) - 1;
      }
    break;

    case "DOWNDOWN":
      //Decrease the year by one
      TheYear = parseInt(TheYear) - 1;
    break;
  }
   
  //If the day passed in is invalid for this month, adjust accordingly
  if (TheDay > DaysInMonth(TheYear, TheMonth))
  {
    TheDay = DaysInMonth(TheYear, TheMonth);
  }
   
  //Now update the date and calendar elements on the page
  TheDate.innerHTML = UpdateTheDate();
  TheCalendar.innerHTML = UpdateTheCalendar();
  UpdateDiaryEvent();
 }
 catch (error)
 {
   CatchError('ChangeDate(Direction=' + Direction + ')', error.number, error.name, error.message);
 }  
}
 
//****************************************************************************
function AddDiaryEvent(EventDate, EventType, EventStart, EventEnd, EventWhere, EventWho, EventWhat)
{
 try
 {
  if (DiaryEvents[EventDate] == null)
  {
    DiaryEvents[EventDate] = EventType + ";" + EventStart + ";" + EventEnd + ";" + EventWhere + ";" + EventWho + ";" + EventWhat;
  }
  else
  {
    DiaryEvents[EventDate] = DiaryEvents[EventDate] + "^" + EventType + ";" + EventStart + ";" + EventEnd + ";" + EventWhere + ";" + EventWho + ";" + EventWhat;
  }
 }
 catch (error)
 {
   CatchError('AddDiaryEvent(EventDate=' + EventDate + ', EventType=' + EventType + ', EventStart=' + EventStart + ', EventEnd=' + EventEnd + ', EventWhere=' + EventWhere + ', EventWho=' + EventWho + ', EventWhat=' + EventWhat + ')', error.number, error.name, error.message);
 }  
}
 
//****************************************************************************
function ShowDiaryEvent(TDName, EventDay)
{
 try
 {
  var ret = "";

  //Generate the current event date and retrieve the diary event for this date
  var EventDate = Format(TheYear, 4) + Format(TheMonth, 2) + Format(TheDay, 2);

  if (TDName == "EVENT")
  {
    EventDate = Format(TheYear, 4) + Format(TheMonth, 2) + Format(EventDay, 2);
  }

  var EventType = "";
  var EventStart = "";
  var EventEnd = "";
  var EventWhere = "";
  var EventWho = "";
  var EventWhat = "";
  var EventData = DiaryEvents[EventDate];
  
  if (EventData == null)
  {
    //No event data so return blank space to the calling routine
    return "&nbsp";
  }
  
  var TestSplit = EventData.split("^");
  var Count = TestSplit.length;
  
  for (var i=0; i<Count; i++)
  {
    //Split the EventData into the EventSplit array
    //Format is "Type;StartTime;EndTime;Where;Who;What"
    var EventSplit = TestSplit[i].split(";");
  
    //Now get hold of the specific data element
    EventType  = EventSplit[0];
    EventStart = EventSplit[1];
    EventEnd   = EventSplit[2];
    EventWhere = EventSplit[3];
    EventWho   = EventSplit[4];
    EventWhat  = EventSplit[5];
   
    if (ret == "")
    {
      ret = ShowEvent(TDName, EventType, EventStart, EventEnd, EventWhere, EventWho, EventWhat);
    }
    else
    {
      ret = ret + "<BR>" + ShowEvent(TDName, EventType, EventStart, EventEnd, EventWhere, EventWho, EventWhat);
    }
  }
  
  return ret;
 }
 catch (error)
 {
   CatchError('ShowDiaryEvent(TDName=' + TDName + ', EventDay=' + EventDay + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function ShowEvent(TDName, EventType, EventStart, EventEnd, EventWhere, EventWho, EventWhat)
{
 try
 {
  switch (EventType)
  {
    case "R":
      TDcolor = " style=\"align:left; color:red\"";
    break;
     
    default:
      TDcolor = " style=\"align:left; color:black\"";
    break;
  }

  var EventStart = "<SPAN " + TDcolor + ">" + EventStart + "</SPAN>";
  var EventEnd = "<SPAN " + TDcolor + ">" + EventEnd + "</SPAN>";
  var EventWhere = "<SPAN " + TDcolor + ">" + EventWhere + "</SPAN>";
  var EventWho = "<SPAN " + TDcolor + ">" + EventWho + "</SPAN>";
  var EventWhat = "<SPAN " + TDcolor + ">" + EventWhat + "</SPAN>";
  
  switch (TDName)
  {
    case "EventStart":
      return EventStart
    break;

    case "EventEnd":
      return EventEnd;
    break;

    case "EventWhere":
      return EventWhere;
    break;

    case "EventWho":
      return EventWho;
    break;

    case "EventWhat": case "EVENT":
      return EventWhat;
    break;
  }
 }
 catch (error)
 {
   CatchError('ShowEvent(TDName=' + TDName + ', EventType=' + EventType + ', EventStart=' + EventStart + ', EventEnd=' + EventEnd + ', EventWhere=' + EventWhere + ', EventWho=' + EventWho + ', EventWhat=' + EventWhat + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function UpdateDiaryEvent()
{
 try
 {
  EventStart.innerHTML = ShowDiaryEvent("EventStart");
  EventEnd.innerHTML = ShowDiaryEvent("EventEnd");
  EventWhere.innerHTML = ShowDiaryEvent("EventWhere");
  EventWho.innerHTML = ShowDiaryEvent("EventWho");
  EventWhat.innerHTML = ShowDiaryEvent("EventWhat");
 }
 catch (error)
 {
   CatchError('UpdateDiaryEvent()', error.number, error.name, error.message);
 }  
}

//****************************************************************************
