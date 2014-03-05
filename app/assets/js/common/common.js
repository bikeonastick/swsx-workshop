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
