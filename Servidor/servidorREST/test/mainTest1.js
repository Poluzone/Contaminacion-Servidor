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

  it( "probar POST /insertarPersona", function( hecho ) {
  var datosPersona = { dni : "20940142E", nombre : "Josep", apellidos : "Carreres"
  }
  request.post(
    { url : IP_PUERTO+"/insertarPersona",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( datosPersona )
  },
  function( err, respuesta, carga ) {
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    assert.equal( carga, "OK", "¿La carga no es OK" )
    hecho()
  } // callback
  ) // .post
  })

  it( "probar POST /insertarAsignatura", function( hecho ) {
  var datos = { nombre : "Fisica", codigo: "235" }
  request.post(
    { url : IP_PUERTO+"/insertarAsignatura",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( datos)
  },
  function( err, respuesta, carga ) {
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    assert.equal( carga, "OK", "¿La carga no es OK" )
    hecho()
  } // callback
  ) // .post
  })

    it( "probar POST /hacerMatricula", function( hecho ) {
    var datos = { dni: "20940142E", codigo: "235" }
    request.post(
      { url : IP_PUERTO+"/hacerMatricula",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify(datos)
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      assert.equal( carga, "OK", "¿La carga no es OK" )
      hecho()
    } // callback
    ) // .post
    })
  // ....................................................
  // ....................................................
  it( "GET /GETpersona/20940142E ", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/GETpersona/20940142E", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
        assert.equal( json[0].dni, "20940142E", "¿El dni es el correcto?" )
        hecho()
      } // callback()
    ) // .get
  }) // it
  it( "GET /GETasignatura/235", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/GETasignatura/235", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
        assert.equal( json[0].nombre, "Hola", "¿la asignatura es el correcto?" )
        hecho()
      } // callback()
    ) // .get
  }) // it

  it( "GET /GETmatricula/20940142E", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/GETmatricula/20940142E", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
        assert.equal( json[0].dni, "20940142E", "¿la asignatura es el correcto?" )
        assert.equal( json[0].codigo, "235", "¿la asignatura es el correcto?" )
        hecho()
      } // callback()
    ) // .get
  }) // it


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
