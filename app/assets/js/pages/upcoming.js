//  This will be called by the included PAGE.js as part of the liger initialization.
PAGE.upcoming = function(){
    this.userCanRefresh = true;
    this.setupRefresh();
    UPCOMING.initialize();
}

PAGE.refresh = function(user){
    UPCOMING.initialize();
}

//  All of the code unique to the page's functionality
var UPCOMING = {

    shows:[],

    initialize: function(){
        var me = this;

        me.shows = [];
        $.getJSON( "http://www.bbc.co.uk/tv/programmes/genres/drama/crime/schedules/upcoming.json", {}, UPCOMING.successfulFetch )
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

        console.log("UPCOMING.initailize succesful");
    },

    successfulFetch: function(json){

        for(var i = 0; i < json.broadcasts.length; i++){
            UPCOMING.shows.push(
                {
                    'title':json.broadcasts[i].programme.display_titles.title,
                    'subtitle':json.broadcasts[i].programme.display_titles.subtitle,
                    'startdatetime':json.broadcasts[i].start,
                    'provider':json.broadcasts[i].service.title,
                    'program':json.broadcasts[i].programme
                });
        }

        UPCOMING.displayUpcoming();
        UPCOMING.addBindings();
    },

    displayUpcoming: function(){
        var me = this;

        var template = $("#upcomingTemplate").html();
        $("#page-content").html(_.template(template,{shows:me.shows}));
    },

    addBindings: function(){
        var me = this;

        $(".show-details-link").unbind().click(function(){
            PAGE.openPage('Details','show',{'show': me.shows[$(this).index()] });
        });

    }
}
