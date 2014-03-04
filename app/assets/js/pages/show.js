//  This will be called by the included PAGE.js as part of the liger initialization.
PAGE.show = function(){
	SHOW.initialize();
}

//  All of the code unique to the page's functionality
var SHOW = {

	show: null,

	initialize: function(){
		var me = this;

		if(PAGE.args){
			if("show" in PAGE.args){
				me.show = PAGE.args.show;
				me.displayDetails();
				me.addBindings();
			}
		}

		console.log("SHOW.initailize succesful");
	},

	displayDetails: function(){
		var me = this;

		var template = $("#showDetailsTemplate").html();
		$("#page-content").html(_.template(template,{show:me.show}));
	},

	addBindings: function(){
		var me = this;

		$(".series-info").click(function(){
			PAGE.openPage('Series','series',{'series_id': me.show.program.programme.programme.pid });
		});

		$("#twitter-share").click(function(){
			PAGE.openDialogWithTitle('Twitter', 'twitter', {"text":"Be sure to watch " + me.show.title + " on " + displayDateTime(me.show.startdatetime) + ".  #bbc"});
		});

		$("#facebook-share").click(function(){
			PAGE.openDialogWithTitle('Facebook', 'facebook', {});
		});

	}

}