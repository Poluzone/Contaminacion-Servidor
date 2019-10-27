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
  var datos = { IdUsuario : null, email : "prueba2@gmail.com",password: "prueba1" ,telefono : "5864"
  }
  request.post(
    { url : IP_PUERTO+"/insertarUsuario",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( datos )
  },
  function( err, respuesta, carga ) {
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    assert.equal( carga, "OK", "¿La carga no es OK" )
    hecho()
  } // callback
  ) // .post
  })


  it( "GET /GetUsuarioPorEmail/Prueba1@hotmail.com ", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/GetUsuarioPorEmail/Prueba1@hotmail.com", headers : { 'User-Agent' : 'jordi' }},
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

}) // describe
