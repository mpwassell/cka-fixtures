// © Copyright 2000-2001 Nick Armitage

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function MouseClick(href, FrameName)
//  function RulesExpandSection(objImage, objSpan)
////****************************************************************************
//****************************************************************************
function RulesExpandSection(objImage, objSpan){ try
 {
  if (objImage.STATE == "+")
  {
    objImage.STATE = "-";
    objImage.src = "images/minus.bmp";
    objSpan.style.display = "";
  }
  else
  {
    objImage.STATE = "+";
    objImage.src = "images/plus.bmp";
    objSpan.style.display = "none";
  }
 }
 catch (error)
 {
   CatchError('RulesExpandSection(objImage=+, objSpan=+)', error.number, error.name, error.message);
 }
}
//****************************************************************************
function MouseClick(href, FrameName)
{
 try
 {
  var obj = eval('window.parent.frames.' + FrameName);
  if (obj.location.href.indexOf(href,0) == -1)
  {
    obj.location.href = href;
  }
 }
 catch (error)
 {
   CatchError('MouseClick(href=' + href + ', FrameName=' + FrameName + ')', error.number, error.name, error.message);
 }
}