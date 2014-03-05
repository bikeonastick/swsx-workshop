//  This will be called by the included PAGE.js as part of the liger initialization.
PAGE.series = function(){
    SERIES.initialize();
}

//  All of the code unique to the page's functionality
var SERIES = {

    series_id:null,
    results:null,

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

        $.getJSON( "http://www.bbc.co.uk/programmes/"+me.series_id+".json", {}, SERIES.successfulFetch )
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

        console.log("SERIES.initailize succesful");
    },

    successfulFetch: function(json){
        SERIES.results = json;

        SERIES.showSeriesDetails();

        if(inFavorites(SERIES.results.programme.pid)){
            SERIES.showAlreadyAFavorite();
        }else{
            SERIES.showAddToFavorites();        
        }

        SERIES.showSeriesNews();
        SERIES.showSeriesExtras();
        SERIES.addBindings();
    },

    showSeriesDetails: function(){
        var me = this;

        var template = $("#seriesDetailsTemplate").html();
        $("#page-content").append(_.template(template, {series:me.results}));
    },

    showAddToFavorites: function(){
        var me = this;

        var template = $("#favoritesButtonTemplate").html();
        $("#page-content").append(_.template(template, {}));
    },

    showAlreadyAFavorite: function(){
        var me = this;

        var template = $("#alreadyFavoriteButtonTemplate").html();
        $("#page-content").append(_.template(template, {}));
    },

    showSeriesNews: function(){
        var me = this;

        if(me.results.programme.links.length > 0){
            var template = $("#newsTemplate").html();
            $("#page-content").append(_.template(template, {news:me.results.programme.links}));
        }
    },

    showSeriesExtras: function(){
        var me = this;

        if(me.results.programme.supporting_content_items.length > 0){
            var template = $("#extrasTemplate").html();
            $("#page-content").append(_.template(template, {extras:me.results.programme.supporting_content_items}));
        }
    },

    addBindings: function(){
        var me = this;

        $("#add-to-favorites").click(function(){
            var favoritesList = favoritesArray()

            var fav = {};
            fav[me.results.programme.pid] = me.results.programme.display_title.title;
            favoritesList.push(fav);

            localStorage.favorites = JSON.stringify(favoritesList);

            alert('This show was added to your favorites.');

            $(this).removeClass('btn-primary').addClass('btn-success').text('Already A Favorite').unbind();
            return false;
        });

        $("#news li").click(function(){
            PAGE.openPage('News', 'browser', { 'link': $(this).data('link')});
        });

        $("#extras li").click(function(){
            PAGE.openPage('Extras', 'browser', { 'link': $(this).data('link')});
        });

        $(".upcoming-series").click(function(){
            PAGE.openPage('Upcoming Episodes','upcoming-series',{'series_id': $(this).data("series-id")});
        })
    }
}
