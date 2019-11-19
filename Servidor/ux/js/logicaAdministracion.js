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

    async getSensoresYUsuarios() {

        console.log("Llamada a getSensoresYUsuarios");

        return 23;

        /*fetch(IP_PUERTO + "/getSensoresYUsuarios", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
        }).then(function (response) {
            return response.json();
        })*/

    }

}
