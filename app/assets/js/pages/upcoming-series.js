//  This will be called by the included PAGE.js as part of the liger initialization.
PAGE.upcomingSeries = function(){
    UPCOMINGSERIES.initialize();
}

//  All of the code unique to the page's functionality
var UPCOMINGSERIES = {

    series_id: null,
    shows:[],
    title: null,

    initialize: function(){
        var me = this;

        if(PAGE.args){
            if("series_id" in PAGE.args){
                me.series_id = PAGE.args.series_id;
                me.getDetails();
            }
        }
    },

    getDetails: function(){
        var me = this;

        $.getJSON( "http://www.bbc.co.uk/programmes/"+me.series_id+"/episodes/upcoming.json", {}, UPCOMINGSERIES.successfulFetch )
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

        console.log("UPCOMINGSERIES.initailize succesful");
    },

    successfulFetch: function(json){
        for(var i = 0; i < json.broadcasts.length; i++){
            UPCOMINGSERIES.shows.push(
                {
                    'title':json.broadcasts[i].programme.display_titles.title,
                    'subtitle':json.broadcasts[i].programme.display_titles.subtitle,
                    'startdatetime':json.broadcasts[i].start,
                    'provider':json.broadcasts[i].service.title,
                    'program':json.broadcasts[i].programme
                });
        }

        UPCOMINGSERIES.title = json.broadcasts[0].programme.display_titles.title;
        UPCOMINGSERIES.displayUpcomingSeries();
        UPCOMINGSERIES.addBindings();

    },

    displayUpcomingSeries: function(){
        var me = this;

        var template = $("#upcomingSeriesTemplate").html();
        $("#page-content").append(_.template(template, {title:me.title, shows:me.shows}));
    },

    addBindings: function(){
        var me = this;

        $(".show-details-link").unbind().click(function(){
            PAGE.openPage('Details','show',{'show': me.shows[$(this).index()] });
        });

    }
    // lots of other cool stuff
}