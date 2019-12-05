//...........................................................
//map.js
//Dibuja el mapa en la página web y contiene las funciones 
//para poder interactuar con el mapa correctamente
// by: Diego Aguirre
//...........................................................

var map;

//...........................................................
// initMap()
// se encarga de iniciar el mapa y mostrar la posición
// y el zoom deseados
//...........................................................
function initMap(){
    var location = {lat: 38.996, lng: -0.166};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,

        //añade el estilo personalizado para que el mapa se vea bonito c:
        styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#263c3f'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6b9a76'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#38414e'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
            }
        ],
        center: location
    });
}

//...........................................................
// getMap() --> Mapa
// Devuelve el mapa
//
//...........................................................
function getMap(){
    return map;
}

//...........................................................
// removeMarkers()
// Quita todos los marcadores del mapa
//
//...........................................................
function removeMarkers(){

}



//Esto es para poder asignarle un nombre al gas dependiendo de su ID
function queGasSoy(dato){
    var gas;
    if(dato == 2){
        gas = "CO";
    }else{
        if(dato == 3){
            gas = "NOX";
        }else{
            if(dato==4){
                gas="SO2";
            }else{
                gas="Gas Irritante";
            }
        }
    }
    return gas;
}