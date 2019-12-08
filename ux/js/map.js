var map;

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

  intervalo = {desde: 0, hasta: 0};
  //Recojo los datos de la base de datos
  proxy.getTodasLasMedidasPorFecha(intervalo, function (datos) {
    // console.log(datos);
    console.log("DATOS DE MEDIDAS POR FECHA");
    var poluzone = [];

    var infowindow = new google.maps.InfoWindow()

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

    }//for
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: poluzone,
      maxIntensity: 1243,
      radius: 60
    });
    heatmap.setMap(getMap());
  });
}

function getMap() {
  return map;
}