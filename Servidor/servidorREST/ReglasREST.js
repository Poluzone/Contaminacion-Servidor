// .....................................................................
// ReglasREST.js
// .....................................................................
const path = require('path');
const saltRounds = 10;

module.exports.cargar = function (servidorExpress, laLogica, bcrypt) {
  // .......................................................
  // GET /prueba
  // .......................................................
  servidorExpress.get('/prueba', function (peticion, respuesta) {
    console.log(" * GET /prueba ")
    respuesta.send("¡Funciona!")
  }) // get /prueba
  // .......................................................
  // GET /persona/<dni>
  // .......................................................

  servidorExpress.get('/GETsoloMedidas',
    async function (peticion, respuesta) {
      console.log(" * GET /soloMedidas ")

      // averiguo el dni
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

  /**
  * /GETidUsuario
  *
  * Recoge el id que corresponda al usuario loggeado
  *
  * - Matthew Conde Oltra -
  */
  servidorExpress.post('/GETidUsuario',
    async function (peticion, respuesta) {

      console.log(" * POST /idUsuario ");

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

  /**
   * /GETultimaMedidaPorUsuario
   *
   * Recoge la última médida del usuario que se le diga -> devuelve un JSON con el dato, la fecha y la posición
   */
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
  /**
     * /GetUsuarioPorEmail/:email -> es una petición GET que llama a getUsuarioPorEmail() de la Lógica
     * la cual recoge los datos del Usuario de la BBDD
     *
     */

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

  /**
 * /GetUsuarioPorEmail -> es una petición POST que llama a getUsuarioPorEmail() de la Lógica
 * la cual recoge los datos del Usuario de la BBDD
 *
 */

  servidorExpress.post('/GetUsuarioPorEmail',
    async function (peticion, respuesta) {
      console.log(" * POST /UsuarioPorEmail ")
      // averiguo el dni
      var dato = peticion.body;

      console.log("El dato introducido en el método: " + dato)
      // llamo a la función adecuada de la lógica
      var res = await laLogica.GetUsuarioPorEmail("rosa@gti.com");

      console.log(res.Email);
      console.log(res.Nombre);
      console.log(res.Telefono);
      console.log(res.TipoUsuario);

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
 * /ComprobarLogin -> es una petición POST que llama a getUsuarioPorEmail() de la Lógica
 * la cual devuelve el objeto USUARIO con el que compara la Password
 *
 */

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

  /**
     * /insertarMedida -> es una petición POST que llama a insertarMedida() de la Lógica
     * la cual añade la medida del sensor a la BBDD
     *
     */
  servidorExpress.post('/insertarMedida',
    async function (peticion, respuesta) {
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
    async function (peticion, respuesta) {
      console.log(" * POST /insertarUsuario")
      var datos = JSON.parse(peticion.body)

      bcrypt.hash(datos.Email + datos.Password, saltRounds, function (err, hash) {
        if (!err) {
          datos.Password = hash;

          laLogica.insertarUsuario(datos).then(function () {
            var data = { status: true }
            respuesta.send(JSON.stringify(data));
          })
            .catch(function (err) {
              console.log(err)
              var data = { status: false }
              respuesta.send(JSON.stringify(data));
            })
        } else {
          var data = { status: false }
          console.log(err);
        }
      })
    }); // post / insertarPersona

    /**
     * /insertarUsuario -> es una petición POST que llama a insertarUsuario() de la Lógica
     * la cual añade el usuario a la BBDD
     *
     *
     */
    servidorExpress.post('/insertarIdUsuarioConIdsensor',
      async function (peticion, respuesta) {
        console.log(" * POST /insertarIdUsuarioConIdsensor")
        var datos = JSON.parse(peticion.body)

        // supuesto procesamiento

        laLogica.insertarIdUsuarioConIdsensor(datos);

        respuesta.send("OK");
      }); // post / insertarPersona


  /*
  * /getSensoresYSusUsuarios/ -> es una petición GET que llama a getSensoresYSusUsuarios() de la Lógica
  * la cual recoge los datos de los sensores de la BBDD
  */

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

  servidorExpress.get('/ux/html/:archivo', function (peticion, respuesta) {
    console.log(" HTML:" + peticion.params.archivo);
    var dir = path.resolve("../ux/html");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

  servidorExpress.get('/ux/js/:archivo', function (peticion, respuesta) {
    console.log(" JS:" + peticion.params.archivo);
    var dir = path.resolve("../ux/js");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });
  servidorExpress.get('/ux/css/:archivo', function (peticion, respuesta) {
    console.log(" CSS:" + peticion.params.archivo);
    var dir = path.resolve("../ux/css");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

  servidorExpress.get('/ux/images/:archivo', function (peticion, respuesta) {
    console.log(" IMAGES:" + peticion.params.archivo);
    var dir = path.resolve("../ux/images");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });
    
    // .......................................................
    // getTodasLasMedidasPorFecha
    //
    // Recoge dos fechas, fecha desde y fecha hasta
    // devuelve todas las medidas entre estas dos medidas de tiempo
    // .......................................................
    servidorExpress.post('/GetTodasLasMedidasPorFecha/',
                        async function(peticion, respuesta){
        console.log("* POST /TodasLasMedidasPorFecha")

        //Obtengo el body donde pondré los parámetros 
        var dato = JSON.parse(peticion.body);

        console.log(dato);

        // llamo a la función adecuada de la lógica
        var res = await laLogica.getTodasLasMedidasPorFecha(dato);

        console.log(res);

        // si el array de resultados no tiene una casilla ...
        if (res.length < 0) {
            // 404: not found
            respuesta.status(404).send("no encontré medidas: " + dato)
            return
        }
        // todo ok
        respuesta.send(JSON.stringify(res))
    })

} // cargar()
// .....................................................................
// .....................................................................
