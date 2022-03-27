// © Copyright 2002+ Nick Armitage

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function ChangeHRef(href, frmName)
//  function CountItems(Source, Delim)
//  function ExtractItem(Source, Index, Delim)
//  function GetBrowserVersion()
//  function GetFramePtr(frmName)
//  function OpenWindow(sURL, sMode, sWindow, sFrameName, vArguments)
//  function MouseClick(btnName, href, frmName, frmNameButton, classNameOn, classNameOff)
//  function MouseOut(btnName, className)
//  function MouseOver(btnName, className)
//
//****************************************************************************

//****************************************************************************
function GetBrowserVersion()
{
 try
 {
  //navigator.appVersion contains something like this -> '4.0 (compatible; MSIE m.nn; Windows NT)'
  //so take everything between the semicolons and use the m.nn version information contained therein
  var strBrowserVersion = ExtractItem(window.navigator.appVersion, 2);
  return strBrowserVersion.slice(6);
 }
 catch (error)
 {
   CatchError('GetBrowserVersion()', error.number, error.name, error.message);
 }
}

//****************************************************************************

//Define the WINDOW and MODE constants used for opening new windows
var MODE_FULLSCREEN = 1;
var MODE_FRAME      = 2;
var WINDOW_OPEN     = 1;
var WINDOW_MODAL    = 2;
var WINDOW_HREF     = 3;

function OpenWindow(sURL, sMode, sWindow, sFrameName, vArguments)
{
 try
 {
  //If no URL passed in then leave now
  if (sURL == "")
  {
    return;
  }

  //Assume a default of FULLSCREEN mode
  if (sMode == null)
  {
    sMode = MODE_FULLSCREEN;
  }

  //Assume a default of OPEN window
  if (sWindow == null)
  {
    sWindow = WINDOW_OPEN;
  }

  //Check if the user wants to override the defaults
  //Is the user pressing the ALT key
  if (EventKeyState(KEY_ALT) == true)
  {
    //They are so set Window to OPEN
    sWindow = WINDOW_OPEN;
  }
    
  //Is the user pressing the CTRL key
  if (EventKeyState(KEY_CTRL) == true)
  {
    //They are so set Window to MODAL
    sWindow = WINDOW_MODAL;
  }

  //Is the user pressing the SHIFT key
  if (EventKeyState(KEY_SHIFT) == true)
  {
    //They are so set Mode to FULL SCREEN (only effective if sWindow - OPEN or MODAL)
    sMode = MODE_FULLSCREEN;
  }

  //Check if browser is capable of showing a Modal Dialog window
  if ((sWindow = WINDOW_MODAL) && (!window.showModalDialog))
  {
    //It isn't capable so force open window
    sWindow = WINDOW_OPEN;
  }
  
  //Now set up the dialog dimensions
  var aH = window.screen.availHeight;
  var aW = window.screen.availWidth;
  
  switch (sMode)
  {
    //Opening a window using the full screen so set the Top and Left values to 0
    case MODE_FULLSCREEN:
      var sT = 0;
      var sL = 0;
    break;
    
    //Opening a window inside the current frame so set the Top and Left values using the screen values
    case MODE_FRAME:
      //Try to get hold of the specified frame
      var obj = eval("window.parent.frames['" + sFrameName + "']");
      
      if (obj)
      {
        //Got the frame so access these screen values
        var sT = obj.screenTop;
        var sL = obj.screenLeft;
      }
      else
      {
        //Could not access the frame so use the window screen values
        var sT = window.screenTop;
        var sL = window.screenLeft;      
      }
    break;
  }
    
  //Calculate the Height, Width, Top and Left values for this window      
  var iHeight = (aH - sT);
  var iWidth = (aW - sL);
  var iTop = sT;
  var iLeft = sL;

  //Get the browser version (in form "m.nn") and split into major and minor revision numbers
  var BrowserVersion = GetBrowserVersion();
  var BrowserVersionMajor = BrowserVersion.slice(0, 1);
  var BrowserVersionMinor = BrowserVersion.slice(2);
  
  switch (BrowserVersionMajor)
  {
    case "4":
      //IE4 so we need to open the window normally regardless
      sWindow = WINDOW_OPEN;      
    break;
  }
 
  //And finally open up the window
  switch (sWindow)
  {
    case WINDOW_OPEN:
      //Opening the window as a normal window
      //Adjust the Height and Width parameters as there is a border and a title bar to consider
      iHeight = parseInt(iHeight, 10) - 37;
      iWidth = parseInt(iWidth, 10) - 10;      

      sDimensions = "height=" + iHeight + ", width=" + iWidth + ", top=" + iTop + ", left=" + iLeft;
      sOptions    = "status=no, resizable=yes, toolbar=no, menubar=no, location=no, titlebar=no, scrollbars=yes";
      sFeatures   = sDimensions + " " + sOptions;

      var ret = window.open(sURL, "", sFeatures);
    break;

    case WINDOW_MODAL:
      //We are opening the window as a modal dialog
      sDimensions = "dialogHeight:" + iHeight + "px; dialogWidth:" + iWidth + "px; dialogTop:" + iTop + "px; dialogLeft:" + iLeft + "px;"
      sOptions    = "center:yes; status:no; resizable:no; help:no; scroll:yes";
      sFeatures   = sDimensions + " " + sOptions;

      var ret = window.showModalDialog(sURL, vArguments, sFeatures);
    break;
    
    case WINDOW_HREF:
      //We are reusing the specified frame in the current window and simply changing the HRef
      var ret = ChangeHRef(sURL, sFrameName);
    break;
  }
  
  //And return ret to the calling routine
  return ret;
 }
 catch (error)
 {
   CatchError('OpenWindow(sURL=' + sURL + ', sMode=' + sMode + ', sWindow=' + sWindow + ', sFrameName=' + sFrameName + ', vArguments=' + vArguments + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function GetFramePtr(frmName)
{
 try
 {
  //Try to get hold of the specified frame
  var obj = null;
  for (var i = 0; i<window.parent.frames.length; i++)
  {
    //Get hold of the ith frame
    obj = window.parent.frames[i];
    
    if (obj.name == frmName)
    {
      //We've found the frame object so return to the caller
      return obj;
    }
    
    var l = obj.length;
    for (var j=0; j<l; j++)
    {
      //Get hold of the jth frame within the ith frame
      obj = window.parent.frames[i][j];
      
      if (obj.name == frmName)
      {
        //We've found the frame object so return to the caller
        return obj;
      }
    }
  }
 }
 catch (error)
 {
   CatchError('GetFramePtr(frmName=' + frmName + ')', error.number, error.name, error.message);
 }  
}

//****************************************************************************
function ChangeHRef(href, frmName)
{
 try
 {
  var ret = false;
  
  if (frmName == null)
  {
    //No frame name specified so assume the default (the MAIN frame)
    frmName = "MAIN";
  }
  
  //Try to get hold of the specified frame
  var obj = GetFramePtr(frmName)
  
  if (obj != null)
  {
    //Got the frame object so let's check if we are currently showing the specified href
    if (obj.location.href.indexOf(href,0) == -1)
    {
      //We're not so move to the specified href and return true to the caller
      obj.location.href = href;      
      ret = true;
    }
  }
  return ret;
 }
 catch (error)
 {
   CatchError('ChangeHRef(href=' + href + ', frmName=' + frmName + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function MouseClick(btnName, href, frmName, frmNameButton, classNameOn, classNameOff)
{
 try
 {
  //btnName is the name of the button you are clicking on
  //href is the name of the htm file you wish to load when this button is clicked
  //frmName is the name of the frame into which you are loading the htm file
  //frmNameButton is the name of the frame where the buttons are located
  
  //example usage:
  //  OnClick="MouseClick('btnResults', 'ResultsFrame.htm', 'MAIN', 'MENU')

  if (frmName == null)
  {
    //No frame name specified so assume the default (the MAIN frame)
    frmName = "MAIN";
  }
  
  //First of all change the href for the specified frame
  if (ChangeHRef(href, frmName) == false)
  {
    //Failed to do this so return now
    return;
  }
  
  if (frmNameButton == null)
  {
    //No button frame name specified so assume the default (the MENU frame)
    frmNameButton = "MENU";
  }
  
  //Set up the string holding the location of the button
  var btnObj = "window.parent.frames." + frmNameButton + ".document.all.";
  
  //And get the value of the Current Button from the button frame
  var TheCurrentButton = eval("window.parent.frames." + frmNameButton + ".CurrentButton");
  
  var obj;
  var cName = IIf(classNameOff == null, "TigerButtonsOff", classNameOff);
  if ((TheCurrentButton != "") && (TheCurrentButton != btnName))
  {
    //Deselect the current button 
    //obj = eval(btnObj + TheCurrentButton);
    obj = document.getElementById(btnObj + TheCurrentButton);
    if (obj != null)
    {
      obj.className = cName;
    }
  }
  
  //Update the Current Button to the new button
  TheCurrentButton = btnName;
  
  //And select the new button
  //obj = eval(btnObj + TheCurrentButton);
  obj = document.getElementById(btnObj + TheCurrentButton);
  cName = IIf(classNameOn == null, "TigerButtonsOn", classNameOn);
  if (obj != null)
  {
    obj.className = cName;
  }

  //Update the value of the Current Button on the button frame
  obj = eval("window.parent.frames." + frmNameButton);
  if (obj != null)
  {
    obj.CurrentButton = TheCurrentButton;
  }
  
  //Only set a cookie when we have clicked on a button in the MAIN frame
  if (frmName == 'MAIN')
  {
    href = SetCookie('href', href, GetExpiryDate(30));
    btnName = SetCookie('btnName', btnName, GetExpiryDate(30));
  }
 }
 catch (error)
 {
   CatchError('MouseClick(btnName=' + btnName + ', href=' + href + ', frmName=' + frmName + ', frmNameButton=' + frmNameButton + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function MouseOver(btnName, className)
{
 try
 {
  //var obj = eval('document.all.' + btnName);
  var obj = document.getElementById(btnName);
  var cName = IIf(className == null, "TigerButtons", className);

  if (CurrentButton != btnName)
  {			
    obj.className = cName;
  }
 }
 catch (error)
 {
   CatchError('MouseOver(btnName=' + btnName + ', className=' + className + ')', error.number, error.name, error.message);
 }
}
    
//****************************************************************************
function MouseOut(btnName, className)
{
 try
 {
  //var obj = eval('document.all.' + btnName);
  var obj = document.getElementById(btnName);
  var cName = IIf(className == null, "TigerButtonsOff", className);
  
  if (CurrentButton != btnName)
  {
    obj.className = cName;
  }
 }
 catch (error)
 {
   CatchError('MouseOut(btnName=' + btnName + ', className=' + className + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function CountItems(Source, Delim)
{
 try
 {
  // Routine to Count Items in a delimited list
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
 catch (error)
 {
   CatchError('CountItems(Source=' + Source + ', Delim=' + Delim + ')', error.number, error.name, error.message);
 }
}

//****************************************************************************
function ExtractItem(Source, Index, Delim)
{
 try
 {
  //Routine to Extract Items from a delimited list
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
 catch (error)
 {
   CatchError('ExtractItem(Source=' + Source + ', Index=' + Index + ', Delim=' + Delim + ')', error.number, error.name, error.message);
 }
}