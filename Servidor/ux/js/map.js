var map;
function initMap(){
    var location = {lat: 38.996, lng: -0.166};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}
function getMap(){
    return map;
}