var page = require('webpage').create(),
	system = require('system');

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
	console.log(msg);
};

// Print usage message, if no twitter ID is passed
if (system.args.length < 2) {
	console.log("Usage: tweets.js [twitter ID]");
} else {
	twitterId = system.args[1];
}

// Heading
console.log("*** Fixtures Live Page ***\n");

// Open page
page.open(encodeURI("https://w.fixtureslive.com/redirect.aspx?element=login"), function (status) {

	// Check for page load success
	if (status !== "success") {
		console.log("Unable to access network");
	} else {

		// Execute some DOM inspection within the page context
		page.evaluate(function() {
			var list = document.querySelectorAll('div');
			for (var i = 0; i < list.length; ++i) {
				console.log((i + 1) + ": " + list[i].innerText);
			}
		});
	}
	phantom.exit();
});