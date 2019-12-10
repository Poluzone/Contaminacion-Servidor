//...........................................................
// Mapa.js
// Contiene: 
// La Clase Mapa
// Los Estilos del Mapa
// Métodos para controlar el Mapa
// Autor: Diego Aguirre
//...........................................................


var map;
var infowindow;



function getMap() {
    return map;
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
}

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
