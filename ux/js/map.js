//...........................................................
// Mapa.js
// Contiene: 
// La Clase Mapa
// Los Estilos del Mapa
// Métodos para controlar el Mapa
// Autor: Diego Aguirre
//...........................................................


//...........................................................
// Clase Mapa
// 
// Encargada de crear objetos mapa. Los cuales dibujaran
//en el HTML los datos.
//...........................................................


class Mapa {

    //.........................................
    //Constructor
    //Introduzco los parámetros para crear el objeto Mapa
    //.........................................
    constructor(position, ajustes, elementHTML) {
        this.position = position;
        this.mapa = new google.maps.Map(elementHTML, {
            zoom: ajustes.zoom,
            zoomControl: false,
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
            ]
        });

        this.focus(this.position);

        //this.pruebaMetodo()

        this.layers = [];

        this.markers = [];

    }//CONSTRUCTOR

    //.......................................................

    //..................................................
    // coords: lat, lng --->focus
    // posiciona el mapa en el lugar de interés, en este caso Gandía Grao
    //..................................................

    focus(coords) {

        var latLng = new google.maps.LatLng(coords.lat, coords.lng);
        this.mapa.setCenter(latLng);
    }//()
    //.......................................................

    //..................................................
    // void -> refreshMap() --> void
    // función que refresca el mapa para evitar problemas con el redibujado de puntos o capas
    //..................................................
    refreshMap(){
        google.maps.event.trigger(this.mapa, 'resize');
    }//()
    //.......................................................

    //...................................................
    // name, position, iconoUrl --> addMarker() --> marker
    // agrega un marcador al string de marcadores y al mapa, 
    // devuelve el marcador en caso de ser necesario para otra tarea
    //...................................................
    addMarker(name, position, iconoUrl){

        var icono ={
            url: iconoUrl,
            scaleSize: new google.maps.Size(40, 40)
        }

        var marker = new google.maps.Marker({
            position: position,
            map: this.map,
            icono: icono
        });

        this.markers[name] = marker;
        return marker;
    }//()
    //.......................................................

    //......................................................
    // name --> removeMarker() -->
    // recibe un string con el nombre del marcador y lo elimina
    // para eliminarlo le paso un null a la función setMap de la API
    //......................................................
    removeMarker(name){
        if(this.markers[name]){
            this.markers[name].setMap(null);
        }
    }
    //.......................................................

    //......................................................
    // marker, string --> addMarkerInfo() -->
    // añade información a la infoWindow del marcador
    //......................................................
    addMarkerInfo(marker, info) {

        const infoWindow = new google.maps.InfoWindow({
            content: info
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.mapa, marker);
        });

    }//()
    //.......................................................

    //......................................................
    // --> getMap() -->
    // devuelve el mapa
    //......................................................
    getMap(){
        return this.mapa;
    }//()
    //.......................................................

    //......................................................
    // string, measure --> addMeasure()
    // agrega una medida y guarda tanto su ubicación como su valor
    //......................................................

    addMeasure(gasName, measure){
        this.layers.push({
            location: new google.maps.LatLng(measure.latitud, measure.longitud),
            weight: measure.valoreMedido
        });
    }//()
    //.......................................................

    //......................................................
    // information --> addLayer()
    // introduzco un objeto information y crea una layer a parte de mostrarla
    //......................................................
    addLayer(information){
        var layer = new google.maps.visualization.HeatmapLayer({
            //data: information.poluzone,
            maxIntensity: information.maxIntensidad,
            radius: information.radio,
            opacity: information.opacidad //número del 0 al 1

        });

        this.layers[information.name] = {
            layer,
            name: information.name
        };
        this.showLayer(information.name);
    }//()
    //.......................................................

    //......................................................
    // string --> showLayer()
    // introduzco el nombre del gas y muestro su capa
    //......................................................
    showLayer(gasName) {
        if (this.layers[gasName]) {
            this.layers[gasName].layer.setMap(this.mapa);
            this.refreshMap();
        }//if
    }//()
    //.......................................................


    //......................................................
    // string --> hideLayer() 
    // introduzco el nombre del gas y oculto su capa
    //......................................................
    hideLayer(gasName){
        if (this.layer[gasName]) {
            //al poner null en setMap la capa se oculta, lo saqué de la documentación de Google Maps API
            this.layer[gasName].layer.setMap(null);
            this.refreshMap();

        }//if
    }//()
    //.......................................................

    //......................................................
    // hideAllLayers()
    // oculto todas las capas
    //......................................................
    hideAllLayers(){
        for (const i in this.layers) {
            if (this.layers.hasOwnProperty(i)) {
                this.hideLayer(this.layers[i].name);
            }//if
        }//for
    }//()
    //.......................................................

}//Clase Mapa



function initMap(){
    var intervalo = { desde: 0, hasta: 0 };
    infowindow = new google.maps.InfoWindow();
    var map = new Mapa({ lat: 38.996, lng: -0.166 },{zoom:14},document.getElementById("map"));

    //prueba para comprobar que el método addMarker funciona
    /*var marker = map.addMarker('prueba', { lat: 38.996, lng: -0.166 },"../images/pin-estacion.png");
    marker.setMap(map.getMap());*/

    //Recojo los datos de la base de datos
    proxy.getTodasLasMedidasPorFecha(intervalo, function (datos) {
        // console.log(datos);
        console.log("DATOS DE MEDIDAS POR FECHA");
        var poluzone = [];
        console.log(window.localStorage.getItem('inlineCheckboxCO'))
        //asigno un marcador dependiendo de la medida    
        for (let i = 0; i < datos["medidas"].length; i++) {
            var iconBase = 'http://maps.google.com/mapfiles/ms/icons/';
            var icon;
            if (datos["medidas"][i].IdTipoMedida == 1) {
                icon = iconBase + 'green.png'
            } else {
                if (datos["medidas"][i].IdTipoMedida == 2) {
                    icon = iconBase + 'yellow.png'
                } else {
                    if (datos["medidas"][i].IdTipoMedida == 3) {
                        icon = iconBase + 'red.png'
                    } else {
                        if (datos["medidas"][i].IdTipoMedida == 4) {
                            icon = iconBase + 'purple.png'
                        } else {
                            icon = iconBase + 'lightblue.png'
                        }
                    }
                }
            }


            // --------------------- CO ---------------------------------
            if (window.localStorage.getItem('inlineCheckboxCO') == "true" && datos["medidas"][i].IdTipoMedida == 2) {
                //dibuja los marcadores
                var medidaCO = map.addMarker('Medidas', { lat: datos["medidas"][i].Latitud, lng: datos["medidas"][i].Longitud }, {url: icon});

                var puntoCalorCO = map.addMeasure('CO', datos["medidas"][i].Valor);

                var heatMapCO = map.addLayer({maxIntesity: 165, radius: 60, opacity: 0.3});

                var infoCO = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h1>' +
                    '<div id="bodyContent">' +
                    '<p><b>' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';
                map.addMarkerInfo(medidaCO, infoCO);
            }//if
        }//for
    });//proxy
}//initMap




var infowindow;




//Esto es para poder asignarle un nombre al gas dependiendo de su ID
function queGasSoy(dato) {
    var gas;
    if (dato == 2) {
        gas = "CO";
    } else {
        if (dato == 3) {
            gas = "NOX";
        } else {
            if (dato == 4) {
                gas = "SO2";
            } else {
                gas = "Gas Irritante";
            }
        }
    }
    return gas;
}

/*function getLasEstacionesOficiales() {
    console.log("getLasEstacionesOficiales map.js");
    proxy.getEstacionesOficiales(function (datos) {
        console.log("Datos de las estaciones han sido recibidos")

        //asigno un marcador dependiendo de la medida    
        for (let i = 0; i < datos["estaciones"].length; i++) {
            var icon = {
                url: "../images/pin-estacion.png", // url
                scaledSize: new google.maps.Size(33, 46), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
            //dibuja los marcadores
            var medida = new google.maps.Marker({
                position: { lat: datos["estaciones"][i].Latitud, lng: datos["estaciones"][i].Longitud },
                map: getMap(),
                title: 'Estaciones',
                icon: icon
            });

            if (datos["estaciones"][i].Municipio == "Gandia") {
                estacionGandia = datos["estaciones"][i];
                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h4 id="firstHeading" class="firstHeading">' + estacionGandia.Municipio + '</h4>' +
                    '<div id="bodyContent">' +
                    '<p><b> Hora: ' + estacionGandia["Medidas"]["hora"] + '<br>' +
                    ' CO: ' + estacionGandia["Medidas"]["co"] + '<br>' +
                    ' NO: ' + estacionGandia["Medidas"]["no"] + '<br>' +
                    ' NO2: ' + estacionGandia["Medidas"]["no2"] + '<br>' +
                    ' NOX: ' + estacionGandia["Medidas"]["nox"] + '<br>' +
                    ' O3: ' + estacionGandia["Medidas"]["o3"] + '<br>' +
                    ' SO2: ' + estacionGandia["Medidas"]["s02"] + '<br>' +
                    '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';
                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            } else {
                estacion = datos["estaciones"][i];
                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h4 id="firstHeading" class="firstHeading">' + estacion.Municipio + '</h4>' +
                    '<div id="bodyContent">'
                ;
                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            }
        }

    }) //proxy.getEstacionesOficiales
} // getLasEstacionesOficiales()*/
