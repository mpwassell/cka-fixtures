var setupForm = function() {

	var h = $("#playerHeader");
	pr = $("#playerRow");
	pr.find(".playerNum").text(i);
	for(var i=7; i>0;i--) {
		var pr_clone = pr.clone();
		pr_clone.find(".playerNum").text(i);
		h.after(pr_clone);
	}

};