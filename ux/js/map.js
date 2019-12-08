//...........................................................
//map.js
//Dibuja el mapa en la página web y contiene las funciones 
//para poder interactuar con el mapa correctamente
// by: Diego Aguirre
//...........................................................

var map;
var infowindow;

//...........................................................
// initMap()
// se encarga de iniciar el mapa y mostrar la posición
// y el zoom deseados
//...........................................................
function initMap() {
    var location = { lat: 38.996, lng: -0.166 };
    infowindow = new google.maps.InfoWindow()
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,

        //añade el estilo personalizado para que el mapa se vea bonito c:
        styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
            }
        ],
        center: location
    });
}

//...........................................................
// getMap() --> Mapa
// Devuelve el mapa
//...........................................................
function getMap() {
    return map;
}

//...........................................................
// 
// int, int-->function recibirCO()
//...........................................................

function recibirCO(intervalo){
    proxy.getTodasLasMedidasPorFecha(intervalo, function(datos){
        var poluzone = [];
        //////////////////////////if(){}//if()
        for(let i = 0; i < datos["medidas"].length; i++){
            if(datos["medidas"][i].IdTipoMedida == 2){
                var iconBase = 'http://maps.google.com/mapfiles/ms/icons/';
                var icon = iconBase + 'yellow.png';


                var medida = new google.maps.Marker({
                    position: { lat: datos["medidas"][i].Latitud, lng: datos["medidas"][i].Longitud },
                    map: getMap(),
                    title: 'CO',
                    icon: { url: icon },
                });

                var puntoCalor = { location: new google.maps.LatLng(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud), weight: datos["medidas"][i].Valor };

                poluzone.push(puntoCalor);
                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h4 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h4>' +
                    '<div id="bodyContent">' +
                    '<p><b> Tipo de gas: ' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                    '<p></p>' +
                    '</div>' +
                    '</div>';

                google.maps.event.addListener(medida, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open(getMap(), marker);
                    };
                })(medida, contentString, infowindow));
            }//if
        }//for()
        var heatmapCO = new google.maps.visualization.HeatmapLayer({
            data: poluzone,
            maxIntensity: 1243,
            radius: 40
        });
        heatmapCO.setMap(getMap());
    });
}

//...........................................................
// removeLayer()
//...........................................................
function removeCO(){
    var heatmapCO = new google.maps.visualization.HeatmapLayer();
    heatmapCO.setMap(null);

}//()

//...........................................................
//
//
//
//...........................................................


function getIcon(tipoGas){
    var iconBase = 'http://maps.google.com/mapfiles/ms/icons/';
    var icon;

    if (tipoGas == 1) {
        icon = iconBase + 'green.png'
    } else {
        if (tipoGas == 2) {
            icon = iconBase + 'yellow.png'
        } else {
            if (tipoGas == 3) {
                icon = iconBase + 'red.png'
            } else {
                if (tipoGas == 4) {
                    icon = iconBase + 'purple.png'
                } else {
                    icon = iconBase + 'lightblue.png'
                }
            }
        }
    }
    return icon;
}//()


//...........................................................
//
//
//
//...........................................................

function getGas(gas){
    var intervalo = {"desde": 0, "hasta": 0};
    getLasEstacionesOficiales();
    proxy.getTodasLasMedidasPorFecha(intervalo, function(datos){
        var poluzone = [];

        for(let i = 0; i < datos["medidas"].length; i++) {
            var iconBase;
        }

    })
}//()

//...........................................................
//
//
//
//...........................................................

function getMarker(latitud, longitud, title, icon){
    var medida = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        map: getMap(),
        title: 'Medidas',
        icon: { url: icon },
    });
    return medida;
}//()

//...........................................................
//
//
//...........................................................
 

//...........................................................
//int,int-->recibirMedidasFecha(intervalo) 
//dibuja en el mapa todas las medidas del intervalo (desde, hasta)
//si son 0, desde y hasta, envía todas las medidas
//...........................................................

function recibirMedidasFecha(intervalo) {
    var title = "";
    getLasEstacionesOficiales();
    proxy.getTodasLasMedidasPorFecha(intervalo, function (datos) {
        // console.log(datos);
        //console.log("DATOS DE MEDIDAS POR FECHA CARGADOS");
        var poluzone = [];

        //asigno un marcador dependiendo de la medida    
        for (let i = 0; i < datos["medidas"].length; i++) {

            var icon = getIcon(datos["medidas"][i].IdTipoMedida);
            //console.log("AAAAAAH"+icon);
            //dibuja los marcadores
            var marcador = getMarker(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud, title, icon);

            var puntoCalor = { location: new google.maps.LatLng(datos["medidas"][i].Latitud, datos["medidas"][i].Longitud), weight: datos["medidas"][i].Valor };

            poluzone.push(puntoCalor);

            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h4 id="firstHeading" class="firstHeading">' + datos["medidas"][i].Valor.toString() + ' ppb</h4>' +
                '<div id="bodyContent">' +
                '<p><b> Tipo de gas: ' + queGasSoy(datos["medidas"][i].IdTipoMedida) + '</b></p>' +
                '<p></p>' +
                '</div>' +
                '</div>';

            google.maps.event.addListener(marcador, 'click', (function (marker, content, infowindow) {
                return function () {
                    infowindow.setContent(content);
                    infowindow.open(getMap(), marker);
                };
            })(marcador, contentString, infowindow));

        }//for
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: poluzone,
            maxIntensity: 1243,
            radius: 60
        });
        heatmap.setMap(getMap());
    });
}


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
}//()

//..............................................................
//
//
//..............................................................

function getLasEstacionesOficiales() {
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
} // getLasEstacionesOficiales()

