Liger Demo App Workshop
=======================

Prerequisites
---------------------------

* XCode

Setting up for the workshop
---------------------------

1. Clone workshop repo

		git clone git@github.com:reachlocal/ligermobile-workshop.git
		
2. Checkout step-0

		git checkout -f step-0
		
	This will throw away any current changes on your working directory.
	
3. Open the ios-mysteries.xcworkspace in the ios-mysteries/ directory.
4. Hit the **Play** button once XCode has finished loading.

	You should see "Hello Roar" in the simulator.


Adding an About page
-----------------------------

1. In app/assets/js/pages/ add an about.js file and add the following.  (To save time I always just start by copying the existing hello.js file.)

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
	          
5. In app/ add an about.html file and add the following.

		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>About</title>

		    <!-- Sets initial viewport load and disables zooming  -->
		    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">

		    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">
		    <link href="assets/css/app.css" rel="stylesheet">

		    <script type="text/javascript" src="vendor/cordova.js"></script>
		    <script type="text/javascript" src="vendor/page.js"></script>
		    <script type="text/javascript" src="vendor/liger.js"></script>
		    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
		    <script type="text/javascript" src="assets/js/lib/bootstrap.min.js"></script>
		    <script type="text/javascript" src="assets/js/lib/underscore.js"></script>
		    <script type="text/javascript" src="assets/js/pages/about.js"></script>

		</head>
		<body>

		    <script type="text/x-underscore" id='aboutTemplate'>
		        <ul class="nav-list">
		            <li>This is not written by or endorsed by the BBC in any way.</li>
		            <li>This is written as an example of how Liger can be used and is not intended to be built and distributed as an application in any app store by any party.</li>
		            <li>You may use any Liger code from this example in your commercial applications, but to interact with BBC services in your commercial applications, you must contact the BBC for permission and it is up to you to ensure you comply with http://www.bbc.co.uk/terms/business.shtml</li>
		        </ul>
		    </script>

		    <div class="container">
		        <!-- Example row of columns -->
		        <div class="row">
		            <div class="col-md-12" id="page-content">

		            </div>
		        </div>
		    </div>
			<script>
		        PAGE.initialize("about");
		    </script>
		</body>
		</html>

		
7. Add the About page to the menu array in app.json

		"accessibilityLabel": "menu",
	    "args": [
	      [
	        {
	          "name": "About",
	          "page": "about",
	          "title": "About",
	          "accessibilityLabel": "about"
	        },
	        {
	          "name": "Hello",
	          "page": "hello",
	          "title": "Hello World",
	          "accessibilityLabel": "hello"
	        }
	      ]
	    ]

8. In XCode, under **Product**, hit the **Clean** option.  (This needs to be done after any change made within the app/ directory.)

9. Hit the **Play** button.  You should see the About page, and opening the menu should show you the About and Hello page links.

To view the completed source for this step checkout step-1

		git checkout -f step-1
		
Adding an Upcoming shows page
-----------------------------

1. In app/assets/js/pages/ add an upcoming.js file and add the following.

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
			
3. In app/ add an upcoming.html file and add the following.

		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>Upcoming</title>

		    <!-- Sets initial viewport load and disables zooming  -->
		    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">

		    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">
		    <link href="assets/css/app.css" rel="stylesheet">

		    <script type="text/javascript" src="vendor/cordova.js"></script>
		    <script type="text/javascript" src="vendor/page.js"></script>
		    <script type="text/javascript" src="vendor/liger.js"></script>
		    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
		    <script type="text/javascript" src="assets/js/lib/bootstrap.min.js"></script>
		    <script type="text/javascript" src="assets/js/lib/underscore.js"></script>
		    <script type="text/javascript" src="assets/js/pages/upcoming.js"></script>
		</head>
		<body>

		    <script type="text/x-underscore" id='upcomingTemplate'>
		        <ul class="nav-list">
		        <% _.each(shows, function(show) { %>
		            <li class="show-details-link">
		                <a><span class="lead"><%=show.title%></span></a><br />
		                <%=show.subtitle%>
		            </li>
		        <% }); %>
		        </ul>
		    </script>

		    <div class="container" id="page-content">

		    </div>

			<script>
		        PAGE.initialize("upcoming");
		    </script>
		</body>
		</html>

		
4. Prepend the Upcoming page to the menu array in app.json

		"args": [
	      [
	        {
	          "name": "Upcoming",
	          "page": "upcoming",
	          "title": "Upcoming",
	          "accessibilityLabel": "upcoming"
	        },
	        {
	          "name": "About",
	          "page": "about",
	          "title": "About",
	          "accessibilityLabel": "about"
	        },
	        {
	          "name": "Hello",
	          "page": "hello",
	          "title": "Hello World",
	          "accessibilityLabel": "hello"
	        }
	      ]
	    ]
		  
8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-2.

		git checkout -f step-2
		
Adding an Show details page
---------------------------

1. In app/assets/js/pages/ add an show.js file and add the following.

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
			
3. In app/assets/js/common/ add a common.js file and add the following.

		function displayDate(date){
	
			var d = date.getDate();
			var m = date.getMonth() + 1; //Months are zero based
			var y = date.getFullYear();
		
			return m + "/" + d + "/" + y;
		}
		
		function displayDateTime(date){
		
			if (!date.getMonth) {
				date = new Date(date);
			}
		
			hours = date.getHours();
		
			suffix = (hours >= 12)? 'pm' : 'am';
			hours = (hours > 12)? hours -12 : hours;
			hours = (hours == '00')? 12 : hours;
		
			return displayDate(date) + " " + hours + ":" + ((date.getMinutes()<10?'0':'') + date.getMinutes()) + suffix;
		}
	
		
4. In app/ add a show.html file and add the following.

		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>Home</title>

		    <!-- Sets initial viewport load and disables zooming  -->
		    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">

		    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">
		    <link href="assets/css/app.css" rel="stylesheet">

		    <script type="text/javascript" src="vendor/cordova.js"></script>
		    <script type="text/javascript" src="vendor/page.js"></script>
		    <script type="text/javascript" src="vendor/liger.js"></script>
		    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
		    <script type="text/javascript" src="assets/js/lib/bootstrap.min.js"></script>
		    <script type="text/javascript" src="assets/js/lib/underscore.js"></script>
		    <script type="text/javascript" src="assets/js/common/common.js"></script>
		    <script type="text/javascript" src="assets/js/pages/show.js"></script>

		</head>
		<body>
		    <script type="text/x-underscore" id='showDetailsTemplate'>
		        <% if(show.program.image){ %>
		            <img src="http://ichef.bbci.co.uk/images/ic/368x207/<%= show.program.image.pid %>.jpg" class="img-responsive img-thumbnail top-image" />
		        <% } %>
		        <h2><a class="series-info"><%= show.title %></a></h2>
		        <h3><%= show.subtitle %></h3>
		        <p><%= show.program.short_synopsis %></p>
		        <p>On <%= show.provider %>.</p>
		        <p><%= displayDateTime(show.startdatetime) %></p>
		        <p><button type="button" class="btn btn-primary" id="twitter-share">Share on Twitter</button></p>
		        <p><button type="button" class="btn btn-primary" id="facebook-share">Share on Facebook</button></p>
		    </script>

		    <div class="container">
		        <!-- Example row of columns -->
		        <div class="row">
		            <div class="col-md-12" id="page-content">

		            </div>
		        </div>
		    </div>

			<script>
		        PAGE.initialize("show");
		    </script>
		</body>
		</html>

		
8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-3.

		git checkout -f step-3
		
Adding an Series details page
-----------------------------

1. In app/assets/js/pages/ add an series.js file and add the following.

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

3. To the common.js file append the following.

		function favoritesArray(){
			if(!localStorage.favorites){
				var favoritesList = [];
				localStorage.favorites = JSON.stringify(favoritesList);
			}
		
			return JSON.parse(localStorage.favorites);
		}
		
		function inFavorites(id){
			var favs = favoritesArray();
		
			for(i = 0; i < favs.length; i++){
				if(favs[i].hasOwnProperty(id)){
					return true;
				}
			}
		
			return false;
		
		}
		
4. In app/ add a series.html file and add the following.
		
		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>Series</title>

		    <!-- Sets initial viewport load and disables zooming  -->
		    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">

		    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">
		    <link href="assets/css/app.css" rel="stylesheet">

		    <script type="text/javascript" src="vendor/cordova.js"></script>
		    <script type="text/javascript" src="vendor/page.js"></script>
		    <script type="text/javascript" src="vendor/liger.js"></script>
		    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
		    <script type="text/javascript" src="assets/js/lib/bootstrap.min.js"></script>
		    <script type="text/javascript" src="assets/js/lib/underscore.js"></script>
		    <script type="text/javascript" src="assets/js/common/common.js"></script>
		    <script type="text/javascript" src="assets/js/pages/series.js"></script>

		</head>
		<body>

		    <script type="text/x-underscore" id='seriesDetailsTemplate'>
		        <% if(series.programme.image){ %>
		            <img src="http://ichef.bbci.co.uk/images/ic/640x360/<%= series.programme.image.pid %>.jpg" class="img-responsive img-thumbnail top-image" />
		        <% } %>
		        <h2><%= series.programme.display_title.title %></h2>
		        <p><a class='upcoming-series' data-series-id="<%= series.programme.pid %>">All Upcoming Episodes</a></p>
		        <p><%= series.programme.medium_synopsis %></p>
		    </script>

		    <script type="text/x-underscore" id='favoritesButtonTemplate'>
		        <button type="button" class="btn btn-primary" id="add-to-favorites">Add To Favorites</button>
		    </script>

		    <script type="text/x-underscore" id='alreadyFavoriteButtonTemplate'>
		        <button type="button" class="btn btn-success">Already A Favorite</button>
		    </script>

		    <script type="text/x-underscore" id='newsTemplate'>
		        <h3>News</h3>
		        <ul class="nav-list" id="news">
		        <% _.each(news, function(link) { %>
		            <li data-link="<%= link.url %>">
		                <a><span class="lead"><%=link.title%></span></a>
		            </li>
		        <% }); %>
		        </ul>
		    </script>

		    <script type="text/x-underscore" id='extrasTemplate'>
		        <ul class="nav-list" id="extras">
		        <h3>Extras</h3>
		        <% _.each(extras, function(link) { %>
		            <li data-link="<%= link.link_uri %>">
		                <a><span class="lead"><%=link.title%></span></a><br />
		                <%=link.content%>
		            </li>
		        <% }); %>
		        </ul>
		    </script>

		    <div class="container">
		        <!-- Example row of columns -->
		        <div class="row">
		            <div class="col-md-12" id="page-content">

		            </div>
		        </div>
		    </div>

			<script>
		        PAGE.initialize("series");
		    </script>
		</body>
		</html>

		
8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-4.

		git checkout -f step-4
		
Adding an Upcoming Series page
------------------------------

1. In app/assets/js/pages/ add an upcoming-series.js file and add the following.

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
			
4. In app/ add a upcoming-series.html file and add the following.
			
		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>Upcoming Series</title>

		    <!-- Sets initial viewport load and disables zooming  -->
		    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">

		    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">
		    <link href="assets/css/app.css" rel="stylesheet">

		    <script type="text/javascript" src="vendor/cordova.js"></script>
		    <script type="text/javascript" src="vendor/page.js"></script>
		    <script type="text/javascript" src="vendor/liger.js"></script>
		    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
		    <script type="text/javascript" src="assets/js/lib/bootstrap.min.js"></script>
		    <script type="text/javascript" src="assets/js/lib/underscore.js"></script>
		    <script type="text/javascript" src="assets/js/common/common.js"></script>
		    <script type="text/javascript" src="assets/js/pages/upcoming-series.js"></script>

		</head>
		<body>

		    <script type="text/x-underscore" id='upcomingSeriesTemplate'>
		        <h2><%=title%></h2>
		        <ul class="nav-list">
		        <% _.each(shows, function(show) { %>
		            <li class='show-details-link'>
		                <a class="lead"><%=show.subtitle%></a><br />
		                <%= displayDateTime(show.startdatetime) %>
		            </li>
		        <% }); %>
		        </ul>
		    </script>

		    <div class="container" id="page-content">

		    </div>

			<script>
		        PAGE.initialize("upcomingSeries");
		    </script>
		</body>
		</html>

		
8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-5.

		git checkout -f step-5
		
Adding an Favorites page
--------------------------

1. In app/assets/js/pages/ add an favorites.js file and add the following.

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
			
4. In app/ add a favorites.html file and add the following. 

		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>Favorites</title>

		    <!-- Sets initial viewport load and disables zooming  -->
		    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">

		    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
		    <link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">
		    <link href="assets/css/app.css" rel="stylesheet">

		    <script type="text/javascript" src="vendor/cordova.js"></script>
		    <script type="text/javascript" src="vendor/page.js"></script>
		    <script type="text/javascript" src="vendor/liger.js"></script>
		    <script type="text/javascript" src="assets/js/lib/jquery.js"></script>
		    <script type="text/javascript" src="assets/js/lib/bootstrap.min.js"></script>
		    <script type="text/javascript" src="assets/js/lib/underscore.js"></script>
		    <script type="text/javascript" src="assets/js/common/common.js"></script>
		    <script type="text/javascript" src="assets/js/pages/favorites.js"></script>

		</head>
		<body>

		    <script type="text/x-underscore" id='favoritesTemplate'>
		        <ul class="nav-list">
		        <% _.each(shows, function(show) { %>
		            <li class='show-details-link' data-series-id="<%= _.keys(show)[0] %>">
		                <a class="lead"><%= show[ _.keys(show)[0] ] %></a>
		            </li>
		        <% }); %>
		        </ul>
		    </script>

		    <script type="text/x-underscore" id='noFavoritesTemplate'>
		        <p class="lead">You have not selected any favorites yet.</p>
		    </script>

		    <div class="container">
		        <!-- Example row of columns -->
		        <div class="row">
		            <div class="col-md-12" id="page-content">

		            </div>
		        </div>
		    </div>

			<script>
		        PAGE.initialize("favorites");
		    </script>
		</body>
		</html>

		
5. Append the Favorites page to the menu array in app.json

		"accessibilityLabel": "menu",
	    "args": [
	      [ 
	        {
	          "name": "Upcoming",
	          "page": "upcoming",
	          "title": "Upcoming",
	          "accessibilityLabel": "upcoming"
	        },
	        {
	          "name": "About",
	          "page": "about",
	          "title": "About",
	          "accessibilityLabel": "about"
	        },
	        {
	          "name": "Favorites",
	          "page": "favorites",
	          "title": "Favorites",
	          "accessibilityLabel": "favorites"
	        },
	        {
	          "name": "Hello",
	          "page": "hello",
	          "title": "Hello World",
	          "accessibilityLabel": "hello"
	        }
	      ]
	    ]
		  
8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-6.

		git checkout -f step-6

Add a Support Link
-----------------------------------

1.  Append the Support link to the menu array in app.json

		"accessibilityLabel": "menu",
	    "args": [
	      [ 
	        {
	          "name": "Upcoming",
	          "page": "upcoming",
	          "title": "Upcoming",
	          "accessibilityLabel": "upcoming"
	        },
	        {
	          "name": "About",
	          "page": "about",
	          "title": "About",
	          "accessibilityLabel": "about"
	        },
	        {
	          "name": "Favorites",
	          "page": "favorites",
	          "title": "Favorites",
	          "accessibilityLabel": "favorites"
	        },
	        {
	          "name": "Hello",
	          "page": "hello",
	          "title": "Hello World",
	          "accessibilityLabel": "hello"
	        },
	        {
	          "name": "Support",
	          "page": "email",
	          "title": "Support",
	          "dialog": true,
	          "args": {
	            "toRecipients": "test@test.com",
	            "ccRecipients": "", 
	            "bccRecipients": "", 
	            "subject": "I need help.", 
	            "body": "I think I broke something", 
	            "html": false
	          }
	        }
	      ]
	    ]

8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-7.

		git checkout -f step-7

Clean Up
-----------------------------------

1. Remove hello.html and hello.js files.

2. Remove Hello page from the menu array.

		"accessibilityLabel": "menu",
	    "args": [
	      [ 
	        {
	          "name": "Upcoming",
	          "page": "upcoming",
	          "title": "Upcoming",
	          "accessibilityLabel": "upcoming"
	        },
	        {
	          "name": "About",
	          "page": "about",
	          "title": "About",
	          "accessibilityLabel": "about"
	        },
	        {
	          "name": "Favorites",
	          "page": "favorites",
	          "title": "Favorites",
	          "accessibilityLabel": "favorites"
	        },
	        {
	          "name": "Support",
	          "page": "email",
	          "title": "Support",
	          "dialog": true,
	          "args": {
	            "toRecipients": "test@test.com",
	            "ccRecipients": "", 
	            "bccRecipients": "", 
	            "subject": "I need help.", 
	            "body": "I think I broke something", 
	            "html": false
	          }
	        }
	      ]
	    ]
		  
8. In XCode, under **Product**, hit the **Clean** option.

9. Hit the **Play** button.

6. To view the completed source for this step checkout step-8.

		git checkout -f step-8