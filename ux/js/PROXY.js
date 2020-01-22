/****************************************************************************************
PROXY.js

Coorporacion

Autores: Ivan Romero, Emilia Rosa van der Heide, Josep Carreres, Diego Aguirre

Descripcion: Contiene la Clase Proxy y los métodos de la lógica fake

Fecha: 22 de Noviembre de 2019

© Copyright:
****************************************************************************************/
//const url = "http://localhost:8080";
const url = "https://juconol.upv.edu.es";

class Proxy {
    constructor() {
        console.log("Funciono");
    }

/****************************************************************************************
 --> N: dato, N: fecha, {lat, lng}
insertarMedida()
--> 

esta función inserta una medida en la base de datos

Josep Carreres
****************************************************************************************/
    async insertarMedida(dato, fecha, posicion) {
        var data = {
            dato: dato,
            fecha: fecha,
            posicion: posicion
        };

        fetch(URL + "/insertarMedida", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(data)
            console.log(res)
        })
    }
    
/****************************************************************************************
 --> string: email, string: password, string: teléfono
insertarMedida()
--> 

esta función inserta una usuario en la base de datos

Josep Carreres
****************************************************************************************/

    async insertarUsuario(email, pass, tel) {

        var data = {
            Email: email,
            Password: pass,
            Telefono: tel
        };

        fetch(URL + "/insertarUsuario", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            setCookie("username", data.Email);
            console.log(data.Email);
            console.log(res)
            checkCookie();
        })

    }
    
/****************************************************************************************
 --> Json con datos del usuario
ComprobacionLogin()
--> boleano

esta función comprueba si el usuaio existe o no, en caso de existir crea las cookies

Josep Carreres
****************************************************************************************/

    async ComprobacionLogin(data) {
        console.log("Realizando ComprobacionLogin");

        fetch(URL + "/ComprobarLogin", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log("hola1");
            return response.json();
        }).catch(function () {
            console.log("OseaError");
            usuarioOContraseñaIncorrectos();
        }).then(function (datos) {
            console.log("hola2");
            if (datos.status == true) {
                setCookie("username", datos.Usuario[0].Email);
                console.log("Iniciar sesion correcto y se han creado los cookies");
                checkCookie();
            } else {
                console.log("No existe o no has puesto bien los datos");
            }
        });
    }

/****************************************************************************************
 --> N: IdUsuario
GETultimaMedidaPorUsuario()
--> N: medida

esta función devuelve la última medida tomada por un usuario

Matt Conde
****************************************************************************************/
    async GETultimaMedidaPorUsuario(userId, callback) {

        fetch(url + "/GETultimaMedidaPorUsuario", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(userId), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        })
            .then(function (datos) {
            if (datos != undefined) {
                console.log("Tenemos la última medida");
            } else {
                console.log("No existe o no has puesto bien los datos");
            }
            callback(datos);
        });
    }
    
/****************************************************************************************
--> string: username
GETidUsuario()
--> N: idUsuario

esta función devuelve la id del usuario

Matt Conde
****************************************************************************************/
    async GETidUsuario(username, callback) {

        fetch(url + "/GETidUsuario", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(username), // data
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log(response);
            return response.json();
        })
            .then(function (datos) {
            if (datos != undefined) {
                console.log("------------PROXY------------");
                console.log("El id del usuario es: " + datos);
            } else {
                console.log("No existe o no has puesto bien los datos");
            }
            callback(datos);
        });
    }

/****************************************************************************************
 -->
getSensoresYSusUsuarios()
--> 

esta función devuelve la id de cada sensor y su usurio

Ivan Romero
****************************************************************************************/
    //------------Ivan---------------
    // getSensoresYSusUsuarios()
    //-------------------------------
    async getSensoresYSusUsuarios(callback) {

        console.log("Llamada a getSensoresYSusUsuarios");

        fetch(url + "/getSensoresYSusUsuarios", {
            method: 'GET', // or 'PUT'
        }).then(function (response) {
            console.log("response ", response);
            return response.json();
        })
            .then(function (datos) {
            if (datos != undefined) {

                console.log("Datos: " + datos);
                callback(datos);

            } else {
                console.log("No hay sensores");
            }
        }).catch(e => {
            console.log("error: " + e);
            return e;
        });

    }
/****************************************************************************************
--> N: IdEstado
getNumSensoresSegunEstado()
--> 

esta función devuelve el estado de un sensor, ejemplo: activo

Ivan Romero
****************************************************************************************/
    async getNumSensoresSegunEstado(estado, callback) {

        console.log("Llamada a getNumSensoresSegunEstado con " + parseInt(estado));

        fetch(url + "/getNumSensoresSegunEstado/" + estado, {
            method: 'GET', // or 'PUT'
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log("response ", response);
            return response.json();
        })
            .then(function (datos) {

            callback(datos);

        }).catch(e => {
            console.log("error: " + e);
            return e;
        });

    }
/****************************************************************************************
--> 
getTodosLosUsuariosYSusSensores()
--> json con todos los usuarios

esta función devuelve todos los usuarios y los sensores que posee cada uno

Ivan Romero
****************************************************************************************/
    async getTodosLosUsuariosYSusSensores(callback) {

        console.log("Llamada a getTodosLosUsuariosYSusSensores");

        fetch(url + "/getTodosLosUsuariosYSusSensores", {
            method: 'GET', // or 'PUT'
        }).then(function (response) {
            console.log("response ", response);
            return response.json();
        })
            .then(function (datos) {
            if (datos != undefined) {

                console.log("Datos: " + datos);
                callback(datos);

            } else {
                console.log("No hay usuarios");
            }
        }).catch(e => {
            console.log("error: " + e);
            return e;
        });

    }
/****************************************************************************************
--> 
getNumeroUsuariosTotales()
--> N: numero de TODOS los usuarios

esta función devuelve cuantos usuarios hay

Ivan Romero
****************************************************************************************/
    //------------Ivan---------------
    // getNumeroUsuariosTotales()
    // --> N: numero de TODOS los usuarios 
    //-------------------------------
    async getNumeroUsuariosTotales(callback) {

        console.log("Llamada a getNumeroUsuariosTotales");

        fetch(url + "/getNumeroUsuariosTotales", {
            method: 'GET', // or 'PUT'
        }).then(function (response) {
            console.log("response ", response);
            return response.json();
        })
            .then(function (datos) {
            callback(datos);

        }).catch(e => {
            console.log("error: " + e);
            return e;
        });

    }
/****************************************************************************************
--> String: tipo 
getNumeroUsuariosTotalesPorTipo()
--> N: numero de usuarios segun tipo

esta función devuelve cuantos usuarios hay de un rol concreto, ejemplo: administrador

Ivan Romero
****************************************************************************************/
    async getNumeroUsuariosTotalesPorTipo(estado, callback) {

        console.log("Llamada a getNumeroUsuariosTotalesPorTipo con " + estado);

        fetch(url + "/getNumeroUsuariosTotalesPorTipo/" + estado, {
            method: 'GET', // or 'PUT'
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log("response ", response);
            return response.json();
        })
            .then(function (datos) {

            callback(datos);

        }).catch(e => {
            console.log("error: " + e);
            return e;
        });

    }

/****************************************************************************************
--> Objeto {desde: int, hasta: int}
getTodasLasMedidasPorFecha()
--> json que contiene cada medida, su tipo, ubicación...

esta función devuelve cuantos usuarios hay de un rol concreto, ejemplo: administrador

Diego Aguirre
****************************************************************************************/
    async getTodasLasMedidasPorFecha(intervalo, callback) {

        fetch(url + "/GetTodasLasMedidasPorFecha", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(intervalo), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        })
            .then(function (datos) {
            if (datos != undefined) {
                console.log("Tenemos las última medidas desde: " + intervalo.desde + " hasta " + intervalo.hasta);
            } else {
                console.log("No existe o no has puesto bien los datos");
            }
            callback(datos);
        });
    }

/****************************************************************************************
--> N: idSensor
borrarSensorPorID()
-->

esta función borra el sensor de la id pasada

Josep Carreres
****************************************************************************************/
    async borrarSensorPorID(id, callback) {

        /*var idJson = {
            id: id
        };*/

        fetch(URL + "/borrarSensorPorID", {
            method: 'POST', // or 'PUT'
            body: id.toString(), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res)
        }).catch(e => {
            console.log("error: " + e);
            return e;
        });
    }

    
/****************************************************************************************
--> QR
insertarSensor()
-->

esta función añade un sensor a partir de una lectura qr

 Emilia Rosa van der Heide
****************************************************************************************/
    async insertarSensor(QR) {
        console.log("PROXY: insertarSensor")

        var datosSensor = {
            IdSensor: 100,
            IdTipoMedida: 5,
            IdEstado: 1
        }

        fetch(URL + "/insertarSensor", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(datosSensor), // data can be `string` or {object}!
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res)
        }).catch(e => {
            console.log("error: " + e);
            return e;
        });
    }

/****************************************************************************************
-->
getEstacionesOficiales()
--> json con las estaciones y las medidas de Gandia 

esta función devuelve todos las estaciones oficiales en un JSON

 Emilia Rosa van der Heide
****************************************************************************************/
    async getEstacionesOficiales(callback) {
        console.log("PROXY: getEstacionesOficiales")

        fetch(url + "/getMedidasEstacionOficialGandia", {
            method: 'POST', // or 'PUT'
            headers: {
                'User-Agent': 'jordi',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        })
            .then(function (datos) {
            if (datos != undefined) {
                console.log(datos)
                console.log("Tenemos las última medidas de las estaciones");
            } else {
                console.log("No existe o no has puesto bien los datos");
            }
            callback(datos);
        });
    }

}
