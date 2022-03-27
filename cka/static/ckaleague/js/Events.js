// © Copyright 2002+ Nick Armitage

//****************************************************************************
//  FUNCTION Prototypes in this file:
//
//  function AddAllDiaryEvents()
//
//****************************************************************************

//****************************************************************************
function AddAllDiaryEvents()
{
 try
 {
  //'E' = EA Cup Matches
  AddDiaryEvent(20010923, "E", "17:00", "18:00", "Norwich",    "Darren", "EA CUP<BR>UEA 4-14 Tigers");
  AddDiaryEvent(20010926, "E", "21:30", "22:30", "Perse",      "Darren", "EA CUP<BR>Tigers 21-5 Kites");
  AddDiaryEvent(20010930, "E", "15:00", "16:00", "Hills Road", "Darren", "EA CUP<BR>Tigers 8-6 Norwich City");
  AddDiaryEvent(20011007, "E", "12:00", "13:00", "Perse",      "Darren", "EA CUP<BR>Tigers 13-8 Norwich Union");
  
  //'1' = 1st Team Matches
  AddDiaryEvent(20011024, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 18-4 Tigers 2");
  AddDiaryEvent(20011108, "1", "21:00", "22:00", "CRC",        "Darren", "Phoenix 1 5-14 Tigers 1");
  AddDiaryEvent(20011113, "1", "22:00", "23:00", "Kelsey K",   "Darren", "Uni 1 6-20 Tigers 1");
  AddDiaryEvent(20011114, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 13-4 City 2");
  AddDiaryEvent(20011128, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 19-8 Kites 1");
  AddDiaryEvent(20011205, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 21-3 Uni 2");
  AddDiaryEvent(20011212, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 17-11 City 1");
  AddDiaryEvent(20020123, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 26-8 Kites 2");
  AddDiaryEvent(20020206, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 21-4 Phoenix 1");
  AddDiaryEvent(20020213, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 21-5 Phoenix 2");
  AddDiaryEvent(20020220, "1", "21:30", "22:30", "Perse",      "Darren", "Tigers 1 17-11 Uni 1");
  AddDiaryEvent(20020305, "1", "21:00", "22:00", "Kelsey K",   "Darren", "City 1 14-13 Tigers 1");
  AddDiaryEvent(20020310, "1", "20:00", "21:00", "Netherhall", "Darren", "Kites 1 v Tigers 1");

  //'2' = 2nd Team Matches
  AddDiaryEvent(20011021, "2", "20:00", "21:00", "Netherhall", "Paul",   "Kites 1 16-2 Tigers 2");
  AddDiaryEvent(20011107, "2", "21:30", "22:30", "Perse",      "Paul",   "Tigers 2 9-5 Phoenix 2");
  AddDiaryEvent(20011115, "2", "21:00", "22:00", "CRC",        "Paul",   "Phoenix 1 12-4 Tigers 2");
  AddDiaryEvent(20011121, "2", "21:30", "22:30", "Perse",      "Paul",   "Tigers 2 6-6 Uni 2");
  AddDiaryEvent(20011202, "2", "20:00", "21:00", "Netherhall", "Paul",   "Kites 2 8-8 Tigers 2");
  AddDiaryEvent(20011204, "2", "21:00", "22:00", "Kelsey K",   "Paul",   "City 2 11-6 Tigers 2");
  AddDiaryEvent(20020131, "2", "22:00", "23:00", "Kelsey K",   "Paul",   "Uni 1 4-3 Tigers 2");
  AddDiaryEvent(20020207, "2", "21:00", "22:00", "CRC",        "Paul",   "Phoenix 2 4-7 Tigers 2");
  AddDiaryEvent(20020212, "2", "21:00", "22:00", "Kelsey K",   "Paul",   "City 1 22-4 Tigers 2");
  AddDiaryEvent(20020227, "2", "21:30", "22:30", "Perse",      "Paul",   "Tigers 2 8-4 Kites 2");
  AddDiaryEvent(20020303, "2", "20:00", "21:00", "Kelsey K",   "Paul",   "Uni 2 9-11 Tigers 2");
  AddDiaryEvent(20020306, "2", "21.30", "22.30", "Perse",      "Paul",   "Tigers 2 11-6 City 2");

  //'3' = 3rd Team Matches
  AddDiaryEvent(20011031, "3", "21:30", "22:30", "Perse",      "Angela", "Tigers 3 6-6 Lions 1");
  AddDiaryEvent(20011122, "3", "21:00", "22:00", "Perse",      "Angela", "Phoenix 3 5-4 Tigers 3");
  AddDiaryEvent(20011127, "3", "21:00", "22:00", "Kelsey K",   "Angela", "City 3 0-5 Tigers 3");
  AddDiaryEvent(20011219, "3", "20:30", "21:30", "Perse",      "Angela", "Tigers 3 5-0 Kites 3");
  AddDiaryEvent(20020130, "3", "21:30", "22:30", "Perse",      "Angela", "Tigers 3 7-6 Phoenix 3");
  AddDiaryEvent(20020305, "3", "21:30", "22:30", "Littleport", "Angela", "Lions 1 5-0 Tigers 3");
  AddDiaryEvent(20020310, "3", "21:00", "22:00", "Netherhall", "Angela", "Kites 3 v Tigers 3");
  AddDiaryEvent(20020320, "3", "21:30", "22:30", "Perse",      "Angela", "Tigers 3 v City 3");

  //'R' = Reffing Commitments
  AddDiaryEvent(20011016, "R", "21:00", "22:00", "Kelsey K",   "",       "Reffing<BR>City 2 13-3 Uni 2");
  AddDiaryEvent(20011028, "R", "20:00", "21:00", "Netherhall", "",       "Reffing<BR>Kites 1 21-4 Kites 2");
  AddDiaryEvent(20011104, "R", "20:00", "21:00", "Netherhall", "",       "Reffing<BR>Kites 1 22-2 Uni 1");
  AddDiaryEvent(20011118, "R", "20:00", "21:00", "Netherhall", "",       "Reffing<BR>Kites 1 19-1 Phoenix 2");
  AddDiaryEvent(20011118, "R", "21:00", "22:00", "Netherhall", "",       "Reffing<BR>Kites 3 6-6 City 3");
  AddDiaryEvent(20011129, "R", "21:00", "22:00", "CRC",        "",       "Reffing<BR>Phoenix 1 9-7 Uni 1");
  AddDiaryEvent(20011204, "R", "21:30", "22:30", "Littleport", "",       "Reffing<BR>Lions 1 3-7 Kites 3");
  AddDiaryEvent(20011213, "R", "21:00", "22:00", "CRC",        "",       "Reffing<BR>Phoenix 1 13-7 City 2");
  AddDiaryEvent(20011218, "R", "21:00", "22:00", "Kelsey K",   "",       "Reffing<BR>City 1 22-2 Kites 2");
  AddDiaryEvent(20020131, "R", "21:00", "22:00", "CRC",        "",       "Reffing<BR>Phoenix 1 4-9 City 1");
  AddDiaryEvent(20020217, "R", "20:00", "21:00", "Netherhall", "",       "Reffing<BR>Kites 1 17-2 Uni 2");
  AddDiaryEvent(20020226, "R", "21:00", "22:00", "Kelsey K",   "",       "Reffing<BR>City 3 1-16 Phoenix 3");
  AddDiaryEvent(20020228, "R", "21:00", "22:00", "CRC",        "",       "Reffing<BR>Phoenix 2 14-4 Uni 2");  
  AddDiaryEvent(20020312, "R", "21:00", "22:00", "Kelsey K",   "",       "Reffing<BR>City 3 v Kites 3");
  AddDiaryEvent(20020317, "R", "20:00", "21:00", "Netherhall", "",       "Reffing<BR>Kites 3 v Lions 1"); 
  AddDiaryEvent(20020321, "R", "21:00", "22:00", "CRC",        "",       "Reffing<BR>Phoenix 1 v Kites 2");
  AddDiaryEvent(20020326, "R", "21:30", "22:30", "Littleport", "",       "Reffing<BR>Lions 1 v City 3");

  //'S' = Social Events
  AddDiaryEvent(20020222, "S", "20:00", "",      "Kingston Arms", "Jam",     "Jam's 600th day in Cambridge");
  AddDiaryEvent(20020316, "S", "19:30", "",      "?",             "Sheanna", "Spirit of the Dance");
  AddDiaryEvent(20020614, "S", "All",   "W/E",   "Thetford",      "Denise",  "Weekend at Center Parcs");
  AddDiaryEvent(20020615, "S", "All",   "W/E",   "Thetford",      "Denise",  "Weekend at Center Parcs");
  AddDiaryEvent(20020616, "S", "All",   "W/E",   "Thetford",      "Denise",  "Weekend at Center Parcs");

  //'M' = Meetings
  AddDiaryEvent(20020328, "M", "19:30", "21:00", "Pike & Eel", "", "CKA Meeting");
  
  //'T' = Tournaments
  AddDiaryEvent(20020713, "T", "All",   "Day",   "Littleport", "", "Cambridge Summer Tournament");
 }
 catch (error)
 {
   CatchError('AddAllDiaryEvents()', error.number, error.name, error.message);
 } 
}