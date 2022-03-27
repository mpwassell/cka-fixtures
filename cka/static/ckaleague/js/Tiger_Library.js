// © Copyright 2002+ Nick Armitage

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function CatchError(Routine, ErrorNumber, ErrorName, ErrorMessage)
//  function CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage)
//  function LoadCalendar(TheDate, TheFormat, TheTitle)
//  function LoadAssistant(sWindowType, sAssistantName, sTitle, sKeyNames, sKeyValues, 
//                         iHeight, iWidth, iTop, iLeft, bRefreshFlag, vArguments)
//
// <COOKIE Routines>
//  function GetCookie(name)
//  function GetExpiryDate(nDays)
//  function SetCookie(name, value, expires, path, domain, secure)
//  function DeleteCookie(name) 
// </COOKIE Routines>
//
//  function EventKeyState(KeyValue)
//  function Format(Number, FieldWidth)
//  function JSRound(Value, DecPlaces)
//  function SetClassName(Control, ClassName)
//  function IIf(Statement, ifTrue, ifFalse)
//
// <ELEMENT POSITION ROUTINES>
//  function GetElementLeft(eElement)
//  function GetElementTop(eElement)
// </ELEMENT POSITION ROUTINES>
//****************************************************************************

//****************************************************************************
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
  
  if (window.showModalDialog)
  {
    //Now set up the dialog features (dimensions + options)
    var sDimensions = "dialogHeight:" + dlgHeight + "px; dialogWidth:" + dlgWidth + "px; dialogTop:" + dlgTop + "px; dialogLeft:" + dlgLeft + "px;"
    var sOptions    = "center:yes; status:no; resizable:no; help:no";
    var sFeatures   = sDimensions + " " + sOptions;

    var ret = window.showModalDialog(sURL, MsgArray, sFeatures);  
    return ret;
  }
  else
  {
    //Open up a window
    //var sDimensions = "height=" + dlgHeight + "px, width" + dlgWidth + "px, top=" + dlgTop + "px, left=" + dlgLeft + "px";
    //var sOptions    = "status=no, resizable=no, toolbar=no, menubar=no, location=no, titlebar=no, scrollbars=no";
    //var sFeatures   = sDimensions + " " + sOptions;
    //var ret = window.open(sURL, "_blank", sFeatures); 
    alert("Routine=" + Routine + ", ErrorNumber=" + ErrorNumber + ", ErrorMessage=" + ErrorMessage);
  }
}

function CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage)
{
  var s;
  
  s = "<STYLE>";
  s+= "  .ErrHead  {color:black; font-family:Tahoma; font-size: 13pt; font-weight: bold}";
  s+= "  .ErrText  {color:mediumslateblue; font-family:Tahoma; font-size:8pt; font-weight:bold}";
  s+= "  .ErrLabel {color:black; font-family:Tahoma; font-size: 9pt; font-weight: bold}";
  s+= "</style>";

  s+= "<TABLE BORDER=0 WIDTH=100%>";
  s+= " <TR>";
  s+= "  <TD ALIGN=LEFT VALIGN=MIDDLE CLASS=ErrHead>";
  s+= "   <B>Dr Korfball</B> has detected the following error<BR><BR>";
  s+= "  </TD>";
  s+= " </TR>";
  
  s+= " <TR>";
  s+= "  <TD>";
  s+= "    <TABLE BORDER=0 CELLSPACING=0 CELLPADDING=1 BGCOLOR=WHITE BORDERCOLOR=WHITE ALIGN=CENTER WIDTH=100%>";
  s+= "      <TR>";
  s+= "        <TD WIDTH=25% ALIGN=LEFT CLASS=ErrLabel>";
  s+= "          Routine";
  s+= "        </TD>";
  s+= "        <TD WIDTH=75% ALIGN=LEFT CLASS=ErrText>";
  s+= "          " + Routine;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "      <TR>";
  s+= "        <TD WIDTH=25% ALIGN=LEFT CLASS=ErrLabel>";
  s+= "          Number";
  s+= "        </TD>";
  s+= "        <TD WIDTH=75% ALIGN=LEFT CLASS=ErrText>";
  s+= "          " + ErrorNumber;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "      <TR>";
  s+= "        <TD WIDTH=25% ALIGN=LEFT CLASS=ErrLabel>";
  s+= "           Name";
  s+= "        </TD>";
  s+= "        <TD WIDTH=75% ALIGN=LEFT CLASS=ErrText>";
  s+= "          " + ErrorName;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "      <TR>";
  s+= "        <TD WIDTH=25% ALIGN=LEFT CLASS=ErrLabel>";
  s+= "          Description";
  s+= "        </TD>";
  s+= "        <TD WIDTH=75% ALIGN=LEFT CLASS=ErrText>";
  //s+= "          <INPUT type=text id=FV style='background-color:white' SIZE=56 value=\"" + ErrorMessage + "\">";
  s+= "          " + ErrorMessage;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "    </TABLE>";
  s+= "  </TD>";
  s+= " </TR>";
  s+= "</TABLE>";
  
  return s;
}

function LoadCalendar(TheDate, TheFormat, TheTitle)
{
 try
 {
  //TheDate   - initial date (passed in YYYYMMDD format)
  //TheFormat - return format of selected date ("YYYYMMDD", "US", "UK", "ALL")
  //         eg 5th July 2001 returns as:
  //            "YYYYMMDD" - "20010705"   (yyyymmdd)
  //            "US"       - "07/05/2001" (mm/dd/yyyy)
  //            "UK"       - "05/07/2001" (dd/mm/yyyy)
  //            "ALL"      - "20010705;07/05/2001;05/07/2001"
  //TheTitle  - the title for the modal dialog window
  
  if (TheDate == "")
  {
    //No date specified so get today's date
    var RightNow = new Date();
    var TheYear = RightNow.getFullYear();
    var TheMonth = RightNow.getMonth()+1; //For some reason getMonth(): {0 to 11}
    var TheDay = RightNow.getDate();   
  }
  else
  {
    //Convert TheDate parameter into separate year, month and day (integer) values
    var TheYear = (TheDate.slice(0,4) * 1);
    var TheMonth = (TheDate.slice(4,6) * 1);
    var TheDay = (TheDate.slice(6,8) * 1);
  }
  
  //Check for duff values before firing off the calendar
  if (((TheMonth < 1) || (TheMonth > 12)) || ((TheDay < 1) || (TheDay > 31)))
  {
    return -1;
  }
   
  //Now set up the dialog dimensions
  var iHeight = 220;
  var iWidth = 200;
  var iTop = (((window.screen.height)/2) - (iHeight/2));
  var iLeft = (((window.screen.width)/2) - (iWidth/2));
  
  //Declare variables for the dialog dimensions, options and features
  var sDimensions, sOptions, sFeatures;
  
  //Declare the URL to be used to fire off the calendar
  var sURL = "Calendar.htm";
  
  //Create a variant argument array containing the year, month, day and return format
  var vArguments = new Array();
  vArguments[0] = TheYear;
  vArguments[1] = TheMonth;
  vArguments[2] = TheDay;
  vArguments[3] = TheFormat;
  
  //Now set up the dialog features (dimensions + options)
  sDimensions = "dialogHeight:" + iHeight + "px; dialogWidth:" + iWidth + "px; dialogTop:" + iTop + "px; dialogLeft:" + iLeft + "px;"
  sOptions    = "center:yes; status:no; resizable:no; help:no";
  sFeatures   = sDimensions + " " + sOptions;
  
  //And finally open up the modal dialog
  var ret = window.showModalDialog(sURL, vArguments, sFeatures);
  return ret;
 }
 catch (error)
 {
   CatchError('LoadCalendar(TheDate=' + TheDate + ', TheFormat=' + TheFormat + ', TheTitle=' + TheTitle + ')', error.number, error.name, error.message);
 }
}

function LoadAssistant(sWindowType, sAssistantName, sTitle, sKeyNames, sKeyValues, iHeight, iWidth, iTop, iLeft, bRefreshFlag, vArguments)
{
 try
 {
  var ret = "";
  if (sWindowType == "MODAL")
  {
    //Adjust the Height and Width parameters (as they are specified for window.open)
    iHeight = parseInt(iHeight, 10) + 25;
    iWidth = parseInt(iWidth, 10) + 5;      
  }
  var sDimensions, sOptions, sFeatures;
  var sFN = "assis_frame.asp";
  var sAN = "?AssistName=" + sAssistantName;
  var sTI = "&Title=" + sTitle;
  var sKN = "&KeyNames=WindowType;WindowHeight;WindowWidth;WindowTop;WindowLeft;" + sKeyNames;
  var sKV = "&KeyValues=" + sWindowType + ";" + iHeight + ";" + iWidth + ";" + iTop + ";" + iLeft + ";" + sKeyValues;
  var sURL = sFN + sAN + sTI + sKN + sKV;
  
  switch (sWindowType)
  {
    case "MODAL":
      //We are doing a Window.showModalDialog
      sDimensions = "dialogHeight:" + iHeight + "px; dialogWidth:" + iWidth + "px; dialogTop:" + iTop + "px; dialogLeft:" + iLeft + "px;"
      sOptions    = "center:yes; status:no; resizable:no; help:no";
      sFeatures   = sDimensions + " " + sOptions;
      ret = window.showModalDialog(sURL, vArguments, sFeatures);
      
      //Only do the refresh if the user clicked on the Next (Finish) button
      if ((ret == 6) && (bRefreshFlag == true))
      {
        //Call the reload function on the ipDetail frame to refresh the page
        top.frames.iPDetail.location.reload(true);
      }
      break;

    default:
      //Default case is to do a Window.open
      sDimensions = "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft;
      sOptions    = "status=no, resizable=no, toolbar=no, menubar=no, location=no, titlebar=no";
      sFeatures   = sDimensions + " " + sOptions;
      ret = window.open(sURL, sAssistantName, sFeatures);
      break;
  }

  return ret;
 }
 catch (error)
 {
   CatchError('LoadAssistant(...)', error.number, error.name, error.message);
 }
}

//****************************************************************************
function GetCookie(name)
{
 try
 {
  //Find the first occurrence of 'name=' in the cookie
  var index = document.cookie.indexOf(name + "=");
  if (index == -1)
  {
    //'name=' not found in the cookie so return null to the caller
    return null;
  }
  
  //Now we've found 'name=', move to one character beyond the '=' character
  var startindex = document.cookie.indexOf("=", index) + 1;
   
  //Starting from the start index, find the trailing ';' and set this as the end index
  var endindex = document.cookie.indexOf(";", startindex);
    
  if (endindex == -1)
  {
    //No trailing ';' so simply set end index to the length of the entire cookie
    endindex = document.cookie.length;
  }
    
  //And finally return the (unescaped) substring of the cookie (from startindex to endindex)
  return unescape(document.cookie.substring(startindex, endindex));
 }
 catch (error)
 {
   CatchError('GetCookie(name=' + name + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function GetExpiryDate(nDays)
{
 try
 {
  //Create an 'ExpiryDate' date variable
  var ExpiryDate = new Date();
  
  //One Day = 24hours * 60mins * 60 secs * 1000ms
  var OneDay = 24 * 60 * 60 * 1000;

  //Set an expiry date to be 'n' Days from now
  ExpiryDate.setTime(ExpiryDate.getTime() + (nDays * OneDay));
  
  return ExpiryDate.toGMTString();
 }
 catch (error)
 {
   CatchError('GetExpiryDate(nDays=' + nDays + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function SetCookie(name, value, expires, path, domain, secure)
{
 try
 {
  //Set cookie to 'name=value; expires=<e>; path=<p>; domain=<d>; secure=<s>'
  //The 'expires', 'path', 'domain' and 'secure' parameters are optional
  document.cookie = name + "=" + escape(value) +
                    ((expires) ? "; expires=" + expires : "") +
                    ((path) ? "; path=" + path : "") +
                    ((domain) ? "; domain=" + domain : "") +
                    ((secure) ? "; secure" : "");

  //Return the value passed in to the calling routine
  return value;
 }
 catch (error)
 {
   CatchError('SetCookie(name=' + name + ', value=' + value + ', expires=' + expires + ', path=' + path + ', domain=' + domain + ', secure=' + secure + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function DeleteCookie(name)
{ 
 try
 {
  //Delete the cookie using a null value and an 'expires' date in the past.
  //The reason you must do both is that simply setting the expiration to a past time will 
  //not change it's value until the browser is closed. That is, all cookie names, values, 
  //expirations, etc are resolved once the browser program has been closed. Setting the
  //cookie to null allows you to properly test for the cookie until that resolution. 	
  document.cookie = name + "=; expires=" + GetExpiryDate(-1);
 }
 catch (error)
 {
   CatchError('DeleteCookie(name=' + name + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************

//Now define constants for the event key combinations
var KEY_NONE           = 0;
var KEY_SHIFT          = 1;
var KEY_CTRL           = 2;
var KEY_SHIFT_CTRL     = 3;
var KEY_ALT            = 4;
var KEY_SHIFT_ALT      = 5;
var KEY_CTRL_ALT       = 6;
var KEY_SHIFT_CTRL_ALT = 7;

function EventKeyState(KeyValue)
{
 try
 {
  //Assume initially that the required event key state is false
  var ret = false;
  
  if (window.event != null)
  {
    //There is a window event so now look for the required combination
    switch (KeyValue)
    {
      case KEY_SHIFT:
        ret = (window.event.shiftKey);
      break;

      case KEY_CTRL:
        ret = (window.event.ctrlKey);
      break;
      
      case KEY_SHIFT_CTRL:
        ret = (window.event.shiftKey && window.event.ctrlKey);
      break;

      case KEY_ALT:
        ret = (window.event.altKey);
      break;

      case KEY_SHIFT_ALT:
        ret = (window.event.shiftKey && window.event.altKey);
      break;

      case KEY_CTRL_ALT:
        ret = (window.event.ctrlKey && window.event.altKey);
      break;

      case KEY_SHIFT_CTRL_ALT:
        ret = (window.event.shiftKey && window.event.ctrlKey && window.event.altKey);
      break;
    }
  }
  
  //Now return ret to the calling routine to indicate the event key state
  return ret;
 }
 catch (error)
 {
  CatchError('EventKeyState(KeyValue=' + KeyValue + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function Format(Number, FieldWidth)
{
 try
 {
  var s;
  var i;

  //Convert the Number passed in, into a string
  s = Number + '';

  if (s.length < FieldWidth)
  {
   for (i=s.length; i<FieldWidth; i++)
   {
    //Pad the string with leading zeros
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
function JSRound(Value, DecPlaces)
{
 try
 {
  var Result, Whole, DecPoint, Sign;

  //If Value passed in is Not a Number, set Vvalue to zero and proceed
  if (isNaN(Value))
  {
   Value = 0;
  }

  //Assume initially that the value is +ve (ie has no sign)
  Sign = '';
  if (Value < 0)
  {
   //Value is -ve so set Sign for later
   Sign = '-';
  }

  //Convert (the absolute) Value to a string
  Value = '' + Math.abs(Value);

  //Get the number of decimal places we are working with
  DecPlaces = parseInt(DecPlaces);

  //Multiply the value by 10 to the power of decimal
  //places and convert the result to a string
  Whole = '' + Math.round(Value * Math.pow(10, DecPlaces));

  //If the result does not have enough digits
  while (Whole.length < DecPlaces)
  {
   //Precede with a '0'
   Whole = '0' + Whole;
  }

  //Calculate the position of the decimal point
  DecPoint = Whole.length - DecPlaces;

  //Store the part before the decimal point
  Result = Whole.substring(0, DecPoint);

  //Add a decimal point if you require decimal places
  if (DecPlaces > 0)
  {
   Result += '.';
  }

  //And tag on the part after the decimal point
  Result += Whole.substring(DecPoint, Whole.length);

  //If you end up with a decimal point at the start
  if (Result.substring(0, 1) == '.')
  {
   //Then precede with a zero (ie '0.5' instead of '.5')
   Result = '0' + Result;
  }

  //Finally return the result to the caller (with Sign)
  return Sign + Result;
 }
 catch (error)
 {
  CatchError('JSRound(Value=' + Value + ', DecPlaces=' + DecPlaces + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function SetClassName(Control, ClassName)
{
 try
 {
  var obj = eval('document.all.' + Control);
  
  if (obj != null)
  {
    if (obj.className != ClassName)
    {
      obj.className = ClassName;
    }
  }
 }
 catch (error)
 {
  CatchError('SetClassName(Control=+, ClassName=' + ClassName + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function IIf(Statement, ifTrue, ifFalse)
{
 try
 {
   if (Statement == true)
   {
     return ifTrue;
   }
   else
   {
     return ifFalse;
   }
    
 }
 catch (error)
 {
  CatchError('IIf(Statement=' + Statement + ', IfTrue=' + IfTrue + ', IfFalse=' + IfFalse + ')', error.number, error.name, error.message);
 }
}

//***************************************************************************************
// <ELEMENT POSITION ROUTINES>
//***************************************************************************************
function GetElementLeft(eElement)
{
  if (!eElement && this)                    // if argument is invalid
  {                                         // (not specified, is null or is 0)
    eElement = this;                        // and function is a method
  }                                         // identify the element as the method owner

  var isIE = document.all ? true : false;   // initialize var to identify IE
  var nLeftPos = eElement.offsetLeft;       // initialize var to store calculations
  var eParElement = eElement.offsetParent;  // identify first offset parent element

  while (eParElement != null)
  {                                         // move up through element hierarchy
    if (isIE)                               // if browser is IE, then...
    {
      if ( (eParElement.tagName != "TABLE") && (eParElement.tagName != "BODY") )
      {                                     // if parent is not a table or the body, then...
        nLeftPos += eParElement.clientLeft; // append cell border width to calcs
      }
    }
    else                                    // if browser is Gecko, then...
    {
      if (eParElement.tagName == "TABLE")   // if parent is a table, then...
      {                                     // get its border as a number
        var nParBorder = parseInt(eParElement.border);
     
        if (isNaN(nParBorder))              // if no valid border attribute, then...
        {                                   // check the table's frame attribute
          var nParFrame = eParElement.getAttribute('frame');

          if(nParFrame != null)             // if frame has ANY value, then...
          {
            nLeftPos += 1;                  // append one pixel to counter
          }
        }
        else if(nParBorder > 0)             // if a border width is specified, then...
        {
          nLeftPos += nParBorder;           // append the border width to counter
        }
      }
    }
    
    nLeftPos += eParElement.offsetLeft;     // append left offset of parent
    eParElement = eParElement.offsetParent; // and move up the element hierarchy
  }                                         // until no more offset parents exist
  
  return nLeftPos;                          // return the number calculated
}

function GetElementTop(eElement)
{
  if (!eElement && this)                    // if argument is invalid
  {                                         // (not specified, is null or is 0)
    eElement = this;                        // and function is a method
  }                                         // identify the element as the method owner

  var isIE = document.all ? true : false;   // initialize var to identify IE
  var nTopPos = eElement.offsetTop;         // initialize var to store calculations
  var eParElement = eElement.offsetParent;  // identify first offset parent element

  while (eParElement != null)
  {                                         // move up through element hierarchy
    if (isIE)                               // if browser is IE, then...
    {
      if ( (eParElement.tagName != "TABLE") && (eParElement.tagName != "BODY") )
      {                                     // if parent a table cell, then...
        nTopPos += eParElement.clientTop;   // append cell border width to calcs
      }
    }
    else                                    // if browser is Gecko, then...
    {
      if (eParElement.tagName == "TABLE")   // if parent is a table, then...
      {                                     // get its border as a number
        var nParBorder = parseInt(eParElement.border);

        if (isNaN(nParBorder))              // if no valid border attribute, then...
        {                                   // check the table's frame attribute
          var nParFrame = eParElement.getAttribute('frame');

          if (nParFrame != null)            // if frame has ANY value, then...
          {
            nTopPos += 1;                   // append one pixel to counter
          }
        }
        else if (nParBorder > 0)            // if a border width is specified, then...
        {
          nTopPos += nParBorder;            // append the border width to counter
        }
      }
    }

    nTopPos += eParElement.offsetTop;       // append top offset of parent
    eParElement = eParElement.offsetParent; // and move up the element hierarchy
  }                                         // until no more offset parents exist

  return nTopPos;                           // return the number calculated
}