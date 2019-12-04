// .....................................................................
// mainServidorREST.js
// .....................................................................
// .....................................................................
// .....................................................................
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const Logica = require("../Servidor/Logica.js")
const puerto = process.env.PORT || 8080;
// .....................................................................
// .....................................................................
function cargarLogica(fichero) {
    return new Promise((resolver, rechazar) => {
        var laLogica = new Logica(fichero,
            function (err) {
                if (err) {
                    rechazar(err)
                } else {
                    resolver(laLogica)
                }

            }) // new
    }) // Promise
} // ()
// .....................................................................
// main()
// .....................................................................
async function main() {
    var laLogica = await cargarLogica("../Servidor/bd/datos.db")
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
    var servicio = servidorExpress.listen(puerto, function () {
        console.log("servidor REST escuchando en el puerto 8080 ")
    })
    // capturo control-c para cerrar el servicio ordenadamente
    process.on('SIGINT', function () {
        console.log(" terminando ")
        servicio.close()
    })
} // ()
// .....................................................................
// .....................................................................
main()
// .....................................................................
// .....................................................................
