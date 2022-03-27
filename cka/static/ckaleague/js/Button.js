function Button(btnID, btnFilterName, btnFilterValue, boolGroupButton, btnState, boolColourButton, btnText, btnWidth, btnHeight)
{
  //Button attributes
  this.ID   = "btn" + btnID;
  this.Value = btnID;
  this.GroupID = ""; //Holds the id of the group when added to a button group
  this.SpecialButton = false;
  this.GroupButton = (boolGroupButton == null) ? (false) : (boolGroupButton);
  this.ColourButton = (boolColourButton == null) ? (false) : (boolColourButton);

  this.FilterName = btnFilterName;
  this.FilterValue = (btnFilterValue == null) ? (this.Value) : (btnFilterValue);
  this.FilterOperation = "==";

  this.State = (btnState == null) ? ("Click") : (btnState); //Holds the current state {"Click","Over","Out"}
  
  //Styling attributes  
  this.Text = (btnText == null) ? ("") : (btnText);
  this.Width = (btnWidth == null) ? ("100%") : (btnWidth);
  this.Height = (btnHeight == null) ? ("24px") : (btnHeight);
  
  //Button Methods
  this.GetButtonObject = Button_GetButtonObject;
}

function Button_GetButtonObject()
{
  //Get hold of and return a pointer to the button object specified by the internal ID attribute
  return document.getElementById(this.ID);
}

function ButtonGroup(btnGroupID)
{
  //Button Group attributes
  this.GroupID = btnGroupID;
  this.Type = "";  // {"single", "multiple"}
  this.Buttons = new Array();
  
  //Button Group Methods
  this.AddButton = ButtonGroup_AddButton;
}

function ButtonGroup_AddButton(button)
{
  var i = this.Buttons.length;
  this.Buttons[i] = button;
  this.Buttons[i].GroupID = this.GroupID;
}

function ButtonBar(bbID)
{
  //Button Bar attributes
  this.ID = bbID;
  this.Groups = new Array();
  
  this.classMouse      = "TigerButtons";
  this.classMouseOver  = this.classMouse + " Over";
  this.classMouseOut   = this.classMouse + " Out";
  this.classMouseClick = this.classMouse + " Click";

  //Button Bar Methods
  this.GetButtonInstance     = ButtonBar_GetButtonInstance;
  this.GetButtonState        = ButtonBar_GetButtonState;
  this.SetButtonState        = ButtonBar_SetButtonState;
  this.SetGroupButtonState   = ButtonBar_SetGroupButtonState;
  this.SetSpecialButtonState = ButtonBar_SetSpecialButtonState;
  this.AddButtonGroup        = ButtonBar_AddButtonGroup;  
  this.MouseOver             = ButtonBar_MouseOver;
  this.MouseOut              = ButtonBar_MouseOut;
  this.MouseClick            = ButtonBar_MouseClick;
}

/*button*/ function ButtonBar_GetButtonInstance(btnID)
{
  for (var i=0; i<this.Groups.length; i++)
  {
    var g = this.Groups[i];
    
    for (var j=0; j<g.Buttons.length; j++)
    {
      var b = g.Buttons[j];
      
      if (b.Value == btnID)
      {
        return b;
      }
    }
  }
  
  //Not found the specified button so return null to caller
  return null;
}

/*buttons[]*/ function ButtonBar_GetButtonState(btnState)
{
  //This function runs through the entire Button Bar looking for buttons with a specific state
  //It returns an array of buttons with that state
  
  var buttons = new Array();
  
  for (var i=0; i<this.Groups.length; i++)
  {
    var g = this.Groups[i];
    
    for (var j=0; j<g.Buttons.length; j++)
    {
      var b = g.Buttons[j];
      
      //Only include non-special buttons in this list
      if (b.SpecialButton == false)
      {
        if (b.State == btnState)
        {
          buttons.push(b);
        }
      }
    }
  }
  
  return buttons;
}

function ButtonBar_SetButtonState(btnState, btnClass)
{
  //This function runs through the entire Button Bar and sets the button state to a specific state 
  for (var i=0; i<this.Groups.length; i++)
  {
    var g = this.Groups[i];
    
    for (var j=0; j<g.Buttons.length; j++)
    {
      var b = g.Buttons[j];
      
      //Only set the button state for non-special buttons
      if (b.SpecialButton == false)
      {
        //Set the state of the non-special button
        b.State = btnState;
        
        //Get hold of the actual button
        var btn = b.GetButtonObject();
      
        if (btn)
        {
          //And set the class of this button
          btn.className = btnClass + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
      }
    }
  }
}

function ButtonBar_SetGroupButtonState(btnGroupID, btnState, btnClass)
{
  //This function runs through the entire Button Bar and sets the button state to a specific state for all buttons with a specific Group ID
  var g = this.Groups[btnGroupID];
  
  for (var j=0; j<g.Buttons.length; j++)
  {
    var b = g.Buttons[j];
    //Only set the button state for non-special buttons
    if (b.SpecialButton == false)
    {
      //Set the state of the non-special button
      b.State = btnState;
    
      //Get hold of the actual button
      var btn = b.GetButtonObject();
    
      if (btn)
      {
        //And set the class of this button
        btn.className = btnClass + ( (b.ColourButton == true) ? (b.Value) : ("") );
      }
    }
  }
}

function ButtonBar_SetSpecialButtonState(btnState, btnClass)
{
  //This function runs through the entire Button Bar and sets the button state to a specific state for all buttons with all groups
  for (var i=0; i<this.Groups.length; i++)
  {
    var g = this.Groups[i];
    
    for (var j=0; j<g.Buttons.length; j++)
    {
      var b = g.Buttons[j];
      
      //Only set the button state for non-special and non-group buttons
      if ( (b.SpecialButton == false) && (b.GroupButton == false) )
      {
        //Set the state of the normal button
        b.State = btnState;
        
        //Get hold of the actual button
        var btn = b.GetButtonObject();
      
        if (btn)
        {
          //And set the class of this button
          btn.className = btnClass + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
      }
    }
  }
}

function ButtonBar_AddButtonGroup(buttonGroup)
{
  var i = this.Groups.length;
  this.Groups[i] = buttonGroup;
}

function ButtonBar_MouseClick(e, btnID)
{
  var evt = (window.event) ? window.event : e;
  //var kc  = (window.event) ? evt.keyCode : evt.which;
  
  //If the ctrl key is being pressed returns true otherwise returns false
  var ctrlKey = (evt.ctrlKey == true);
  
  //Get hold of the javascript button instance
  var b = this.GetButtonInstance(btnID);

  if (b == null)
  {
    alert('GetButtonInstance returned "null" for btnID "' + btnID + '"');
    return;
  }
  
  //And using that instance, get hold of the physical button object
  var btn = b.GetButtonObject();

  if (btn == null)
  {
    alert('GetButtonObject returned "null"');
    return;
  }

  //Do different things depending on the current state of the button and the state of the ctrl key
  switch (b.State)
  {
    case "Click":
      if (ctrlKey == false)
      {
        //Ctrl key is not being pressed. Set the state of all (non special) buttons to "Out"
        this.SetButtonState("Out", this.classMouseOut);
        
        //Set this button to "Click" and change the class name
        b.State = "Click";
        btn.className = this.classMouseClick + ( (b.ColourButton == true) ? (b.Value) : ("") );
        
        //If this is a special button
        if (b.SpecialButton == true)
        {
          //Then set all buttons in all groups to the same state
          this.SetSpecialButtonState(b.State, this.classMouseClick);

          //Then set the special button to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
        else if (b.GroupButton == true)
        {
          //Then set all the (non special) buttons in this group to the same state
          this.SetGroupButtonState(b.GroupID, b.State, this.classMouseClick);

          //Then set the group button to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
      }
      else
      {
        //Ctrl key is being pressed. Determine how many buttons are currently set to "Click"
        var buttons = this.GetButtonState("Click");
        
        //Check the number of buttons that are set to "Click"
        if (buttons.length > 1)
        {
          //More than one button selected so so set to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
      }
    break;
  
    case "Over":
      if (ctrlKey == false)
      {
        //Ctrl key is not being pressed. Set the state of all (non special) buttons to "Out"
        this.SetButtonState("Out", this.classMouseOut);
        
        //Set this button to "Click" and change the class name
        b.State = "Click";
        btn.className = this.classMouseClick + ( (b.ColourButton == true) ? (b.Value) : ("") );

        //If this is a special button
        if (b.SpecialButton == true)
        {
          //Then set all buttons in all groups to the same state
          this.SetSpecialButtonState(b.State, this.classMouseClick);

          //Then set the special button to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
        else if (b.GroupButton == true)
        {
          //Then set all the (non special) buttons in this group to the same state
          this.SetGroupButtonState(b.GroupID, b.State, this.classMouseClick);

          //Then set the group button to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
      }
      else
      {
        //Ctrl key is being pressed. Currently we are "Over" so set to "Click" and change the class name
        b.State = "Click";
        btn.className = this.classMouseClick + ( (b.ColourButton == true) ? (b.Value) : ("") );

        //If this is a special button
        if (b.SpecialButton == true)
        {
          //Then set all buttons in all groups to the same state
          this.SetSpecialButtonState(b.State, this.classMouseClick);

          //Then set the special button to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
        else if (b.GroupButton == true)
        {
          //Then set all the (non special) buttons in this group to the same state
          this.SetGroupButtonState(b.GroupID, b.State, this.classMouseClick);

          //Then set the group button to "Out" and change the class name
          b.State = "Out";
          btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
        }
      }      
    break;
    
    case "Out":
      //Currently we are "Out" so set to "Click" and change the class name
      b.State = "Click";
      btn.className = this.classMouseClick + ( (b.ColourButton == true) ? (b.Value) : ("") );
      
      //If this is a group button
      if (b.GroupButton == true)
      {
        //Then set all the (non special) buttons in this group to the same state
        this.SetGroupButtonState(b.GroupID, b.State, this.classMouseClick);

        //Then set the group button to "Out" and change the class name
        b.State = "Out";
        btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
      }
    break;
  }
}

function ButtonBar_MouseOver(btnID)
{
  var b = this.GetButtonInstance(btnID);

  if (b == null)
  {
    alert('GetButtonInstance returned "null" for btnID "' + btnID + '"');
    return;
  }
  
  var btn = b.GetButtonObject();

  if (btn == null)
  {
    alert('GetButtonObject returned "null"');
    return;
  }
  
  switch (b.State)
  {
    case "Click":
      //We are currently "Click" so no need to do anything
    break;
  
    case "Over":
      //We are already "Over" so no need to do anything
    break;
    
    case "Out":
      //Currently we are "Out" so set to "Over" and change the class name
      b.State = "Over";
      btn.className = this.classMouseOver + ( (b.ColourButton == true) ? (b.Value) : ("") );
    break;
  } 
}

function ButtonBar_MouseOut(btnID)
{
  var b = this.GetButtonInstance(btnID);
  if (b == null)
  {
    alert('GetButtonInstance returned "null" for btnID "' + btnID + '"');
    return;
  }
  
  var btn = b.GetButtonObject();
  if (btn == null)
  {
    alert('GetButtonObject returned "null"');
    return;
  }
  
  switch (b.State)
  {
    case "Click":
      //We are currently "Click" so no need to do anything
    break;
  
    case "Over":
      //Currently we are "Over" so set to "Out"
      b.State = "Out";
      btn.className = this.classMouseOut + ( (b.ColourButton == true) ? (b.Value) : ("") );
    break;
    
    case "Out":
      //We are already "Out" so no need to do anything
    break;
  }
}

function Filter()
{
  this.FilterName      = "";
  this.FilterValue     = "";
  this.FilterOperation = "";
}

function ButtonBarFilter(bbID)
{
  this.ButtonBar = new Array();
  
  this.AddButtonBar = ButtonBarFilter_AddButtonBar;
  this.ApplyFilters = ButtonBarFilter_ApplyFilters;
}

function ButtonBarFilter_AddButtonBar(buttonBar)
{
  var i = this.ButtonBar.length;
  this.ButtonBar[i] = buttonBar;
}

function Statistics_Category()
{
  this.Total = 0;
  this.Division = new Array();
  for (var i=0; i<4; i++)
  {
    this.Division[i] = 0;
  }
}

function Statistics()
{
  this.GoalCount   = new Statistics_Category();
  this.HomeWins    = new Statistics_Category();
  this.Draws       = new Statistics_Category();
  this.AwayWins    = new Statistics_Category();
  this.HomeGoals   = new Statistics_Category();
  this.AwayWins    = new Statistics_Category();
  this.AwayDraws   = new Statistics_Category();
  this.AwayLosses  = new Statistics_Category();
  this.AwayGoals   = new Statistics_Category();
  
  this.LowestHomeScore = 99;
  this.LowestHomeTeam = "";
  this.LowestAwayScore = 99;
  this.LowestAwayTeam = "";
  this.HighestHomeScore = 0;
  this.HighestHomeTeam = "";
  this.HighestAwayScore = 0;  
  this.HighestAwayTeam = "";
  
  this.GameCount   = new Statistics_Category();
  this.PlayedCount = new Statistics_Category();
  this.ToPlayCount = new Statistics_Category();

/*
  this.GoalCount   = 0;
  this.HomeWins    = 0;
  this.Draws       = 0;
  this.AwayWins    = 0;
  this.HomeGoals   = 0;
  this.AwayWins    = 0;
  this.AwayDraws   = 0;
  this.AwayLosses  = 0;
  this.AwayGoals   = 0;
  this.LowestHomeScore = 99;
  this.LowestHomeTeam = "";
  this.LowestAwayScore = 99;
  this.LowestAwayTeam = "";
  this.HighestHomeScore = 0;
  this.HighestHomeTeam = "";
  this.HighestAwayScore = 0;  
  this.HighestAwayTeam = "";
  this.GameCount   = 0;
  this.PlayedCount = 0;
  this.ToPlayCount = 0;
*/
  this.AddGame = Statistics_AddGame;
  this.Output  = Statistics_Output;
}

function Statistics_AddGame(row)
{
  //Get hold of the TD containing the Division (in column 3 of the grid)
  var divisionTD =  document.getElementById("R" + row + "C3");
  var division = divisionTD.innerText || divisionTD.textContent; //innerText for IE || textContent for Firefox
  //Convert Division NL 
  if (division == "NL")
  {
    //to Division 0
    division = "0";
  }
  
  //And convert division to a number
  division = division * 1;
  
  //Get hold of the TD containing the Score (in column 8 of the grid)
  var scoreTD = document.getElementById("R" + row + "C8");
  var score   = scoreTD.innerText || scoreTD.textContent; //innerText for IE || textContent for Firefox
  var homeScore = "";
  var awayScore = "";
  
  var homeTeamTD = document.getElementById("R" + row + "C4");
  var homeTeam   = homeTeamTD.innerText || homeTeamTD.textContent; //innerText for IE || textContent for Firefox
  var awayTeamTD = document.getElementById("R" + row + "C5");
  var awayTeam   = awayTeamTD.innerText || awayTeamTD.textContent; //innerText for IE || textContent for Firefox
  
  if ( (typeof(score) != "undefined") && (score != "") )
  {
    score = score.split("-");
    homeScore = (score[0] * 1); //Multiply by 1 to convert to a number
    awayScore = (score[1] * 1); //Multiply by 1 to convert to a number
  }

  //Increase the game count regardless
  this.GameCount.Total++;
  this.GameCount.Division[division]++;
  
  if ( (typeof(score) != "undefined") && (score != "") )
  {
    //We have a scoreline so increment the played count and add on the goals scored
    this.GoalCount.Total = this.GoalCount.Total + homeScore + awayScore;
    this.GoalCount.Division[division] = this.GoalCount.Division[division] + homeScore + awayScore;
    this.HomeGoals.Total = this.HomeGoals.Total + homeScore;
    this.HomeGoals.Division[division] = this.HomeGoals.Division[division] + homeScore;
    this.AwayGoals.Total = this.AwayGoals.Total + awayScore;
    this.AwayGoals.Division[division] = this.AwayGoals.Division[division] + awayScore;
    this.PlayedCount.Total++;
    this.PlayedCount.Division[division]++;
    
    //Determine from the scores whether it's a Home Win, a Draw or an Away Win and adjust the counters accordingly
    if (homeScore > awayScore)
    {
      this.HomeWins.Total++;
      this.HomeWins.Division[division]++;
    }
    else if (homeScore < awayScore)
    {
      this.AwayWins.Total++;
      this.AwayWins.Division[division]++;
    }
    else if (homeScore == awayScore)
    {
      this.Draws.Total++;
      this.Draws.Division[division]++;
    }
    
    //Update the lowest and highest stats
    if (homeScore == this.LowestHomeScore)
    {
      this.LowestHomeTeam += ", " + homeTeam;
    }    
    if (awayScore == this.LowestAwayScore)
    {
      this.LowestAwayTeam += ", " + awayTeam;
    }

    if (homeScore == this.HighestHomeScore)
    {
      this.HighestHomeTeam += ", " + homeTeam;
    }
    if (awayScore == this.HighestAwayScore)
    {
      this.HighestAwayTeam += ", " + awayTeam;
    }

    if (homeScore < this.LowestHomeScore)
    {
      this.LowestHomeScore = homeScore;
      this.LowestHomeTeam = homeTeam;
    }
    if (awayScore < this.LowestAwayScore)
    {
      this.LowestAwayScore = awayScore;
      this.LowestAwayTeam  = awayTeam;
    }

    if (homeScore > this.HighestHomeScore)
    {
      this.HighestHomeScore = homeScore;
      this.HighestHomeTeam  = homeTeam;
    }
    if (awayScore > this.HighestAwayScore)
    {
      this.HighestAwayScore = awayScore;
      this.HighestAwayTeam  = awayTeam;
    }
  }
  else
  {
    //No scoreline so increment the to play count
    this.ToPlayCount.Total++;
    this.ToPlayCount.Division[division]++;
  }      
}

function Tabs(pTabs)
{
  var ret = "";
  
  for (var i=1; i<=pTabs; i++)
  {
    //One tab equals 4 non breaking spaces
    ret += "&nbsp;&nbsp;&nbsp;&nbsp;"
  }
  
  return ret;
}

function Output_Division(obj)
{

  var s = "";
  
  for (var i=0; i<4; i++)
  {
    if (s == "")
    {
      s = obj.Division[i] + "";
    }
    else
    {
      s = s + "&nbsp;&nbsp;" + obj.Division[i];
    }
  }
  
  return s;
}

function Output_DivisionAverage(obj, objCount)
{
  var s = "";
  
  for (var i=0; i<4; i++)
  {
    average = 0;
    if (objCount.Division[i] != 0)
    {
      var average = (obj.Division[i] / objCount.Division[i]);
      average = parseInt(100 * average) / 100;
    }

    if (s == "")
    {
      s = average + "";
    }
    else
    {
      s = s + "&nbsp;&nbsp;" + average;
    }
  }
  
  return s;
}

function Statistics_Output()
{
  var scoreTitle = "Games already played: " + this.PlayedCount.Total + "<br>" +
                   Tabs(1) + "Per Division: " + Output_Division(this.PlayedCount) + "<br>" +
                   Tabs(1) + "Home Wins: " + this.HomeWins.Total + "<br>" +
                   Tabs(2) + "Per Division: " + Output_Division(this.HomeWins) + "<br>" + 
                   Tabs(1) + "Away Wins: " + this.AwayWins.Total +  "<br>" +
                   Tabs(2) + "Per Division: " + Output_Division(this.AwayWins) + "<br>" +
                   Tabs(1) + "Draws: " + this.Draws.Total +  "<br>" +
                   Tabs(2) + "Per Division: " + Output_Division(this.Draws) + "<br><br>" + 
                   "Games still to play: " + this.ToPlayCount.Total + "<br>" + 
                   Tabs(1) + "Per Division: " + Output_Division(this.ToPlayCount) + "<br><br>" +
                   "Total number of goals scored: " + this.GoalCount.Total +  "<br>" +
                   Tabs(1) + "Per Division: " + Output_Division(this.GoalCount) + "<br>" + 
                   Tabs(1) + "Home goals: " + this.HomeGoals.Total + "<br>" +
                   Tabs(2) + "Per Division: " + Output_Division(this.HomeGoals) + "<br>" +
                   Tabs(1) + "Away goals: " + this.AwayGoals.Total + "<br>" + 
                   Tabs(2) + "Per Division: " + Output_Division(this.AwayGoals);
                   
  if (this.PlayedCount.Total != 0)
  { 
    var average = (this.GoalCount.Total / this.PlayedCount.Total);
    var homeAverage = (this.HomeGoals.Total / this.PlayedCount.Total);
    var awayAverage = (this.AwayGoals.Total / this.PlayedCount.Total);
    average = parseInt(100 * average) / 100;
    homeAverage = parseInt(100 * homeAverage) / 100;
    awayAverage = parseInt(100 * awayAverage) / 100;
    scoreTitle = scoreTitle + "<br><br>Average goals scored per game: " + average + "<br>" +
                              Tabs(1) + "Per Division: " + Output_DivisionAverage(this.GoalCount, this.PlayedCount) + "<br>" +
                              Tabs(1) + "Home average: " + homeAverage + "<br>" +
                              Tabs(2) + "Per Division: " + Output_DivisionAverage(this.HomeGoals, this.PlayedCount) + "<br>" +
                              Tabs(1) + "Away average: " + awayAverage + "<br>" +
                              Tabs(2) + "Per Division: " + Output_DivisionAverage(this.AwayGoals, this.PlayedCount);
  }

  scoreTitle = scoreTitle + "<br><br>Highest and Lowest<br>" + 
                            Tabs(1) + "Highest home score: " + this.HighestHomeScore + "<br>" +
                            Tabs(2) + "By:" + this.HighestHomeTeam + "<br>" + 
                            Tabs(1) + "Highest away score: " + this.HighestAwayScore + "<br>" +
                            Tabs(2) + "By:" + this.HighestAwayTeam  + "<br>" + 
                            Tabs(1) + "Lowest home score: " + this.LowestHomeScore + "<br>" +
                            Tabs(2) + "By:" + this.LowestHomeTeam + "<br>" + 
                            Tabs(1) + "Lowest away score: " + this.LowestAwayScore + "<br>" +
                            Tabs(2) + "By:" + this.LowestAwayTeam + "<br>";  
  
  //Set the tooltip using the generated string
  SetTooltip(this.GameCount.Total, scoreTitle);
}

function ButtonBarFilter_ApplyFilters()
{
  //Create a new statistics object
  var stats = new Statistics();
  
  //Run through all the rows in the fixture list
  for (var row=1; row<RowCount; row++)
  {
    //Get hold of the Row
    var r = document.getElementById("R" + row);
    
    //<TR ID='R1' class='TEAMCODE_CIT2CIT1 REFCODE_LIT1 TEAMREFCODE_CIT2CIT1LIT1 YYYYMMDD_20060927'>
    //Split the class into its component parts:
    //  [TEAMCODE_CIT2CIT1] [REFCODE_LIT1] [TEAMREFCODE_CIT2CIT1LIT1] [YYYYMMDD_20060927]
    var c = r.className.split(" ");
  
    //Start off assuming initially that there is no match on the filter for this Button Bar
    var filterMatch = new Array();
    
    //Run through all of the Button Bars in the ButtonBarFilter object
    for (var bb=0; bb<this.ButtonBar.length; bb++)
    {
      //Create a brand new filter array for this Button Bar
      var filters = new Array();  
    
      //Grab hold of the bth button bar
      var bbb = this.ButtonBar[bb];

      //Get hold of all the buttons that are currently in the "Click" state
      var buttons = bbb.GetButtonState("Click");

      //Run through all the clicked buttons in this Button Bar
      for (var btn=0; btn<buttons.length; btn++)
      {
          //Determine the filterName, filterValue and filterOperation of each buttons that is in the "Click" state
          var filter = new Filter();
          filter.FilterName      = buttons[btn].FilterName;
          filter.FilterValue     = buttons[btn].FilterValue;
          filter.FilterOperation = buttons[btn].FilterOperation;
          filters.push(filter);
      }

      //Assume the filter for this Button Bar is initially false
      filterMatch[bb] = false;
        
      for (var j=0; j<c.length; j++)
      {
        //Split the classes into name/value pairs (either side of the "_" character)
        //  [TEAMCODE][CIT2CIT1] [REFCODE][LIT1] [TEAMREFCODE][CIT2CIT1LIT1] [YYYYMMDD][20060927]
        var fPair = c[j].split("_");
        var fName = fPair[0];
        var fValue = fPair[1];
        
        //Run through all the filters
        for (var f=0; f<filters.length; f++)
        {
          //Check the jth name to see if this is the one to filter on
          if (fName == filters[f].FilterName)
          {
            switch (filters[f].FilterOperation)
            {
                case "==":
                  if (fValue.indexOf(filters[f].FilterValue, 0) != -1) 
                  {
                    //Only do this if there is an exact match
                    if (filters[f].FilterName == "DIVISION")
                    {
                      if (fValue.length == (filters[f].FilterValue+"").length)
                      {
                        //This row matches the filter so set flag to true
                        filterMatch[bb] = true;
                      }
                    }
                    else
                    {
                      filterMatch[bb] = true;
                    }
                  }
                  break;

              case "<":
                if (fValue < filters[f].FilterValue)
                {
                  filterMatch[bb] = true;
                }
              break;

              case ">":
                if (fValue > filters[f].FilterValue)
                {
                  filterMatch[bb] = true;
                }
              break;
            }
          }
        }
      }
    }
    
    //Set filter to true initially
    var filter = true;
    
    for (var i=0; i<filterMatch.length; i++)
    {
      //And AND it with the value of the ith Filter Match
      filter = (filter && filterMatch[i]);
    }

    if (filter == true)
    {
      //This row matches one of the filters so show it
      r.style.display = '';

      //Add the details of this game to the stats object
      stats.AddGame(row);
    }
    else
    {
      //This row does not match any filter so hide it
      r.style.display = 'none';
    }
  }

  //Output the details of the stats object
  stats.Output();
}

function CalculateInitialStats()
{
  //Create a new statistics object
  var stats = new Statistics();

  //Run through all the rows in the fixture list
  for (var row=1; row<RowCount; row++)
  {
    //For each game in the fixture list, add the game detatils to the stats object
    stats.AddGame(row);    
  }
  
  //Output the details of the stats object
  stats.Output();
  
  //And hide the tooltip initially
  Tooltip('Out')
}

function Tooltip(pMode)
{
  var obj = document.getElementById("Tooltip");
  obj.style.visibility = (pMode == 'Over' ? "" : "hidden");

  //Showing the tooltip so work out where the ScoreTD is on the page
  var td = document.getElementById("btnStats");
  
  //If found the ScoreTD object
  if (td)
  {
    //Then set the left and top of the tooltip according to the position of the ScoreTD
    obj.style.left = GetElementLeft(td) + "px";
    obj.style.top = GetElementTop(td) + td.offsetHeight + "px";
  }
}

function SetTooltip(pGameCount, pText)
{  
  var obj = document.getElementById("TooltipHeader");
  obj.innerHTML = "CKA Statistics (" + pGameCount + " games selected)";
  var obj = document.getElementById("TooltipBody");
  obj.innerHTML = pText;
}

function Format(pField, pFieldWidth)
{
  var ret = pField;
  
  while (pField.length < pFieldWidth)
  {
    pField = " " + pField;
  }
  
  return ret;
}
