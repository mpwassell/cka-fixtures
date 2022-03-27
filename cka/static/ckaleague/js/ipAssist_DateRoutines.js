// © Copyright 1999-2000 Business Management Software Limited, All rights reserved.

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function Century(YY)
//  function DateBox_Fix(ThisBox)
//  function DateBox_OnBlur(ThisBox)
//  function DateBox_OnFocus(ThisBox)
//  function DateBox_OnKeyDown(ThisBox)
//  function DateBox_OnKeyPress(ThisBox)
//  function DateBox_OnMouseDown(ThisBox)
//  function ConvertToYYYYMMDD(TheDate)
//  function ConvertFromYYYYMMDD(TheYYYYMMDD)
//  function ResetDateBox(ThisBox)
//
//****************************************************************************

function DateBox_OnFocus(ThisBox)
{
 try
 {
  //Clear the contents of this date box only if it is displaying the mask
  if (ThisBox.value == strDateMask)
  {
    ThisBox.value = '';
  }
  
  //Always set the color to Black when this control receives the focus
  ThisBox.style.color = 'Black';
 }
 catch (error)
 {
   CatchError('DateBox_OnFocus(ThisBox=+)', error.number, error.name, error.message);
 }
}

function ResetDateBox(ThisBox)
{
 try
 {
  if (ThisBox.defaultValue != '')
  {
    //If there is a previous value then use it
    ThisBox.value = ThisBox.defaultValue;
  }
  else
  {
    //No previous value so blank it out
    ThisBox.value = strDateMask;
    ThisBox.YYYYMMDD = '';
  }
  
  //Always move the focus back to the text box
  ThisBox.focus();
 }
 catch (error)
 {
   CatchError('ResetDateBox(ThisBox=+)', error.number, error.name, error.message);
 }
}

function Century(YY)
{
  if (YY < "30")
  {
    return "20" + YY;
  }
  else
  {
    return "19" + YY;
  }
}

function DateBox_Fix(ThisBox)
{
 try
 {
  var ret = ThisBox.value;
  
  var TheDate = ret;  
  var i;
  var SlashCount = 0;
  var SlashPos = '';
  
  for (i=0; i<TheDate.length; i++)
  {
    if (TheDate.slice(i,i+1) == '/')
    {
      SlashCount = SlashCount + 1;
      SlashPos = SlashPos + (i+1) + "";
    }
  }
  
  switch (SlashCount)
  {
    case 1:
      SlashPos = SlashPos + "0";
    break;

    case 0:
      SlashPos = SlashPos + "00";
    break;
  }
  
  //Generate the code according to the date input
  var Code = TheDate.length + "-" + SlashCount + "-" + SlashPos;
  
  var RightNow = new Date();
  var YYYY  = RightNow.getFullYear() + "";
  var YY = YYYY.slice(0,2);
  
  switch (Code)
  {
    case '10-2-36': // mm/dd/yyyy or dd/mm/yyyy
      ret = TheDate;
    break;

    case '8-2-36':  // mm/dd/yy or dd/mm/yy
      ret = TheDate.slice(0,6) + Century(TheDate.slice(6,8));
    break;

    case '5-1-30':  // mm/dd or mm/dd
      ret = TheDate.slice(0,5) + "/" + YYYY;
    break;

    case '9-2-35':  // mm/d/yyyy or dd/m/yyyy
      ret = TheDate.slice(0,3) + "0" + TheDate.slice(3,9);
    break;

    case '7-2-35':  // mm/d/yy or dd/m/yy
      ret = TheDate.slice(0,3) + "0" + TheDate.slice(3,5) + Century(TheDate.slice(5,7));
    break;

    case '9-2-25':  // m/dd/yyyy or d/mm/yyyy
      ret = "0" + TheDate.slice(0,9);
    break;

    case '7-2-25':  // m/dd/yy or d/mm/yy
      ret = "0" + TheDate.slice(0,5) + Century(TheDate.slice(5,7));
    break;

    case '4-1-30':  // mm/d or dd/m
      ret = TheDate.slice(0,3) + "0" + TheDate.slice(3,4) + "/" + YYYY;
    break;

    case '4-1-20':  // m/dd or d/mm
      ret = "0" + TheDate.slice(0,4) + "/" + YYYY;
    break;

    case '8-2-24':  // m/d/yyyy or d/m/yyyy
      ret = "0" + TheDate.slice(0,2) + "0" + TheDate.slice(2,8);
    break;

    case '6-2-24':  // m/d/yy or d/m/yy
      ret = "0" + TheDate.slice(0,2) + "0" + TheDate.slice(2,4) + Century(TheDate.slice(4,6));
    break;

    case '3-1-20':  // m/d or d/n
      ret = "0" + TheDate.slice(0,2) + "0" + TheDate.slice(2,3) + "/" + YYYY;
    break;

    case '8-0-00':  // mmddyyyy or ddmmyyyy
      ret = TheDate.slice(0,2) + "/" + TheDate.slice(2,4) + "/" + TheDate.slice(4,8);
    break;

    case '6-0-00':  // mmddyy or ddmmyy
      ret = TheDate.slice(0,2) + "/" + TheDate.slice(2,4) + "/" + + Century(TheDate.slice(4,6));
    break;

    case '4-0-00':  // mmdd or ddmm
      ret = TheDate.slice(0,2) + "/" + TheDate.slice(2,4) + "/" + YYYY;
    break;
  }
  
  return ret;
 }
 catch (error)
 {
   CatchError('DateBox_Fix(ThisBox=+)', error.number, error.name, error.message);
 }
}

function DateBox_OnBlur(ThisBox)
{
 try
 {
  //If this date box is empty, redisplay the relevant date mask
  //Otherwise proceed to check the validity of this date.
  if (ThisBox.value == '')
  {
    ThisBox.style.color = MASK_TEXT_COLOR;
    ThisBox.value = strDateMask;
    ThisBox.YYYYMMDD = '';
  }
  else
  {
    //Try to fix the date in the date box
    ThisBox.value = DateBox_Fix(ThisBox);

    var DateToCheck = ThisBox.value;
    
    if (DateToCheck.length < 10)
    {
      //Valid date is in mm/dd/yyyy or dd/mm/yyyy format      
      //This date is <10 chars and therefore not valid
      var ErrorsWin = TCMessageBox(1, 1, 6114, Page_MsgTypes[6114], Page_Messages[6114], tcOKOnly, 1, DateToCheck + ";" + "date");
      ResetDateBox(ThisBox);
      return;
    }
     
    if (strDateFormat == 'UK')
    {
      //UK date format
      var DayToCheck = DateToCheck.slice(0,2);
      var MonthToCheck = DateToCheck.slice(3,5);
      var DayTruncate = 2;
      var MonthTruncate = 5;
    }
    else
    {
      //US date format
      var DayToCheck = DateToCheck.slice(3,5);
      var MonthToCheck = DateToCheck.slice(0,2);
      var DayTruncate = 5;
      var MonthTruncate = 2;
    }
    
    //Year will have the same location regardless
    var YearToCheck = DateToCheck.slice(6,10);
    if (YearToCheck < 1900 || YearToCheck > 2199)
    {
      //Year is not valid so inform user
      var ErrorsWin = TCMessageBox(1, 1, 6114, Page_MsgTypes[6114], Page_Messages[6114], tcOKOnly, 1, YearToCheck + ";" + "year");
      ResetDateBox(ThisBox);
      return;
    }
    
    // Resolve leap year cases
    var MaxDays  = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if (((YearToCheck % 4 == 0) && (YearToCheck % 100 != 0)) || (YearToCheck % 400 == 0))
    {
      MaxDays[2] = 29;
    }
    else
    {
      MaxDays[2] = 28;
    }
    
    // Checking the validity of this date
    if ((MonthToCheck < 1) || (MonthToCheck > 12))
    {
      //Month is not valid so inform user
      var ErrorsWin = TCMessageBox(1, 1, 6114, Page_MsgTypes[6114], Page_Messages[6114], tcOKOnly, 1, MonthToCheck + ";" + "month");
      ResetDateBox(ThisBox);
      return;
    }
    
    if ((DayToCheck < 1) || (DayToCheck > MaxDays[MonthToCheck*1]))
    {
      //Day is not valid for this month so inform user
      var ErrorsWin = TCMessageBox(1, 1, 6114, Page_MsgTypes[6114], Page_Messages[6114], tcOKOnly, 1, DayToCheck + ";" + "day for the given month");
      ResetDateBox(ThisBox);
      return;
    }
    
    //Made it this far so the date must be valid.
    //Need to populate the YYYYMMDD property
    ThisBox.YYYYMMDD = YearToCheck + MonthToCheck + DayToCheck;
  }
 }
 catch (error)
 {
   CatchError('DateBox_OnBlur(ThisBox=+)', error.number, error.name, error.message);
 }
}

function DateBox_OnMouseDown(ThisBox)
{
 try
 {
  if (ThisBox.readOnly == false)
  {
    //If the user clicks the mouse down on a date box, blank out the value
    ThisBox.value = '';
  }
 }
 catch (error)
 {
   CatchError('DateBox_OnMouseDown(ThisBox=+)', error.number, error.name, error.message);
 }
}
  
function DateBox_OnKeyPress(ThisBox)
{
 try
 {
  if (ThisBox.readOnly == true)
  {
    //This date box is read only so clear the key press and leave now
    window.event.keyCode = 0;
    return;
  }

  //Define some local constants for use in this routine
  var DatePattern = "mm/dd/yyyy";
  var DateDelimiter = 47;
    
  //Check that a window event has occurred
  if (window.event != null)
  {      
    //Check if the user has selected part of the date
    var trsel = document.selection.createRange();
  
    switch (trsel.text.length)
    {
      case ThisBox.value.length:
        //User has selected the entire date so blank it out and clear the selection
        ThisBox.value = "";  
        document.selection.clear();      
      break;
      
      case 0:
        //User hasn't selected any part of the date so do nothing
      break;
      
      default:
        //User has selected some part of the date so clear the keycode and leave now
        window.event.keyCode = 0;
        return;
      break;
    }
    	
    //Get hold of the key code that caused the event and blank out the event keycode
    var kc = window.event.keyCode;
    window.event.keyCode = 0;

    //Check the length of the date box against the defined date pattern
    if (ThisBox.value.length < DatePattern.length)    
    {
      //Check that the key pressed is in the range {'0'..'9'} (or '0'..'9' on the keypad)
      if (((kc >= 48) && (kc <= 57)) || ((kc >= 96) && (kc <= 105)))
      {
        //Check date pattern to see if a '/' is needed before the next character
        if (DatePattern.charAt(ThisBox.value.length) == String.fromCharCode(DateDelimiter))
        {
          //Add a '/' to the end of the date box
          ThisBox.value = ThisBox.value + String.fromCharCode(DateDelimiter);
        }
        
        //Add the character behind the key code to the date box value
        ThisBox.value = ThisBox.value + String.fromCharCode(kc);
			
        //Check date pattern to see if a '/' is needed after the character just entered
        if (DatePattern.charAt(ThisBox.value.length) == String.fromCharCode(DateDelimiter))
        {
          //Add a '/' to the end of the date box
          ThisBox.value = ThisBox.value + String.fromCharCode(DateDelimiter);
        }	
      }
    }
  }
 }
 catch (error)
 {
   CatchError('DateBox_OnKeyPress(ThisBox=+)', error.number, error.name, error.message);
 }
}

function DateBox_OnKeyDown(ThisBox)
{
 try
 {
  var kc = window.event.keyCode;
  var ControlKey = false;
  var NumberKey = false;

  if (ThisBox.readOnly == true)
  {
    //This date box is read only so reset return false to the calling routine
    return false;
  }

  //Assume initially that the key just pressed is invalid
  var ValidKey = false;
   
  switch (kc)
  {
    //Backspace (8), Tab (9), Del(46)
    //Home (36), End (35), Left (37), Right (39) and Shift (16)
    //Keypad '/' (111)
    case 8: case 9: case 46:
    case 36: case 35: case 37: case 39: case 16:
    case 111:
      //The above keys are valid Control keys
      ControlKey = true;
      ValidKey = true;
    break;
      
    case 27:
      //Escape (27) blanks out the value and is a valid Control key
      ThisBox.value = '';
      ControlKey = true;
      ValidKey = true;
    break;     
  }

  //Only allow the following characters if the shift key is not pressed
  if (window.event.shiftKey == false)
  {      
    switch (kc)
    {
      //Keyboard '0' to '9' (48 to 57)
      //Keypad '0' to '9' (96 to 105)
      //Keyboard '/' (191 on the keyboard)
      case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:        
      case 96: case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105:        
      case 191:
        //The above keys are valid Number keys
        NumberKey = true;
        ValidKey = true;        
      break;
    }
  }      

  //Check if we have already typed in 10 characters (10 chars='mm/dd/yyyy')
  if (ThisBox.value.length == 10)
  {
    //If we have pressed a Number key
    if (NumberKey == true)
    {
      //Check if the user has selected part of the date
      var selThisBox = document.selection.createRange();

      if (selThisBox.text.length == 0)
      {
        //No part of the date is selected so therefore not a valid key to press
        ValidKey = false;
      }
    }
  }
    
  //Return the flag to the calling routine
  return ValidKey;
 }
 catch (error)
 {
   CatchError('DateBox_OnKeyDown(ThisBox=+)', error.number, error.name, error.message);
 }
}  

function ConvertToYYYYMMDD(TheDate)
{
 try
 {
  //This routine takes a date in UK (dd/mm/yyyy) or US (mm/dd/yyyy)
  //format and returns the date in commnon YYYYMMDD format.
  if (strDateFormat == 'UK')
  {
    //UK date format - dd/mm/yyyy
    var DD = TheDate.slice(0,2);
    var MM = TheDate.slice(3,5);
  }
  else
  {
    //US date format - mm/dd/yyyy
    var DD = TheDate.slice(3,5);
    var MM = TheDate.slice(0,2);
  }
  
  //Year will have the same location regardless
  var YYYY = TheDate.slice(6,10);

  //And finally reset the YYYYMMDD value
  return YYYY + MM + DD;
 }
 catch (error)
 {
   CatchError('ConvertToYYYYMMDD(TheDate=' + TheDate + ')', error.number, error.name, error.message);
 }
}

function ConvertFromYYYYMMDD(TheYYYYMMDD)
{
 try
 { 
  //This routine takes an internal format date (YYYYMMDD) and returns the date in
  //UK (dd/mm/yyyy) or US (mm/dd/yyyy) format.
  
  //Firstly, let's get the Year, Month and Day from the YYYYMMDD format date passed in
  var YYYY = TheYYYYMMDD.slice(0,4);
  var MM   = TheYYYYMMDD.slice(4,6);
  var DD   = TheYYYYMMDD.slice(6,8);
  
  if (strDateFormat == 'UK')
  {
    //UK date format - dd/mm/yyyy
    return DD + "/" + MM + "/" + YYYY;
  }
  else
  {
    //US date format - mm/dd/yyyy
    return MM + "/" + DD + "/" + YYYY;
  }  
 }
 catch (error)
 {
   CatchError('ConvertFromYYYYMMDD(TheYYYYMMDD=' + TheYYYYMMDD + ')', error.number, error.name, error.message);
 }
}
