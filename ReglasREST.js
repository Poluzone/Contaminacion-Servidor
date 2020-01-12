/****************************************************************************************
ReglasREST.js
GTI 3º, 2019-2020, Equipo 3
Autor: Josep Carreres, Emilia Rosa van der Heide
Descripcion: Reglas REST del servidor
Fecha: septiembre 2019
© Copyright:
****************************************************************************************/
const path = require('path');
const saltRounds = 10;
const util = require('util')
const fs = require('fs')

module.exports.cargar = function (servidorExpress, laLogica, bcrypt) {
  /****************************************************************************************
  GET /prueba
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/prueba', function (peticion, respuesta) {
    console.log(" * GET /prueba ")
    respuesta.send("¡Funciona!")
  }) // get /prueba

  /****************************************************************************************
  GET /GETsoloMedidas
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/GETsoloMedidas',
    async function (peticion, respuesta) {
      console.log(" * GET /soloMedidas ")

      var dato = peticion.params.dato

      console.log(dato)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetSoloMedidas();

      console.log(res.dato);
      console.log(res.fecha);
      console.log(res.posicion);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /GETidUsuario
  Recoge el id que corresponda al usuario loggeado
  Matthew Conde Oltra
  ****************************************************************************************/
  servidorExpress.post('/GETidUsuario',
    async function (peticion, respuesta) {
      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      console.log(dato);

      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetIdDelUsuario(dato.Email);

      console.log(res[0].IdUsuario);

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


  /****************************************************************************************
  POST /GETultimaMedidaPorUsuario
  Recoge la última médida del usuario que se le diga -> devuelve un JSON con el dato, la fecha y la posición
  Matthew Conde Oltra
  ****************************************************************************************/
  servidorExpress.post('/GETultimaMedidaPorUsuario',
    async function (peticion, respuesta) {
      console.log(" * POST /ultimaMedidaPorUsuario ")

      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      console.log(dato);

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getLaUltimaMedidaPorUsuario(dato);

      console.log(res[0].Valor);
      console.log(res[0].Tiempo);
      console.log(res[0].Latitud);
      console.log(res[0].Longitud);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })


  /****************************************************************************************
  GET /GetUsuarioPorEmail/:email
  Es una petición GET que llama a getUsuarioPorEmail() de la Lógica la cual recoge los datos del Usuario de la BBDD
  ****************************************************************************************/
  servidorExpress.get('/GetUsuarioPorEmail/:email',
    async function (peticion, respuesta) {
      console.log(" * GET /UsuarioPorEmail ")
      // averiguo el dni
      var dato = peticion.params.email

      console.log(dato)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetUsuarioPorEmail(dato);

      console.log(res.Email);
      console.log(res.Password);
      console.log(res.Telefono);

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré usuario: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /GetUsuarioPorEmail
  Es una petición GET que llama a getUsuarioPorEmail() de la Lógica la cual recoge los datos del Usuario de la BBDD
  ****************************************************************************************/
  servidorExpress.post('/GetUsuarioPorEmail',
    async function (peticion, respuesta) {
      console.log(" * POST /UsuarioPorEmail ")
      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      console.log("El dato introducido en el método: " + dato.Email)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetUsuarioPorEmail(dato.Email);

      console.log(res[0].Email);
      console.log(res[0].Nombre);
      console.log(res[0].Telefono);
      console.log(res[0].TipoUsuario);

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


  /****************************************************************************************
  GET /getNumSensoresSegunEstado/:idestado
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.get('/getNumSensoresSegunEstado/:idestado',
    async function (peticion, respuesta) {
      console.log(" * GET /getNumSensoresSegunEstado/:idestado")
      var dato = peticion.params.idestado
      console.log("El dato introducido en el método: " + dato)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.getNumSensoresSegunEstado(dato);
      console.log("La respuesta es: " + res);

      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /ComprobarLogin/:idestado
  Es una petición POST que llama a getUsuarioPorEmail() de la Lógica la cual devuelve el objeto USUARIO con el que compara la Password
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/ComprobarLogin',
    async function (peticion, respuesta) {
      console.log(" * POST /ComprobarLogin ")
      // averiguo el dni
      var dato = JSON.parse(peticion.body);

      console.log(dato)
      // llamo a la función adecuada de la lógica
      var resu = await laLogica.GetUsuarioPorEmail(dato.Email);

      if (resu.length != 1) {
        // 404: not found
        console.log("no encontré email: " + dato.Email);
        respuesta.status(404).send("no encontré usuario: " + dato.Email)
        return
      }

      bcrypt.compare(dato.Email + dato.Password, resu[0].Password, function (err, res) {
        if (!err) {
          var data = {
            Usuario: resu,
            status: res,
          };

          respuesta.send(data);

        }
      });

    })

  /****************************************************************************************
  POST /insertarMedida
  Es una petición POST que llama a insertarMedida() de la Lógica la cual añade la medida del sensor a la BBDD
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/insertarMedida',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarMedida")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.insertarMedida(datos);

      respuesta.send("OK");
    }) // post / insertarMedida


  /****************************************************************************************
  POST /insertarUsuario
  Es una petición POST que llama a insertarUsuario() de la Lógica la cual añade el usuario a la BBDD
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/insertarUsuario',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarUsuario")
      var datos = JSON.parse(peticion.body)

      bcrypt.hash(datos.Email + datos.Password, saltRounds, function (err, hash) {
        if (!err) {
          datos.Password = hash;

          laLogica.insertarUsuario(datos).then(function () {
            var data = {
              status: true
            }
            respuesta.send(JSON.stringify(data));
          })
            .catch(function (err) {
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


  /****************************************************************************************
  POST /insertarIdUsuarioConIdsensor
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/insertarIdUsuarioConIdsensor',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarIdUsuarioConIdsensor")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.vincularSensorConUsuario(datos);

      respuesta.send("OK");
    }); // post / insertarPersona


  /****************************************************************************************
  POST /insertarSensor
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/insertarSensor',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarSensor")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.insertarSensor(datos);

      respuesta.status(200).send("OK");
    }); // post / insertarPersona


  /****************************************************************************************
  POST /borrarSensorPorID
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/borrarSensorPorID',
    function (peticion, respuesta) {
      console.log(" * POST /borrarSensorPorID")
      var id = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.borrarSensorPorID(id);

      respuesta.status(200).send("OK");
    }); // post / insertarPersona


  /****************************************************************************************
  POST /borrarUsuarioPorId
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/borrarUsuarioPorId',
    function (peticion, respuesta) {

      console.log(" * POST /borrarUsuarioPorId")

      var id = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.borrarUsuarioPorId(id);

      respuesta.send("OK");
    }); // post / insertarPersona


  /****************************************************************************************
  POST /desvincularUsuarioDeSensorPorIdUsuario
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.post('/desvincularUsuarioDeSensorPorIdUsuario',
    function (peticion, respuesta) {

      console.log(" * POST /desvincularUsuarioDeSensorPorIdUsuario")

      var id = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.desvincularUsuarioDeSensorPorIdUsuario(id);

      respuesta.send("OK");
    }); // post / insertarPersona


  /****************************************************************************************
  POST /editarInformacionUsuario
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/editarInformacionUsuario',
    function (peticion, respuesta) {

      console.log(" * POST /editarInformacionUsuario")

      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.editarInformacionUsuario(datos);

      respuesta.send("OK");
    }); // post / insertarPersona


  /****************************************************************************************
  GET /getSensoresYSusUsuarios
  Es una petición GET que llama a getSensoresYSusUsuarios() de la Lógica la cual recoge los datos de los sensores de la BBDD
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.get('/getSensoresYSusUsuarios',
    async function (peticion, respuesta) {
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


  /****************************************************************************************
  GET /getMedidasEstacionOficialGandia
  Es una petición GET que llama a getMedidasEstacionOficialGandia() de la Lógica la cual 
  recoge los datos las medidas oficiales de gandia en este momento
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.get('/getMedidasEstacionOficialGandia',
    async function (peticion, respuesta) {
      console.log(" * GET /getMedidasEstacionOficialGandia ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMedidasEstacionOficialGandia();

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + dato)
        return
      }
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /getMediaCalidadDelAireDeLaJornada
  Es una petición GET que llama a getMediaCalidadDelAireDeLaJornada() de la Lógica la cual 
  recoge los datos de todas las medidas de un usuario según un intervalo de la BBDD y
  calcula su media
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.post('/getMediaCalidadDelAireDeLaJornada',
    async function (peticion, respuesta) {
      console.log(" * GET /getMediaCalidadDelAireDeLaJornada ")

      console.log(peticion.body)
      var datos = JSON.parse(peticion.body)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMediaCalidadDelAireDeLaJornada(datos);
      var resJson = { media: res };

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


  /****************************************************************************************
  POST /getMedidasDeEsteUsuarioPorFecha
  Es una petición POST que llama a getMedidasDeEsteUsuarioPorFecha() de la Lógica la cual 
  devuelve todas las medidas del idUsuario pasado desde, hasta una fecha
  Matthew Conde Oltra
  ****************************************************************************************/
  servidorExpress.post('/getMedidasDeEsteUsuarioPorFecha',
    async function (peticion, respuesta) {
      console.log(" * POST /getMedidasDeEsteUsuarioPorFecha ")

      console.log(peticion.body)
      var datos = JSON.parse(peticion.body)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMedidasDeEsteUsuarioPorFecha(datos.Intervalo, datos.IdUsuario);
      //console.log(res);

      var data = {
        medidas: res,
        funciona: "ok"
      }

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + res)
        return
      }
      // todo ok
      respuesta.status(200).send(data)
    });

  /****************************************************************************************
  POST /getUltimasNMedicionesPorUsuario
  Josep Carreres Fluixà
  ****************************************************************************************/
  servidorExpress.post('/getUltimasNMedicionesPorUsuario',
    async function (peticion, respuesta) {
      console.log(" * POST /getUltimasNMedicionesPorUsuario ")

      console.log(peticion.body)
      var datos = JSON.parse(peticion.body)

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getUltimasNMedicionesPorUsuario(datos);
      //console.log(res);
      var data = {
        medidas: res,
        funciona: "ok"
      }

      // si el array de resultados no tiene una casilla ...
      if (res.length < 1) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas: " + res)
        return
      }
      // todo ok
      respuesta.status(200).send(data)
    });


  /****************************************************************************************
  POST /getEstacionesOficiales
  Es una petición POST que llama a getEstacionesOficiales() de la Lógica la cual devuelve 
  todas las estaciones de la Comunidad Valenciana
  Matthew Conde Oltra
  ****************************************************************************************/
  servidorExpress.post('/getEstacionesOficiales',
    async function (peticion, respuesta) {
      console.log(" * POST /getEstacionesOficiales ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getEstacionesOficiales();
      //console.log(res);
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

  /****************************************************************************************
  GET /getNumeroUsuariosTotales
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.get('/getNumeroUsuariosTotales',
    async function (peticion, respuesta) {
      console.log(" * GET /getNumeroUsuariosTotales ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getNumeroUsuariosTotales();

      // si el array de resultados no tiene una casilla ..
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /****************************************************************************************
  GET /getTodosLosUsuariosYSusSensores
  Es una petición GET que llama a getTodosLosUsuariosYSusSensores() de la Lógica la 
  cual recoge los datos de todos los usuarios
  Josep Carreres Fluixà
  ****************************************************************************************/
  servidorExpress.get('/getTodosErroresDeSensoresSinRevision',
    async function (peticion, respuesta) {
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


  /****************************************************************************************
  POST /marcarErroresComoRevisados
  Es una petición POST que llama a marcarErroresComoRevisados() de la Lógica la cual edita 
  el estado del nodo
  Josep Carreres Fluixà
  ****************************************************************************************/
  servidorExpress.post('/marcarErroresComoRevisados',
    async function (peticion, respuesta) {
      console.log("* POST /marcarErroresComoRevisados")

      // llamo a la función adecuada de la lógica
      await laLogica.marcarErroresComoRevisados();

      respuesta.send("OK");
    })

  /****************************************************************************************
  POST /getMedidasEstacionOficialGandia
  Es una petición POST que llama a getMedidasEstacionOficialGandia() de la Lógica la cual 
  devuelve todas las estaciones de la Comunidad Valenciana y las medidas de Gandia
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.post('/getMedidasEstacionOficialGandia',
    async function (peticion, respuesta) {
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


  /****************************************************************************************
  GET /getNumeroUsuariosTotales
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/getNumeroUsuariosTotales',
    async function (peticion, respuesta) {
      console.log(" * GET /getNumeroUsuariosTotales ")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getNumeroUsuariosTotales();

      // si el array de resultados no tiene una casilla ..
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /****************************************************************************************
  GET /getNumeroUsuariosTotalesPorTipo/:tipo
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/getNumeroUsuariosTotalesPorTipo/:tipo',
    async function (peticion, respuesta) {

      var dato = peticion.params.tipo
      var res = await laLogica.getNumeroUsuariosTotalesPorTipo(dato);
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /getTodasLasMedidasPorFecha
  Recoge dos fechas, fecha desde y fecha hasta devuelve todas las medidas entre estas 
  dos medidas de tiempo
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.post('/GetTodasLasMedidasPorFecha/',
    async function (peticion, respuesta) {
      console.log("* POST /TodasLasMedidasPorFecha")

      //Obtengo el body donde pondré los parámetros
      var dato = JSON.parse(peticion.body);

      //console.log(dato);

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getTodasLasMedidasPorFecha(dato);

      //console.log(res[0]);
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


  /****************************************************************************************
  GET /getTodosLosUsuariosYSusSensores
  Es una petición GET que llama a getTodosLosUsuariosYSusSensores() de la Lógica la cual 
  recoge los datos de todos los usuarios y los sensores vinculados
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.get('/getTodosLosUsuariosYSusSensores/',
    async function (peticion, respuesta) {
      console.log("* GET /getTodosLosUsuariosYSusSensores")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getTodosLosUsuariosYSusSensores();

      // si el array de resultados no tiene una casilla ...
      if (res.length < 0) {
        // 404: not found
        respuesta.status(404).send("no encontré usuarios: " + dato)
        return
      }
      // todo ok
      respuesta.status(200).send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /indicarActividadNodo
  Es una petición POST que llama a indicarActividadNodo() de la Lógica la cual edita 
  el estado del nodo
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.post('/indicarActividadNodo/',
    async function (peticion, respuesta) {
      console.log("* POST /indicarActividadNodo")

      var dato = JSON.parse(peticion.body);

      // llamo a la función adecuada de la lógica
      await laLogica.indicarActividadNodo(dato);
      res = { ok: "ok" }
      respuesta.send(JSON.stringify(res))
    })


  /****************************************************************************************
  GET /getMedidasEstacionOficialGandia
  Es una petición POST que llama a indicarActividadNodo() de la Lógica la cual edita 
  el estado del nodo
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.get('/getMedidasEstacionOficialGandia/',
    async function (peticion, respuesta) {
      console.log("* POST /getMedidasEstacionOficialGandia")

      // llamo a la función adecuada de la lógica
      var res = await laLogica.getMedidasEstacionOficialGandia();
      respuesta.send(JSON.stringify(res))
    })


  /****************************************************************************************
  POST /insertarImagen
  Es una petición POST que guarda la foto en ux/images/poluzone
  Emilia Rosa van der Heide
  ****************************************************************************************/
  servidorExpress.post('/insertarImagen', async function (peticion, respuesta) {

    console.log(" * POST /insertarImagen ")
    var datos = JSON.parse(peticion.body)
    let image = datos["imagen"];

    // luego extraes la cabecera del data url
    var base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    // grabas la imagen el disco
    fs.writeFile('./ux/images/poluzone/img' + '-' + Date.now() + '.jpg', base64Data, 'base64', function (err) {
      console.log(err);
    });

    return respuesta.sendStatus(200);

  }) // post / subirImagen


  /****************************************************************************************
  GET /ux/html/:archivo
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/ux/html/:archivo', function (peticion, respuesta) {
    //console.log(" HTML:" + peticion.params.archivo);
    var dir = path.resolve("./ux/html");
    respuesta.sendFile(dir + "/" + peticion.params.archivo);
  });

  /****************************************************************************************
  GET /ux/js/:archivo
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/ux/js/:archivo', function (peticion, respuesta) {
    //console.log(" JS:" + peticion.params.archivo);
    var dir = path.resolve("./ux/js");
    respuesta.sendFile(dir + "/" + peticion.params.archivo);
  });

  /****************************************************************************************
  GET /ux/css/:archivo
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/ux/css/:archivo', function (peticion, respuesta) {
    //console.log(" CSS:" + peticion.params.archivo);
    var dir = path.resolve("./ux/css");
    respuesta.sendFile(dir + "/" + peticion.params.archivo);
  });

  /****************************************************************************************
  GET /ux/images/:archivo
  Josep Carreres Fluixa
  ****************************************************************************************/
  servidorExpress.get('/ux/images/:archivo', function (peticion, respuesta) {
    //console.log(" IMAGES:" + peticion.params.archivo);
    var dir = path.resolve("./ux/images");
    respuesta.sendFile(dir + "/" + peticion.params.archivo);
  });



} // cargar()
/****************************************************************************************
****************************************************************************************/
