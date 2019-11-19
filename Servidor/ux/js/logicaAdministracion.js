//---------------------------------------------------------------------
//----------------------- logicaAdministracion.js ---------------------
//
// Creada por Iván Romero Ruiz apartir del codigo de Josep Carreres
// Fuster del archivo PROXY.js
//
//---------------------------------------------------------------------

const ip_puerto = "http://localhost:8080";

class logicaAdministracion {

    constructor() {

        console.log("logicaAdministracion funcionando");

    }

    async getSensoresYSusUsuarios() {

        console.log("Llamada a getSensoresYSusUsuarios");

        fetch(IP_PUERTO + "/getSensoresYSusUsuarios", {
                method: 'GET', // or 'PUT'
                mode: 'no-cors',
                headers: {
                    'User-Agent': 'jordi',
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
            var json = response.json();
                console.log("respuesta " + json.stringify);
                //return response.json();
            })
            .then(function (datos) {
                console.log("Datos: " + datos[0]);
            });

    }

}
