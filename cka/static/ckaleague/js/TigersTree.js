// Part 1 - Tree nodes
var TREE_NODES = 
[
  ['Home Page',             'HomePage.htm',                 'MAIN'],
  ['What Is Korfball?',     'WhatIs.htm',                   'MAIN'],
  ['Join Us',               'JoinUs.htm',                   'MAIN'],
  ['Find Us',               'FindUs.htm',                   'MAIN'],
  ['Diary',                 'DiaryNew.htm',                 'MAIN'],
  ['Tigers in the News',    'NewsFrame.htm',                'MAIN'],
  ['Photos', null, null, 
    ['The Committee',       'Photo1.htm',                   'MAIN'],
    ['The Club',            'Photo2.htm',                   'MAIN'],
    ['The Archives',        'Photo3.htm',                   'MAIN']
  ],
  ['Any Questions?',        'Construction.htm',             'MAIN'],
  ['The Rules of Korfball', 'TheRules.htm',                 'MAIN'],
  ['Korfball Links',        'Links.htm',                    'MAIN'],
  ['Basics of Korfball',    'BOK.htm',                      'MAIN',
    ['Order Now',           'OrderForm.htm',                'MAIN'],
    ['More Info',           'MoreInfo.htm',                 'MAIN']
  ],
  ['CKA', null, null,
	['2012/2013 Season', null, null,
      ['Div 1', 'Upload2012/Division1.htm', 'MAIN'],
      ['Div 1 Goals', 'Upload2012/Stats1.htm', 'MAIN'],
      ['Div 2', 'Upload2012/Division2.htm', 'MAIN'],
      ['Div 2 Goals', 'Upload2012/Stats2.htm', 'MAIN'],
      ['Div 3', 'Upload2012/Division3.htm', 'MAIN'],
      ['Div 3 Goals', 'Upload2012/Stats3.htm', 'MAIN'],
      ['SERL 1', 'Upload2012/Stats-1.htm', 'MAIN'],
      ['SERL 2', 'Upload2012/Stats-2.htm', 'MAIN'],
      ['Status List', 'Upload2012/StatusList.htm', 'MAIN'],
      ['Season', 'SeasonFrame2012.htm', 'MAIN'],
      ['Fixtures', 'Upload2012/FixtureList.htm', 'MAIN']
    ],
    ['2011/2012 Season', null, null,
      ['Div 1', 'Upload2011/Division1.htm', 'MAIN'],
      ['Div 1 Goals', 'Upload2011/Stats1.htm', 'MAIN'],
      ['Div 2', 'Upload2011/Division2.htm', 'MAIN'],
      ['Div 2 Goals', 'Upload2011/Stats2.htm', 'MAIN'],
      ['Div 3', 'Upload2011/Division3.htm', 'MAIN'],
      ['Div 3 Goals', 'Upload2011/Stats3.htm', 'MAIN'],
      ['SERL 1', 'Upload2011/Stats-1.htm', 'MAIN'],
      ['SERL 2', 'Upload2011/Stats-2.htm', 'MAIN'],
      ['Status List', 'Upload2011/StatusList.htm', 'MAIN'],
      ['Season', 'SeasonFrame2011.htm', 'MAIN'],
      ['Fixtures', 'Upload2011/FixtureList.htm', 'MAIN']
    ],
    ['2010/2011 Season', null, null,
      ['Div 1', 'Upload2010/Division1.htm', 'MAIN'],
      ['Div 1 Goals', 'Upload2010/Stats1.htm', 'MAIN'],
      ['Div 2', 'Upload2010/Division2.htm', 'MAIN'],
      ['Div 2 Goals', 'Upload2010/Stats2.htm', 'MAIN'],
      ['Div 3', 'Upload2010/Division3.htm', 'MAIN'],
      ['Div 3 Goals', 'Upload2010/Stats3.htm', 'MAIN'],
      ['SERL 1', 'Upload2010/Stats-1.htm', 'MAIN'],
      ['SERL 2', 'Upload2010/Stats-2.htm', 'MAIN'],
      ['Status List', 'Upload2010/StatusList.htm', 'MAIN'],
      ['Season', 'SeasonFrame2010.htm', 'MAIN'],
      ['Fixtures', 'Upload2010/FixtureList.htm', 'MAIN']
    ],
    ['2009/2010 Season', null, null,
      ['Div 1',             'Upload2009/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2009/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2009/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2009/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2009/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2009/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2009/Stats0.htm',        'MAIN'],
      ['Status List',       'Upload2009/StatusList.htm',    'MAIN'],
      ['Season',            'SeasonFrame2009.htm',          'MAIN'],
      ['Fixtures',          'Upload2009/FixtureList.htm',   'MAIN']
    ],
    ['2008/2009 Season', null, null,
      ['Div 1',             'Upload2008/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2008/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2008/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2008/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2008/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2008/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2008/Stats0.htm',        'MAIN'],
      ['Status List',       'Upload2008/StatusList.htm',    'MAIN'],
      ['Season',            'SeasonFrame2008.htm',          'MAIN'],
      ['Fixtures',          'Upload2008/FixtureList.htm',   'MAIN']
    ],
    ['2007/2008 Season', null, null,
      ['Div 1',             'Upload2007/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2007/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2007/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2007/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2007/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2007/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2007/Stats0.htm',        'MAIN'],
      ['Status List',       'Upload2007/StatusList.htm',    'MAIN'],
      ['Season',            'SeasonFrame2007.htm',          'MAIN'],
      ['Fixtures',          'Upload2007/FixtureList.htm',   'MAIN']
    ],
    ['2006/2007 Season', null, null,
      ['Div 1',             'Upload2006/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2006/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2006/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2006/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2006/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2006/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2006/Stats0.htm',        'MAIN'],
      ['Status List',       'Upload2006/StatusList.htm',    'MAIN'],
      ['Season',            'SeasonFrame2006.htm',          'MAIN'],
      ['Fixtures',          'Upload2006/FixtureList.htm',   'MAIN'],
      ['CKA Blog *New*',    'http://CambridgeKorfball.spaces.live.com',   'MAIN']
    ],
    ['2005/2006 Season', null, null,
      ['Div 1',             'Upload2005/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2005/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2005/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2005/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2005/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2005/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2005/Stats0.htm',        'MAIN'],
      ['Squad Lists',       'Upload2005/SquadList.htm',     'MAIN'],
      ['Season',            'SeasonFrame2005.htm',          'MAIN'],
      ['Fixtures',          'Upload2005/FixtureList.htm',   'MAIN']
    ],
    ['2004/2005 Season', null, null,
      ['Div 1',             'Upload2004/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2004/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2004/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2004/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2004/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2004/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2004/Stats0.htm',        'MAIN'],
      ['Squad Lists',       'Upload2004/SquadList.htm',     'MAIN'],
      ['Season',            'SeasonFrame2004.htm',          'MAIN'],
      ['Fixtures',          'Upload2004/FixtureList.htm',   'MAIN']
    ],
    ['2003/2004 Season', null, null,
      ['Div 1',             'Upload2003/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2003/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2003/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2003/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2003/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2003/Stats3.htm',        'MAIN'],
      ['CKA Cup Goals',     'Upload2003/Stats4.htm',        'MAIN'],
      ['National League',   'Upload2003/Stats0.htm',        'MAIN'],
      ['Squad Lists',       'Upload2003/SquadList.htm',     'MAIN'],
      ['Season',            'SeasonFrame2003.htm',          'MAIN'],
      ['Fixtures',          'Upload2003/FixtureList.htm',   'MAIN']
    ],
    ['2002/2003 Season', null, null,
      ['Div 1',             'Upload2002/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2002/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2002/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2002/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2002/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2002/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2002/Stats0.htm',        'MAIN'],
      ['Status',            'Upload2002/Status.htm',        'MAIN'],
      ['Season',            'SeasonFrame2002.htm',          'MAIN'],
      ['Fixtures',          'Upload2002/FixtureList.htm',   'MAIN']
    ],
    ['2001/2002 Season', null, null,
      ['Div 1',             'Upload2001/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2001/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2001/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2001/Stats2.htm',        'MAIN'],
      ['Div 3',             'Upload2001/Division3.htm',     'MAIN'],
      ['Div 3 Goals',       'Upload2001/Stats3.htm',        'MAIN'],
      ['National League',   'Upload2001/Stats0.htm',        'MAIN'],
      ['Status',            'Upload2001/Status.htm',        'MAIN'],
      ['Season',            'SeasonFrame2001.htm',          'MAIN'],
      ['Fixtures',          'Upload2001/FixtureList.htm',   'MAIN']
    ],
    ['2000/2001 Season', null, null,
      ['Div 1',             'Upload2000/Division1.htm',     'MAIN'],
      ['Div 1 Goals',       'Upload2000/Stats1.htm',        'MAIN'],
      ['Div 2',             'Upload2000/Division2.htm',     'MAIN'],
      ['Div 2 Goals',       'Upload2000/Stats2.htm',        'MAIN'],
      ['National League',   'Upload2000/Stats0.htm',        'MAIN'],
      ['Status',            'Upload2000/Status.htm',        'MAIN'],
      ['Season',            'SeasonFrame2000.htm',          'MAIN'],
      ['Fixtures',          'Upload2000/FixtureList.htm',   'MAIN']
    ],
    ['1999/2000 Season', null, null,
      ['Div 1',             'ResultsDivOne.htm',            'MAIN'],
      ['Div 2',             'ResultsDivTwo.htm',            'MAIN'],
      ['Tigers',            'ResultsTigers.htm',            'MAIN'],
      ['National League',   'Upload1999/Stats0.htm',        'MAIN'],
      ['NL Season',         'Upload1999/CAM1.htm',          'MAIN'],
      ['Fixtures',          'Upload1999/FixtureList.htm',   'MAIN']
    ],
    ['1998/1999 Season', null, null,
      ['National League',   'Upload1998/Stats0.htm',        'MAIN'],
      ['NL Season',         'Upload1998/CAM1.htm',          'MAIN'],
      ['Fixtures',          'Upload1998/FixtureList.htm',   'MAIN']
    ],
    ['1997/1998 Season', null, null,
      ['National League',   'Upload1997/Stats0.htm',        'MAIN'],
      ['NL Season',         'Upload1997/CAM1.htm',          'MAIN'],
      ['Fixtures',          'Upload1997/FixtureList.htm',   'MAIN']
    ],
    ['1996/1997 Season', null, null,
      ['National League',   'Upload1996/Stats0.htm',        'MAIN'],
      ['NL Season',         'Upload1996/CAM1.htm',          'MAIN'],
      ['Fixtures',          'Upload1996/FixtureList.htm',   'MAIN']
    ]
  ],
  ['Games', null, null, 
    ['Cricket',             'http://www.npower.com/cfm/cricketgame.cfm',                   'MAIN'],
    ['Spear Toss',          'http://www.makaimedia.com/games/game_frame.aspx?gid=11',      'MAIN'],
    ['Volcano Jump',        'http://www.makaimedia.com/games/game_frame.aspx?gid=90',      'MAIN'],

 // ['Mini Golf',           'http://www.people.fas.harvard.edu/~pyang/flash/miniputt.swf', 'MAIN'],
 // ['Korfball',            'http://www.hkc-utrecht.nl/scripts/spel/hkc-2003.swf',         'MAIN'],
 // ['Table Tennis',        'http://www.playplay.be/top5/top5_game_3.htm',                 'MAIN'],
 // ['Skateboard',          'http://www.playplay.be/skateboarden.htm',                     'MAIN'],
 // ['Golf',                'http://www.playplay.be/golven.htm',                           'MAIN'],
 // ['Beer Monster',        'http://www.playplay.be/beermonster.htm',                      'MAIN']
  ]
];

// Part 2 - Tree format
var TREE_FORMAT = [
    0,                                       //  0. x coordinate
    0,                                       //  1. y coordinate
    true,                                    //  2. button images flag
    [                                        //  3. button images:
        "images/CoolTree/collapsed.gif",     //       collapsed,
        "images/CoolTree/expanded.gif",      //       expanded,
        "images/CoolTree/blank.gif",         //       blank
    ],
    [ 16, 16, 0],                            //  4. button images size: width, height, and indentation for childless nodes
    true,                                    //  5. folder images flag
    [                                        //  6. folder images:
        "images/CoolTree/folder_closed.gif", //       closed,
        "images/CoolTree/folder_open.gif",   //       opened,
        "images/CoolTree/blank.gif"          //       document
    ],
    [ 16, 16],                               //  7. folder images size: width, height
    [ 0, 8, 32 ],                            //  8. indentation for each level
    "",                                      //  9. background color for the whole tree
    "clsNode",                               // 10. default CSS class for nodes
    [ "cls1", "cls2", "cls3" ],              // 11. CSS classes for each level
    false,                                   // 12. single branch mode flag
    [ 0, 0 ],                                // 13. item padding and spacing
// ---- additional formatting options ----
    true,                                    // 14. explorer-like mode flag
    [                                        // 15. images for explorer-like mode:
        "images/CoolTree/folder.gif",        //       folder,
        "images/CoolTree/folder_open.gif",   //       opened folder,
        "images/CoolTree/page.gif",          //       page,
        "images/CoolTree/minus.gif",         //       button in opened state,
        "images/CoolTree/minus_bottom.gif",  //       same without bottom line,
        "images/CoolTree/plus.gif",          //       button in closed state,
        "images/CoolTree/plus_bottom.gif",   //       same without bottom line,
        "images/CoolTree/line.gif",          //       vertical line,
        "images/CoolTree/join.gif",          //       three-way join,
        "images/CoolTree/join_bottom.gif"    //       two-way join
    ],
    [ 19, 16 ],                              // 16. images' size for explorer-like mode
    true,                                    // 17. state saving feature flag
    false,                                   // 18. relative positioning flag
    [ 0, 0 ],                                // 19. initial width and height for relative positioning mode
    false,                                   // 20. resizable background for relative positioning mode
    true,                                    // 21. selected node highlighting mode flag
    [                                        // 22. attributes for selected node:
        "darkorange",                        //     background color for unselected nodes,
        "darkorange",                        //     same for selected node,
        "clsSelected"
    ],
    0,                                       // 23. text wrapping margin ("0" means "do not wrap")
    "top"                                    // 24. vertical alignment for buttons and icons
                                             //     (applies to trees with non-zero text wrapping and explorer-like mode set to false)
];
