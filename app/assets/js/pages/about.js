//  This will be called by the included PAGE.js as part of the liger initialization.
PAGE.about = function(){
	ABOUT.initialize();
}

//  All of the code unique to the page's functionality
var ABOUT = {
	initialize: function(){
		var me = this;

		/* 
		*
		*    All arguments that have been passed to this page are now ready to be accessed.
		*    They can be found in the PAGE.args object.  
		*
		*
		*/

		var template = $("#aboutTemplate").html();
		$("#page-content").append(_.template(template,{}));

		console.log("ABOUT.initailize succesful");
	}

	// lots of other cool stuff
}