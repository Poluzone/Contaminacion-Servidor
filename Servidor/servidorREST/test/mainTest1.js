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
describe("Test 1 : Recuerda arrancar el servidor", function() {
  // ....................................................
  // ....................................................

  it( "probar POST /insertarUsuario", function( hecho ) {
  var datos = { Email : "prueba2@gmail.com",Password: "prueba1" ,Telefono : "5864"
  }
  request.post(
    { url : IP_PUERTO+"/insertarUsuario",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( datos )
  },
  function( err, respuesta, carga ) {
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    //assert.equal( carga, "true", "¿La carga no es OK" )
    hecho()
  } // callback
  ) // .post
  })

  it( "probar POST /insertarMedida", function( hecho ) {
    var medida = {

      IdTipoMedida: 2,
      IdUsuario: 6,
      Valor: 2423433,
      Tiempo: 234324,
      Latitud: 234,
      Longitud:324
    }

  request.post(
    { url : IP_PUERTO+"/insertarMedida",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( medida )
  },
  function( err, respuesta, carga ) {
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    assert.equal( carga, "OK", "¿La carga no es OK" )
    hecho()
  } // callback
  ) // .post
  })

  it( "probar POST /ComprobarLogin", function( hecho ) {
    var dato = {
      Email:"prueba2@gmail.com",
      Password:"prueba1"
    }

  request.post(
    { url : IP_PUERTO+"/ComprobarLogin",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( dato )
  },
  function( err, respuesta, carga ) {
    var json = JSON.parse(carga);
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    assert.equal( json.status, true , "¿La carga no es OK" )
    hecho()
  } // callback
  ) // .post
  })


  it( "GET /GetUsuarioPorEmail/Prueba1@hotmail.com ", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/GetUsuarioPorEmail/prueba1@hotmail.com", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
        assert.equal( json[0].Telefono, "22132", "¿El telefono es el correcto?" )
        assert.equal( json[0].Password, "prueba1", "¿La contraseña es la correcta?" )
        hecho()
      } // callback()
    ) // .get
  }) // it


  it( "POST /GETultimaMedidaPorUsuario ", function( hecho ) {
    var dato = 15;
    request.post(
      { url : IP_PUERTO+"/GETultimaMedidaPorUsuario",
       headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
       body : JSON.stringify(dato)
      },
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" );
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" );
        hecho();
      } // callback()
    ) // .get
  }) // it

  it( "POST /GETidUsuario ", function( hecho ) {
    var dato = "mat@gmail.com";
    request.post(
      { url : IP_PUERTO+"/GETidUsuario", 
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json'},
      body : JSON.stringify(dato)
    },
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" );
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" );
        hecho();
      } // callback()
    ) // .get
  }) // it

}) // describe
