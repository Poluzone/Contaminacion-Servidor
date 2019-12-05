const IP_PUERTO = "http://localhost:8080";


class Proxy {
    constructor() {
        console.log("Funciono");
    }


    async insertarMedida(dato, fecha, posicion) {
        var data = {
            dato: dato,
            fecha: fecha,
            posicion: posicion
        };

        fetch(IP_PUERTO + "/insertarMedida", {
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

    async insertarUsuario(email, pass, tel) {

        var data = {
            Email: email,
            Password: pass,
            Telefono: tel
        };

        fetch(IP_PUERTO + "/insertarUsuario", {
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

    async ComprobacionLogin(data) {
        console.log("Realizando ComprobacionLogin");

        fetch(IP_PUERTO + "/ComprobarLogin", {
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
                if (datos.Usuario[0].TipoUsuario == "Admin") {
                    setCookie("username", datos.Usuario[0].Email);
                    console.log("Iniciar sesion correcto y se han creado los cookies");
                    checkCookie();
                } else {
                    console.log("El usuario que intenta iniciar sesión no es Admin");
                    elUsuarioNoEsAdmin();
                }

            } else {
                console.log("No existe o no has puesto bien los datos");
                usuarioOContraseñaIncorrectos();
            }
        });
    }

    /**
     * GETultimaMedida()
     */
    async GETultimaMedidaPorUsuario(userId, callback) {

        fetch(IP_PUERTO + "/GETultimaMedidaPorUsuario", {
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

    /**
     * GetIdUsuario()
     */
    async GETidUsuario(username, callback) {

        fetch(IP_PUERTO + "/GETidUsuario", {
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

    //------------Ivan---------------
    // getSensoresYSusUsuarios()
    // --> json con todos los sensores
    //-------------------------------
    async getSensoresYSusUsuarios(callback) {

        console.log("Llamada a getSensoresYSusUsuarios");

        fetch(IP_PUERTO + "/getSensoresYSusUsuarios", {
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

    //-------------Ivan--------------
    // N: IdEstado -->
    // getNumSensoresSegunEstado()
    // --> N: numero de sensores segun estado
    //-------------------------------
    async getNumSensoresSegunEstado(estado, callback) {

        console.log("Llamada a getNumSensoresSegunEstado con " + parseInt(estado));

        fetch(IP_PUERTO + "/getNumSensoresSegunEstado/" + estado, {
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

    //------------Ivan---------------
    // getTodosLosUsuariosYSusSensores()
    // --> json con todos los usuarios
    //-------------------------------
    async getTodosLosUsuariosYSusSensores(callback) {

        console.log("Llamada a getTodosLosUsuariosYSusSensores");

        fetch(IP_PUERTO + "/getTodosLosUsuariosYSusSensores", {
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

    //------------Ivan---------------
    // getNumeroUsuariosTotales()
    // --> N: numero de TODOS los usuarios 
    //-------------------------------
    async getNumeroUsuariosTotales(callback) {

        console.log("Llamada a getNumeroUsuariosTotales");

        fetch(IP_PUERTO + "/getNumeroUsuariosTotales", {
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

    //-------------Ivan--------------
    // String: tipo -->
    // getNumeroUsuariosTotalesPorTipo()
    // --> N: numero de usuarios segun tipo
    //-------------------------------
    async getNumeroUsuariosTotalesPorTipo(estado, callback) {

        console.log("Llamada a getNumeroUsuariosTotalesPorTipo con " + estado);

        fetch(IP_PUERTO + "/getNumeroUsuariosTotalesPorTipo/" + estado, {
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

    //-------------------------------
    // GetUltimasMedidasPorFecha()
    //-------------------------------
    async getTodasLasMedidasPorFecha(intervalo, callback) {

        fetch(IP_PUERTO + "/GetTodasLasMedidasPorFecha", {
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

    //-------------------------------
    // borrarSensorPorID()
    //-------------------------------
    async borrarSensorPorID(id, callback) {

        /*var idJson = {
            id: id
        };*/

        fetch(IP_PUERTO + "/borrarSensorPorID", {
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

    //-------------------------------
    // Emilia Rosa van der Heide
    // estado, medida -> insertarSensor() ->
    //-------------------------------
    async insertarSensor(QR) {
        console.log("PROXY: insertarSensor")

        var datosSensor = {
            IdSensor: 100,
            IdTipoMedida: 5,
            IdEstado: 1
        }

        fetch(IP_PUERTO + "/insertarSensor", {
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

}
