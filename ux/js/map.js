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

        this.layers = new Array();

        this.markers = new Array();

    }//

    //..................................................
    // coords: lat, lng --->focus
    // posiciona el mapa en el lugar de interés, en este caso Gandía Grao
    //..................................................

    focus(coords) {

        var latLng = new google.maps.LatLng(coords.lat, coords.lng);
        this.mapa.setCenter(latLng);
    }//()

    //..................................................
    // void -> refreshMap() --> void
    // función que refresca el mapa para evitar problemas con el redibujado de punto, esta función no es mía, si no de Carlos Tortosa
    //..................................................
    refreshMap(){
        google.maps.event.trigger(this.mapa, 'resize');
    }
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

    //......................................................
    // --> getMap() -->
    // devuelve el mapa
    //......................................................
    getMap(){
        return this.mapa;
    }
}//Clase Mapa



function initMap(){
    var intervalo = { desde: 0, hasta: 0 };
    infowindow = new google.maps.InfoWindow();
    var map = new Mapa({ lat: 38.996, lng: -0.166 },{zoom:14},document.getElementById("map"));
    var marker = map.addMarker('prueba', { lat: 38.996, lng: -0.166 },"../images/pin-estacion.png");
    marker.setMap(map.getMap());
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
            /*if(datos[i].IdTipoMedida == 2){
      icon = iconBase + 'purple-dot.png'
      }*/
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
                var medida = new google.maps.Marker({
                    position: { lat: datos["medidas"][i].Latitud, lng: datos["medidas"][i].Longitud },
                    map: getMap(),
                    title: 'Medidas',
                    icon: { url: icon },
                });

                var puntoCalor = { location: new google.maps.LatLng(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud), weight: datos["medidas"][i].Valor };

                poluzone.push(puntoCalor);

                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h1>' +
                    '<div id="bodyContent">' +
                    '<p><b>' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';

                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            }

            // --------------------- NOX ---------------------------------
            if (window.localStorage.getItem('inlineCheckboxNOX') == "true" && datos["medidas"][i].IdTipoMedida == 3) {
                //dibuja los marcadores
                var medida = new google.maps.Marker({
                    position: { lat: datos["medidas"][i].Latitud, lng: datos["medidas"][i].Longitud },
                    map: getMap(),
                    title: 'Medidas',
                    icon: { url: icon },
                });

                var puntoCalor = { location: new google.maps.LatLng(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud), weight: datos["medidas"][i].Valor };

                poluzone.push(puntoCalor);

                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h1>' +
                    '<div id="bodyContent">' +
                    '<p><b>' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';

                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            }

            // --------------------- SO2 ---------------------------------
            if (window.localStorage.getItem('inlineCheckboxSO2') == "true" && datos["medidas"][i].IdTipoMedida == 4) {
                //dibuja los marcadores
                var medida = new google.maps.Marker({
                    position: { lat: datos["medidas"][i].Latitud, lng: datos["medidas"][i].Longitud },
                    map: getMap(),
                    title: 'Medidas',
                    icon: { url: icon },
                });

                var puntoCalor = { location: new google.maps.LatLng(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud), weight: datos["medidas"][i].Valor };

                poluzone.push(puntoCalor);

                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h1>' +
                    '<div id="bodyContent">' +
                    '<p><b>' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';

                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            }

            // --------------------- Gases irr ---------------------------------
            if (window.localStorage.getItem('inlineCheckboxIrr') == "true" && datos["medidas"][i].IdTipoMedida == 5) {
                //dibuja los marcadores
                var medida = new google.maps.Marker({
                    position: { lat: datos["medidas"][i].Latitud, lng: datos["medidas"][i].Longitud },
                    map: getMap(),
                    title: 'Medidas',
                    icon: { url: icon },
                });

                var puntoCalor = { location: new google.maps.LatLng(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud), weight: datos["medidas"][i].Valor };

                poluzone.push(puntoCalor);

                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h1>' +
                    '<div id="bodyContent">' +
                    '<p><b>' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';

                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            }

        }//for
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: poluzone,
            maxIntensity: 165,
            radius: 60,
            opacity: 0.3 // Número entre 0 y 1
        });
        heatmap.setMap(getMap());
    });
}





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
