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

  servidorExpress.get('/GetUsuarioPorEmail/:email',
    async function(peticion, respuesta) {
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
      if (res.length != 1) {
        // 404: not found
        respuesta.status(404).send("no encontré usuario: " + dato)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    })

    servidorExpress.post('/ComprobarLogin',
      async function(peticion, respuesta) {
        console.log(" * POST /ComprobarLogin ")
        // averiguo el dni
        var dato = JSON.parse(peticion.body);

        console.log(dato)
        // llamo a la función adecuada de la lógica
        var resu = await laLogica.GetUsuarioPorEmail(dato.Email);

        if (resu.length != 1) {
          // 404: not found
          respuesta.status(404).send("no encontré usuario: " + dato)
          return
        }

        bcrypt.compare(dato.Password, resu[0].Password , function(err, res) {
          if(!err){
                console.log(res);
              respuesta.send(JSON.stringify(res));
          }else {

            console.log(err);
          }
        });

      })

  servidorExpress.post('/insertarMedida',
    async function(peticion, respuesta) {
      console.log(" * POST /insertarMedida")
      var datos = JSON.parse(peticion.body)

      // supuesto procesamiento

      laLogica.insertarMedida(datos);

      respuesta.send("OK");
    }) // post / insertarPersona

  servidorExpress.post('/insertarUsuario',
    async function(peticion, respuesta) {
      console.log(" * POST /insertarUsuario")
      var datos = JSON.parse(peticion.body)

      bcrypt.hash(datos.Password, saltRounds, function(err, hash) {
        if (!err) {

          datos.Password = hash;

        var data = { status: "ok" }
        respuesta.send(JSON.stringify(data));
      }) // post / insertarPersona

  servidorExpress.get('/ux/html/:archivo', function(peticion, respuesta) {
    console.log(" HTML:" + peticion.params.archivo);
    var dir = path.resolve("../ux/html");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

  servidorExpress.get('/ux/js/:archivo', function(peticion, respuesta) {
    console.log(" JS:" + peticion.params.archivo);
    var dir = path.resolve("../ux/js");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });
  servidorExpress.get('/ux/css/:archivo', function(peticion, respuesta) {
    console.log(" CSS:" + peticion.params.archivo);
    var dir = path.resolve("../ux/css");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

  servidorExpress.get('/ux/images/:archivo', function(peticion, respuesta) {
    console.log(" IMAGES:" + peticion.params.archivo);
    var dir = path.resolve("../ux/images");
    respuesta.sendfile(dir + "/" + peticion.params.archivo);
  });

} // cargar()
// .....................................................................
// .....................................................................
