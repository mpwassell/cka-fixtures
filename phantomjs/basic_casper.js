var casper = require('casper').create();

/*
casper.options.onResourceRequested = function(C, requestData, request) {
    if(requestData.method = 'POST') console.log(JSON.stringify(requestData));
};
*/

/* 
    These are the CSS selectors for the elements we wait for or want to click or otherwise interact with.
    You can get hold of them using the browser debugger
*/
var clicks =  {
    myaccounts :  'div#FLnavbartop',
    compadmin  :  '#content_compadmin > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(1) > a > img',
    resultstoenter : '#adminnav > li.currentPage > a'
};


casper.start('https://w.fixtureslive.com/redirect.aspx?element=login', function(response) {
        this.fill('form#frm', {
            'ctl00$ctl00$cphContent$cphContent$login1$tbUserName' : '531162',
            'ctl00$ctl00$cphContent$cphContent$login1$tbPassword' : 'Egerton6'
        }, false);
        //this.echo(this.getFormValues('form#frm')['__VIEWSTATE']);
        this.capture('login_before.png');
        this.click('#btnLogin');
        this.capture('login_after_btn.png');

      
})
.waitForSelector(clicks.myaccounts,  function(response) {
    //console.log("Response Data");
    //require('utils').dump(response.data);
    this.echo(this.getHTML("div#FLnavbartop"));
    this.capture('login_after.png');
    console.log(this.getCurrentUrl());

    this.click(clicks.myaccounts);
})
.waitForSelector( clicks.compadmin, function() {
    this.capture('my_accounts.png');
    console.log(this.getCurrentUrl());

    this.click(clicks.compadmin);
})
.waitForSelector( clicks.resultstoenter, function() {
    this.capture('results_to_enter.png');
    console.log(this.getCurrentUrl());

    /* Suggested operation:
        Iterate over the results until we have a score for match, and then enter the score.
        Repeat until we iterate to end  and haven't entered a score.
        Problems is that it only shows a fixed number of matches - can make this 20 but what if > 20?
    */

})
.run();



//casper.run();