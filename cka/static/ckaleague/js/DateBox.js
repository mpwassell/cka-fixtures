//********************************************************************************************
//
// © Copyright 2011 ArmzSoft
//
//********************************************************************************************
//
//  FUNCTION Prototypes in this file:
//
//  DateBox (theDelimiter, theFormat, theWarningID, theDefaultTextColor, theMaskTextColor)
//  {
//    .DelimiterKeyBoard()
//    .DelimiterKeyPad()
//    .DateMask()
//    .OnEvent(theEventType, theEvent, theBox)
//    .OnFocus(theEvent, theBox)
//    .OnKeyDown(theEvent, theBox)
//    .IsValid(theEvent, theBox)
//    .OnBlur(theEvent, theBox, isValid)
//
//    .setSelectionRange(input, selectionStart, selectionEnd)
//    .NameOfMonth(theMonth)
//    .MessageBox(theMsgText, theMsgType)
//    .MessageBox1(theMsgText, theMsgType, theWarningID)
//    .SetWarning(theMsg, theWarningID)
//    .CatchError(theFunctionName, theErrorNumber, theErrorName, theErrorMessage)
//    .CharacterCount(theChar, theValue)
//    .Century(YY)
//    .FixDate(theBox, theDelimiter, theDateFormat)
//  }
//    
//********************************************************************************************

DateBox = function(theDelimiter, theFormat, theWarningID, theDefaultTextColor, theMaskTextColor) 
{
    this.Delimiter = theDelimiter ? theDelimiter : "/";
    this.DateFormat = theFormat ? theFormat : "UK";
    this.WarningID = theWarningID ? theWarningID : null;
    this.DefaultTextColor = theDefaultTextColor ? theDefaultTextColor : "#000000";
    this.MaskTextColor = theMaskTextColor ? theMaskTextColor : "#808080";

    this.DelimiterKeyBoard = function()
    {
        switch (this.Delimiter)
        {
            case "/":
                return 191;
                break;

            case "-":
                return 190;
                break;
        }
    }

    this.DelimiterKeyPad = function()
    {
        switch (this.Delimiter)
        {
            case "/":
                return 111;
                break;

            case "-":
                return 109;
                break;
        }
    }

    this.DateMask = function()
    {
        switch (this.DateFormat)
        {
            case "UK":
                return "dd" + this.Delimiter + "mm" + this.Delimiter + "yyyy";
                break;

            case "US":
                return "mm" + this.Delimiter + "dd" + this.Delimiter + "yyyy";
                break;
        }
    }

    this.OnEvent = function(theEventType, theEvent, theBox)
    {
        switch (theEventType)
        {
            case "Focus":
                return this.OnFocus(theEvent, theBox);
                break;

            case "KeyDown":
                return this.OnKeyDown(theEvent, theBox);
                break;

            case "Blur":
                return this.OnBlur(theEvent, theBox);
                break;
        }
    }

    this.OnFocus = function(theEvent, theBox)
    {
        try
        {
            //Clear the contents of this date box only if it is displaying the mask
            if (theBox.value == this.DateMask())
            {
                theBox.value = '';
            }

            //Always set the color to DefaultTextColor when this control receives the focus
            theBox.style.color = this.DefaultTextColor;

            //Select all text in the date box
            this.setSelectionRange(theBox, 0, theBox.value.length);
        }
        catch (error)
        {
            this.CatchError('DateBox.OnFocus()', error.number, error.name, error.message);
        }
    }

    this.OnKeyDown = function(theEvent, theBox)
    {
        try
        {
            //window.event => IE browser; theEvent => W3C compliant browsers
            //     keyCode => IE browser;    which => W3C compliant browsers
            var evt = (window.event) ? window.event : theEvent;
            var kc = (window.event) ? evt.keyCode : evt.which;

            var ControlKey = false;
            var NumberKey = false;

            //Assume initially that the key just pressed is invalid
            var ValidKey = false;

            switch (kc)
            {
                //Tab (9) 
                case 9:
                    if (this.IsValid(theEvent, theBox) == true)
                    {
                        //The date is valid so the Tab key is a valid Control key
                        ControlKey = true;
                        ValidKey = true;
                    }
                    break;

                //Backspace (8), Del(46) 
                //Home (36), End (35), Left (37), Right (39) and Shift (16) 
                //DelimiterKeypad 
                case 8: case 46:
                case 36: case 35: case 37: case 39: case 16:
                case this.DelimiterKeyPad():
                    //The above keys are valid Control keys
                    ControlKey = true;
                    ValidKey = true;
                    break;

                case 27:
                    //Escape (27) blanks out the value and is a valid Control key
                    ControlKey = true;
                    ValidKey = true;
                    break;
            }

            //Only allow the following characters if the shift key is not pressed
            if (evt.shiftKey == false)
            {
                switch (kc)
                {
                    //Keyboard '0' to '9' (48 to 57) 
                    //Keypad '0' to '9' (96 to 105) 
                    //DelimiterKeyBoard 
                    case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
                    case 96: case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105:
                    case this.DelimiterKeyBoard():
                        //The above keys are valid Number keys
                        NumberKey = true;
                        ValidKey = true;
                        break;
                }
            }

            if (ValidKey == false)
            {
                if (window.event)
                {
                    //returnValue and cancelBubble => IE browser to prevent the key from bubbling up to other handlers
                    evt.returnValue = false;
                    evt.cancelBubble = true;
                }
                else {
                    //preventDefault and stopPropagation => W3C compliant browsers to prevent the key from propagating to other handlers
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            }
        }
        catch (error)
        {
            this.CatchError('DateBox.OnKeyDown()', error.number, error.name, error.message);
        }
    }

    this.IsValid = function(theEvent, theBox)
    {
        try
        {
            return this.OnBlur(theEvent, theBox, true);
        }
        catch (error)
        {
            this.CatchError('DateBox.IsValid()', error.number, error.name, error.message);
        }
    }

    this.OnBlur = function(theEvent, theBox, isValid)
    {
        try
        {
            //window.event => IE browser; theEvent => W3C compliant browsers
            var evt = (window.event) ? window.event : theEvent;

            //Clear the warning text
            this.SetWarning("", this.WarningID);

            //If this date box is empty, redisplay the relevant date mask
            //Otherwise proceed to check the validity of this date.
            if (theBox.value == '') 
            {
                if (!isValid) 
                {
                    theBox.style.color = this.MaskTextColor;
                    theBox.value = this.DateMask();
                }
                return true;
            }

            //Try to fix the date in the date box
            var DateToCheck = this.FixDate(theBox, this.Delimiter, this.DateFormat);

            if (DateToCheck.length < 10) 
            {
                //Valid date is in mm/dd/yyyy or dd/mm/yyyy format
                //This date is <10 chars and therefore not valid
                this.MessageBox1(DateToCheck, "date", this.WarningID);
                return false;
            }

            //Count the number of Delimiters there are in the date
            if (this.CharacterCount(this.Delimiter, DateToCheck) != 2) 
            {
                //Having fixed the dated box there should always be two Delimiters in the date
                //If there aren't then this cannot be a valid date
                this.MessageBox1(DateToCheck, "date", this.WarningID);
                return false;
            }

            if (this.DateFormat == 'UK')
            {
                //UK date format
                var DayToCheck = DateToCheck.slice(0, 2);
                var MonthToCheck = DateToCheck.slice(3, 5);
            }
            else {
                //US date format
                var DayToCheck = DateToCheck.slice(3, 5);
                var MonthToCheck = DateToCheck.slice(0, 2);
            }

            //Year will have the same location regardless
            var YearToCheck = DateToCheck.slice(6, 10);

            if (YearToCheck < 1900 || YearToCheck > 2199)
            {
                //Year is not valid so inform user
                this.MessageBox1(YearToCheck, "year", this.WarningID);
                return false;
            }

            // Resolve leap year cases
            var MaxDays = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            if (((YearToCheck % 4 == 0) && (YearToCheck % 100 != 0)) || (YearToCheck % 400 == 0))
            {
                MaxDays[2] = 29;
            }

            // Checking the validity of this date
            if ((MonthToCheck < 1) || (MonthToCheck > 12))
            {
                //Month is not valid so inform user
                this.MessageBox1(MonthToCheck, "month", this.WarningID);
                return false;
            }

            if ((DayToCheck < 1) || (DayToCheck > MaxDays[MonthToCheck * 1]))
            {
                //Day is not valid for this month so inform user
                this.MessageBox1(DayToCheck, "day for " + this.NameOfMonth(MonthToCheck * 1), this.WarningID);
                return false;
            }

            //Made it this far so the date must be valid.
            if (!isValid)
            {
                theBox.value = DateToCheck;
            }

            //Return true to the calling routine
            return true;
        }
        catch (error)
        {
            this.CatchError('DateBox.OnBlur()', error.number, error.name, error.message);
        }
    }

    this.setSelectionRange = function(input, selectionStart, selectionEnd)
    {
        //Check if the setSelectionRange method is available on the input control
        if (input.setSelectionRange)
        {
            //It is so set focus to the input control and select the relevant part of the input
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange)
        {
            //Check if the createTextRange method is available on the input control
            //it is so create a text range
            var range = input.createTextRange();

            //Move the insertion point to the start (true) of the text range
            range.collapse(true);

            //Move to the end of the text range
            range.moveEnd('character', selectionEnd);

            //Then move to the start of the text range
            range.moveStart('character', selectionStart);

            //Select the current text range
            range.select();
        }
    }

    this.NameOfMonth = function(theMonth)
    {
        var ret = "";
        var monthNames = new Array("", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

        if ((theMonth >= 1) && (theMonth <= 12))
        {
            ret = monthNames[theMonth];
        }

        return ret;
    }

    this.MessageBox = function(theMsgText, theMsgType)
    {
        var msg = theMsgText + " is not a valid " + theMsgType + ".\n\nPlease check the details and try again.";
        alert(msg);
    }

    this.MessageBox1 = function(theMsgText, theMsgType, theWarningID)
    {
        //Set up the message using the text and type
        //var msg = theMsgText + " is not a valid " + theMsgType;
        var msg = 'Invalid date';
        
        //And set the warning
        this.SetWarning(msg, theWarningID);
    }

    this.SetWarning = function(theMsg, theWarningID)
    {
        var obj = document.getElementById(theWarningID);

        if (obj)
        {
            if (window.event)
            {
                obj.innerText = theMsg;
            }
            else
            {
                obj.innerHTML = theMsg;
            }
        }
    }

    this.CatchError = function(theFunctionName, theErrorNumber, theErrorName, theErrorMessage)
    {
        alert('Function=' + theFunctionName + ', Error Number=' + theErrorNumber + ', Error Name=' + theErrorName + ', Error Message=' + theErrorMessage);
    }

    this.CharacterCount = function(theChar, theValue)
    {
        var i;
        var theCounter = 0;

        //Run through all characters in the value
        for (i = 0; i < theValue.length; i++)
        {
            //If you come across the character that is to be counted
            if (theValue.slice(i, i + 1) == theChar)
            {
                //Increase the counter by one
                theCounter = theCounter + 1;
            }
        }

        //Return the counter to the calling routine
        return theCounter;
    }

    this.Century = function(YY)
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

    this.FixDate = function(theBox, theDelimiter, theDateFormat)
    {
        try
        {
            var ret = theBox.value;

            var TheDate = ret;
            var i;
            var DelimiterCount = 0;
            var DelimiterPos = '';

            for (i = 0; i < TheDate.length; i++)
            {
                if (TheDate.slice(i, i + 1) == theDelimiter)
                {
                    DelimiterCount = DelimiterCount + 1;
                    DelimiterPos = DelimiterPos + (i + 1) + "";
                }
            }

            switch (DelimiterCount)
            {
                case 1:
                    DelimiterPos = DelimiterPos + "0";
                    break;

                case 0:
                    DelimiterPos = DelimiterPos + "00";
                    break;
            }

            //Generate the code according to the date input
            var Code = TheDate.length + "-" + DelimiterCount + "-" + DelimiterPos;

            var RightNow = new Date();
            var YYYY = RightNow.getFullYear() + "";
            var YY = YYYY.slice(0, 2);
            var MM = RightNow.getMonth() + 1 + "";
            if (MM.length == 1)
                MM = "0" + MM;
            var DD = RightNow.getDate() + "";
            if (DD.length == 1)
                DD = "0" + DD;

            switch (Code)
            {
                case '10-2-36': // mm/dd/yyyy or dd/mm/yyyy
                    ret = TheDate;
                    break;

                case '8-2-36':  // mm/dd/yy or dd/mm/yy
                    ret = TheDate.slice(0, 6) + this.Century(TheDate.slice(6, 8));
                    break;

                case '5-1-30':  // mm/dd or dd/mm
                case '6-2-36':  // mm/dd/ or dd/mm/
                    ret = TheDate.slice(0, 5) + theDelimiter + YYYY;
                    break;

                case '9-2-35':  // mm/d/yyyy or dd/m/yyyy
                    ret = TheDate.slice(0, 3) + "0" + TheDate.slice(3, 9);
                    break;

                case '7-2-36': //mm/dd/y or dd/mm/y
                    ret = TheDate.slice(0, 5) + "200" + TheDate.slice(6, 7);
                    break;

                case '7-2-35':  // mm/d/yy or dd/m/yy
                    ret = TheDate.slice(0, 3) + "0" + TheDate.slice(3, 5) + this.Century(TheDate.slice(5, 7));
                    break;

                case '9-2-25':  // m/dd/yyyy or d/mm/yyyy
                    ret = "0" + TheDate.slice(0, 9);
                    break;

                case '7-2-25':  // m/dd/yy or d/mm/yy
                    ret = "0" + TheDate.slice(0, 5) + this.Century(TheDate.slice(5, 7));
                    break;

                case '4-1-30':  // mm/d or dd/m
                case '5-2-35':  // mm/d/ or dd/m/
                    ret = TheDate.slice(0, 3) + "0" + TheDate.slice(3, 4) + theDelimiter + YYYY;
                    break;

                case '4-1-20':  // m/dd or d/mm
                case '5-2-25':  // m/dd/ or d/mm/
                    ret = "0" + TheDate.slice(0, 4) + theDelimiter + YYYY;
                    break;

                case '8-2-24':  // m/d/yyyy or d/m/yyyy
                    ret = "0" + TheDate.slice(0, 2) + "0" + TheDate.slice(2, 8);
                    break;

                case '6-2-24':  // m/d/yy or d/m/yy
                    ret = "0" + TheDate.slice(0, 2) + "0" + TheDate.slice(2, 4) + this.Century(TheDate.slice(4, 6));
                    break;

                case '3-1-20':  // m/d or d/m
                case '4-2-24':  // m/d/ or d/m/
                    ret = "0" + TheDate.slice(0, 2) + "0" + TheDate.slice(2, 3) + theDelimiter + YYYY;
                    break;

                case '8-0-00':  // mmddyyyy or ddmmyyyy
                    ret = TheDate.slice(0, 2) + theDelimiter + TheDate.slice(2, 4) + theDelimiter + TheDate.slice(4, 8);
                    break;

                case '6-0-00':  // mmddyy or ddmmyy
                    ret = TheDate.slice(0, 2) + theDelimiter + TheDate.slice(2, 4) + theDelimiter + this.Century(TheDate.slice(4, 6));
                    break;

                case '4-0-00':  // mmdd or ddmm
                    ret = TheDate.slice(0, 2) + theDelimiter + TheDate.slice(2, 4) + theDelimiter + YYYY;
                    break;

                case '2-0-00':  //mm or dd
                case '3-1-30':  //mm/ or dd/
                    switch (theDateFormat)
                    {
                        case "UK":
                            ret = TheDate.slice(0, 2) + theDelimiter + MM + theDelimiter + YYYY;
                            break;

                        case "US":
                            ret = TheDate.slice(0, 2) + theDelimiter + DD + theDelimiter + YYYY;
                            break;
                    }
                    break;

                case '1-0-00':  //m or d
                case '2-1-20':  //m/ or d/
                    switch (theDateFormat)
                    {
                        case "UK":
                            ret = "0" + TheDate.slice(0, 1) + theDelimiter + MM + theDelimiter + YYYY;
                            break;

                        case "US":
                            ret = "0" + TheDate.slice(0, 1) + theDelimiter + DD + theDelimiter + YYYY;
                            break;
                    }
                    break;
            }

            return ret;
        }
        catch (error)
        {
            this.CatchError('DateBox.FixDate()', error.number, error.name, error.message);
        }
    }
}

TimeBox = function(theDelimiter, theFormat, theWarningID, theDefaultTextColor, theMaskTextColor)
{
    this.Delimiter = theDelimiter ? theDelimiter : ":";
    this.TimeFormat = theFormat ? theFormat : "hhmm";
    this.WarningID = theWarningID ? theWarningID : null;
    this.DefaultTextColor = theDefaultTextColor ? theDefaultTextColor : "#000000";
    this.MaskTextColor = theMaskTextColor ? theMaskTextColor : "#c0c0c0";

    this.DelimiterKeyBoard = function()
    {
        return 186; //What is the keycode for the ":" character
    }

    this.TimeMask = function()
    {
        switch (this.TimeFormat)
        {
            case "hhmm":
                return "hh" + this.Delimiter + "mm";
                break;

            case "hhmmss":
                return "hh" + this.Delimiter + "mm" + this.Delimiter + "ss";
                break;
        }
    }

    this.OnEvent = function(theEventType, theEvent, theBox)
    {
        switch (theEventType)
        {
            case "Focus":
                return this.OnFocus(theEvent, theBox);
                break;

            case "KeyDown":
                return this.OnKeyDown(theEvent, theBox);
                break;

            case "Blur":
                return this.OnBlur(theEvent, theBox);
                break;
        }
    }

    this.OnFocus = function(theEvent, theBox)
    {
        try
        {
            //Clear the contents of this time box only if it is displaying the mask
            if (theBox.value == this.TimeMask())
            {
                theBox.value = '';
            }

            //Always set the color to DefaultTextColor when this control receives the focus
            theBox.style.color = this.DefaultTextColor;

            //Select all text in the time box
            this.setSelectionRange(theBox, 0, theBox.value.length);
        }
        catch (error)
        {
            this.CatchError('TimeBox.OnFocus()', error.number, error.name, error.message);
        }
    }

    this.OnKeyDown = function(theEvent, theBox)
    {
        try
        {
            //window.event => IE browser; theEvent => W3C compliant browsers
            //     keyCode => IE browser;    which => W3C compliant browsers
            var evt = (window.event) ? window.event : theEvent;
            var kc = (window.event) ? evt.keyCode : evt.which;

            var ControlKey = false;
            var NumberKey = false;

            //Assume initially that the key just pressed is invalid
            var ValidKey = false;

            switch (kc)
            {
                //Tab (9)         
                case 9:
                    if (this.IsValid(theEvent, theBox) == true)
                    {
                        //The date is valid so the Tab key is a valid Control key
                        ControlKey = true;
                        ValidKey = true;
                    }
                    break;

                //Backspace (8), Del(46)         
                //Home (36), End (35), Left (37), Right (39) and Shift (16)         
                case 8: case 46:
                case 36: case 35: case 37: case 39: case 16:
                    //The above keys are valid Control keys
                    ControlKey = true;
                    ValidKey = true;
                    break;

                case 27:
                    //Escape (27) blanks out the value and is a valid Control key
                    ControlKey = true;
                    ValidKey = true;
                    break;
            }

            //Only allow the following characters if the shift key is not pressed
            if (evt.shiftKey == false)
            {
                switch (kc)
                {
                    //Keyboard '0' to '9' (48 to 57)         
                    //Keypad '0' to '9' (96 to 105)         
                    case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
                    case 96: case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105:
                        //The above keys are valid Number keys
                        NumberKey = true;
                        ValidKey = true;
                        break;
                }
            }

            //Only allow the following characters if the shift key is pressed
            if (evt.shiftKey == true)
            {
                switch (kc)
                {
                    case this.DelimiterKeyBoard():
                        //The above keys are valid Number keys
                        NumberKey = true;
                        ValidKey = true;
                        break;
                }
            }

            if (ValidKey == false)
            {
                if (window.event)
                {
                    //returnValue and cancelBubble => IE browser to prevent the key from bubbling up to other handlers
                    evt.returnValue = false;
                    evt.cancelBubble = true;
                }
                else
                {
                    //preventDefault and stopPropagation => W3C compliant browsers to prevent the key from propagating to other handlers
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            }
        }
        catch (error)
        {
            this.CatchError('TimeBox.OnKeyDown()', error.number, error.name, error.message);
        }
    }

    this.IsValid = function(theEvent, theBox)
    {
        try
        {
            return this.OnBlur(theEvent, theBox, true);
        }
        catch (error)
        {
            this.CatchError('TimeBox.IsValid()', error.number, error.name, error.message);
        }
    }

    this.OnBlur = function(theEvent, theBox, isValid)
    {
        try
        {
            //window.event => IE browser; theEvent => W3C compliant browsers
            var evt = (window.event) ? window.event : theEvent;

            //Clear the warning text
            this.SetWarning("", this.WarningID);

            //If this time box is empty, redisplay the relevant time mask
            //Otherwise proceed to check the validity of this time.
            if (theBox.value == '')
            {
                if (!isValid)
                {
                    theBox.style.color = this.MaskTextColor;
                    theBox.value = this.TimeMask();
                }
                return true;
            }

            //Try to fix the time in the time box
            var TimeToCheck = this.FixTime(theBox, this.Delimiter, this.TimeFormat);

            if (TimeToCheck.length < this.TimeMask().length)
            {
                //Valid time is in "hh:mm" or "hh:mm:ss" format
                //This date is not long enough and therefore not valid
                this.MessageBox1(TimeToCheck, "time", this.WarningID);
                return false;
            }

            //Count the number of Delimiters there are in the time
            if (this.CharacterCount(this.Delimiter, TimeToCheck) != this.CharacterCount(this.Delimiter, this.TimeMask()))
            {
                //Having fixed the time box there should always be one (hh:mm) or two (hh:mm:ss) Delimiters in the time (depending on the TimeMask)
                //If there aren't then this cannot be a valid time
                this.MessageBox1(TimeToCheck, "time", this.WarningID);
                return false;
            }

            //Grab hold of the hour and minute (and second) to check - hh:mm:ss
            var HourToCheck = TimeToCheck.slice(0, 2);
            var MinuteToCheck = TimeToCheck.slice(3, 5);
            var SecondToCheck = "";

            if (this.TimeFormat == "hhmmss")
            {
                SecondToCheck = TimeToCheck.slice(6, 8);
            }

            //Check the validity of the Hour
            if (HourToCheck < "00" || HourToCheck > "23")
            {
                //Hour is not valid so inform user
                this.MessageBox1(HourToCheck, "hour", this.WarningID);
                return false;
            }

            //Check the validity of the Minute
            if ((MinuteToCheck < "00") || (MinuteToCheck > "59"))
            {
                //Minute is not valid so inform user
                this.MessageBox1(MinuteToCheck, "minute", this.WarningID);
                return false;
            }

            if (this.TimeFormat == "hhmmss")
            {
                //Check the validity of the Second
                if ((SecondToCheck < "00") || (SecondToCheck > "59"))
                {
                    //Second is not valid so inform user
                    this.MessageBox1(SecondToCheck, "second", this.WarningID);
                    return false;
                }
            }

            //Made it this far so the time must be valid.
            if (!isValid)
            {
                theBox.value = TimeToCheck;
            }

            //Return true to the calling routine
            return true;
        }
        catch (error)
        {
            this.CatchError('TimeBox.OnBlur()', error.number, error.name, error.message);
        }
    }

    this.setSelectionRange = function(input, selectionStart, selectionEnd)
    {
        //Check if the setSelectionRange method is available on the input control
        if (input.setSelectionRange)
        {
            //It is so set focus to the input control and select the relevant part of the input
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
        }
        else if (input.createTextRange)
        {
            //Check if the createTextRange method is available on the input control
            //it is so create a text range
            var range = input.createTextRange();

            //Move the insertion point to the start (true) of the text range
            range.collapse(true);

            //Move to the end of the text range
            range.moveEnd('character', selectionEnd);

            //Then move to the start of the text range
            range.moveStart('character', selectionStart);

            //Select the current text range
            range.select();
        }
    }

    this.MessageBox = function(theMsgText, theMsgType)
    {
        var msg = theMsgText + " is not a valid " + theMsgType + ".\n\nPlease check the details and try again.";
        alert(msg);
    }

    this.MessageBox1 = function(theMsgText, theMsgType, theWarningID)
    {
        //Set up the message using the text and type
        var msg = theMsgText + " is not a valid " + theMsgType;

        //And set the warning
        this.SetWarning(msg, theWarningID);
    }

    this.SetWarning = function(theMsg, theWarningID)
    {
        var obj = document.getElementById(theWarningID);

        if (obj)
        {
            if (window.event)
            {
                obj.innerText = theMsg;
            }
            else
            {
                obj.innerHTML = theMsg;
            }
        }
    }

    this.CatchError = function(theFunctionName, theErrorNumber, theErrorName, theErrorMessage)
    {
        alert('Function=' + theFunctionName + ', Error Number=' + theErrorNumber + ', Error Name=' + theErrorName + ', Error Message=' + theErrorMessage);
    }

    this.CharacterCount = function(theChar, theValue)
    {
        var i;
        var theCounter = 0;

        //Run through all characters in the value
        for (i = 0; i < theValue.length; i++)
        {
            //If you come across the character that is to be counted
            if (theValue.slice(i, i + 1) == theChar)
            {
                //Increase the counter by one
                theCounter = theCounter + 1;
            }
        }

        //Return the counter to the calling routine
        return theCounter;
    }

    this.FixTime = function(theBox, theDelimiter, theTimeFormat)
    {
        try
        {
            var ret = theBox.value;

            var TheTime = ret;
            var i;
            var DelimiterCount = 0;
            var DelimiterPos = '';

            for (i = 0; i < TheTime.length; i++)
            {
                if (TheTime.slice(i, i + 1) == theDelimiter)
                {
                    DelimiterCount = DelimiterCount + 1;
                    DelimiterPos = DelimiterPos + (i + 1) + "";
                }
            }

            switch (DelimiterCount)
            {
                case 1:
                    DelimiterPos = DelimiterPos + "0";
                    break;

                case 0:
                    DelimiterPos = DelimiterPos + "00";
                    break;
            }

            //Generate the code according to the time input
            var Code = TheTime.length + "-" + DelimiterCount + "-" + DelimiterPos;

            var RightNow = new Date();
            var HH = RightNow.getHours() + "";
            var MM = RightNow.getMinutes() + "";
            if (MM.length == 1)
                MM = "0" + MM;
            var SS = RightNow.getSeconds() + "";
            if (SS.length == 1)
                SS = "0" + SS;

            switch (Code)
            {
                case '8-2-36': // hh:mm:ss
                    ret = TheTime;
                    break;

                case '5-1-30': // hh:mm
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = TheTime;
                            break;

                        case 'hhmmss':
                            ret = TheTime + theDelimiter + "00";
                            break;
                    }
                    break;

                case '2-0-00': // hh
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = TheTime + theDelimiter + "00";
                            break;

                        case 'hhmmss':
                            ret = TheTime + theDelimiter + "00" + theDelimiter + "00";
                            break;
                    }
                    break;

                case '6-0-00': // hhmmss
                    switch (theTimeFormat)
                    {
                        case 'hhmmss':
                            ret = TheTime.slice(0, 2) + theDelimiter + TheTime.slice(2, 4) + theDelimiter + TheTime.slice(4,6);
                            break;
                    }
                    break;

                case '4-0-00': // hhmm
                    switch (theTimeFormat) 
                    {
                        case 'hhmm':
                            ret = TheTime.slice(0,2) + theDelimiter + TheTime.slice(2,4);
                            break;

                        case 'hhmmss':
                            ret = TheTime.slice(0, 2) + theDelimiter + TheTime.slice(2, 4) + theDelimiter + "00";
                            break;
                    }
                    break;
                    
                case '3-1-30': // hh:
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = TheTime + "00";
                            break;

                        case 'hhmmss':
                            ret = TheTime + "00" + theDelimiter + "00";
                            break;
                    }
                    break;

                case '2-1-20': // h:
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = TheTime + "00";
                            break;

                        case 'hhmmss':
                            ret = TheTime + "00" + theDelimiter + "00";
                            break;
                    }
                    break;

                case '4-1-30': // hh:m
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = TheTime + "0";
                            break;

                        case 'hhmmss':
                            ret = TheTime + "0" + theDelimiter + "00";
                            break;
                    }
                    break;

                case '4-1-20': // h:mm
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = "0" + TheTime;
                            break;

                        case 'hhmmss':
                            ret = "0" + TheTime + theDelimiter + "00";
                            break;
                    }
                    break;

                case '3-1-20': // h:m
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = "0" + TheTime + "0";
                            break;

                        case 'hhmmss':
                            ret = "0" + TheTime + "0" + theDelimiter + "00";
                            break;
                    }
                    break;

                case '1-0-00': //h
                    switch (theTimeFormat)
                    {
                        case 'hhmm':
                            ret = '0' + TheTime.slice(0, 1) + theDelimiter + "00";
                            break;

                        case 'hhmmss':
                            ret = '0' + TheTime.slice(0, 1) + theDelimiter + "00" + theDelimiter + "00";
                            break;
                    }
                    break;
            }

            return ret;
        }
        catch (error)
        {
            this.CatchError('TimeBox.FixTime()', error.number, error.name, error.message);
        }
    }
}