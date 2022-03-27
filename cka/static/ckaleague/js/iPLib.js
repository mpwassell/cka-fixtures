// © Copyright 1999-2000 Business Management Software Limited, All rights reserved.
//
// Form Painter JavaScript Include File
//
// 001 | 07/02/2000 | 1.0.0 | Drew         | New Include file
//
// <ITEM ROUTINES>
//   function AddItemToList(List, Item, Delimiter)
//   function CountItems(Source, Delim)
//   function ExtractItem(Source, Index, Delim)
//   function ExtractItemEx(Source, Index, Delim, Count)
//   function GetItemPosition(Source, Item, Delim)
//   function GetItemPositionEx(Source, Item, Delim, itemArray)
//   function InsertItem(Source, Index, Item, Delim)
//   function RemoveItem(Source, Item, Delim)

// <CONTROL ROUTINES>
//   routine  changeClassName(field, newClass)
//   routine  changeVisibility(field, newState)
//   function ControlExists(CntrlName, FrameName)
//   routine  DisableButton(ButtonName)
//   routine  EnableButton(ButtonName)
//   routine  SetComboFocus(ComboName)
//   routine  SetFocus(CntrlName, FrameName)

// <STRING ROUTINES>
//   routine  DescToUpper(ele)
//   function FieldLengthValueCheck(strField1, strField2, Type, Size)
//   function InStr(Source, Find)
//   function Left(str, cnt)
//   function LTrim(str)
//   function Mid(str, pos, cnt)
//   function NameCase(str)
//   function NameCaseAllWords(str)
//   function PadString(Str, PadChar, ReqLen, PadEnd)
//   function ReplaceString(Source, Find, Replace)
//   function Right(str, cnt)
//   function RTrim(str)
//   function StripText(sValue, sCarRet, sSemiColon)
//   function StrLen(str)
//   function Trim(str)
//   function UCase(str)
//   function Undash(inValue)

// <NUMERIC ROUTINES>
//   function AddValues(Val1, Val2)
//   function AddValuesF(Val1, Val2)

// <DATE ROUTINES>
//   function AGEYears(dtDOB)
//   function AGEMonths(dtDOB)
//   function DatePack(ExternalFormat, DateFormat)
//   function DateUnpack(PackedDate, DateFormat)
//   function GetDay(ExternalFormat, DateFormat)
//   function GetMonth(ExternalFormat, DateFormat)
//   function GetPreviousDay(YYYMMDD)
//   function GetToday()
//   function GetYear(ExternalFormat, DateFormat)
//   function IsLeapYear(Year)
//   function WorkDay(mDate)

// <FORMAT ROUTINES>
//   function DateFormat(InternalFormat, DateFormat)
//   function FormatDate(Date)
//   function FormatSSN(inSSN)
//   function RoundValue(Value, DPs)

// <FIELD ROUTINES>
//   function GetFieldCol(ArrayID, FieldName)
//   function GetFieldDataType(ArrayID, FieldName)
//   function GetFieldValue(FldObj)
//   function GetFieldValueList(FieldList)
//   function GetOldValue(ArrayID, RecordNumber, FieldName)
//   routine  SetFieldValue(FldObj, DataValue)
//   function SetOldValue(ArrayID, RecordNumber, FieldName, Value)

// <ARRAY ROUTINES>
//   function BuildSplitItemArray(Source, Delim)
//   function ExistsInArray(theArray, theItem)

// <MISCELLANEOUS ROUTINES>
//   function AllFramesLoaded()
//   function AppIsBusy()
//   function buildElement(dom, tag, attribs, attribVals, text)
//   function ClientActionStatusOK(bShowMsg)
//   routine  LaunchContact()
//   routine  LaunchLock(sDBTable)
//   routine  ResetKeyRO(AllKeys, AllFields, AllControlTypes)
//   routine  SpinCompanyLogo(bSpin)

// <LABEL ROUTINES>
//   function hide_label(label_name)

// <MESSAGE ROUTINES>
//   function ShowClientMessagesBox(sMsg, sBoxTitle, sBoxDescription, sSubst, sParams, sButtons)
//   function SubstMessageParams(sMessage, sSubst, sParams)

// <VALIDATION ROUTINES>
//   function IsInvalid_DescriptionValue(obj)
//   function IsInvalid_InputMaskValue(FieldValue, FieldMask)
//   function IsInvalid_KeyValue(obj)

// <MANDATORY WINDOW ROUTINES>
//   function CheckMandatory(TheseFields, TheseCaptions)
//   function CloseOpenWindows(strWindowList)
//   function ShowMandatoryWindow(strMandatoryFieldList)
//   function TCMessageTableRow(FieldName)
//   function TCMessageTableList(TableHeading, FieldNames)
//
// <ERROR ROUTINES>
//   function CatchError(Routine, ErrorNumber, ErrorName, ErrorMessage)
//   function CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage)
//
// <TC MESSAGE ROUTINES>
//   function FormatTCMessage(sMsgNo, sMsgType, sMsgText)
//   function FormatTCMessageXML(TheXML, sMsgNoArray, sMsgTypeArray, sMsgTextArray, sMsgParamsArray)
//   function TCValidationBoxXML(ValidationFlag, XML)
//   function TCValidationBox(iTitleNo, sMsgNoArray, sMsgTypeArray, sMsgTextArray, 
//                            iButtons, iDefaultButton, [sMsgParamsArray])
//   function GetTCMessageBoxProperty(sPropertyName, iPropertyValue)
//   function TCMessageBox(iTitleNo, iMsgCount, sMsgNo, sMsgType, sMsgText, iButtons, iDefaultButton, 
//                         [sMsgParams, sInputType, sDialogInCentreOf, iMsgDlgHeight, iMsgDlgWidth])
//
//   function PaintMessage(iMsgNo, iMsgCount, sMsgType, sMsgText, iButtons, iDefaultButton,
//                         [sMsgParams], [sDialogInCentreOf], [iMsgDlgHeight], [iMsgDlgWidth])
//
// <ASSISTANT ROUTINES>
//   function LoadCalendar(TheDate, TheFormat, TheTitle)
//   function LoadAssistant(sWindowType, sAssistantName, sTitle, sKeyNames, sKeyValues, iHeight, iWidth, iTop, iLeft, bRefreshFlag, vArguments)
//
// <ARRAY COPY ROUTINES>
//   **Array.prototype.CopyArray=array_copyarray**
//   function array_copyarray(inArray)
//
//   **Array.prototype.CopyComboArray=array_copycomboarray**
//   function array_copycomboarray(cmbCopyFrom, inArray)
//
// <XML ROUTINES>
//   function dsoEOF(dsoID) returns true if a data island (passed as a string in parameter dsoID) is empty of records
//   function FormatXMLString
//   function UnFormatXMLString

// <PAGE ROUTINES>
//   routine  locPopulatePage(Page_CurrentRow)

// <HELP ROUTINES>
//   function ShowTCSHelp(sHelpURL, sPageID) show the relavant help topic, return pointer to window

//***************************************************************************************
// <ITEM ROUTINES>
function AddItemToList(List, Item, Delimiter)
{
  //Function to Add an Item to the end of a Delimited list
  var l;

  if ((Delimiter == null) || (Delimiter == ""))
  {
    //Default delimiter is ";"
    Delimiter = ";";
  }

  if (List == "")
  {
    //List is blank so set to Item passed in (+ "" to convert to string)
    l = Item + "";
  }
  else
  {
    //List is not empty so tag the Delimiter and the Item on to the end
    l = List + Delimiter + Item; 
  }

  //Return the local copy of the List to the caller
  return l;
}

function CountItems(Source, Delim)
{
  //Function to Count the number of Items in a Delimited list
	var x;
	var Pos;
	var TStr;
	if (Source=='' || Source==null)
	{
		return 0;
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}
	TStr = Source;
	if (TStr.charAt(TStr.length-1) != Delim)
	{
		TStr += Delim;
	}
	x = -1;
	Pos = -1;
	do
	{
		x+=1;
		Pos = TStr.indexOf(Delim,Pos+1);
	}
	while(Pos != -1)
	return x;
}

function ExtractItem(Source, Index, Delim)
{
  //Function to Extract an Item from a certain point in a Delimited list
	var x;
	var Pos1;
	var Pos2;
	var TStr;
	if (Source=='' || Source==null)
	{
		return '';
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}
	TStr = Source;
	if (TStr.charAt(TStr.length-1) != Delim)
	{
		TStr += Delim;
	}
	Pos1 = -1;
	if (Index > CountItems(Source,Delim))
	{
		return '';
	}
	if (Index > 1)
	{
		for (x = 1; x < Index; x++)
		{
			Pos1 = TStr.indexOf(Delim , Pos1+1);
		}
		Pos1 = Pos1 + Delim.length; 
	}
	else
	{
		Pos1 = 0;
	}
	Pos2 = TStr.indexOf(Delim,Pos1);
	if (Pos2 == -1)
	{
		Pos2 = TStr.length + 1;
	}
	return TStr.substr(Pos1,Pos2-Pos1);
}

function ExtractItemEx(Source, Index, Delim, Count)
{
  //Function to Extract Items from a Delimited list
	var x;
	var Pos1;
	var Pos2;
	var TStr;

	if (Source=='' || Source==null)
	{
		return '';
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}
	TStr = Source;
	// Add trailing delim if not present
	if (TStr.charAt(TStr.length-1) != Delim)
	{
		TStr += Delim;
	}
	Pos1 = -1;
	if (Index > Count)
	{
		return '';
	}
	if (Index > 1)
	{
		for (x = 1; x < Index; x++)
		{
			Pos1 = TStr.indexOf(Delim , Pos1+1);
		}
		Pos1 = Pos1 + Delim.length; 
	}
	else
	{
		Pos1 = 0;
	}
	Pos2 = TStr.indexOf(Delim,Pos1);
	if (Pos2 == -1)
	{
		Pos2 = TStr.length + 1;
	}
	return TStr.substr(Pos1,Pos2-Pos1);
}

function GetItemPosition(Source, Item, Delim)
{
  //Function to get the Position of an Item in a Delimited list
	var cnt;
	var cnt2;
	
	if (Source=='' || Source==null)
	{
		return 0;
	}
	if (Item=='' || Item==null)
	{
		return 0;
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}
	var itemArray;

//	itemArray = BuildSplitItemArray(Source, Delim)

//	for (cnt=0;cnt<itemArray.length;cnt++)
//	{
//		if  (itemArray[cnt] == Item )
//		{
//			return cnt+1;
//		}
//	}
	
	cnt2 = CountItems(Source,Delim);

	for (cnt=1;cnt<=cnt2;cnt++)
	{
		if (ExtractItem(Source,cnt,Delim) == Item)
			return cnt;
	}
	
	return 0;
}

function GetItemPositionEx(Source, Item, Delim, itemArray)
{
  //Function to get the Position of an Item in an Array 
	var cnt;
	
	if (Source=='' || Source==null)
	{
		return 0;
	}
	if (Item=='' || Item==null)
	{
		return 0;
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}

	for (cnt=0;cnt<itemArray.length;cnt++)
	{
		if  (itemArray[cnt] == Item )
		{
			return cnt+1;
		}
	}
	
	return 0;
}

function InsertItem(Source, Index, Item, Delim)
{
  //Function to Insert an Item into a Delimited list
	var cnt;
	var sStr;
	var tStr;
	var rStr;
	
	if (Source==null)
	{
		Source = "";
	}
	if (Item==null)
	{
		Item = "";
	}
	if (Index==null)
	{
		return Source;
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}
	
	sStr = Source;
	if (sStr.charAt(sStr.length-1) != Delim)
	{
		sStr += Delim;
	}
	
	if (Index <= 1)
	{
		rStr = Item + Delim + Source;
	}
	else if (Index > CountItems(Source,Delim))
	{
		rStr = Source + Delim + Item;
	}
	else
	{
		rStr = "";
		for (cnt=1;cnt<Index;cnt++)
		{
			rStr += ExtractItem(Source,cnt,Delim) + Delim;
		}
		rStr += Item + Delim;
		for (cnt=Index;cnt<=CountItems(Source,Delim);cnt++)
		{
			rStr += ExtractItem(Source,cnt,Delim) + Delim;
		}
	}

	return rStr;	
}

function RemoveItem(Source, Item, Delim)
{
  //Function to Remove an Item from a Delimited list
	var cnt;
	var tstr;
	var rstr;
	var cnt2;

	if (Source=='' || Source==null)
	{
		return Source;
	}
	if (Item=='' || Item==null)
	{
		return Source;
	}
	if (Delim=='' || Delim==null)
	{
		Delim = ';' ;
	}
	
	rstr = "";
	cnt2 = CountItems(Source,Delim);

	for (cnt=1;cnt<=cnt2;cnt++)
	{
		tstr = ExtractItem(Source,cnt,Delim);
		if (tstr != Item)
			rstr += tstr + Delim;
	}
	
	return rstr;
}
// </ITEM ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <CONTROL ROUTINES>
function changeClassName(field, newClass)
{
 //Function to change the className of a specified Field
 // RJA - changing the class name is expensive, so this routine
 //       checks first.  Improved screen rendering by 16%
 try
 {
  //Check that the field exists
  if (field != null)
  {
    //Check if the className needs to be changed
    if (field.className != newClass)
    {
      //It does so change to the new class passed in
	    field.className = newClass;
	  }
	}
 }
 catch (error)
 { 
   CatchError('changeClassName(field=+, newClass=' + newClass + ')', error.number, error.name, error.message);
 }
}

function changeVisibility(field, newState)
{
 //Function to change the visibility of a specified Field
 // SPR - as above this is more efficient
 //       2nd parameter is	'visible' or 'hidden'
 try
 {
  //Check that the field exists
  if (field != null)
  {
    //Check if the visibility needs to be changed
    if (field.style.visibility != newState)
    {
      //It does so change to the new state passed in
      field.style.visibility = newState;
    }
  }
 }
 catch (error)
 { 
   CatchError('changeVisibility(field=+, newState=' + newState + ')', error.number, error.name, error.message);
 }
}

function ControlExists(CntrlName, FrameName)
{
  //Function to check whether a Control/Frame exists
	var Obj;
	var Frm;
	if (FrameName != '' && FrameName != null)
	{
		Frm = eval('top.frames["' + FrameName + '"]');
		if (!Frm)
		{
			return false;
		}
		else
		{
			if (CntrlName != '' && CntrlName != null)
			{
				//Obj = eval('top.frames["'+ FrameName + '"].document.all.' + CntrlName);
				Obj = Frm.document.all.item(CntrlName);
			}
			else
			{
				return true;
			}
		}
	}
	else
	{
		Obj = eval('document.all.' + CntrlName);
	}
	if (!Obj)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function DisableButton(ButtonName)
{
  //Routine to disable a button (if it exists) by changing its class name
	if (ControlExists(ButtonName, "iPDetail") == true)
	{
		var obj = eval("document.all." + ButtonName);
		changeClassName(obj, "DisabledNavButtonsOff");
	}
}

function EnableButton(ButtonName)
{
  //Routine to enable a button (if it exists) by changing its class name
	if (ControlExists(ButtonName, "iPDetail") == true)
	{
		var obj = eval("document.all." + ButtonName);
    changeClassName(obj, "NavButtonsOff");
	}
}

function SetComboFocus(ComboName)
{
  //Routine to set the Focus to the Combo whose Name is passed in
	eval(ComboName + ".Toggle()");
}

function SetFocus(CntrlName, FrameName)
{
  //Routine to Set Focus to a given Control in a given Frame
	var Obj;

	if (ControlExists(CntrlName, FrameName))
	{
		Obj = eval('top.frames["'+ FrameName + '"].document.all.' + CntrlName);

		//Check Obj Type		
		if (Obj.tagName == 'TABLE')
		{
			Obj = eval('top.frames["'+ FrameName + '"].document.all.' + CntrlName + '_input');
		}
		
		if (!Obj.disabled)	// IC 21/Jun/2001 Cannot set focus to a disabled control
		{
			Obj.focus();
		}				
	}
}
// </CONTROL ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <STRING ROUTINES>
function DescToUpper(ele)
{
  //Routine to convert the first letter of a Desc field to uppercase
	var Fld = ele.value;
	var FirstCap = Fld.slice(0,1);
	ele.value = FirstCap.toUpperCase() + Fld.slice(1,ele.value.length);
	return true;
}

function FieldLengthValueCheck(strField1, strField2, Type, Size)
{
  //Function to add the value of two fields and compares CharLength against a specified Size
  //The comparison is passed in the Type parameter ('<', '>' or '=')
  var iField1 = strField1.length;
  var iField2 = 0;
		
  if (strField2 != '')
  {
    iField2 = strField2.length;
  }

  switch (Type)
  {
	  case '>':
      if (iField1 + iField2 > Size)
      {
        return false;
      }
      else 
      {
        return true;
      }
    break;

    case '<':
      if (iField1 + iField2 < Size)
      {
        return true;
      }
      else 
      {
        return false;
      }
    break;

    case '=':
      if (iField1 + iField2 == Size)
      {
        return true;
      }
      else 
      {
        return false;
      }
    break;

    default:
      return false;
    break;
  }
}

function InStr(Source, Find)
{
  //Function to check if a given string can be found inside another string
	var tSource = Source.toString();
	var tFind = Find.toString();

	if (tSource.indexOf(tFind) == -1)
	{
		return false;
	}
	return true;
}

function Left(str, cnt)
{
  //Function to return the specified number of characters on the Left of a String
	if (str == '')
	{
		return '';
	}
	return str.substr(0, cnt);
}

function LTrim(str)
{
  //Function to remove the leading whitespace from the given string
  var whitespace = new String(" \t\n\r");

  var s = new String(str);

  if (whitespace.indexOf(s.charAt(0)) != -1)
  {
    // We have a string with leading blank(s)...
    var j=0, i = s.length;

    //Iterate from the far left of string until we
    //don't have any more whitespace...
    while (j < i && whitespace.indexOf(s.charAt(j)) != -1)
    {
      j++;
    }

    //Get the substring from the first non-whitespace
    //character to the end of the string...
    s = s.substring(j, i);
  }

  return s;
}

function Mid(str, pos, cnt)
{
  //Function to return the specified number of characters in the Middle of a String
  // pos is zero based
	if (str == '')
	{
		return '';
	}
	return str.substr(pos, cnt);
}

function NameCase(str)
{
	//Function to capitalise the Name String passed in (convert the first char to Upper case)
	if (str == '')
	{
		return '';
	}
	var Char = Left(str, 1);
	var Rest = Right(str, str.length - 1);
	return UCase(Char) + Rest;
}

function NameCaseAllWords(str)
{
	//Function to convert the first letter of each word to Upper Case
	if (str == '')
	{
		return '';
	}
	var tStr = '';
	var i;
	for (i=1; i<=CountItems(str, " "); i++)
	{
		if (i>1)
		{
			tStr = tStr + ' ';
		}
		tStr = tStr + NameCase(ExtractItem(str, i, " "));
	}
	return tStr;
}

function PadString(Str, PadChar, ReqLen, PadEnd)
{
  //Function to Pad a String with a Pad Character for a Required Length
	TStr = new String(Str);

	if (TStr.length >= ReqLen) 
	{
		return TStr;
	}
	else
	{
		var PString = "";
		var cnt;
		var diff = ReqLen - TStr.length;
		for (cnt = 0;cnt < diff;cnt++)
			PString += PadChar;
		if (PadEnd)
		{
			return TStr + PString;
		}
		else
		{
			return PString + TStr;
		}
	}
}

function ReplaceString(Source, Find, Replace)
{
  //Function to Replace a given String with a Replacement string
  if (Source == null)
  {
    return;
  }
    
  if (!isNaN(Source))
  {
    Source = Source.toString();
  }

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

function Right(str, cnt)
{
  //Function to return the specified number of characters on the Right of a String
	if (str == '')
	{
		return '';
	}
	var Len = str.length;
	return str.substr(Len - cnt, cnt);
}

function RTrim(str)
{
  //Function to remove the trailing whitespace from the given string
  // We don't want to trip JUST spaces, but also tabs,
  // line feeds, etc.  Add anything else you want to
  // "trim" here in Whitespace
  var whitespace = new String(" \t\n\r");

  var s = new String(str);

  if (whitespace.indexOf(s.charAt(s.length-1)) != -1)
  {
    // We have a string with trailing blank(s)...
    // Get length of string
    var i = s.length - 1;

    // Iterate from the far right of string until we
    // don't have any more whitespace...
    while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1)
    {
      i--;
    }

    // Get the substring from the front of the string to
    // where the last non-whitespace character is...
    s = s.substring(0, i+1);
  }

  return s;
}

function StripText(sValue, sCarRet, sSemiColon)
{
  //Function to strip the carriage returns and semi colons out of a string
  //and replace them with the replacement strings passed in
  //It also substitutes any special characters, for example '
	sValue = ReplaceString(sValue, "'", "\\'")

	if (sCarRet != null)
	{
		sValue = ReplaceString(sValue, "\r", sCarRet);
		sValue = ReplaceString(sValue, "\n", "");
		sValue = ReplaceString(sValue, "\f", "");
	}
	
	if (sSemiColon != null)
	{
		sValue = ReplaceString(sValue, ";", sSemiColon);
	}

	return sValue;
}

function StrLen(str)
{
  //Function to return the Length of the String passed in
  return str.length;
}

function Trim(str)
{
  //Function to remove leading and trailing whitespace from the given String
  return RTrim(LTrim(str));
}

function UCase(str)
{
  //Function to convert the specified String to Upper Case
	if (str == '')
	{
		return '';
	}
	return str.toUpperCase();
}

function Undash(inValue)
{
  //Function to remove the Dashes from a Value passed in
	var lcValue = new String(inValue);
	var lcIntPos = lcValue.indexOf('-');
	while (lcIntPos > -1)
	{
		lcValue = lcValue.slice(0, lcIntPos) + lcValue.slice(lcIntPos + 1);
		lcIntPos = lcValue.indexOf('-');
	}
	return lcValue;
}

// </STRING ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <NUMERIC ROUTINES>
function AddValues(Val1, Val2)
{
  //Function to add two integer values together
	return (parseInt(parseInt(Val1,10) + parseInt(Val2,10)));
}

function AddValuesF(Val1, Val2)
{
  //Function to add two floating point values together
	return (parseFloat(parseFloat(Val1) + parseFloat(Val2)));
}

// </NUMERIC ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <DATE ROUTINES>
function AGEYears(dtDOB)
{
  //Function create AGEYears from DOB
  //if birth month is greater than todays month
  //add one to birth month and subtract it from today
  var today = GetToday();
  var DOBDate = dtDOB;
  var DOBYear = String(DOBDate).slice(0,4);
  var nowYear = String(today).slice(0,4);
  var TodaysMonth = String(today).slice(4,6);
  var BirthMonth = String(DOBDate).slice(4,6);
  var TodaysDay = String(today).slice(6);
  var BirthDay = String(DOBDate).slice(6);
  var YearsOld = 0;

	YearsOld = nowYear - DOBYear;
		
	if (TodaysMonth < BirthMonth)
	{
		YearsOld--;
	}
	else if (TodaysMonth == BirthMonth)
	{
		if (TodaysDay < BirthDay)
		{
			YearsOld--;
		}
	}
	
	// If the DOB is blank the age will be the current year which would make the employee very old!
	if(YearsOld == nowYear || nowYear == '' || nowYear == 0 || dtDOB > today)
	{
		YearsOld = 0;
	}

	if (YearsOld == 1)
	{
		return String(YearsOld) + ' ' + 'Year';
	}
	else
	{
    return String(YearsOld) + ' ' + 'Years';
	}
}

function AGEMonths(dtDOB)
{
  //Function to create AGEMonths from DOB
  var today = GetToday();
  var DOBDate = dtDOB;
  var DOBYear = String(DOBDate).slice(0,4);
  var nowYear = String(today).slice(0,4);
  var TodaysMonth = String(today).slice(4,6);
  var BirthMonth = String(DOBDate).slice(4,6);
  var TodaysDay = String(today).slice(6);
  var BirthDay = String(DOBDate).slice(6);
  var MonthsOld = 0;	

	MonthsOld = TodaysMonth - BirthMonth;
		
	if (TodaysDay < BirthDay)
	{
		MonthsOld--;
	}
	
	if (MonthsOld < 0)
	{
		MonthsOld+=12;
	}
	
	// if the DOB is blank the month returned would be the current month
	if(BirthMonth == '' || BirthMonth == 0 || dtDOB > today)
	{
		MonthsOld = 0;
	}
	
	if (MonthsOld == 1)
	{
		return String(MonthsOld) + ' ' + 'Month';
	}
	else
	{
		return String(MonthsOld) + ' ' + 'Months';
	}
}

function DatePack(ExternalFormat, DateFormat)
{
  //Function to return a Date Packed into YYYYMMDD format from a valid External format.
	if (ExternalFormat == "" || ExternalFormat == null)
		return "";

	var day = "";
	var mth = "";
	var yr  = "";

	var DatePattern = "";
	var dout = "";
	var ptr = 0;
	var curChar = "";
	var curPart = "";
	var curPartLength = 0;
	var OutputDatePortion = false;
	
	if (DateFormat == null || DateFormat == "")
	{
		DateFormat = DATE_FORMAT_MMDDYYYY;
	}
		
	switch (DateFormat)
	{
		case DATE_FORMAT_DDMMYYYY:
			DatePattern = DATE_PATTERN_DDMMYYYY;
			break;
		case DATE_FORMAT_MMDDYYYY:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
		default:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
	}
	
	for (ptr = 0 ; ptr < DatePattern.length ; ptr++)
	{
		curChar = DatePattern.charAt(ptr);
		if (curChar != String.fromCharCode(DateDelimiter))
		{
			OutputDatePortion = false;
			if (curChar != curPart)
			{
				curPart = curChar;
				curPartLength = 1;
			}
			else
			{
				curPartLength += 1;
			}	
			if (ptr == DatePattern.length - 1)
			{
				//DO DATE BIT
				OutputDatePortion = true;
			}
			else
			{
				curChar = DatePattern.charAt(ptr + 1)
				if (curChar != curPart)
				{
					//DO DATE BIT
					OutputDatePortion = true;
				}
			}
			if (OutputDatePortion)
			{
				switch (curPart)
				{
					case "d":
						day = PadString(ExternalFormat.substr(ptr - curPartLength + 1,curPartLength),"0",curPartLength,false);
						break;
					case "m":
						mth = PadString(ExternalFormat.substr(ptr - curPartLength + 1,curPartLength),"0",curPartLength,false);
						break;
					case "y":
						yr = PadString(ExternalFormat.substr(ptr - curPartLength + 1,curPartLength),"0",curPartLength,false);
						break;
				}
			}
		}
	}

	if (day != "" && mth != "" && yr != "")
	{
		dout = yr + "" + mth + "" + day;
	}

	return dout;	
}

function DateUnpack(PackedDate, strDateFormat)
{
 //Function to convert an internal format date (YYYYMMDD) and returns the date in
 //UK (dd/mm/yyyy) or US (mm/dd/yyyy) format according to the Date Format passed in.
 try
 { 
  //Firstly, let's get the Year, Month and Day from the YYYYMMDD format date passed in
  var YYYY = PackedDate.slice(0,4);
  var MM   = PackedDate.slice(4,6);
  var DD   = PackedDate.slice(6,8);
  
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
   CatchError('DateUnpack(PackedDate=' + PackedDate + ', strDateFormat=' + strDateFormat + ')', error.number, error.name, error.message);
 }
}

function GetDay(ExternalFormat, DateFormat)
{
  //Function to return a Day from an External format date. Returns 0 if an error occurs.
	var DatePattern = "";

	if (ExternalFormat == "" || ExternalFormat == null)
		return 0;

	if (DateFormat == null || DateFormat == "")
	{
		DateFormat = DATE_FORMAT_MMDDYYYY;
	}
		
	switch (DateFormat)
	{
		case DATE_FORMAT_DDMMYYYY:
			DatePattern = DATE_PATTERN_DDMMYYYY;
			break;
		case DATE_FORMAT_MMDDYYYY:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
		default:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
	}

	var firstd = DatePattern.indexOf("d");
	
	if (firstd == -1)
		return 0;
		
	var lastd = DatePattern.lastIndexOf("d");
	
	if (lastd == -1)
		return 0;

	var testd = ExternalFormat.substring(firstd,lastd+1);
	
	if (!isNaN(parseInt(testd,10)))
		return testd;
	else
		return 0;
}

function GetMonth(ExternalFormat, DateFormat)
{
  //Function to return a Month from an External format date. Returns 0 if an error occurs.
	var DatePattern = "";

	if (ExternalFormat == "" || ExternalFormat == null)
		return 0;

	if (DateFormat == null || DateFormat == "")
	{
		DateFormat = DATE_FORMAT_MMDDYYYY;
	}
		
	switch (DateFormat)
	{
		case DATE_FORMAT_DDMMYYYY:
			DatePattern = DATE_PATTERN_DDMMYYYY;
			break;
		case DATE_FORMAT_MMDDYYYY:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
		default:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
	}

	var firstm = DatePattern.indexOf("m");
	
	if (firstm == -1)
		return 0;
		
	var lastm = DatePattern.lastIndexOf("m");
	
	if (lastm == -1)
		return 0;

	var testm = ExternalFormat.substring(firstm,lastm+1);
	
	if (!isNaN(parseInt(testm,10)))
		return testm;
	else
		return 0;
}

function GetPreviousDay(YYYYMMDD)
{
	//Function to perform the equivalent of DateAdd("d", -1, Date) : returns as YYYYMMDD
	var Year = parseInt(Left(YYYYMMDD.toString(),4));
	var Month = parseInt(Mid(YYYYMMDD.toString(), 4, 2));
	var Day = parseInt(Right(YYYYMMDD.toString(), 2));

	if (Day == 1)
	{
		if (Month == 1)
		{
			Year = parseInt(Year) - 1;
			Month = 12;
		}
		switch (Month)
		{
			case 1:
				Day = 31;
				break;
			case 2:
				Day = 28;
				if (IsLeapYear(Year) == true)
				{
					Day = 29;
				}
				break;
			case 3:
				Day = 31;
				break;
			case 4:
				Day = 30;
				break;
			case 5:
				Day = 31;
				break;
			case 6:
				Day = 30;
				break;
			case 7:
				Day = 31;
				break;
			case 8:
				Day = 31;
				break;
			case 9:
				Day = 30;
				break;
			case 10:
				Day = 31;
				break;
			case 11:
				Day = 30;
				break;
			case 12:
				Day = 31;
				break;
		}		
	}
	else
	{
		Day = parseInt(Day) - 1;
	}
	return Year + PadString(Month.toString(), "0", 2, false) + PadString(Day.toString(), "0", 2, false);
}

function GetToday()
{
  //Function to return today's date in YYYYMMDD format
	var ObjToday = new Date();
	var tmpToday = '';
	var locMonth = new Array('01','02','03','04','05','06','07','08','09','10','11','12');
	var locDay = new Array('00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31');
	
	tmpToday += ObjToday.getFullYear().toString();
	tmpToday += locMonth[ObjToday.getMonth()];
	tmpToday += locDay[ObjToday.getDate()];
	
	return tmpToday;
}

function GetYear(ExternalFormat, DateFormat)
{
  //Function to return a Year from an External format date. Returns 0 if an error occurs.
	var DatePattern = "";

	if (ExternalFormat == "" || ExternalFormat == null)
		return 0;

	if (DateFormat == null || DateFormat == "")
	{
		DateFormat = DATE_FORMAT_MMDDYYYY;
	}
		
	switch (DateFormat)
	{
		case DATE_FORMAT_DDMMYYYY:
			DatePattern = DATE_PATTERN_DDMMYYYY;
			break;
		case DATE_FORMAT_MMDDYYYY:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
		default:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
	}

	var firsty = DatePattern.indexOf("y");
	
	if (firsty == -1)
		return 0;
		
	var lasty = DatePattern.lastIndexOf("y");
	
	if (lasty == -1)
		return 0;

	var testy = ExternalFormat.substring(firsty,lasty+1);
	
	if (!isNaN(parseInt(testy,10)))
		return testy;
	else
		return 0;
}

function IsLeapYear(Year)
{
  //Function to determine whether the Year passed in is a Leap Year
	// is it divisble by 4 ?
	if (Year % 4 == 0)
	{
		// yes, is it a century ?
		if (Year % 100 == 0)
		{
			// must be divisble by 400
			if (Year % 400 == 0)
			{
				return true;
			}
		}
		else
		{
			return true;
		}
	}
	return false;
}

function WorkDay(mDate)
{
	//Function to check if the date passed in internal format falls on a working day (mon-fri)
	var yy = parseInt(mDate.substr(0,4),10);
	var mm = parseInt(mDate.substr(4, 2),10);
	var dd = parseInt(mDate.substr(6, 2),10);
	
	// if the date was before 1582 it is not a valid Gregorian calendar date
	if ( (yy<1582) || (yy==1582&&mm<10) || (yy==1582&&mm==10&&dd<4) ) 
	{
		return false;
	}
	
	// is it a leap year
	var ly=(!(yy%4)-!(yy%100)+!(yy%400))
	
	if (mm<1||mm>12) 
	{
		return false;
	}

	if ( (dd<1) || (dd>31) || ((mm==4||mm==6||mm==9||mm==11)&&dd>30) || (mm==2&&dd>(28+ly)) ) 
	{	
		return false
	}

	if (mm<3) 
	{
		mm += 12
		yy -= 1
	}

	var jdy=Math.floor(365.25*yy)-Math.floor(0.01*yy)+Math.floor(0.0025*yy)

	var jd=jdy+Math.floor(30.6001*(mm+1))+dd+1720994.5

	var wd=jd+2.5-(7*Math.floor((jd+2.5)/7))

	var dow = false;
	switch(wd)
	{
		case 0: 
		case 1:
		case 2:
		case 3:
		case 4:
			dow = true;
			break;
		case 5:
		case 6:
			dow = false;
			break;
		default:
			dow = false;
	}
	return dow;
}

// </DATE ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <FORMAT ROUTINES>
function DateFormat(InternalFormat, DateFormat)
{
  //Function to return a Date Formatted for an Input box, using the System Date settings.
	if (InternalFormat == "" || InternalFormat == null)
	{
		return "";
	}
	
	var yr = InternalFormat.slice(0,4);
	var mth = InternalFormat.slice(4,6);
	var day = InternalFormat.slice(6,8);

	if ((yr == "0000") || (mth == "00") || (day == "00"))
		return "";
	if ((yr == 0) || (mth == 0) || (day == 0))
		return "";
		
	var dout = "";
	var ptr = 0;
	var curPart = "";
	var curPartLength = 0;
	var curChar = "";
	var OutputDatePortion = false;
	var DatePattern = "";
	
	if (DateFormat == null || DateFormat == "")
	{
		DateFormat = DATE_FORMAT_MMDDYYYY;
	}
		
	switch (DateFormat)
	{
		case DATE_FORMAT_DDMMYYYY:
			DatePattern = DATE_PATTERN_DDMMYYYY;
			break;
		case DATE_FORMAT_MMDDYYYY:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
		default:
			DatePattern = DATE_PATTERN_MMDDYYYY;
			break;
	}
		
	for (ptr = 0 ; ptr < DatePattern.length ; ptr++)
	{
		curChar = DatePattern.charAt(ptr);
		if (curChar != String.fromCharCode(DateDelimiter))
		{
			OutputDatePortion = false;
			if (curChar != curPart)
			{
				curPart = curChar;
				curPartLength = 1;
			}
			else
			{
				curPartLength += 1;
			}	
			if (ptr == DatePattern.length - 1)
			{
				//DO DATE BIT
				OutputDatePortion = true;
			}
			else
			{
				curChar = DatePattern.charAt(ptr + 1)
				if (curChar != curPart)
				{
					//DO DATE BIT
					OutputDatePortion = true;
				}
			}
			if (OutputDatePortion)
			{
				switch (curPart)
				{
					case "d":
						dout += PadString(day,"0",curPartLength,false);
						break;
					case "m":
						dout += PadString(mth,"0",curPartLength,false);
						break;
					case "y":
						dout += PadString(yr,"0",curPartLength,false);
						break;
				}
			}
		}	
		else
		{
			dout += String.fromCharCode(DateDelimiter);
			curPart = "";
		}
	}
	return dout;
}

function FormatDate(Date)
{
  //Function to format a given YYYYMMDD date into a "mmm dd, yyyy" date (eg "Dec 5, 2001")
	var inYear;
	var inMonth;
	var inDay;
		
	var outMonth;
		
	// yyyymmdd
	inYear = parseInt(Date.substr(0,4),10);
	inMonth = parseInt(Date.substr(4, 2),10);
	inDay = parseInt(Date.substr(6, 2),10);
		
	switch(inMonth)
	{
		case 1:
			outMonth = "Jan";
			break;
		case 2:	
			outMonth = "Feb";
			break;
		case 3:
			outMonth = "Mar";
			break;
		case 4:
			outMonth = "Apr";
			break;
		case 5:
			outMonth = "May";
			break;
		case 6:
			outMonth = "Jun";
			break;
		case 7:
			outMonth = "Jul";
			break;
		case 8:
			outMonth = "Aug";
			break;
		case 9:
			outMonth = "Sep";
			break;
		case 10:
			outMonth = "Oct";
			break;
		case 11:
			outMonth = "Nov";
			break;
		case 12:
			outMonth = "Dec";
			break;
	}		
	return outMonth + ' ' + inDay + ', ' + inYear;
}

function FormatSSN(inSSN)
{
  //Function to format a given Social Security Number into "###-##-####" format
	if (!inSSN)
	{
		return '';
	}
	else
	{
		return inSSN.substr(0, 3) + "-" + inSSN.substr(3, 2) + "-" + inSSN.substr(5, 4);
	}
}

function RoundValue(Value, DPs)
{
  //Function that takes a Value and Rounds it to the required number of Decimal Places
	var oUndefined;
	if (Value == oUndefined)
	{
		return '';
	}
	var inValueStr = Value.toString();
	
	if (inValueStr == '')
	{
		return Value;
	}
	var Left = ExtractItem(inValueStr, 1, ".");
	var Right = ExtractItem(inValueStr, 2, ".");
	var NewRight = "";
	var DPL = "";
	var DPR = "";

	if (Right.length > DPs)
	{
		NewRight = Right.substr(0, DPs)
		DPR = Right.substr(DPs, 1);
		if (parseInt(DPR,10) >= 5)
		{
			var tRight = AddValuesF(NewRight, 1);
			var tRightStr = tRight.toString();
			if (tRightStr.length > NewRight.length)
			{
				NewRight = tRightStr.substr(1, (tRightStr.length - 1));
				Left = AddValuesF(Left, 1);
			}
			else if (tRightStr.length < NewRight.length)
			{
				var AddZ = (NewRight.length - tRightStr.length);
				NewRight = tRightStr;
				for (i=0; i<AddZ; i++)
				{
					NewRight = "0" + NewRight;
				}
			}
			else
			{
				NewRight = tRight;
			}
		}
	}
	else
	{
		NewRight = Right;
		if (StrLen(NewRight) < DPs)
		{
			for (var i=StrLen(NewRight); i<DPs; i++)
			{			
				NewRight = NewRight + "0";
			}
		}
	}
	if (Left == '')
	{
		Left = '0';
	}
	if (DPs == 0)
	{
		return Left;
	}
	else
	{
		return Left + "." + NewRight;
	}
}
// </FORMAT ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <FIELD ROUTINES>
function GetFieldCol(ArrayID, FieldName)
{
  //Function to return the column position of a Field Name passed in the Page_Fields or Sub_Fields array
  var ColFound = 0;
  var FieldArray = new Array;
	
	switch (ArrayID)
	{
		case "P":
			FieldArray = Page_Fields;
			break;
		case "S":
			FieldArray = Sub_Fields;
			break;
	}
	
	for (var ColPos = 0; ColFound == 0; ColPos++)
	{
		if (FieldArray[ColPos] == FieldName)
		{
			ColPos--;
			ColFound = 1;
		}
		else
		{
			if (ColPos == (FieldArray.length - 1))
			{
				ColFound = 2;
			}
		}
	}
	
	if (ColFound == 1)
	{
		return ColPos;
	}
	else
	{
		return -1;
	}
}

function GetFieldDataType(ArrayID, FieldName)
{
  //Function to return the data type of a specified Field Name in the specified Array
	var ColNo = GetFieldCol(ArrayID, FieldName);
	return Page_FieldTypes[ColNo];
}

function GetFieldValue(FldObj)
{
  //Function to Get the Value behind a Field regardless of the field type
	var DataValue;
				
	switch (FldObj.tagName)
	{
		case 'INPUT':
			switch (FldObj.type) 
			{
				case 'checkbox':
					DataValue = FldObj.checked;
					break;
				default:
					DataValue = FldObj.value;
					break;
			}
			break;
		case 'SPAN':
			DataValue = FldObj.outerText;
			break;
		case 'SELECT':
			DataValue =  FldObj.value;
			break;
		case 'TABLE':
			DataValue = FldObj.value;
			break;
		case 'TEXTAREA':
			DataValue = FldObj.value;
			break;
		default:
			DataValue = "";
			break;
	}
	
	return DataValue;
}

function GetFieldValueList(FieldList)
{
  //Function to get the Values behind a (; delimited) List of Fields
	var Lst ='';
	var Obj;
	var Colcnt;
	var x;

	x = CountItems(FieldList,';');

	for (Colcnt=1;Colcnt<=x;Colcnt++)
	{
		Obj = eval('document.all.' + ExtractItem(FieldList,Colcnt,';'));
		if ((Obj.tagName == "INPUT" && Obj.type == "text") || Obj.tagName == "TEXTAREA")
		{
			Lst += StripText(GetFieldValue(Obj), "#ReT#", "#SeC#") + ';';
		}
		else
		{
			Lst += GetFieldValue(Obj) + ';';
		}
	}

	Lst  = Lst.substr(0,Lst.length-1);
	return Lst;	
}

function GetOldValue(ArrayID, RecordNumber, FieldName)
{
  //Function to Get the Old Value from the Page_ or Sub_ Data array
	var ColNo = GetFieldCol(ArrayID, FieldName);
	
	switch (ArrayID)
	{
		case "P":
			if (RecordNumber > Page_Data.length)
			{
				return '';
			}
			return Page_Data[RecordNumber - 1][ColNo];
			break;
		case "S":
			if (RecordNumber > Sub_Data.length)
			{
				return '';
			}
			return Sub_Data[RecordNumber - 1][ColNo];
			break;
	}
}

function SetFieldValue(FldObj, DataValue)
{
  //Routine to Set the Value of a Field regardless of the field type
	var undefinedvar;

	switch (FldObj.tagName)
	{
		case 'INPUT':
			switch (FldObj.type) 
			{
				case 'checkbox':
					if (DataValue=="")
					{
						FldObj.checked = false;
					}
					else
					{
						FldObj.checked = DataValue;
					}
					break;
				default:
					if (DataValue === undefinedvar)
					{
						FldObj.value = '';
					}
					else
					{
						FldObj.value = DataValue;
					}
					break;
			}
			break;
		case 'SPAN':
			FldObj.outerText = DataValue;
			break;
		case 'SELECT':
			FldObj.value = DataValue;
			break;
		case 'TABLE':
			eval(FldObj.id + '.SetValue("' + DataValue + '")');
			break;
		case 'TEXTAREA':
			if (DataValue === undefinedvar)
			{
				FldObj.value = '';
			}
			else
			{
				FldObj.value = DataValue;
			}
			break;
		default:
			break;
	}
}

function SetOldValue(ArrayID, RecordNumber, FieldName, Value)
{
  //Function to Set the Old Value in the Page_ or Sub_ Data array
	var ColNo = GetFieldCol(ArrayID, FieldName);
	switch (ArrayID)
	{
		case "P":
			if (RecordNumber > Page_Data.length)
			{
				return '';
			}
			Page_Data[RecordNumber - 1][ColNo] = Value;
			break;
		case "S":
			if (RecordNumber > Sub_Data.length)
			{
				return '';
			}
			Sub_Data[RecordNumber - 1][ColNo] = Value;
			break;
	}
}
// </FIELD ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <ARRAY ROUTINES>
function BuildSplitItemArray(Source, Delim)
{
  //Function to split a Delimited string into a javascript array
 	var x;
	var Pos1;
	var Pos2;
	var TStr;
	var countOfItem = 0;
	var delimLen = Delim.length;

	var myArray = new Array();

	if (Source=='' || Source==null)
	{
		return null;
	}
	if (Delim=='' || Delim==null)
	{
		Delim = null;
	}
	TStr = Source;

	// Add trailing delim if not present
	if (TStr.charAt(TStr.length-1) != Delim)
	{
		TStr += Delim;
	}
	Pos1 = 0;

	for(;;)
	{
		Pos2 = TStr.indexOf(Delim , Pos1);
		if  ( Pos2 == -1 )
			break;

		myArray[countOfItem] = TStr.substr(Pos1,Pos2-Pos1);
		Pos1 = Pos2 + delimLen;
		countOfItem++;
	}

	return myArray;
}

function ExistsInArray(theArray, theItem)
{
  //Function to check if theItem Exists in theArray (returns the index if found)
	var i=0;
	for (i=0;i<=theArray.length;i++)
	{
		if (theArray[i] == theItem)
		{
			return i;
		}
	}

	return -1;
}
// </ARRAY ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <MISCELLANEOUS ROUTINES>
function AllFramesLoaded()
{
  //Function to check whether All Frames have finished Loading
	var CanWeGo = true;
	var i=0;
	
	for (i=0; i<top.frames.length; i++)
	{
		if (top.frames.item(i).document.readyState != "complete")
		{
			CanWeGo = false;
		}
	}
	
	return CanWeGo;
}

function AppIsBusy()
{
	//Function to check if there is any outstanding application activity in iPList and iPDetail
	var Val = eval("top.frames.iPNav.GetActionStatus()");
	if (Val == true)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function buildElement(dom, tag, attribs, attribVals, text)
{
  //Function to build dom element
	var e = dom.createElement(tag);
	for (var i=0; i<attribs.length;i++)
	{	
		e.setAttribute(attribs[i], attribVals[i]);
	}
	if (text!='') 
	{
		t = dom.createTextNode(text);
		e.appendChild(t);
	}
	return e;
}

function ClientActionStatusOK(bShowMsg)
{
  //EL 30-11-2000 checks the client action state to see if the system isn't in edit mode
  //			    returns false (and displays message) if in edit mode otherwise true.
	var elCAS = top.frames.iPNav.document.all.ClientActionStatus.value;
	if (elCAS == "EditMode" || elCAS == "SubEditMode")
	{
		if (bShowMsg)
		{
			var sMsg = "You must save or cancel the current changes before you can select a new item from the list.";
			ShowClientMessagesBox(sMsg, 'Error', 'Error in Selection', '', '', 'OK', '');  	
		}
		return false;
	}
	
	//IC 10/May/2001 - IR#54805(Beta) / IR#54755(Pilot) - Stop the user from making another menu selection whilst in NHA
	var elNHA = top.frames.iPNav.document.all.NewHireInProgress.value;
	if (elNHA == "YES")
	{
		if (bShowMsg)
		{
			var sMsg = "A new hire is in progress, please complete or cancel the assistant before making a new selection.";
			ShowClientMessagesBox(sMsg, 'Error', 'Error in Selection', '', '', 'OK', '');  	
		}
		return false;
	}
	//End 10/May/2001
	
	return true;
}

function LaunchContact()
{
  //Routine to Launch the Contact screen
	// get person id from the list frame
	var sFieldNames = top.frames.iPList.entitykeysnames.value;
	var sValues = top.frames.iPList.entitykeys.value;
	var lPos = GetItemPosition(sFieldNames.toUpperCase(), "PERSON_ID");
	
	if (lPos > 0)
	{
		var mywin = "window.showModalDialog('ipCntDet.asp?ID=P' + ExtractItem(sValues, lPos), '', 'dialogHeight:320px; dialogWidth:550px; center:yes; status:no; resizable:no; help:no')";
		eval(mywin);
	}
	else
	{
		lPos = GetItemPosition(sFieldNames.toUpperCase(), "EMPLOYEE_CODE");
		if (lPos > 0)
		{
			var mywin = "window.showModalDialog('ipCntDet.asp?ID=E' + ExtractItem(sValues, lPos), '', 'dialogHeight:320px; dialogWidth:550px; center:yes; status:no; resizable:no; help:no')";
			eval(mywin);
		}
	}
}

function LaunchLock(sDBTable)
{
  //Routine to Launch the Lock screen with parameters depending on the DB Table passed in
	var sParam1 = "";
	var sParam2 = "";
	var lPos = 0;
	var sAllParams = "";

	var sNames = top.frames.iPList.document.all.entitykeysnames.value;
	var sValues = top.frames.iPList.document.all.entitykeys.value;
	
	switch (sDBTable)
	{
		case "PERSON":
			lPos = GetItemPosition(sNames, "Person_ID");
			sParam1 = ExtractItem(sValues, lPos);
			break;

		case "EE_PAYROLL_PROFILE":
			lPos = GetItemPosition(sNames, "EE_payroll_code");
			sParam2 = ExtractItem(sValues, lPos)
				
		case "EE_STATUTORY":
			lPos = GetItemPosition(sNames, "Employee_code");
			sParam1 = ExtractItem(sValues, lPos)
			break;				

		case "PAY_GROUP":
			lPos = GetItemPosition(sNames, "Pay_group_code");
			sParam2 = ExtractItem(sValues, lPos)
								
		case "COMPANY":
			lPos = GetItemPosition(sNames, "Company_code");
			sParam1 = ExtractItem(sValues, lPos)
			break;
							
		case "ADP_CODE_SETUP":
			lPos = GetItemPosition(sNames, "ADP_code");
			sParam1 = ExtractItem(sValues, lPos)
			break;				
	}

	sAllParams = sDBTable + ";" + sParam1 + ";" + sParam2;

	var mywin = "window.showModalDialog('lockscreen.htm', '" + sAllParams + "','dialogHeight:350px; dialogWidth:450px; center:yes; status:no; resizable:no; help:no')";
	eval(mywin);
}

function ResetKeyRO(AllKeys, AllFields, AllControlTypes)
{
  //Routine to change the field state of all key fields to Read Only
	var lPos = 0;
	var sKey = '';
	var lType = 0;
	var i=0;

	for (i=0;i<AllKeys.length;i++)
	{
		// need to find out what control type this is
		sKey = AllKeys[i].toUpperCase();
		lPos = ExistsInArray(AllFields,sKey)
		lType = AllControlTypes[lPos];
		
		ChangeFieldState(eval("document.all." + sKey), CONTROL_READONLY, lType)
	}
}

function SpinCompanyLogo(bSpin)
{
  //Routine to spin the company logo
	if (bSpin)
	{
		if (top.frames.iPDetail.isPopUp == true)
		{
			var objOpener = top.frames.window.opener;
			//eval("objOpener.top.frames.iPLogo.document.all.companylogo.src='images/ADPSpin.gif'");
			
			// CN 01.01.2000 - Use new animated progress image
			eval("objOpener.top.frames.iPLogo.document.all.companylogo.src='images/progress.gif'");
		}
		else
		{
			//top.frames.iPLogo.document.all.companylogo.src='images/ADPSpin.gif';

			// CN 01.01.2000 - Use new animated progress image
			if (top.frames.iPLogo.document.all.companylogo)
			{
				top.frames.iPLogo.document.all.companylogo.src='images/progress.gif';
			}
		}
	}
	else
	{
		if (top.frames.iPDetail.isPopUp == true)
		{
			var objOpener = top.frames.window.opener;
			//eval("objOpener.top.frames.iPLogo.document.all.companylogo.src='images/ADPSpinStatic.gif'");

			// CN 01.01.2000 - Use new animated progress image
			eval("objOpener.top.frames.iPLogo.document.all.companylogo.src='images/progress_still.gif'");
		}
		else
		{
			//top.frames.iPLogo.document.all.companylogo.src='images/ADPSpinStatic.gif';

			// CN 01.01.2000 - Use new animated progress image
			top.frames.iPLogo.document.all.companylogo.src='images/progress_still.gif';
		}
	}
}
// </MISCELLANEOUS ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <LABEL ROUTINES>
function hide_label(label_name)
{
  //Routine to run through the entire DOM and set the inner Text to blank for all LABEL objects
	label_name = label_name.toUpperCase();		//convert the passed label text to all upper case
	
	for(var i=0; i<document.all.length; i++)
	{
		if(document.all[i].tagName == 'LABEL')
		{
			if(document.all[i].innerText.toUpperCase() == label_name)
			{
				document.all[i].innerText = '';
				break;
			}
		}			
	}
}
// </LABEL ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <MESSAGE ROUTINES>
function ShowClientMessagesBox(sMsg, sBoxTitle, sBoxDescription, sSubst, sParams, sButtons, sInputType)
{
  //OBSOLETE Function to show a client message box
	var sSubLFMsg = null; //RonaldF - added to correct line feed problems
	var sSubdMsg = null;

	//Replace line breaks in the message '%/%' with html line breaks '<BR>'
	sSubLFMsg = ReplaceString(sMsg, "%/%", "<BR>");
	
    //Then substitute the message parameters
	if (sSubst == '' || sParams == '')
	{
		sSubdMsg = sSubLFMsg;
	}
	else
	{
		sSubdMsg = SubstMessageParams(sSubLFMsg,sSubst,sParams);
	}

	if (sButtons == '')
	{
		sButtons='OK';
	}

	//var ErrorsWin = window.showModalDialog('messagedialog.asp?Title=' + sBoxTitle + '&TopMessage=' + sBoxDescription + '&Message=' + sSubdMsg + '&Buttons=' + sButtons,'','dialogHeight:210px; dialogWidth:350px; center:yes; status:no; resizable:no; help:no');
	var ErrorsWin = window.showModalDialog('messageinputdialog.htm', sBoxTitle + '|' + sBoxDescription + '|' + sSubdMsg + '|' + sButtons + '|' + sInputType,'dialogHeight:210px; dialogWidth:350px; center:yes; status:no; resizable:no; help:no');

	return ErrorsWin;
}

function SubstMessageParams(sMessage, sSubst, sParams)
{
  //Function that takes a Message and Substitutes Parameters into it
	var sFinalMessage='';
	var sCurSub=null;
	var lPo0s=0;
	var i=0;
	var cnt;

	cnt = CountItems(sParams);
	
	for (i=1;i<=cnt;i++)
	{
	
		sCurSub=ExtractItem(sParams,i);
		
		lPos = sMessage.indexOf(sSubst);
		
		if (lPos > -1)
		{		
			sFinalMessage = sFinalMessage + sMessage.substring(0,lPos);
			sFinalMessage = sFinalMessage + sCurSub;
			sMessage = sMessage.substring(lPos+2);		
		}
	}
	
	sFinalMessage = sFinalMessage + sMessage;

	return sFinalMessage;
}
// </MESSAGE ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <VALIDATION ROUTINES>
function IsInvalid_DescriptionValue(obj)
{
  //Function to determine if a description value is valid
  var ALLOWED = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%_-()[]';
  var MsgTxt = 'The <b>%%</b> character is not allowed.<BR>Description Fields are limited to a-z, A-Z, 0-9, Dollar, Percentage, Hyphen and Underscore characters only.'
                
  var Value = obj.value;
  var i=0;
  var ch;
  if (Value == '')
  {
    return false;
  }
  for (i=0; i<Value.length; i++)
  {
    ch = Value.substr(i, 1);
    if (InStr(ALLOWED, ch) == false)
    {
      switch(ch)
      {
        case "@":
          ch = "at"
          break;
        case "'":
          ch = "apostrophe"
          break;
        case "#":
          ch = "hash"
          break;
        case "&":
          ch = "ampersand"
          break;
        case "%":
          ch = "percent"
          break;
        case "@":
          ch = "at"
          break;
        case "+":
          ch = "plus"
          break;
        case ";":
          ch = "semi-colon"
          break;
        default:
          break;
      }
      ShowClientMessagesBox(MsgTxt, 'Validation Error', 'The following Validation Error has occurred.', '%%', ch, 'OK');
      obj.focus;
      return true;
    }
  }
  return false;
}

function IsInvalid_InputMaskValue(FieldValue, FieldMask)
{
  //Function to determine if a Value is allowed according to the Mask
  var ALLOW_9 = "0123456789";
  var ALLOW_X = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var ALLOW_Hyphen = "-";

	var chMask = '';
	var chValue = '';
	var i = 0;

	if (FieldValue != '' && FieldMask != '')
	{
		if (StrLen(FieldValue) != StrLen(FieldMask))
		{
			return true;
		}

		for (i=0; i<StrLen(FieldValue); i++)
		{
			chMask = Mid(FieldMask, i, 1);
			chValue = Mid(FieldValue, i, 1);
			switch (chMask)
			{
				case "9":
					if (InStr(ALLOW_9, chValue) == false)
					{
						return true;
					}
					break;
				case "X":
				case "x":
					if (InStr(ALLOW_X, chValue) == false)
					{
						return true;
					}
					break;
				case "@":
					if (InStr(ALLOW_9 + ALLOW_X, chValue) == false)
					{
						return true;
					}
					break;
				case "-":
					if (InStr(ALLOW_Hyphen, chValue) == false)
					{
						return true;
					}
					break;
			}
		}
	}
	return false;
}

function IsInvalid_KeyValue(obj, Caption)
{
  //Function to determine if a key value is valid
  var ALLOWED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-';
  var MsgTxt = 'Valid values for %% include  A-Z, 0-9, hyphens (-), periods (.), and underscores (_).'
  var Value = obj.value;
  var i=0;
  var ch;
  var tCaption = '';
  var oUndefined;
  if (Value == '')
  {
    return false;
  }
  if (Caption == '' || Caption == oUndefined)
  {
    tCaption = "this field";
  }
  else
  { 
    tCaption = "the field <b>" + ReplaceString(Caption, ":", "") + "</b>";
  }

  //SKE 25/6/01 Allow bank acc. no. to contain spaces
  switch(UCase(obj.id))
  {
    case "POSN_ID":             // POSN_ID is an exception
      ALLOWED = ALLOWED + '/';
      break;
    case "BANK_ACCOUNT_NO":
      ALLOWED = ALLOWED + ' ';
      break;
    default:
      break;
  }
  
  for (i=0; i<Value.length; i++)
  {
    ch = Value.substr(i, 1);
    if (InStr(ALLOWED, ch) == false)
    {
      switch(ch)
      {
        case " ":
          ch = "space"
          break;
        case "@":
          ch = "at"
          break;
        case "'":
          ch = "apostrophe"
          break;
        case "#":
          ch = "hash"
          break;
        case "&":
          ch = "ampersand"
          break;
        case "%":
          ch = "percent"
          break;
        case "@":
          ch = "at"
          break;
        case "+":
          ch = "plus"
          break;
        case ";":
          ch = "semi-colon"
          break;
        default:
          break;
      }
      ShowClientMessagesBox(MsgTxt, 'Validation Error', 'The following Validation Error has occurred.', '%%', tCaption + ";" + ch, 'OK');
      obj.focus;
      return true;
    }
  }
  return false;
}
// </VALIDATION ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <MANDATORY WINDOW ROUTINES>
function CheckMandatory(TheseFields, TheseCaptions)
{
  //Function to run through the Mandatory fields to see if any fields are left blank
  // IC 18/May/2000 - Checking on madatory fields on the calling form
  // Any fields left blank, will be returned as a semi-colon separated string
  var strMissingValue = '';
  var FieldsCount = TheseFields.length;
  var i = 0;

  for (i=0; i<FieldsCount; i++)
  {
    ThisObj = eval('document.all.' + TheseFields.slice(i,i+1));

    if ((ReplaceString(ThisObj.value, ' ', '') == '') || (ThisObj.value == 'hh:mm') || (ThisObj.value == 'dd/mm/yyyy') || (ThisObj.value == 'mm/dd/yyyy') || (ThisObj.value == '-1')) // IR 25430 & 25442
    {
      // The field caption is appended to the offending list as the user has not entered a value
      strMissingValue = AddItemToList(strMissingValue, TheseCaptions.slice(i,i+1), ";");
    }
  }

  return strMissingValue;
}

function CloseOpenWindows(strWindowList)
{
  //Function to show the "Close Open Windows" warning message box
  var iMsgCount = 1;
  var sMsgNo    = "";  
  var sMsgType  = "";
  var sMsgText  = TCMessageTableList(CLOSEOPENWINDOWS_HEADING, strWindowList);
  var iButtons  = tcOKCancel;
  var iDefaultButton = 1;  
  
  var ErrorsWin = TCMessageBox(mbCLOSEOPENWINDOWS, iMsgCount, sMsgNo, sMsgType, sMsgText, iButtons, iDefaultButton);
  return ErrorsWin;
}

function ShowMandatoryWindow(strMandatoryFieldList)
{
  //Function to Show the "Mandatory Window" warning message box
  var iMsgCount = 1;
  var sMsgNo    = "";  
  var sMsgType  = "";
  var sMsgText  = TCMessageTableList(MANDATORY_HEADING, strMandatoryFieldList);
  var iButtons  = tcOKOnly;
  var iDefaultButton = 1;  
  
  var ErrorsWin = TCMessageBox(mbMANDATORY, iMsgCount, sMsgNo, sMsgType, sMsgText, iButtons, iDefaultButton);
  return ErrorsWin;
}

function TCMessageTableRow(FieldName)
{
  //Function to generate the TR row for a TCMessageBox
  var s = "";
  s += "<TR>";
  s += " <TD ALIGN=CENTER VALIGN=MIDDLE STYLE='height:16px' CLASS=Required>";
  s += "  " + FieldName;
  s += " </TD>";
  s += "</TR>";  
  return s;
}

function TCMessageTableList(TableHeading, FieldNames)
{
  //Function to generate the TABLE for a TCMessageBox
  var i;
  var s = "";
  
  s += "<TABLE WIDTH=100% HEIGHT=100% BORDER=0 CELLPADDING=0 CELLSPACING=0 BGCOLOR=White>";
  s += " <TR>";
  s += "  <TD ALIGN=CENTER VALIGN=MIDDLE STYLE='font-size:9pt; font-weight:bold'>";
  s += "   " + TableHeading;
  s += "   <TABLE WIDTH=80% BORDER=0 CELLPADDING=0 CELLSPACING=1 BGCOLOR=White>";
  for (i=1; i<=CountItems(FieldNames, ";"); i++)
  {
    s += "    " + TCMessageTableRow(ExtractItem(FieldNames, i, ";"));
  }
  s += "   </TABLE>";
  s += "  </TD>";
  s += " </TR>";
  s += "</TABLE>";
  
  return s;
}
// </MANDATORY WINDOW ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <ERROR ROUTINES>
function CatchError(Routine, ErrorNumber, ErrorName, ErrorMessage)
{
  //Function to show the JavaScript error in a TCMessageBox
  var iMsgCount = 1;
  var sMsgNo = "";  
  var sMsgType = "?";
  var sMsgText = CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage);
  var iButtons = tcOKOnly;
  var iDefaultButton = 1;
  var sMsgParams = "";
  var sInputType = "";
  var sDialogInCentreOf = "";
  var bModelessDialog = false;
  var iMsgDlgHeight = 285;
  var iMsgDlgWidth = 550;

  //Fire off the system TCMessageBox
  var ret = TCMessageBox(mbSYSTEM, iMsgCount, sMsgNo, sMsgType, sMsgText, iButtons, iDefaultButton, sMsgParams, sInputType, sDialogInCentreOf, bModelessDialog, iMsgDlgHeight, iMsgDlgWidth);
}

function CatchMsg(Routine, ErrorNumber, ErrorName, ErrorMessage)
{
  //Function to generate the message for the JavaScript error
  var s;
  s = "<TABLE BORDER=0 WIDTH=100%>";
  s+= "<TR>";
  s+= "  <TD ALIGN=CENTER>";
  s+= "   <B>Dr Chicago</B> has detected the following error:<BR><BR>";
  s+= "  </TD>";
  s+= " </TR>";
  
  s+= "<TR>";
  s+= "  <TD>";
  s+= "    <TABLE BORDER=1 CELLSPACING=0 CELLPADDING=1 WIDTH=100%>";
  s+= "      <TR>";
  s+= "        <TD WIDTH=20% ALIGN=CENTER>";
  s+= "          <B>Routine</B>";
  s+= "        </TD>";
  s+= "        <TD WIDTH=80% ALIGN=LEFT>";
  s+= "          " + Routine;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "      <TR>";
  s+= "        <TD WIDTH=20% ALIGN=CENTER>";
  s+= "          <B>Number</B>";
  s+= "        </TD>";
  s+= "        <TD WIDTH=80% ALIGN=LEFT>";
  s+= "          " + ErrorNumber;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "      <TR>";
  s+= "        <TD WIDTH=20% ALIGN=CENTER>";
  s+= "           <B>Name</B>";
  s+= "        </TD>";
  s+= "        <TD WIDTH=80% ALIGN=LEFT>";
  s+= "          " + ErrorName;
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "      <TR>";
  s+= "        <TD WIDTH=20% ALIGN=CENTER>";
  s+= "          <B>Message</B>";
  s+= "        </TD>";
  s+= "        <TD WIDTH=80% ALIGN=LEFT>";
  s+= "          <INPUT type=text id=FV style='background-color:white' SIZE=56 value=\"" + ErrorMessage + "\">";
  s+= "        </TD>";
  s+= "      </TR>";

  s+= "    </TABLE>";
  s+= "  </TD>";
  s+= "</TR>";
  s+= "</TABLE>";
  
  return s;
}
// </ERROR ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <TC MESSAGE ROUTINES>
function FormatTCMessage(sMsgNo, sMsgType, sMsgText, bOuterTable)
{
  //Function to format a TCMessage
  var s = "";

  if ((bOuterTable == true))
  {
    s += "<table border=0 rules=none width=100% height=100% cellpadding=0 cellspacing=0 bgcolor=white bordercolor=white>";  
  }
    
  s += "  <tr width=100% height=100% valign=middle>";
  
  //If there is a message type, convert it to an image and place the message number beneath
  if (sMsgType != "")
  {
    s += "    <td width=20% align=center bgcolor=white>";
  
    //Set up the default values in case the Msg Type is not received
    var imgName = "MsgError.gif";
    var imgHeight = 32;
    var imgWidth = 32;
              
    switch (sMsgType)
    {
      case "R": //R=Runtime error
        imgName = "MsgRuntimeError.gif";
      break;
                  
      case "S": //S=System error
        imgName = "MsgSystemError.gif";
      break;
                
      case "E": //E=Error
        imgName = "MsgError.gif";
      break;
                
      case "O": //O=Success(OK)
        imgName = "MsgSuccess.gif";
      break;

      case "F": //F=Failure
        imgName = "MsgFailure.gif";
      break;

      case "W": //W=Warning
        imgName = "MsgWarning.gif";
      break;
                
      case "I": //I=Information
        imgName = "MsgInformation.gif";
      break;
                
      case "Q": //Q=Question
        imgName = "MsgQuestion.gif";
      break;
            
      case "?": //?=Unknown
        imgName = "MsgDr.gif";
        imgHeight = 110;
        imgWidth = 80;
      break;
    }
    s += "      <img src='images/" + imgName + "' width=" + imgWidth + " height=" + imgHeight + ">";
	      
    //Write the Message Number underneath the message image
    s += "      <BR>" + sMsgNo;
    s += "    </td>";

    //Output the message text
    s += "    <td width=80% align=Left valign=center bgcolor=white>";          
    s += "      " + sMsgText;
    s += "    </td>";
  }
  else
  {
    //Output the message text 
    s += "    <td width=100% align=Left valign=center bgcolor=white>";          
    s += "      " + sMsgText;
    s += "    </td>";
  }
  s += "  </tr>";
  
  if (bOuterTable == false)
  {    
    s += "  <tr>";
    s += "   <td width=100% height=2 colspan=2>";
    //s += "    <HR STYLE='height:0px; backgroundColor:white'>";
    s += "    <BR>";
    s += "   </td>";
    s += "  </tr>";    
  }
  else
  {
    s += "</table>";
  }
  return s;
}

function FormatTCMessageXML(TheXML, sMsgNoArray, sMsgTypeArray, sMsgTextArray, sMsgParamsArray)
{
  //Function to format an XML TCMessage
  //'TheXML' passed in will look something like this:
  // <MESSAGES>
  //  <MSG>
  //   <MSG_HELPID>0</MSG_HELPID>
  //   <MSG_NO>5000<MSG_NO>
  //   <MSG_PARAMS></MSG_PARAMS>
  //   <MSG_PROFILE>48</MSG_PROFILE>
  //   <MSG_REFNAME></MSG_REFNAME>
  //   <MSG_REFTYPE></MSG_REFTYPE>
  //   <MSG_TEXT>This is the warning message with parameters %%</MSG_TEXT>
  //   <MSG_TYPE>W</MSG_TYPE>
  //  </MSG>
  // </MESSAGES>
  
  var XML = new ActiveXObject("MSXML.DOMDocument");
  XML.loadXML(TheXML);
  var Base = XML.documentElement;

  var sMsgNo;
  var sMsgType;
  var sMsgText;
  var sMsgParams;
  var sMsgHelpID;
  var sMsgProfile;
  var sMsgRefName;
  var sMsgRefType;
  
  var iMsgCount = 0;
  var i;
  
  for (i=0; i<Base.childNodes.length; i++)
  {
    //Get hold of the parts that will be used
    sMsgNo      = GetNodeValue(Base.childNodes(i), "MSG_NO");
    sMsgType    = GetNodeValue(Base.childNodes(i), "MSG_TYPE");
    sMsgText    = GetNodeValue(Base.childNodes(i), "MSG_TEXT");
    sMsgParams  = GetNodeValue(Base.childNodes(i), "MSG_PARAMS");
    
    if (sMsgType == 'R')
    {
      //This is a runtime error message type so tag the Params on to the message text
      sMsgText   = sMsgText + "<BR><BR>" + sMsgParams;
      sMsgParams = "";
    }
    
    //Get hold of the parts that will not be used
    sMsgHelpID  = GetNodeValue(Base.childNodes(i), "MSG_HELPID");    
    sMsgProfile = GetNodeValue(Base.childNodes(i), "MSG_PROFILE");
    sMsgRefName = GetNodeValue(Base.childNodes(i), "MSG_REFNAME");
    sMsgRefType = GetNodeValue(Base.childNodes(i), "MSG_REFTYPE");
    
    //Increase the message counter now we have unwrapped the message
    iMsgCount++;
    
    //Now place these values into the arrays.
    sMsgNoArray[iMsgCount]     = sMsgNo;
    sMsgTypeArray[iMsgCount]   = sMsgType; 
    sMsgTextArray[iMsgCount]   = sMsgText;
    sMsgParamsArray[iMsgCount] = sMsgParams;
  }
  
  //And return the message count to the calling routine
  return iMsgCount;
}

function TCValidationBoxXML(ValidationFlag, XML)
{
  //Function to show a TCValidationBox given some XML
  //Declare the arrays required to hold the (potentially) multiple messages
  var sMsgNoArray = new Array();
  var sMsgTypeArray = new Array();
  var sMsgTextArray = new Array();
  var sMsgParamsArray = new Array();

  //Set up the overall validation values in array element 0 (assume 'Success' initially)
  sMsgNoArray[0]     = VALIDATION_SUCCESS;
  sMsgTypeArray[0]   = VALIDATION_SUCCESS_TYPE;
  sMsgTextArray[0]   = "";
  sMsgParamsArray[0] = "";

  if (ValidationFlag == false)
  {
    //Validation failure so alter the message number and type arrays
    sMsgNoArray[0]   = VALIDATION_FAILURE;
    sMsgTypeArray[0] = VALIDATION_FAILURE_TYPE;
  }  
  
  //Now unpack the XML passed in and format it in the message arrays
  var iMsgCount = FormatTCMessageXML(XML, sMsgNoArray, sMsgTypeArray, sMsgTextArray, sMsgParamsArray);
  
  //Now pass the message arrays to the validation box routine
  var ret = TCValidationBox(mbVALIDATION, sMsgNoArray, sMsgTypeArray, sMsgTextArray, tcOKOnly, 1, sMsgParamsArray);
  
  return ret;
}

function TCValidationBox(iTitleNo, sMsgNoArray, sMsgTypeArray, sMsgTextArray, iButtons, iDefaultButton, sMsgParamsArray)
{
  //Function to generate and show the TCValidationBox
  var bOuterTable = false;
  var s = "";
  var i;
  var sMsgText          = "";
  var sMsgParams        = "";
  var sInputType        = ""
  var sDialogInCentreOf = "";
  var bModelessDialog = true;
  
  if (sMsgNoArray.length == 2)
  {
    bOuterTable = true;
  }
  
  for (i=1; i<sMsgNoArray.length; i++)
  {
    //Replace all %/% with HTML line breaks <BR>
    s = ReplaceString(sMsgTextArray[i], "%/%", "<BR>");

    //Then substitute the message parameters (if there are any)
    if (sMsgParamsArray != null)
    {
      s = SubstMessageParams(s, "%%", sMsgParamsArray[i]);
    }
 
    sMsgText += FormatTCMessage(sMsgNoArray[i], sMsgTypeArray[i], s, bOuterTable);
  }

  if (bOuterTable == false)
  {
    var tablestart = "<table border=0 rules=none width=100% height=100% cellpadding=0 cellspacing=0 bgcolor=white bordercolor=white>";
    var tableend   = "</table>";
    sMsgText = tablestart + sMsgText + tableend;
  }

  var ret = TCMessageBox(iTitleNo, sMsgNoArray.length, sMsgNoArray[0], sMsgTypeArray[0], sMsgText, iButtons, iDefaultButton, sMsgParams, sInputType, sDialogInCentreOf, bModelessDialog);
  
  return ret;
}

function GetTCMessageBoxProperty(sPropertyName, iPropertyValue)
{
  //Function to return the title for the TCMessageBox given the PropertyName and Value
  var retProperty = "";
  
  switch (sPropertyName)
  {
    case "TITLE":
      switch (iPropertyValue)
      {
        case mbSYSTEM:
          //System message box
          retProperty = MESSAGE_BOX_SYSTEM;
        break;
          
        case mbVALIDATION:
          //Validation report
          retProperty = MESSAGE_BOX_VALIDATION;
        break;
          
        case mbMANDATORY:
          //Mandatory fields
          retProperty = MESSAGE_BOX_MANDATORY;
        break;

        case mbCLOSEOPENWINDOWS:
          //Close open windows
          retProperty = MESSAGE_BOX_CLOSEOPENWINDOWS;
        break;

        default:
          //Output the default title
          retProperty = MESSAGE_BOX_TITLE_DEFAULT;
        break;
      }
      
      //Pad the title so "-- Web Page Dialog" is replaced with "..."
      var l = retProperty.length;
      while (l < MESSAGE_BOX_TITLE_PAD_LENGTH)
      {
        retProperty = retProperty + "&nbsp;";
        l++;
      }
    break;    
  }
  
  return retProperty;
}

function TCMessageBox(iTitleNo, iMsgCount, sMsgNo, sMsgType, sMsgText, iButtons, iDefaultButton, sMsgParams, sInputType, sDialogInCentreOf, bModelessDialog, iMsgDlgHeight, iMsgDlgWidth, arrCustomButtons, arrCustomConsts)
{
  //Function to output the TCMessageBox
  //First of all, sort out any missing parameters and set up defaults
  if (iTitleNo == ""){iTitleNo = mbSYSTEM}
  if (iMsgCount == ""){iMsgCount = 1}

  //If no message number, use space instead, otherwise convert to a string (add "")
  if ((sMsgNo == "") || (sMsgNo == 0)){sMsgNo = ""}
  sMsgNo = sMsgNo + "";
  
  //If no message type is specified, assume the default
  if (sMsgType == ""){sMsgType = MESSAGE_BOX_TYPE_DEFAULT};
  
  //If no buttons or default button provided, assume the default
  if (isNaN(iButtons)){iButtons = MESSAGE_BOX_BUTTON_DEFAULT}
  if (isNaN(iDefaultButton)){iDefaultButton = 1}

  //If no input type is specified, assume none
  if (sInputType == null){sInputType = ""}

  //If no dialog in centre of is specified, assume to be in the center of the parent
  if ((sDialogInCentreOf == null) || (sDialogInCentreOf == "")){sDialogInCentreOf = "PARENT"}
  
  //If the modeless dialog flag is not passed in, set to false
  if (bModelessDialog == null){bModelessDialog = false;}
  
  //******************************************************************  
  //Declare the URL to be used to fire off the TotalChoice message box
  var sURL = MESSAGE_BOX_URL;

  //Create an array from the message parameters passed in
  var MsgArray = new Array();
  
  //Replace all %/% with HTML line breaks <BR>
  sMsgText = ReplaceString(sMsgText, "%/%", "<BR>");

  //Then substitute the message parameters (if there are any)
  if (sMsgParams != null)
  {
    sMsgText = SubstMessageParams(sMsgText, "%%", sMsgParams);
  }
  
  //Convert the title enumeration into the title string
  var sTitle = GetTCMessageBoxProperty("TITLE", iTitleNo);
  
  //Format the TCMessage (if there is only one message)
  if (iMsgCount == 1)
  {
    sMsgText = FormatTCMessage("", "", sMsgText, true);
  }
  
  //Construct the message array from the values set up
  MsgArray = [sTitle, iMsgCount, sMsgNo, sMsgType, sMsgText, iButtons, iDefaultButton, sInputType, arrCustomButtons, arrCustomConsts];
  
  //Set up the default dialog position to be in the center of the parent
  var dlgPosition = "PARENT";
  
  //Use the dialog in centre of value if it has been passed in
  if (sDialogInCentreOf != null) {dlgPosition = sDialogInCentreOf;}

  //Set up the default dimensions for the dialog box
  var dlgHeight = MESSAGE_BOX_HEIGHT;
  var dlgWidth  = MESSAGE_BOX_WIDTH;
  
  //Use the (optional) dialog box dimensions if they have been passed in
  if (iMsgDlgHeight != null) {dlgHeight = iMsgDlgHeight;}
  if (iMsgDlgWidth  != null) {dlgWidth  = iMsgDlgWidth;}

  //Now set up the dialog features (dimensions + options)
  var sDimensions, sOptions, sFeatures;
  sDimensions = "dialogHeight:" + dlgHeight + "px; dialogWidth:" + dlgWidth + "px;";   

  switch (sDialogInCentreOf)
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
  
  //Finally open up the message box (as a modal/modeless dialog)
  if (bModelessDialog == false)
  {
    var ret = window.showModalDialog(sURL, MsgArray, sFeatures);
  }
  else
  {
    var ret = window.showModelessDialog(sURL, MsgArray, sFeatures);
  }
  
  //And pass the return value back to the calling routine
  return ret;
}

function PaintMessage(iMsgNo, iMsgCount, sMsgType, sMsgText, iButtons, iDefaultButton, sMsgParams, sDialogInCentreOf, iMsgDlgHeight, iMsgDlgWidth)
{
  //Function to paint a message in a TCMessageBox
  //Declare the URL to be used to fire off the message box
  var sURL = "ErrorBox.htm";

  //Declare a message array
  var MsgArray = new Array();

  //Substitute the message parameters (if there are any)
  if (sMsgParams != null)
  {
    sMsgText = SubstMessageParams(sMsgText, "%%", sMsgParams);
  }
  //Replace all %/% with HTML line breaks
  sMsgText = ReplaceString(sMsgText, "%/%", "<BR>");
  
  //And construct the message array from the parameters passed in
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
  var ret = window.showModalDialog(sURL, MsgArray, sFeatures);
  
  //And pass the return value back to the calling routine
  return ret;
}
// </TC MESSAGE ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <ASSISTANT ROUTINES>
function LoadCalendar(TheDate, TheFormat, TheTitle)
{
  //Function to load up the calendar picker control
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
  var sURL = "Calendar.asp?Title=" + TheTitle;
  
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

  //Return the selected date or blank if the user clicked on the Cancel button
  var retButton = ExtractItem(ret, 1);
  var retDate = ExtractItem(ret, 2);
  if (retButton == "%CANCEL%" && TheDate == "")
  {
    ret = "";
  }
  else
  {
    ret = retDate;
  }
  return ret;
}

function LoadAssistant(sWindowType, sAssistantName, sTitle, sKeyNames, sKeyValues, iHeight, iWidth, iTop, iLeft, bRefreshFlag, vArguments, iPageNumber)
{
  //Function to load an Assistant
  if ((iPageNumber == null) || (iPageNumber == ""))
  {
		// The normal entry point for an assistant is page 0.  However, it is possible to call a (previously initialised) assistant at any page.
		iPageNumber = 0;
	}
	
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
  var sKV = "&KeyValues=" + sWindowType + ";" + iHeight + ";" + iWidth + ";" + iTop + ";" + iLeft + ";" + escape(sKeyValues);
  var sPN = "&PageNumber=" + iPageNumber;
  var sURL = sFN + sAN + sTI + sKN + sKV + sPN;
  
  switch (sWindowType)
  {
    case "MODAL":
      //We are doing a Window.showModalDialog
      sDimensions = "dialogHeight:" + iHeight + "px; dialogWidth:" + iWidth + "px; dialogTop:" + iTop + "px; dialogLeft:" + iLeft + "px;"
      sOptions    = "center:yes; status:no; resizable:no; help:no";
      sFeatures   = sDimensions + " " + sOptions;
      var ret = window.showModalDialog(sURL, vArguments, sFeatures);
	var oUndefined;

	if (ret == oUndefined)
	{
		return 0;  // put default in if no value
	}

      if (ret == -1)
      {
        //System has timed out so redirect the parent window to the endsession page
        window.parent.location = 'System/endsession.asp';
      }
      else
      {
        //Only do the refresh if the user clicked on the Next (Finish) button
        if ((ret == 6) && (bRefreshFlag == true))
        {
          //Call the reload function on the ipDetail frame to refresh the page
					if (ControlExists('txtNewHire', 'iPList'))	// Cannot navigate from the pick list within NHA
					{
						top.frames.iPDetail.location.reload(true);
					}
					else
					{
						fmCallNavigateFromList();
					}
        }
        //Only do the refresh if the user clicked on the Next (Finish) button
        if ((ret == 'ReloadList') && (bRefreshFlag == true))
        {
          //Call the reload function on the ipDetail frame to refresh the page
          fmCallReloadList(fmGenGetVar(FRAME_LIST, 'curlistid'), true, true, false, true)
        }
        //Only do the refresh if the user clicked on the Next (Finish) button
        if ((ret == 'ReloadListNoAction') && (bRefreshFlag == true))
        {
          top.frames.iPList.bActionListSelection = false;
          //Call the reload function on the ipDetail frame to refresh the page
          fmCallReloadList(fmGenGetVar(FRAME_LIST, 'curlistid'), true, true, false, true)
        }
      }
    break;

    default:
      //Default case is to do a Window.open
      sDimensions = "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft;
      sOptions    = "status=no, resizable=no, toolbar=no, menubar=no, location=no, titlebar=no";
      sFeatures   = sDimensions + " " + sOptions;
      var ret = window.open(sURL, sAssistantName, sFeatures);
    break;
  }

  return ret;
}
// </ASSISTANT ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <ARRAY COPY ROUTINES>
Array.prototype.CopyArray=array_copyarray;
function array_copyarray(inArray)
{
  //copies the contents of inArray (a simple array) into itself.
  //ie var x= new Array();
  //x.CopyArray(y)   where y=an array object
	var i;
	for (i=0;i<inArray.length;i++)
	{
		this[i]=inArray[i];	
	}
}

Array.prototype.CopyComboArray=array_copycomboarray;
function array_copycomboarray(cmbCopyFrom, inArray)
{
  //copies the contents of a combo box array into itself.
  //ie var combo.FieldNames = new Array();
  //combo.FieldNames.CopyComboArray(cmbCopyFrom,"FieldNames")
  //where cmbCopyFrom is combo object;
  //inArray is a string defining the array required.
	var i;
	for (i=0;i<cmbCopyFrom[inArray].length;i++)
	{
		this[i]=cmbCopyFrom[inArray][i];
	}
}
// </ARRAY COPY ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <XML ROUTINES>
function dsoEOF(dsoID)
{
	if(dsoID != '')
	{
		// Error trapping in case the XML object fails to instantiate
		try
		{
			var XML = new ActiveXObject("MSXML.DOMDocument");
			eval('XML.loadXML(Trim(document.all.' + dsoID + '.innerHTML))');

			var Base = XML.documentElement;
			if(Base.childNodes.length == 1 && Base.firstChild.text == '')
			{
				return true;
			}

			return false;
		}
		catch(error)
		{
			return true;
		}
	}
	return true;
}

function FormatXMLString(str)
{
  //Function to replace & with ~amp, < with ~lt, < with ~gt, ' with ~quot
	var tStr = str;
	tStr = ReplaceString(tStr, "&", "~amp;");
	tStr = ReplaceString(tStr, "<", "~lt;");
	tStr = ReplaceString(tStr, ">", "~gt;");
	tStr = ReplaceString(tStr, "'", "~quot;");
	return tStr;
}

function UnFormatXMLString(str)
{
  //Function to replace ~amp with &, ~lt with <, ~gt with <, ~quot with '
	var tStr = str;
	tStr = ReplaceString(tStr, "~amp;", "&");
	tStr = ReplaceString(tStr, "~quot;", "'");
	tStr = ReplaceString(tStr, "~gt;", ">");
	tStr = ReplaceString(tStr, "~lt;", "<");
	return tStr;
}
// </XML ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <PAGE ROUTINES>
function locPopulatePage(RowToDisplay)
{
  //Routine to locate the Row To Display on the Page being Populated
	var Colcnt;
	var Obj;
	var x;
	var DataValue;
	var oUndefined;
	
	if (PageGrid.FilterCount < PageGrid.RowCount)
	{
		for (Colcnt = 0; Colcnt < Page_Fields.length; Colcnt++)
		{
			if (ControlExists(Page_Fields[Colcnt]))
			{

				Obj = eval('document.all.' + Page_Fields[Colcnt]);

				if (RowToDisplay ==	-1)
				{
					if (Page_NewMode)
					{
						DataValue = Page_Data[0][Colcnt];
					}
					else
					{
						DataValue= Page_Defaults[Colcnt];
					}
				}
				else
				{
					if (RowToDisplay > Page_Data.length)
					{
						DataValue = "";
					}
					else
					{
						if (Obj.DECIMALS == oUndefined)
						{
							DataValue = Page_Data[RowToDisplay-1][Colcnt];
						}
						else
						{
							DataValue = RoundValue(Page_Data[RowToDisplay-1][Colcnt],Obj.DECIMALS);
						}
					}
				}
				
				SetFieldValue(Obj,DataValue);
						
				if (Page_Parents[Colcnt] == 1)
				{
					eval(Page_Fields[Colcnt] + '_controlChange()');
				}		
			}
		}
		//Page_onCurrent(RowToDisplay);

		// get list of current old values
		document.all.PageOldFieldValues.value = GetFieldValueList(document.all.PageSubmitFields.value);
	
		UpdateScrollBarPosition('PageGrid', RowToDisplay);
	}	
}
// </PAGE ROUTINES>
//***************************************************************************************

//***************************************************************************************
// <HELP ROUTINES>
function ShowTCSHelp(sHelpURL, sPageID)
{
  try
  {
    var mywin = window.open(sHelpURL + '/help.asp?context=' + sPageID, 'Help', 'status=no, resizable=yes, left=0, top=0,width=510, height=380')
    return mywin;
  }
  catch (error)
  { 
    CatchError('ShowHelp(sHelpURL=' + sHelpURL + ', PageID=' + PageID + ')', error.number, error.name, error.message);
  }
}
// </HELP ROUTINES>
//***************************************************************************************
