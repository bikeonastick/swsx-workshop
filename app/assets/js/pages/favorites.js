//  This will be called by the included PAGE.js as part of the liger initialization.
PAGE.favorites = function(){
    FAVORITES.initialize();
}

PAGE.onPageAppear = function(){
    FAVORITES.initialize();
}

//  All of the code unique to the page's functionality
var FAVORITES = {

    shows: null,

    initialize: function(){
        var me = this;
        var template;

        me.shows = favoritesArray();
        if(me.shows.length > 0){
            template = $("#favoritesTemplate").html();

        }else{
            template = $("#noFavoritesTemplate").html();
        }

        console.log(template);

        $("#page-content").html(_.template(template,{shows:me.shows}));

        me.addBindings();

        console.log("FAVORITES.initailize succesful");
    },

    addBindings: function(){
        $(".show-details-link").click(function(){
            PAGE.openPage('Series','series',{'series_id': $(this).data('series-id') });
        });
    }
}

