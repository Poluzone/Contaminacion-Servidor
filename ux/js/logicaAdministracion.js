//---------------------------------------------------------------------
//----------------------- logicaAdministracion.js ---------------------
//
// Creada por Iván Romero Ruiz apartir del codigo de Josep Carreres
// Fuster del archivo PROXY.js
//
//---------------------------------------------------------------------

//const URL = "https://juconol.upv.edu.es";
const URL = "http://localhost:8080";
class logicaAdministracion {

    constructor() {

        console.log("logicaAdministracion funcionando");

    }

    async getSensoresYSusUsuarios(callback) {

        console.log("Llamada a getSensoresYSusUsuarios");

        fetch(URL + "/getSensoresYSusUsuarios", {
                method: 'GET', // or 'PUT'
                headers: {
                    'User-Agent': 'jordi',
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {
                console.log("response ", response);
                return response.json();
            })
            .then(function (datos) {
                if (datos != undefined) {

                    console.log("HOLA " + datos);
                    callback(datos);


                    console.log("Tenemos la última medida");
                } else {
                    console.log("No existe o no has puesto bien los datos");
                }
            }).catch(e => {
                console.log("error: "+e);
                return e;
            });

    }

}
