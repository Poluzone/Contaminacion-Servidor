// ........................................................
// mainTest1.js
// ........................................................
const Logica = require("../Logica.js")
var assert = require('assert')
// ........................................................
// ........................................................
// ........................................................
// main ()
// ........................................................
describe("Test 1 : Recuerda arrancar el servidor", function() {
  // ....................................................
  var laLogica = null
  // ....................................................
  it("conectar a la base de datos", function(hecho) {
    laLogica = new Logica(
      "../bd/datos.db",
      function(err) {
        if (err) {
          throw new Error("No he podido conectar con datos.db")
        }

        hecho()
      })
  })


  it("probar insertarUsuario",
    async function() {
      var datos = {
        IdUsuario: null,
        email: "Prueba1@hotmail.com",
        password: "prueba1",
        telefono: "22132"
      }

      try {
        laLogica.insertarUsuario(datos)
      } catch (err) {
        error = err
      }

      var res = await laLogica.GetUsuarioPorEmail("Prueba1@hotmail.com")
      assert.equal(res.length, 1, "¿no hay un resulado?")
      assert.equal(res[0].Email, "Prueba1@hotmail.com", "¿no es 1234A?")

    }) //it


}) // describe
