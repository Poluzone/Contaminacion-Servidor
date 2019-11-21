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
        Email: "test1@gti.com",
        Password: "test1TodoOK",
        Nombre: "Testing",
        Telefono: "555555555",
        TipoUsuario: "Conductor"
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


  it("probar getTodosLosSensores()",
    async function() {


      var res = await laLogica.getTodosLosSensores()

      assert.equal(res.length, 2, "¿no hay un resulado?")

    }) //it

  it("probar getUsuarioPorIdSensor()",
    async function() {


      var res = await laLogica.getUsuarioPorIdSensor(1)

      assert.equal(res.length, 1, "¿no hay un resulado?")

    }) //it

  it("probar getSensoresYSusUsuarios()",
    async function() {


      var res = await laLogica.getSensoresYSusUsuarios(1);

      assert.equal(res[0].IdSensor, 1, "no coge el idsensor correcto")
      assert.equal(res[1].Usuario.Nombre, "Emilia Rosa", "el nombre no coincide")


    }) //it


  it("probar GetUsuarioPorEmail",
    async function() {


      var res = await laLogica.GetUsuarioPorEmail("prueba1@hotmail.com")



      assert.equal(res[0].Telefono, "22132", "¿no es 1234A?")
      assert.equal(res[0].Password, "prueba1", "¿no es 1234A?")

    })

  it("probar insertarMedida",
    async function() {
      var medida = {
        IdTipoMedida: 2,
        IdUsuario: 15,
        Valor: 243,
        Tiempo: 234324,
        Latitud: 234,
        Longitud: 324
      }

      await laLogica.insertarMedida(medida);
      var res = await laLogica.getLaUltimaMedidaPorUsuario(15);
      assert.equal(res.length, 1, "¿no hay un resulado?")

    })

  it("probar insertarIdUsuarioConIdsensor",
    async function() {
      var dato = {
        IdUsuario: 6,
        IdSensor: 2
      }

      await laLogica.insertarIdUsuarioConIdsensor(dato);
      var res = await laLogica.getUsuarioPorIdSensor(19);
      assert.equal(res.length, 1, "¿no hay un resulado?")

    })

  it("probar GetLaUltimaMedidaPorUsuario",
    async function() {

      var res = await laLogica.getLaUltimaMedidaPorUsuario(15);
      assert.equal(res.length, 1, "¿no hay un resulado?")


    })

  it("probar GetIdUsuario",
    async function() {


      var res = await laLogica.GetIdDelUsuario('mat@gmail.com');
      assert.equal(res.length, 1, "¿no hay un resulado?")

    })

  it("probar getTodasLasMedidasPorFecha",
    async function() {

      var res = await laLogica.getTodasLasMedidasPorFecha({
        'desde': 6,
        'hasta': 7
      });
      //console.log(res);
      assert.equal(res.length, 2, "¿no hay un resulado?")

    }

  ) //probar getTodasLasMedidasPorFecha()


}) // describe
