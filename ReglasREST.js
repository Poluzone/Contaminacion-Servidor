// .....................................................................
// ReglasREST.js
// .....................................................................
const path = require('path');
const saltRounds = 10;

module.exports.cargar = function(servidorExpress, laLogica, bcrypt) {
  // .......................................................
  // GET /prueba
  // .......................................................
  servidorExpress.get('/prueba', function(peticion, respuesta) {
    console.log(" * GET /prueba ")
    respuesta.send("¡Funciona!")
  }) // get /prueba
  // .......................................................
  // GET /persona/<dni>
  // .......................................................

  servidorExpress.get('/GETsoloMedidas',
    async function(peticion, respuesta) {
      console.log(" * GET /soloMedidas ")
      var dato = peticion.params.dato

      //console.log(dato)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetSoloMedidas();

      //console.log(res.dato);
      //console.log(res.fecha);
      //console.log(res.posicion);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })

  /**
   * /GETidUsuario
   *
   * Recoge el id que corresponda al usuario loggeado
   *
   * - Matthew Conde Oltra -
   */
  servidorExpress.post('/GETidUsuario',
    async function(peticion, respuesta) {
      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      //console.log(dato);

      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetIdDelUsuario(dato.Email);

      //console.log(res[0].IdUsuario);

      var idUser = {
        IdUsuario: res[0].IdUsuario
      }

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + email);
        return;
      }
      // todo ok
      respuesta.send(idUser);


    })

  /**
   * /GETultimaMedidaPorUsuario
   *
   * Recoge la última médida del usuario que se le diga -> devuelve un JSON con el dato, la fecha y la posición
   */
  servidorExpress.post('/GETultimaMedidaPorUsuario',
    async function(peticion, respuesta) {
      console.log(" * POST /ultimaMedidaPorUsuario ")

      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      //console.log(dato);

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getLaUltimaMedidaPorUsuario(dato);

      //console.log(res[0].Valor);
      //console.log(res[0].Tiempo);
      //console.log(res[0].Latitud);
      //console.log(res[0].Longitud);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })
  /**
   * /GetUsuarioPorEmail/:email -> es una petición GET que llama a getUsuarioPorEmail() de la Lógica
   * la cual recoge los datos del Usuario de la BBDD
   *
   */

  servidorExpress.get('/GetUsuarioPorEmail/:email',
    async function(peticion, respuesta) {
      console.log(" * GET /UsuarioPorEmail ")
      // averiguo el dni
      var dato = peticion.params.email

      //console.log(dato)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetUsuarioPorEmail(dato);

      //console.log(res.Email);
      //console.log(res.Password);
      //console.log(res.Telefono);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré usuario: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })

  /**
   * /GetUsuarioPorEmail -> es una petición POST que llama a getUsuarioPorEmail() de la Lógica
   * la cual recoge los datos del Usuario de la BBDD
   *
   */

  servidorExpress.post('/GetUsuarioPorEmail',
    async function(peticion, respuesta) {
      console.log(" * POST /UsuarioPorEmail ")
      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      console.log("El dato introducido en el método: " + dato.Email)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetUsuarioPorEmail(dato.Email);

      //console.log(res[0].Email);
      //console.log(res[0].Nombre);
      //console.log(res[0].Telefono);
      //console.log(res[0].TipoUsuario);

      var data = {
        Usuario: res,
        k: "ok"
      }

      console.log("La respuesta es: " + JSON.stringify(data));

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré usuario: " + dato)
        return
      }

      respuesta.send(data);
    })


  servidorExpress.get('/getNumSensoresSegunEstado/:idestado',
    async function(peticion, respuesta) {
      console.log(" * GET /getNumSensoresSegunEstado/:idestado")
      var dato = peticion.params.idestado
      console.log("El dato introducido en el método: " + dato)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.getNumSensoresSegunEstado(dato);
      console.log("La respuesta es: " + res);

      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })

  /**
   * /ComprobarLogin -> es una petición POST que llama a getUsuarioPorEmail() de la Lógica
   * la cual devuelve el objeto USUARIO con el que compara la Password
   *
   */

  servidorExpress.post('/ComprobarLogin',
    async function(peticion, respuesta) {
      console.log(" * POST /ComprobarLogin ")
      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      //console.log(dato)
      // llamo a la función adecuada de la lógica
      var resu = await laLogica.GetUsuarioPorEmail(dato.Email);

      if (resu.length != 1) {
        // 404: not found
        console.log("no encontré email: " + dato.Email);
        respuesta.status(404).send("no encontré usuario: " + dato.Email)
        return
      }

      bcrypt.compare(dato.Email + dato.Password, resu[0].Password, function(err, res) {
        if (!err) {
          var data = {
            Usuario: resu,
            status: res,
          };

          respuesta.send(data);

        }
      });

    })

  /**
   * /insertarMedida -> es una petición POST que llama a insertarMedida() de la Lógica
   * la cual añade la medida del sensor a la BBDD
   *
   */
  servidorExpress.post('/insertarMedida',
    async function(peticion, respuesta) {
      console.log(" * POST /insertarMedida")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.insertarMedida(datos);

      respuesta.send("OK");
    }) // post / insertarPersona

  /**
   * /insertarUsuario -> es una petición POST que llama a insertarUsuario() de la Lógica
   * la cual añade el usuario a la BBDD
   *
   *
   */
  servidorExpress.post('/insertarUsuario',
    async function(peticion, respuesta) {
      console.log(" * POST /insertarUsuario")
      var datos = JSON.parse(peticion.body)

      bcrypt.hash(datos.Email + datos.Password, saltRounds, function(err, hash) {
        if (!err) {
          datos.Password = hash;

          laLogica.insertarUsuario(datos).then(function() {
              var data = {
                status: true
              }
              respuesta.send(JSON.stringify(data));
            })
            .catch(function(err) {
              console.log(err)
              var data = {
                status: false
              }
              respuesta.send(JSON.stringify(data));
            })
        } else {
          var data = {
            status: false
          }
          console.log(err);
        }
      })
    }); // post / insertarPersona

  /**
   * /insertarUsuario -> es una petición POST que llama a insertarUsuario() de la Lógica
   * la cual añade el usuario a la BBDD
   */
  servidorExpress.post('/insertarIdUsuarioConIdsensor',
    async function(peticion, respuesta) {
      console.log(" * POST /insertarIdUsuarioConIdsensor")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.vincularSensorConUsuario(datos);

      respuesta.send("OK");
    }); // post / insertarPersona


  servidorExpress.post('/insertarSensor',
    async function(peticion, respuesta) {
      console.log(" * POST /insertarSensor")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.insertarSensor(datos);

      respuesta.send("OK");
    }); // post / insertarPersona

  servidorExpress.post('/borrarSensorPorID',
    function(peticion, respuesta) {

      var id = JSON.parse(peticion.body);

      console.log(" * POST /borrarSensorPorID " + id);

      // supuesto procesamiento

      laLogica.borrarSensorPorID(id);

      respuesta.send("OK");
    }); // post / insertarPersona

  servidorExpress.post('/borrarUsuarioPorId',
    function(peticion, respuesta) {

      console.log(" * POST /borrarUsuarioPorId")

      var id = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.borrarUsuarioPorId(id);

      respuesta.send("OK");
    }); // post / insertarPersona

  servidorExpress.post('/desvincularUsuarioDeSensorPorIdUsuario',
    function(peticion, respuesta) {

      console.log(" * POST /desvincularUsuarioDeSensorPorIdUsuario")

      var id = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.desvincularUsuarioDeSensorPorIdUsuario(id);

      respuesta.send("OK");
    }); // post / insertarPersona

  servidorExpress.post('/editarInformacionUsuario',
    function(peticion, respuesta) {

      console.log(" * POST /editarInformacionUsuario")

      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.editarInformacionUsuario(datos);

      respuesta.send("OK");
    }); // post / insertarPersona


  /*
   * /getSensoresYSusUsuarios/ -> es una petición GET que llama a getSensoresYSusUsuarios() de la Lógica
   * la cual recoge los datos de los sensores de la BBDD
   */

  servidorExpress.get('/getSensoresYSusUsuarios',
    async function(peticion, respuesta) {
      console.log(" * GET /getSensoresYSusUsuarios ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getSensoresYSusUsuarios();

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré sensores: " + dato)
        return
      }
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Emilia Rosa van der Heide
   * /getMediaCalidadDelAireDeLaJornada -> es una petición GET que llama a
   * getMediaCalidadDelAireDeLaJornada() de la Lógica la cual recoge los datos
   * de todas las medidas de un usuario según un intervalo de la BBDD y
   * calcula su media
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  servidorExpress.post('/getMediaCalidadDelAireDeLaJornada',
    async function(peticion, respuesta) {
      console.log(" * GET /getMediaCalidadDelAireDeLaJornada ")

      console.log(peticion.body)
      var datos = JSON.parse(peticion.body)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMediaCalidadDelAireDeLaJornada(datos);
      var resJson = {
        media: res
      };

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      console.log(resJson)
      respuesta.status(200).send(resJson)
    })

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * - Matthew Conde Oltra -
   *
   * /getMedidasDeEsteUsuarioPorFecha -> es una petición POST que llama a
   * getMedidasDeEsteUsuarioPorFecha() de la Lógica la cual devuelve todas las
   * medidas del idUsuario pasado desde, hasta una fecha
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  servidorExpress.post('/getMedidasDeEsteUsuarioPorFecha',
    async function(peticion, respuesta) {
      console.log(" * POST /getMedidasDeEsteUsuarioPorFecha ")

      //console.log(peticion.body)
      var datos = JSON.parse(peticion.body)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMedidasDeEsteUsuarioPorFecha(datos.Intervalo, datos.IdUsuario);
      //console.log(res);

      var respuesta = {
        medidas: res,
        resultado: "ok"
      }

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.status(200).send(respuesta)
    });

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * - Matthew Conde Oltra -
   *
   * /getEstacionesOficiales -> es una petición POST que llama a
   * getEstacionesOficiales() de la Lógica la cual devuelve todas las
   * estaciones de la Comunidad Valenciana
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  servidorExpress.post('/getEstacionesOficiales',
    async function(peticion, respuesta) {
      console.log(" * POST /getEstacionesOficiales ")


      // llamo a la función adecuada de la lógica
      //var res = await laLogica.getEstacionesOficiales();
      var res = await laLogica.getMedidasEstacionOficialGandia();
      console.log(res);
      var data = {
        estaciones: res,
        k: 'ok'
      };
      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré estaciones")
        return
      }
      // todo ok
      respuesta.status(200).send(data)
    });

  servidorExpress.get('/getNumeroUsuariosTotales',
    async function(peticion, respuesta) {
      console.log(" * GET /getNumeroUsuariosTotales ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getNumeroUsuariosTotales();

      // si el array de resultados no tiene una casilla ..
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * - Emilia Rosa van der Heide -
   *
   * /getMedidasEstacionOficialGandia -> es una petición POST que llama a
   * getMedidasEstacionOficialGandia() de la Lógica la cual devuelve todas las
   * estaciones de la Comunidad Valenciana y las medidas de Gandia
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  servidorExpress.post('/getMedidasEstacionOficialGandia',
    async function(peticion, respuesta) {
      console.log(" * POST /getMedidasEstacionOficialGandia ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMedidasEstacionOficialGandia();
      //console.log(res);
      var data = {
        estaciones: res,
        ok: 'ok'
      };
      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré estaciones")
        return
      }
      // todo ok
      respuesta.status(200).send(data)
    });


  servidorExpress.get('/getNumeroUsuariosTotalesPorTipo/:tipo',
    async function(peticion, respuesta) {

      var dato = peticion.params.tipo
      var res = await laLogica.getNumeroUsuariosTotalesPorTipo(dato);
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })

  // .......................................................
  // getTodasLasMedidasPorFecha
  //
  // Recoge dos fechas, fecha desde y fecha hasta
  // devuelve todas las medidas entre estas dos medidas de tiempo
  // .......................................................
  servidorExpress.post('/GetTodasLasMedidasPorFecha/',
    async function(peticion, respuesta) {
      console.log("* POST /TodasLasMedidasPorFecha")

      //Obtengo el body donde pondré los parámetros
      var dato = JSON.parse(peticion.body);

      //console.log(dato);

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getTodasLasMedidasPorFecha(dato);

      console.log(res[0]);
      var data = {
        medidas: res,
        k: "ok"
      }

      //console.log("La respuesta es: " + JSON.stringify(data));

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.status(200).send(data)
    })


  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Emilia Rosa van der Heide
   * /getTodosLosUsuariosYSusSensores -> es una petición GET que llama a
   * getTodosLosUsuariosYSusSensores() de la Lógica la cual recoge los datos
   * de todos los usuarios
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  servidorExpress.get('/getTodosLosUsuariosYSusSensores',
    async function(peticion, respuesta) {
      console.log("* GET /getTodosLosUsuariosYSusSensores")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getTodosLosUsuariosYSusSensores();

      //console.log(res);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré usuarios: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })


  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Josep Carreres Fluixà
   * /getTodosLosUsuariosYSusSensores -> es una petición GET que llama a
   * getTodosLosUsuariosYSusSensores() de la Lógica la cual recoge los datos
   * de todos los usuarios
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  servidorExpress.get('/getTodosErroresDeSensoresSinRevision',
    async function(peticion, respuesta) {
      console.log("* GET /getTodosErroresDeSensoresSinRevision")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getErroresConSenoresYUsuarios();

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré errores: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Josep Carreres Fluixà
   * /indicarActividadNodo -> es una petición POST que llama a
   * indicarActividadNodo() de la Lógica la cual edita el estado del nodo
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  servidorExpress.post('/marcarErrorComoRevisadoPorIdError',
    async function(peticion, respuesta) {
      console.log("* POST /marcarErrorComoRevisadoPorIdError")

      var idError = JSON.parse(peticion.body);

      // llamo a la función adecuada de la lógica
      await laLogica.marcarErrorComoRevisadoPorIdError(idError);

      respuesta.send("OK");
    })


  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Emilia Rosa van der Heide
   * /indicarActividadNodo -> es una petición POST que llama a
   * indicarActividadNodo() de la Lógica la cual edita el estado del nodo
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  servidorExpress.post('/indicarActividadNodo/',
    async function(peticion, respuesta) {
      console.log("* POST /indicarActividadNodo")

      var dato = JSON.parse(peticion.body);

      // llamo a la función adecuada de la lógica
      await laLogica.indicarActividadNodo(dato);
      res = {
        ok: "ok"
      }
      respuesta.send(JSON.stringify(res))
    })

  servidorExpress.get('/ux/html/:archivo', function(peticion, respuesta) {
    console.log(" HTML:" + peticion.params.archivo);
    var dir = path.resolve("./ux/html");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

  servidorExpress.get('/ux/js/:archivo', function(peticion, respuesta) {
    console.log(" JS:" + peticion.params.archivo);
    var dir = path.resolve("./ux/js");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });
  servidorExpress.get('/ux/css/:archivo', function(peticion, respuesta) {
    console.log(" CSS:" + peticion.params.archivo);
    var dir = path.resolve("./ux/css");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

  servidorExpress.get('/ux/images/:archivo', function(peticion, respuesta) {
    console.log(" IMAGES:" + peticion.params.archivo);
    var dir = path.resolve("./ux/images");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });



} // cargar()
// .....................................................................
// .....................................................................
