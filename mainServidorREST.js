/****************************************************************************************
mainServidorREST.js
GTI 3º, 2019-2020, Equipo 3
Autor: Josep Carreres Fluixà
Descripcion:
Fecha: septiembre 2019
© Copyright:
****************************************************************************************/
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const Logica = require("./Logica.js")
const puerto = process.env.PORT || 8080;
/****************************************************************************************
 ****************************************************************************************/
function cargarLogica(fichero) {
  return new Promise((resolver, rechazar) => {
    var laLogica = new Logica(fichero,
      function(err) {
        if (err) {
          rechazar(err)
        } else {
          resolver(laLogica)
        }

      }) // new
  }) // Promise
} // ()
/****************************************************************************************
                                        main ()
****************************************************************************************/
async function main() {
  var laLogica = await cargarLogica("./bd/datos.db")
  // creo el servidor
  var servidorExpress = express()
  // para poder acceder a la carga de la petición http
  // asumiendo que es JSON
  servidorExpress.use(bodyParser.text({
    type: 'application/json'
  }))

  //Pa que funcione getSensoresYSusUsuarios desde la web
  servidorExpress.use((req, res, next) => {
    // Permitir cross origin
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Monitorear todas la peticiones
    //console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
    next()
  })


  // cargo las reglas REST
  var reglas = require("./ReglasREST.js")
  reglas.cargar(servidorExpress, laLogica, bcrypt)
  // arranco el servidor
  var servicio = servidorExpress.listen(puerto, function() {
    console.log("servidor REST escuchando en el puerto 8080 ")
  })

  var now = new Date();
  var milis = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 00, 0, 0, 0) - now;
  if (milis < 0) {
    milis += 86400000; // it's after 10am, try 10am tomorrow.
  }
  setTimeout(function() {
    laLogica.comprobarSiHayErroresDeMedicionEnSensor();
  }, milis);
  // capturo control-c para cerrar el servicio ordenadamente
  process.on('SIGINT', function() {
    console.log(" terminando ")
    servicio.close()
  })
} // ()
/****************************************************************************************
 ****************************************************************************************/
main()
/****************************************************************************************
 ****************************************************************************************/
