// ........................................................
// mainTest1.js
// ........................................................
var request = require('request')
var assert = require('assert')
// ........................................................
// ........................................................
const IP_PUERTO = "http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe("Test 1 : Recuerda arrancar el servidor", function () {
  // ....................................................
  // ....................................................

  it("probar POST /insertarUsuario", function (hecho) {
    var datos = {
      Email: "rosa@gti.com",
      Password: "equipo3rosa",
      Nombre: "Emilia Rosa",
      Telefono: "958623144",
      TipoUsuario: "Admin"
    }
    request.post(
      {
        url: IP_PUERTO + "/insertarUsuario",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        //assert.equal( carga, "true", "¿La carga no es OK" )
        hecho()
      } // callback
    ) // .post
  })

  it("probar POST /insertarMedida", function (hecho) {
    var medida = {
      IdTipoMedida: 2,
      IdUsuario: 6,
      Valor: 2423433,
      Tiempo: 234324,
      Latitud: 234,
      Longitud: 324
    }

    request.post(
      {
        url: IP_PUERTO + "/insertarMedida",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(medida)
      },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        assert.equal(carga, "OK", "¿La carga no es OK")
        hecho()
      } // callback
    ) // .post
  })



  it("probar POST /insertarIdUsuarioConIdsensor", function (hecho) {
    var dato = {
      IdUsuario: 19,
      IdSensor:2

    }

    request.post(
      {
        url: IP_PUERTO + "/insertarIdUsuarioConIdsensor",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(dato)
      },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        assert.equal(carga, "OK", "¿La carga no es OK")
        hecho()
      } // callback
    ) // .post
  })

  it("probar POST /insertarSensor", function (hecho) {
    var dato = {
      IdSensor:99,
      IdTipoMedida:2,
      IdEstado:2

    }

    request.post(
      {
        url: IP_PUERTO + "/insertarSensor",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(dato)
      },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        assert.equal(carga, "OK", "¿La carga no es OK")
        hecho()
      } // callback
    ) // .post
  })

  it("probar POST /borrarSensorPorID", function (hecho) {


    request.post(
      {
        url: IP_PUERTO + "/borrarSensorPorID",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(99)
      },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        assert.equal(carga, "OK", "¿La carga no es OK")
        hecho()
      } // callback
    ) // .post
  })

  it("probar POST /ComprobarLogin", function (hecho) {
    var dato = {
      Email: "prueba2@gmail.com",
      Password: "prueba1"
    }

    request.post(
      {
        url: IP_PUERTO + "/ComprobarLogin",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(dato)
      },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        assert.equal(json.status, true, "¿La carga no es OK")
        hecho()
      } // callback
    ) // .post
  })


  it("GET /GetUsuarioPorEmail/rosa@gti.com ", function (hecho) {
    /*var datos = {
      Email : "rosa@gti.com",
      Password: "equipo3rosa" ,
      Nombre: "Emilia Rosa",
      Telefono : "958623144",
      TipoUsuario: "Admin"
    }*/
    request.get(
      { url: IP_PUERTO + "/GetUsuarioPorEmail/rosa@gti.com", headers: { 'User-Agent': 'jordi' } },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        //assert.equal( json[0].Telefono, "958623144", "¿El telefono es el correcto?" )
        //assert.equal( json[0].Password, "prueba1", "¿La contraseña es la correcta?" )
        hecho()
      } // callback()
    ) // .get
  }) // it


/*
  it("POST /GetUsuarioPorEmail", function (hecho) {
    var dato = "prueba1@hotmail.com";
    request.post(
      {
        url: IP_PUERTO + "/GetUsuarioPorEmail",
        headers: { 'User-Agent': 'jordi' },
        body: JSON.stringify(dato)
      },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        assert.equal(json.status, true, "¿La carga no es OK")
        hecho()
      } // callback()
    ) // .get
  }) // it
*/
  it("POST /GETultimaMedidaPorUsuario ", function (hecho) {
    var dato = 15;
    request.post(
      {
        url: IP_PUERTO + "/GETultimaMedidaPorUsuario",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(dato)
      },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        assert.equal(err, null, "¿ha habido un error?");
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)");
        hecho();
      } // callback()
    ) // .get
  }) // it
/*
  it("GET /GETidUsuario ", function (hecho) {
    var dato = "prueba1@hotmail.com";
    request.post(
      {
        url: IP_PUERTO + "/GETidUsuario",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' },
        body: JSON.stringify(dato)
      },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        //assert.equal(err, null, "¿ha habido un error?");
        assert.equal(200, 200, "¿El código no es 200 (OK)");

        console.log(respuesta);

        hecho();
      } // callback()
    ) // .get
  }) // it
*/
  // Test by Iván y Rosa
  it("probar getSensoresYSusUsuarios", function (hecho) {
    request.get(
      {
        url: IP_PUERTO + "/getSensoresYSusUsuarios",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' }
      },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        assert.equal(err, null, "¿ha habido un error?");
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)");
        hecho();

      } // function
    )// get
  }) // it

  // Test Josep
  it("probar getNumeroUsuariosTotales", function (hecho) {
    request.get(
      {
        url: IP_PUERTO + "/getNumeroUsuariosTotales",
        headers: { 'User-Agent': 'jordi', 'Content-Type': 'application/json' }
      },
      function (err, respuesta, carga) {
        var json = JSON.parse(carga);
        assert.equal(err, null, "¿ha habido un error?");
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)");
        hecho();

      } // function
    )// get
  }) // it

  it("GET /getNumeroUsuariosTotalesPorTipo/normal ", function (hecho) {

    request.get(
      { url: IP_PUERTO + "/getNumeroUsuariosTotalesPorTipo/normal", headers: { 'User-Agent': 'jordi' } },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")

        hecho()
      } // callback()
    ) // .get
  }) // it

     //GET TodasLasMedidasPorFecha()
     //By Diego
   //GET TodasLasMedidasPorFecha()

  it( "POST/GetTodasLasMedidasPorFecha ", function( hecho ) {
    var desde = 6;
    var hasta = 7;
    request.post(
      { url : IP_PUERTO+"/GETtodasLasMedidasPorFecha",
       headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
       body : JSON.stringify({'desde':desde, 'hasta':hasta})
      },
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" );
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" );
        hecho();
      } // callback()
    ) // .post
  }) //probar getTodasLasMedidasPorFecha()

}) // describe
