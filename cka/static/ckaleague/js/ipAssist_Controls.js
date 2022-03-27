// © Copyright 1999-2000 Business Management Software Limited, All rights reserved.

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function PropertyGrid()
//  function PropertyTable()
//  function PropertyRow()
//  function PropertyLabel()
//  function PropertyControl()
//
//****************************************************************************

function PropertyGrid()
{
  //Define the Grid Properties
  this.Title                = "";
  this.TitleAlign           = "'center'";
  this.Class                = "'GridScrollbarsWhite'";
  this.Prefix               = "";
  this.Delimiter            = "";
  this.MaxRowsToDisplay     = 1;
  this.SaveData             = "YES";
  this.MultiSelect          = false;
  this.InitialRowSelected   = true;
  this.NoRecordsInteraction = "";
  this.NoRecordsMessage     = "";
}

function PropertyTable()
{
  //Define the Table Properties
  this.Border      = "0";
  this.Width       = "100%";
  this.Align       = "Center";
  this.CellSpacing = "1";
  this.CellPadding = "1";
  this.CellOverflow = false;
  this.CellWrapping = false;
}

function PropertyRow()
{
  //Define the Row Properties
  this.HeaderHeight = 25;
  this.Height       = 20;
}

function PropertyLabel()
{
  //Define the Label Properties
  this.Value   = "";
  this.Width   = "";
  this.Value   = "";
  this.Width   = "90%";
  this.Align   = "Center";
  this.Style   = "";
  this.OnRight = False;
  this.OnTop   = False;
}

function PropertyControl()
{
  this.SaveData  = "YES";
  this.Disabled  = false;
  this.Hidden    = false;
  this.ReadOnly  = false;
  this.Mandatory = false;
  this.Password  = false;
}