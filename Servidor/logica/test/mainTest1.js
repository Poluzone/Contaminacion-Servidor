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
        Email: "Test",
        Password: "prueba1",
        Telefono: "22132"
      }

      try {
        laLogica.insertarUsuario(datos)
      } catch (err) {
        error = err
      }

      var res = await laLogica.GetUsuarioPorEmail("Test")

      assert.equal(res.length, 1, "¿no hay un resulado?")
      assert.equal(res[0].Email, "Test", "¿no es 1234A?")


    }) //it


  it("probar GetUsuarioPorEmail",
    async function() {
      var datos = {
        Email: "Test",
        Password: "prueba1",
        Telefono: "22132"
      }

      try {
        await laLogica.insertarUsuario(datos)
      } catch (err) {
        error = err
      }

      var res = await laLogica.GetUsuarioPorEmail("Test")

      assert.equal(res.length, 1, "¿no hay un resulado?")
      assert.equal(res[0].Telefono, "22132", "¿no es 1234A?")
      assert.equal(res[0].Password, "prueba1", "¿no es 1234A?")



    })

    it("probar insertarMedida",
      async function() {
        var medida = {

          IdTipoMedida: 2,
          IdUsuario: 6,
          Valor: 243,
          Tiempo: 234324,
          Latitud: 234,
          Longitud:324
        }

         await laLogica.insertarMedida(medida);
        var res = await laLogica.GetLaUltimaMedida();
        assert.equal(res.length, 1, "¿no hay un resulado?")



      })

  it("probar GetLaUltimaMedida",
    async function() {


      var res = await laLogica.GetLaUltimaMedida(15);
      assert.equal(res.length, 1, "¿no hay un resulado?")


    })

  it("probar GetIdUsuario",
    async function() {


      var res = await laLogica.GetIdDelUsuario('mat@gmail.com');
      assert.equal(res.length, 1, "¿no hay un resulado?")


    })


}) // describe
