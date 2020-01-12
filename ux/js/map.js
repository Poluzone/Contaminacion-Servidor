var map;
var infowindow;

function initMap() {
  var location = { lat: 38.996, lng: -0.166 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
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

      +  {
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

  getLasEstacionesOficiales();
  intervalo = { desde: 0, hasta: 0 };
  infowindow = new google.maps.InfoWindow()

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
    var legend = document.getElementById('leyenda_mapa');
    getMap().controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

    var filtro = document.getElementById('filtro_mapa');
    getMap().controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(filtro);

    heatmap.setMap(getMap());
  });
}

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
