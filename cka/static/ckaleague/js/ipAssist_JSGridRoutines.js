// © Copyright 1999-2000 Business Management Software Limited, All rights reserved.

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function JSGrid(GridName)
//  function _Initialise()
//  function _Paint()
//    function __PaintGridOuter(obj, Mode)
//    function __PaintGridHeader(obj)
//    function __PaintGridMain(obj, Mode)
//    function __PaintGridRow(obj, RowNumber)
//    function __PaintGridRowFormat(obj, Row, Col)
//  function _AddCol(ColField, ColCaption, ColWidth, ColType, ColFormat, ColExtra, ColAlign,  ColAlignHeader)
//  function _AddColKeys(Data)
//  function _AddRow(Key, Selected, Data)
//  function _DeleteRow(RowNumber, Repaint)
//  function __SetRowClass(obj, RowNumber)
//  function __BtnInteraction()
//  function _SelectAllRows(RowSelected)
//  function _GetColumnNumber(ColField)
//  function __GetRowNumber(element)
//  function _OnGridClick()
//  function _OnGridMouseEvent(Event)
//  function _SelectedRowCount()
//  function _DeletedRowCount()
//  function _Cell(Row, Col, Value)
//  function _GetFieldData(Mode)
//
//****************************************************************************

var SELROW_BG_COLOR = "#ccccff";
var ROW_BG_COLOR    = "#ffffff";

function JSGrid(GridName)
{
 try
 {
  //Define the Grid Properties
  this.GridName             = GridName;
  this.ID                   = "tab" + GridName;
  this.Painted              = false;
  this.ColCount             = 0;
  this.RowCount             = 0;
  this.CurrentRow           = 0;
  
  //Add arrays for the Columns and Rows of the Grid
  this.ColFields            = new Array();
  this.ColKeyFields         = new Array();
  this.ColCaptions          = new Array();
  this.ColWidths            = new Array();
  this.ColTypes             = new Array();
  this.ColFormats           = new Array();
  this.ColExtras            = new Array();
  this.ColAligns            = new Array();
  this.ColAlignHeaders      = new Array();  
  this.Rows                 = new Array();
  this.RowKeys              = new Array();
  this.RowSelected          = new Array();
  this.RowDeleted           = new Array();
  
  //Add the grid, table and row properties
  this.Grid                 = new PropertyGrid();
  this.Table                = new PropertyTable();
  this.Row                  = new PropertyRow();  

  //Add the Events property array
  this.Events               = new PropertyArray();
  
  //Define the Public Methods available to this class
  this.Paint                = _Paint;
  this.AddCol               = _AddCol;
  this.AddColKeys           = _AddColKeys;
  this.AddRow               = _AddRow;
  this.DeleteRow            = _DeleteRow;
  this.SelectAllRows        = _SelectAllRows;
  this.GetColumnNumber      = _GetColumnNumber;
  this.SelectedRowCount     = _SelectedRowCount;
  this.DeletedRowCount      = _DeletedRowCount;
  this.Cell                 = _Cell;
  this.GetFieldData         = _GetFieldData;
     
  //Define the Public Event Handler Methods
  this.OnGridClick          = _OnGridClick;
  this.OnGridMouseEvent     = _OnGridMouseEvent;
  
  //Define the Private methods (actually public but '_' used to denote private method)
  this._Initialise          = _Initialise;
  
  //Define the Helper methods (again public but '__' used to denote helper method)
  this.__PaintGridOuter     = __PaintGridOuter;
  this.__PaintGridHeader    = __PaintGridHeader;
  this.__PaintGridMain      = __PaintGridMain;
  this.__PaintGridRow       = __PaintGridRow;
  this.__PaintGridRowFormat = __PaintGridRowFormat;
  this.__SetRowClass        = __SetRowClass;
  this.__BtnInteraction     = __BtnInteraction;
  this.__GetRowNumber       = __GetRowNumber;
  
  //Initialise the grid with default values using the private method
  this._Initialise();
 }
 catch (error)
 {
  CatchError('JSGrid(GridName=' + GridName + ')', error.number, error.name, error.message);
 }
}

function _Initialise()
{
 try
 { 
  //Set up the default grid event handlers
  this.Events.Set("OnClick",     "if (PageBusy()){return}" + this.GridName + ".OnGridClick()");
  this.Events.Set("OnMouseOver", "if (PageBusy()){return}" + this.GridName +  ".OnGridMouseEvent('over')");
  this.Events.Set("OnMouseOut",  "if (PageBusy()){return}" + this.GridName +  ".OnGridMouseEvent('out')");  
 }
 catch (error)
 {
  CatchError('_Initialise()', error.number, error.name, error.message);
 }
}

function _Paint()
{
// try
// {
  //Build up the HTML using the PaintGrid "helper" functions ('__' denotes "helper" function)
  var GridOuterBegin = __PaintGridOuter(this, "BEGIN");
  var GridHeader     = __PaintGridHeader(this);
  var GridMainBegin  = __PaintGridMain(this, "BEGIN");
  var GridMainEnd    = __PaintGridMain(this, "END");
  var GridOuterEnd   = __PaintGridOuter(this, "END");
  
  if (this.Painted == false)
  {
    //This grid has not yet been painted on the page so write to the document with a DIV around it
    document.write("<DIV ID=" + this.GridName + ">");
    document.write(GridOuterBegin);
    document.write(GridHeader);
    document.write(GridMainBegin);
    document.write(GridMainEnd);
    document.write(GridOuterEnd);
    document.write("</DIV>");

    //And set the Painted flag to true
    this.Painted = true;	
  }  
  else
  {
    //This grid has been painted on the page so get hold of it and update its innerHTML
    //obj = eval("document.all." + this.GridName);
    obj = document.getElementById(this.GridName);
    obj.innerHTML = GridOuterBegin + GridHeader + GridMainBegin + GridMainEnd + GridOuterEnd;
  }
// }
// catch (error)
// {
//  CatchError('_Paint()', error.number, error.name, error.message);
// }
}

function __PaintGridOuter(obj, Mode)
{
 try
 {
  //This is a HELPER function so "this" needs to be passed in as "obj"
  var s = "";
  
  if (Mode == "BEGIN")
  {
    var GridTitle      = obj.Grid.Title;
    var GridTitleAlign = obj.Grid.TitleAlign;
    var TableBorder    = obj.Table.Border;
    var TableAlign     = obj.Table.Align;
    
    s += "<DIV>";    
    if (GridTitle != "")
    {
      s += " <DIV align=" + GridTitleAlign + ">";
      s += "  " + GridTitle;
      s += " </DIV>";
    }
    
    s += " <TABLE border=" + TableBorder + " align=" + TableAlign + ">";
    s += "  <TR>";
    s += "   <TD align=LEFT>";
  }
  else
  {
    s += "   </TD>";
    s += "  </TR>";
    s += " </TABLE>";
    s += "</DIV>";
  }
  
  return s;
 }
 catch (error)
 {
  CatchError('__PaintGridOuter(obj=+, Mode=' + Mode + ')', error.number, error.name, error.message);
 }
}

function __PaintGridHeader(obj)
{
 try
 {
  //This is a HELPER function so "this" needs to be passed in as "obj"  
  var ID            = obj.ID + "HeaderDiv";
  var GridClass     = obj.Grid.Class;
  var CellSpacing   = obj.Table.CellSpacing;
  var CellPadding   = obj.Table.CellPadding;
  var CellOverflow  = obj.Table.CellOverflow;
  var CellWrapping  = obj.Table.CellWrapping;
  var HeaderHeight  = (obj.Row.HeaderHeight*1);
  var ColCount      = obj.ColCount;
  var RowCount      = obj.RowCount;
  
  //Set up base style for all TH elements
  var TH = "";
  var THStyleBase = "height:" + HeaderHeight + "px; width:";
  var THStyle = "";
  var THinner = "";
  var Wrap;
  if (CellWrapping == true)
    { Wrap = ""; }
  else
    { Wrap = " NOWRAP"; }
  var DivStyle = "";
  var i;
  var THDisplayStyle;
    
  //Now build up the <TH> element
  
  for (i=1; i<=ColCount; i++)
  {
    var CW = obj.ColWidths[i];
    var CA = obj.ColAlignHeaders[i];    
    var CH = obj.ColCaptions[i];
  
    //If the ith Column Width is zero, do not display the column
    if (CW == "0.00")
      { THDisplayStyle = "; display:none"; }
    else
      { THDisplayStyle = ""; }
    THStyle = THStyleBase + CW + "px" + THDisplayStyle;

    //Start the <TH> element
    TH += "   <TH class='tablehdr' style='" + THStyle + "' align='" + CA + "'" + Wrap + ">";

    //Now build up the "value" to go inside the <TH>
    if (CellOverflow == false)
    {
      //CellOverflow for this Grid is set to Off so need to paint a <DIV> inside the <TH>
      //Set up the style for the <DIV>
      DivStyle = "WIDTH:" + CW + "px; OVERFLOW:hidden";
      
      //Now paint the <DIV> which is to go inside the <TH>
      THinner = "    <DIV style='" + DivStyle + "'" + Wrap + ">";
      THinner += CH;
      THinner += "    </DIV>";    
    }
    else
    {
      //CellOverflow for this Grid is set to On so simply paint the Column Heading
      //Get hold of the value of the cell (and convert to &nbsp if blank)
      THinner = IIf(CH == "", "&nbsp", CH);
    }
  
    //Add the THinner to the <TH> element
    TH += THinner;
    
    //And close the <TH> element
    TH += "   </TH>";
  }

  //Calculate the style for the grid
  var GridStyle = "height:" + IIf(RowCount==0, HeaderHeight+2, HeaderHeight) + "px; " +
                  "overflow-x:hidden; overflow-y:scroll"; 

  //And build up the Header grid
  var s = "";  
  s += "<DIV" + " id=" + ID + " class=" + GridClass + " style='" + GridStyle + "'>";
  s += " <TABLE" + " cellspacing=" + CellSpacing + " cellpadding=" + CellPadding + " border=1>";
  s += "  <TR>";
  s += TH;
  s += "  </TR>";
  s += " </TABLE>";
  s += "</DIV>";
  
  return s;
 }
 catch (error)
 {
  CatchError('__PaintGridHeader(obj=+)', error.number, error.name, error.message);
 }
}

function __PaintGridMain(obj, Mode)
{
// try
// {
  //This is a HELPER function so "this" needs to be passed in as "obj"

  //If called with Mode = "END" then simply return the closing body, table and div HTML tags
  if (Mode == "END")
  {
    return "</TBODY></TABLE></DIV>";
  }
    
  var ID              = obj.ID;
  var GridPrefix      = obj.Grid.Prefix;
  var GridDelimiter   = obj.Grid.Delimiter;
  var GridMaxRows     = obj.Grid.MaxRowsToDisplay;
  var GridSaveData    = obj.Grid.SaveData;
  var MultiSelect     = IIf(obj.Grid.MultiSelect==true, "YES", "NO");
  var CellSpacing     = obj.Table.CellSpacing;
  var CellPadding     = obj.Table.CellPadding;
  var ColCount        = obj.ColCount;
  var RowCount        = obj.RowCount;
  var DeletedRowCount = obj.DeletedRowCount();
  var Border          = IIf(RowCount==0, "0", "1");
  var SelectedRow     = obj.Row.SelectedRow;
  var GridClass       = IIf((RowCount - DeletedRowCount) > GridMaxRows, "GridScrollbars",  "GridScrollbarsWhite");
  var RowHeight       = obj.Row.Height;
  var GridHeight      = (GridMaxRows * parseInt(RowHeight)) + 
                        (GridMaxRows * parseInt(CellSpacing)) + 
                        (GridMaxRows + 1);
  var DIVStyle        = "height:" + GridHeight + "px; overflow-x:hidden; overflow-y:scroll";
  
  var TheDiv   = "<DIV" + " id='" + ID + "ScrollBar' class='" + GridClass + "' style='" + DIVStyle +  "'>";
  var TheTable = " <TABLE" + " id=" + ID + 
                   " cellspacing=" + CellSpacing + 
                   " cellpadding=" + CellPadding + 
                   " border=" + Border +
                   " WIDTH=100%" +
                   " COLCOUNT=" + ColCount + 
                   " ROWCOUNT=" + RowCount + 
                   " MAXROWSTODISPLAY='" + GridMaxRows + "'" +
                   " SAVEDATA='" + GridSaveData + "'" +
                   " MULTISELECT='" + MultiSelect + "'" +
                   " SELECTEDROW='" + SelectedRow + "'" +
                   " GRIDPREFIX='" + GridPrefix + "'" +
                   " ROWZERO='R000" + GridPrefix + "'" +
                   " DELIMITER='" + GridDelimiter + "'";

  var i;
  for (i=0; i<obj.Events.Count; i++)
  {
    TheTable += " " + obj.Events.PropertyName[i] + "=\"";
    TheTable += obj.Events.PropertyValue[i] + "\"";
  }
  TheTable += ">";
  
  //Output the <COL> definition for all columns within the group (rather than specified on each row)
  var TheCols = "";
  var CW;
  var CA;
  var CS;

  //Add NOWRAP to the column definition if the CellWrapping attribute is not set
  
  var CellWrap;
  if (obj.Table.CellWrapping == false)
  {
    CellWrap = " NOWRAP";
  }
    
  for (i=1; i<=ColCount; i++)
  {
    //Get hold of the width and alignment for the ith column
    CW = obj.ColWidths[i];
    CA = obj.ColAligns[i];
    
    //Now set the Column Style depending on the width of the column
    if (CW == 0)
      { CS = "display:none"; }
    else
      { CS = "overflow:hidden"; }
    
    TheCols += "  <COL width='" + CW + "' align='" + CA + "'" + "' style='" +
    CS + "'" + CellWrap + "/>";
  }  

  //Declare the body string
  var TheBody = "  <TBODY" + " id=" + ID + "TBODY>";
    
  //Declare the rows string
  var TheRows = "";

  //If there are no rows
  if (RowCount == 0)
  {
    //Then check if there is a message to show when there are no records
    if (obj.Grid.NoRecordsMessage != "")
    {
      //Then output the no records message
      TheRows = "   <DIV ALIGN=CENTER><BR>" + obj.Grid.NoRecordsMessage + "</DIV>";
    }
  }
  else
  {
    //The next bit is used to solve the string concatenation problem which can be heavy in javascript  with
    //repeatedly adding small strings to larger strings. It basically builds up 10 rows at a time into  one
    //small string and then dumps it into a larger 50 row buffer. Every 50 rows, it then dumps the 50  row
    //buffer into the real Rows string.At the end it outputs any remaining rows into the real Rows  string.
    var Str10 = "";
    var Str50 = "";
    var Count10 = 0;
    var Count50 = 0;

    //There are rows to output so paint them now
    for (i=1; i<=RowCount; i++)
    {
      //Increase the 10 row and 50 row counters
      Count10++;
      Count50++;

      if (Count10 == 10)
      {
        //We have reached 10 rows so add the 10 row string to the 50 row string
        Str50 += Str10;
        
        //And reset the 10 row counter and 10 row string
        Count10 = 0;
        Str10 = "";
      }

      if (Count50 == 50)
      {
        //We have reached 50 rows so add the 50 row string to TheRows string
        TheRows += Str50;
        
        //And reset the 50 row counter and 50 row string
        Count50 = 0;
        Str50 = "";
      }
      
      //Paint the ith row into the 10 row string
      Str10 += __PaintGridRow(obj, i);
    }
    
    //If there is anything in the 50 row string buffer, add it to TheRows string
    if (Str50 != "")
    {
      TheRows += Str50;
    }
    
    //And if there is anything in the 10 row string buffer, add it to TheRows string
    if (Str10 != "")
    {
      TheRows += Str10;
    }
  }
 
  //Now return the full main string (built up from the individual components)
  return TheDiv + TheTable + TheCols + TheBody + TheRows;
// }
// catch (error)
// {
//  CatchError('__PaintGridMain(obj=+)', error.number, error.name, error.message);
// }
}

function __PaintGridRow(obj, RowNumber)
{
// try
// {
  //This is a HELPER function so "this" needs to be passed in as "obj" 
  var ID           = obj.ID;
  var Parent       = ID;
  var GridPrefix   = obj.Grid.Prefix;
  var RowID        = "R" + Format(RowNumber, 3) + GridPrefix;
  var RowHeight    = obj.Row.Height;
  var Key          = obj.RowKeys[RowNumber];
  var ColCount     = obj.ColCount;
  var RowCount     = obj.RowCount;
  var CellOverflow = obj.Table.CellOverflow;
  var CellWrapping = obj.Table.CellWrapping;

  if (RowCount == 1)
  {
    //If there is only one row in the grid then always set it to be selected
    obj.RowSelected[RowNumber] = true;
  }
  else
  {
    //More than one row so check the number of rows that are selected
    if (obj.SelectedRowCount() == 0)
    {
      //No rows are selected so see if the InitialRowSelected flag is set
      if (obj.Grid.InitialRowSelected == true)
      {
        //The initial row selected flag is set so select this row
        obj.RowSelected[RowNumber] = true;
        
        //Set this row to be the current row
        obj.CurrentRow = RowNumber;
      }
    }
  }
  
  //Set the background color depending on whether we are selecting or de-selecting the row
  var RowSelected = obj.RowSelected[RowNumber];
  var TRBGColor;
  if (RowSelected == true)
    { TRBGColor = SELROW_BG_COLOR; }
  else
    { TRBGColor = ROW_BG_COLOR; }
  
  //Determine if this row is deleted and set the display style accordingly
  var RowDeleted  = obj.RowDeleted[RowNumber];
  var TRStyle = "height:" + RowHeight + "px; background-color:" + TRBGColor;
  if (RowDeleted == true)
    { TRStyle += "; display:none"; }
  
  var TR = "<TR id='" + RowID + "' KEY='" + Key + "'" + " ROW=" + RowNumber + "  STYLE='" + TRStyle + "'>";           
  var TD = "";
  var TDinner;
  var Wrap;
  if (CellWrapping == false)
  {
    Wrap = " NOWRAP";
  }
  var DivStyle;
  var i;
  
  for (i=1; i<=ColCount; i++)
  {
    ColID = RowID + "C" + Format(i,3);
    CW    = obj.ColWidths[i];
    CA    = obj.ColAligns[i];

    //Start the <TD> element
    TD += "<TD ID='" + ColID + "' ROW=" + RowNumber + " COL=" + i + Wrap + ">";
    
    //Now build up the "value" to go inside the <TD>
    if (CellOverflow == false)
    {
      //CellOverflow for this Grid is set to Off so need to paint a <DIV> inside the <TD>
      //Set up the style for the <DIV>
      DivStyle = "WIDTH:" + CW + "px; OVERFLOW:hidden";
      
      //Now paint the <DIV> which is to go inside the <TD>
      TDinner = "  <DIV ID='" + ColID + "div' ROW=" + RowNumber + " COL=" + i + " style='" + DivStyle  + "'" + Wrap + ">";
      TDinner += __PaintGridRowFormat(obj, RowNumber, i);
      TDinner += "  </DIV>";    
    }
    else
    {
      //CellOverflow for this Grid is set to On so simply paint the <TD>
      //Get hold of the value of the cell (and convert to &nbsp if blank)
      TDinner = __PaintGridRowFormat(obj, RowNumber, i);
      if (TDinner == "")
        { TDinner = "&nbsp"; }
    }
    
    //Add the TDinner to the <TD> element
    TD += TDinner;
    
    //And close the <TD> element
    TD += "</TD>";
  }

  return TR + TD + "</TR>";
// }
// catch (error)
// {
//  CatchError('__PaintGridRow(obj=+, RowNumber=' + RowNumber + ')', error.number, error.name,  error.message);
// }
}

function __PaintGridRowFormat(obj, Row, Col)
{
// try
// {
  //This is a HELPER function so "this" needs to be passed in as "obj"
  var ret = "";
  
  //Get hold of the specific Cell within the Row array
  var Cell = obj.Rows[Row][Col];
  
  //Get hold of the specific Column Type and Format
  var ColType   = obj.ColTypes[Col];
  var ColFormat = obj.ColFormats[Col];
  
  switch (ColType)
  {
    case "string":
      ret = Cell;
    break;

    case "number":
      ret = Cell;
      if (ColFormat != "")
      {
        ret = BMSRound(Cell, ColFormat);
      }
    break;

    case "date":
      switch (ColFormat)
      {
        case "mm/dd/yyyy":
        case "dd/mm/yyyy":
          ret = Cell;
        break;
        
        case "YYYYMMDD":
        break;
      }
      ret = Cell;
    break;

    case "text":
      var s = " onchange=\"" + obj.GridName + ".Cell(" + Row + "," + Col + ", this.value)\"";
      ret = "<INPUT type=text class=INPUTText SIZE=10 value=" + Cell + s + ">";
    break;
    
    case "checkbox":
      var Checked = IIf(Cell==true, "CHECKED", "");
      var s = " onclick=\"" + obj.GridName + ".Cell(" + Row + "," + Col + ", this.checked)\"";
      ret = "<INPUT type=checkbox class=INPUTCheckbox " + Checked + s + ">";
    break;
    
    case "combobox":
      ret = Cell;
    break;

    case "radio":
      ret = Cell;
    break;
    
    default:
      ret = Cell;
    break;
  }
  
  return ret;
// }
// catch (error)
// {
//  CatchError('__PaintGridRowFormat(obj=+, Row=' + Row + ', Col=' + Col + ')', error.number,  error.name, error.message);
// }
}

//Add a column to the Grid
function _AddCol(ColField, ColCaption, ColWidth, ColType, ColFormat, ColExtra, ColAlign,  ColAlignHeader)
{
 try
 {
  //Add one to the current column count and assign to c
  var c = ++this.ColCount;
  
  //Populate the column arrays using the parameters passed in
  this.ColFields[c]   = ColField;
  this.ColCaptions[c] = ColCaption;
  this.ColWidths[c]   = ColWidth;
  this.ColTypes[c]    = ColType;
  this.ColFormats[c]  = ColFormat;
  this.ColExtras[c]   = ColExtra;
  this.ColAligns[c]   = ColAlign;
  
  //Assume the Column Alignment by default for the Header
  this.ColAlignHeaders[c] = ColAlign;
  if (ColAlignHeader != null)
  {
    //Unless specified otherwise
    this.ColAlignHeaders[c] = ColAlignHeader;
  }
 }
 catch (error)
 {
  CatchError('_AddCol(ColField=' + ColField + ', ColCaption=' + ColCaption + ', ColWidth=' + ColWidth  + ', ColType=' + ColType + ', ColFormat=' + ColFormat + ', ColExtra=' + ColExtra + ', ColAlign=' +  ColAlign + ', ColAlignHeader=' + ColAlignHeader + ')', error.number, error.name, error.message);
 }
}

//Add a column key to the Grid
function _AddColKeys(Data)
{
 try
 {
  //Run through the argument list
  for (var c=0; c<arguments.length; c++)
  {
    //Populate the cth column of this row with the data passed in
    this.ColKeyFields[c+1]= IIf(arguments[c] == null, "", arguments[c] + "");
  }
 }
 catch (error)
 {
  CatchError('_AddColKeys(Data=' + Data + ')', error.number, error.name, error.message);
 }
}

//Add a row to the Grid
function _AddRow(Key, Selected, Data)
{
 try
 {
  //Add one to the current row count and assign to r
  var r = ++this.RowCount;
  
  //Create a brand new blank row (to be populated further down this function)
  this.Rows[r] = ["",""];
  
  //Fill in the Key and the Selected flag into the relevant arrays
  this.RowKeys[r]     = Key;
  this.RowSelected[r] = Selected;
  
  //If this row is selected
  if (this.RowSelected[r] == true)
  {
    //Set the current row to the row number passed in
    this.CurrentRow = r;
  }
  
  //Mark this row as not deleted
  this.RowDeleted[r]  = false;
  
  //Run through the rest of the argument list (Row Data runs from arg[2..n])
  for (var c=2; c<arguments.length; c++)
  {
    //Populate the cth column of this row with the data passed in
    this.Rows[r][c-1] = IIf(arguments[c] == null, "", arguments[c]);
  }
 }
 catch (error)
 {
  CatchError('_AddRow(Key=' + Key + ', Selected=' + Selected + ', Data=' + Data + ')', error.number,  error.name, error.message);
 }
}

function _DeleteRow(RowNumber, Repaint)
{
 try
 {
  //Mark the specified Row Number as deleted
  this.RowDeleted[RowNumber] = true;
   
  //And repaint the grid if specified
  if (Repaint == true)
  {
    this.Paint();
  }
 }
 catch (error)
 {
  CatchError('_DeleteRow(RowNumber=' + RowNumber + ', Repaint=' + Repaint + ')', error.number,  error.name, error.message);
 }
}

function __SetRowClass(obj, RowNumber)
{
 try
 {
  //This is a HELPER function so "this" needs to be passed in as "obj"
  //Determine whether the row is selected or not
  var RowSelected = obj.RowSelected[RowNumber];
  
  //Set the background color depending on whether we are selecting or de-selecting the row
  var TRBGColor;
  if (RowSelected == false)
    { TRBGColor = ROW_BG_COLOR; }
  else
    { TRBGColor = SELROW_BG_COLOR; }
  
  //Get hold of the specific row
  var ElementID = "R" + Format(RowNumber,3) + obj.Grid.Prefix;  
  var TR = document.getElementById(ElementID);
      
  if (TR != null)
  {
    //then alter the background color
    TR.style.backgroundColor = TRBGColor;
    
    //And update the CurrentRow value to be the selected row
    obj.CurrentRow = RowNumber;
  }
 }
 catch (error)
 {
  CatchError('__SetRowClass(obj=+, RowNumber=' + RowNumber + ')', error.number, error.name,  error.message);
 }
}

function __BtnInteraction(obj)
{
 try
 {
  //This is a HELPER function so "this" needs to be passed in as "obj"
  //Now see how we should interact with the buttons
  var btnList = obj.Grid.NoRecordsInteraction;
  if (btnList == "")
  {
    //There are no buttons to interact with so leave now
    return;
  }
  
  //btnList is held as two comma separated lists of button names separated by a semi colon:
  // eg "Next,Back;Extra,Cancel"
  //The 1st list holds the list of buttons to be disabled when there are no selected records
  //The 2nd list holds the list of buttons to be disabled when there are selected records
  var btnListNoRecords = ExtractItem(btnList, 1, ";");
  var btnListRecords = ExtractItem(btnList, 2, ";");
  
  //Assume initially that the buttons WILL NOT be disabled when there are no records
  var ClassName = 'NavButtonsOff';
  
  //Get hold of the number of rows that are currently selected
  var RowCount = obj.SelectedRowCount();
  if ((RowCount == 0) && (btnListNoRecords != ""))      
  {
    //No rows selected and there are some buttons to interact with so use disabled class name
    ClassName = 'DisabledNavButtonsOff';
  }
  
  for (var i=1; i<=CountItems(btnListNoRecords, ","); i++)
  {
    //Set the class name for the specified button(s)
    var btnName = ExtractItem(btnListNoRecords, i, ",");
    var objButton = eval('document.all.btn' + btnName);
    if (objButton != null)
    {
      SetClassName(objButton, ClassName);
    }
  }

  //Assume initially that the buttons WILL NOT be disabled when there are records
  var ClassName = 'NavButtonsOff';

  if ((RowCount > 0) && (btnListRecords != ""))
  {
    //Rows selected and there are some buttons to interact with so use disabled class name
    ClassName = 'DisabledNavButtonsOff';
  }
  
  for (var i=1; i<=CountItems(btnListRecords, ","); i++)
  {
    //Set the class name for the specified button(s)
    var btnName = ExtractItem(btnListRecords, i, ",");
    var objButton = eval('document.all.btn' + btnName);
    if (objButton != null)
    {
      SetClassName(objButton, ClassName);
    }
  }
 }
 catch (error)
 {
  CatchError('__BtnInteraction(obj=+)', error.number, error.name, error.message);
 }
}

function _SelectAllRows(RowSelected)
{
 try
 {
  //Set the background color depending on whether we are selecting or de-selecting the row
  var TRBGColor;
  if (RowSelected == true)
    { TRBGColor = SELROW_BG_COLOR; }
  else
    { TRBGColor = ROW_BG_COLOR; }

  //Get hold of the multi select setting for this grid
  var MultiSelect = this.Grid.MultiSelect;
  var GridPrefix  = this.Grid.Prefix;
  var TR;
  
  //Only allowed to select all rows if the Multi Select setting is true
  //or you are de-selecting all rows in which case Multi Select is irrelevant
  if ((MultiSelect == true) || (RowSelected == false))
  {
    for (i=1; i<=this.RowCount; i++)
    {
      //Set the ith row to be Selected/Unselected (according to RowSelected flag)
      this.RowSelected[i] = RowSelected;
    
      //Get hold of the TR object
      TR = document.getElementById("R" + Format(i,3) + GridPrefix);

      //If the TR is available
      if (TR != null)
      {
        //then alter the background color
        TR.style.backgroundColor = TRBGColor;        
      }
    }
    
    //And update the CurrentRow value to be the current row count
    this.CurrentRow = this.RowCount;
    
    //Now determine how the buttons should interact in case all rows have been de-selected
    __BtnInteraction(this);
  }  
 }
 catch (error)
 {
  CatchError('_SelectAllRows(RowSelected=' + RowSelected + ')', error.number, error.name,  error.message);
 }
}

function _GetColumnNumber(ColField)
{
 try
 {
  for (c=1; c<=this.ColCount; c++)
  {
    if (this.ColFields[c].toUpperCase() == ColField.toUpperCase())
    {
      //The column field name in the grid matches the one passed in so return the column number
      return c;
    }
  }
  
  //If reached here, could not find the column field so return 0 to the calling routine
  return 0;
 }
 catch (error)
 {
  CatchError('_GetColumnNumber(ColField=' + ColField + ')', error.number, error.name, error.message);
 }
}

function __GetRowNumber(element)
{
 try
 {
  //Try to get hold of the Row Number from the element passed in
  var RowNumber = element.ROW;
  
  if (RowNumber == null)
  {
    //While this element doesn't have a ROW, check it's parent until you hit nothing
    while ((RowNumber == null) && (element != null))
    { 
      //Try to get hold of the ROW from this element
      RowNumber = element.ROW;
      
      //Get hold of its parent
      element = element.parentElement;
    }
  }
  
  if (RowNumber != null)
  {
    if (isNaN(RowNumber) == false)
    {
      //RowNumber is a number so convert it to one
      RowNumber = parseInt(RowNumber);
    }
  }
  
  //Finally return the RowNumber to the calling routine
  return RowNumber;
 }
 catch (error)
 {
  CatchError('__GetRowNumber(element=+)', error.number, error.name, error.message);
 }
}

function _OnGridClick()
{
 try
 {
  //Get hold of the element that was clicked on
  var obj = window.event.srcElement;
  
  //Try to get hold of the Row Number from this object
  var RowNumber = __GetRowNumber(obj);

  if (RowNumber == null)
  {
    //Row number could not be found so not possible to perform a grid click
    return;
  }
    
  //Get hold of the Multi Select flag for this grid
  var MultiSelect = this.Grid.MultiSelect;
  
  switch (MultiSelect)
  {
    case true:
      //Check if the Alt key is also being pressed
      if (EventKeyState(KEY_ALT) == true)
      {
        //Alt key is being pressed so get hold of the state of the (previously) current row
        var PreviousRow = IIf(this.CurrentRow==0, 1, this.CurrentRow);
        var PreviousState = this.RowSelected[PreviousRow];
        
        //Now set state for all rows between the PreviousRow and the (current) Row Number
        var Low  = parseInt(PreviousRow);
        var High = parseInt(RowNumber);
        
        if (PreviousRow > RowNumber)
        {
          Low  = RowNumber;       
          High = PreviousRow;
        }
        
        for (var r=Low; r<=High; r++)
        {
          //Set the state for the rth row
          this.RowSelected[r] = PreviousState;

          //And set the row class for the rth Row
          __SetRowClass(this, r);
        }
      }
      else
      {
        //We are in Multi Select mode so toggle the state of this row
        this.RowSelected[RowNumber] = !this.RowSelected[RowNumber];

        //And set the row class for this Row
        __SetRowClass(this, RowNumber);
      }
    break;
    
    case false:
      //Not in Multi Select mode so deselect the previously current row and set the row class
      if (this.CurrentRow != 0)
      {
        this.RowSelected[this.CurrentRow] = false;
        __SetRowClass(this, this.CurrentRow);
      }
      
      //And select the new row and set the row class
      this.RowSelected[RowNumber] = true;
      __SetRowClass(this, RowNumber);
    break;
  }
  
  //Now call the helper function to determine how the buttons should interact
  __BtnInteraction(this);  
 }
 catch (error)
 {
  CatchError('_OnGridClick()', error.number, error.name, error.message);
 }
}

function _OnGridMouseEvent(Event)
{
 try
 {
  var TheElement = window.event.srcElement;
  if ((TheElement.tagName == 'TD') || (TheElement.tagName == 'DIV'))
  {
    //Try to get hold of the Row Number from this object
    var RowNumber = __GetRowNumber(TheElement);
   
    if (RowNumber == null)
    {
      //Row number could not be found so not possible to perform a grid click
      return;
    }
   
    //Get hold of the Row containing the TD that has been moused
    var TR = document.getElementById("R" + Format(RowNumber,3) + this.Grid.Prefix);

    switch (TR.style.backgroundColor)
    {
      case SELROW_BG_COLOR:
        SetCursor(TR, 'default');
      break;
    
      case ROW_BG_COLOR:
        SetCursor(TR, IIf(Event == 'over', 'hand', 'default'));
      break;
    }
  }  
 }
 catch (error)
 {
  CatchError('_OnGridMouseEvent(Event=' + Event + ')', error.number, error.name, error.message);
 }
}

function _SelectedRowCount()
{
 try
 {
  var i;
  var ret = 0;
  
  for (i=1; i<=this.RowCount; i++)
  {
    if (this.RowSelected[i] == true)
    {
      ret++;
    }
  }
  
  return ret;
 }
 catch (error)
 {
  CatchError('_SelectedRowCount()', error.number, error.name, error.message);
 }
}

function _DeletedRowCount()
{
 try
 {
  var i;
  var ret = 0;
  
  for (i=1; i<=this.RowCount; i++)
  {
    if (this.RowDeleted[i] == true)
    {
      ret++;
    }
  }
  
  return ret;
 }
 catch (error)
 {
  CatchError('_DeletedRowCount()', error.number, error.name, error.message);
 }
}

function _Cell(Row, Col, Value)
{
 try
 {
  //Set the cell specified by Row and Col to the Value passed in
  this.Rows[Row][Col] = Value;
 }
 catch (error)
 {
  CatchError('_Cell(Row=' + Row + ', Col=' + Col + ', Value=' + Value + ')', error.number, error.name,  error.message);
 }
}

function _GetFieldData(Mode)
{
 try
 {
  var r, c;
  var GN       = this.ID;
  var SaveData = this.Grid.SaveData;
  var RowCount = this.RowCount;
  
  switch (SaveData)
  {
    case "NO":
      //Do not need to save the data so return blank string to the calling routine
      return "";
    break;
    
    case "YES":
      //Only required to return the key information from the selected rows
      var SelCount = 0;
      var FN       = "";
      var FV       = "";
      
      for (r=1; r<=RowCount; r++)
      {
        if ((this.RowSelected[r] == true) && (this.RowDeleted[r] == false))
        {
          //Row is selected (and not deleted) so increase the selected count 
          SelCount++;
          
          //And add to the Field lists
          FN = AddItemToList(FN, GN + ".item(" + SelCount + ")", ";");
          FV = AddItemToList(FV, this.RowKeys[r], ";");
        }
      }      
    break;
    
    case "ALL":
      //Required to return the row information for all rows in the grid
      //Only required to return the key information from the selected rows
      var SelCount = 0;
      var FN       = "";
      var FV       = "";
      var rFV      = "";
      
      for (r=1; r<=RowCount; r++)
      {
        if (this.RowDeleted[r] == false)
        {
          //Row is not deleted so increase the selected count 
          SelCount++;
          
          //This row is not deleted so add to the Field lists
          FN = AddItemToList(FN, GN + ".item(" + SelCount + ")", ";");
          
          rFV = "";
          for (c=1; c<=this.ColCount; c++)
          {
            rFV = AddItemToList(rFV, this.Rows[r][c], ",");
          }
          FV = AddItemToList(FV, rFV, ";");
        }
      }
    break;
  }
  
  var ret = "";

  switch (Mode)
  {
    case "NAMES":
      ret = AddItemToList(ret, GN + ".DELIMITER", ";");
      ret = AddItemToList(ret, GN + ".length", ";");
      ret = AddItemToList(ret, FN, ";");
    break;
    
    case "VALUES":
      ret = AddItemToList(ret, this.Grid.Delimiter, ";");
      ret = AddItemToList(ret, SelCount);
      ret = AddItemToList(ret, FV, ";");  
  }
 
  //Finally return ret to the calling routine
  return ret;
 }
 catch (error)
 {
  CatchError('_GetFieldData(Mode=' + Mode + ')', error.number, error.name, error.message);
 }
}