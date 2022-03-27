// © Copyright 1999-2000 Business Management Software Limited, All rights reserved.

var FORMACTION_FIELDEDIT = "FIELD_EDIT";
var FORMACTION_CHANGE = "SAVE_CHANGE";
var FORMACTION_NEW = "SAVE_NEW";
var FORMACTION_DELETE = "DELETE";
var FORMACTION_CANCEL = "CANCEL";

var SUB_FORMACTION_FIELDEDIT = "SUB_FIELD_EDIT";
var SUB_FORMACTION_CHANGE = "SUB_SAVE_CHANGE";
var SUB_FORMACTION_NEW = "SUB_SAVE_NEW";
var SUB_FORMACTION_DELETE = "SUB_DELETE";

var PAGE_FORM = 0;
var SUB_FORM = 1;

var MOVE_NEXT = 1;
var MOVE_PREVIOUS = -1;
var MOVE_NEW = 99;
var MOVE_STILL = 0;

var DATE_FORMAT_DDMMYYYY = "UK"
var DATE_FORMAT_MMDDYYYY = "US"

//Always use lower case for the following.
var DATE_PATTERN_DDMMYYYY = "dd/mm/yyyy"
var DATE_PATTERN_MMDDYYYY = "mm/dd/yyyy"

var DateDelimiter = 47; // Ascii. 45='-', 46='.', 47='/', 32=' ' // They must match above!

var NORMAL_TEXT_COLOR = "Black";
var MASK_TEXT_COLOR = "Tan";

// constants used for date operators in grid filter and edit masks.
var CGREATER = 1;
var CGREATEREQUAL = 2;
var CLESS = 3;
var CLESSEQUAL = 4;
var CEQUAL = 5;

var CDT_STRING = 1;
var CDT_INTEGER = 2;
var CDT_FLOAT = 3;
var CDT_DATE = 4;
var CDT_BOOLEAN = 5;
var CDT_TIMESTAMP = 6;

var KEY_FORMATTYPE_EDITBOX = '1';
var KEY_FORMATTYPE_LISTBOX = '2';
var KEY_FORMATTYPE_DROPLIST = '3';
var KEY_FORMATTYPE_DATE = '4';
var KEY_FORMATTYPE_RO_DATE = '5';
var KEY_FORMATTYPE_YESNO = '6';
var KEY_FORMATTYPE_TRUEFALSE = '7';
var KEY_FORMATTYPE_ONOFF = '8';
var KEY_FORMATTYPE_NATIVE = '9';
var KEY_FORMATTYPE_AGE = '10';
var KEY_FORMATTYPE_GRID = '11';
var KEY_FORMATTYPE_TEXTAREA = '12';
var KEY_FORMATTYPE_DCDROPLIST = '13';
var KEY_FORMATTYPE_LINKCHILD = '14';
var KEY_FORMATTYPE_SUB2CHECKBOX = '15';
var KEY_FORMATTYPE_SUB2STATEDATA = '16';
var KEY_FORMATTYPE_EMAILADDRESS = '19';

//***************************************************************************************
// The following definitions are used to display message boxes within the application
//***************************************************************************************
//Declare the name of the HTML file to use to display message boxes
var MESSAGE_BOX_URL = "TCMessageBox.htm";

//Declare the default height and width dimensions for the message box
var MESSAGE_BOX_HEIGHT = 210;
var MESSAGE_BOX_WIDTH  = 350;

//Define the standard available button combinations
var tcOKOnly = 0;
var tcOKCancel = 1;
var tcAbortRetryIgnore = 2;
var tcYesNoCancel = 3;
var tcYesNo = 4;
var tcRetryCancel = 5;
var tcRerunExitCancel = 6;
var tcContinueCancel = 7;

//Define the standard available message box return values
var tcDefault = 0;
var tcOK = 1;
var tcCancel = 2;
var tcAbort = 3;
var tcRetry = 4;
var tcIgnore = 5;
var tcYes = 6;
var tcNo = 7;
var tcContinue = 8;

//Declare the constants for the message box titles (defined below)
var mbSYSTEM           = 1;
var mbVALIDATION       = 2;
var mbMANDATORY        = 3;
var mbCLOSEOPENWINDOWS = 4;

//The base message box title
var MESSAGE_BOX_TITLE      = "TotalChoice System Message";

//And the specific message box titles
var MESSAGE_BOX_SYSTEM           = MESSAGE_BOX_TITLE;
var MESSAGE_BOX_VALIDATION       = MESSAGE_BOX_TITLE + " - Validation Report";
var MESSAGE_BOX_MANDATORY        = MESSAGE_BOX_TITLE + " - Mandatory Fields";
var MESSAGE_BOX_CLOSEOPENWINDOWS = MESSAGE_BOX_TITLE + " - Close Open Windows";

//Define the number of chars required to pad the message box title
//so that "-- Web Page Dialog" turns into "..." on the title bar
var MESSAGE_BOX_TITLE_PAD_LENGTH = 96;

//Declare the default values
var MESSAGE_BOX_TITLE_DEFAULT   = MESSAGE_BOX_SYSTEM;
var MESSAGE_BOX_TYPE_DEFAULT    = "W";
var MESSAGE_BOX_BUTTON_DEFAULT  = tcOKOnly;

//Validation report strings and message types
var VALIDATION_SUCCESS      = "Success";
var VALIDATION_SUCCESS_TYPE = "O"; //Success->OK (MsgType 'S' already used)
var VALIDATION_FAILURE      = "Failure";
var VALIDATION_FAILURE_TYPE = "F";

//Add the mandatory window and close open window headings
var MANDATORY_HEADING        = "The following fields must contain data:";
var CLOSEOPENWINDOWS_HEADING = "The following windows are still open. Do you still wish to exit as this will close these windows?";

//***************************************************************************************
