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


  it( "GET /GETasignaturasPorDni/20940142E", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/GETasignaturasPorDni/20940142E", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
        assert.equal( json[0].nombre, "Hola", "¿El nombre es el correcto?" )
        assert.equal( json[0].codigo, "235", "¿el codigo es el correcto?" )
        assert.equal( json[1].nombre, "Física", "¿El nombre es el correcto?" )
        assert.equal( json[1].codigo, "56", "¿el codigo es el correcto?" )
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
