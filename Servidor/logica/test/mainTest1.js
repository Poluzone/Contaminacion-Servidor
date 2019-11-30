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


      var res = await laLogica.getSensoresYSusUsuarios();

      assert.equal(res[0].IdSensor, 1, "no coge el idsensor correcto")
      assert.equal(res[1].Usuario.Nombre, "Emilia Rosa", "el nombre no coincide")


    }) //it

  it("probar getTipoSensor()",
    async function() {
      var res = await laLogica.getTipoSensor(2);
      assert.equal(res[0].Descripcion, "CO", "no coge la descripción correctamente")
    }) //it

  it("probar getEstado()",
    async function() {
      var res = await laLogica.getEstado(1);
      assert.equal(res[0].Descripcion, "En Stock", "no coge la descripción correctamente")
    }) //it


  it("probar getSensoresSegunEstado()",
    async function() {
      var res = await laLogica.getSensoresSegunEstado(2);
      assert.equal(res[0].IdSensor, "2", "no coge los sensores correctamente")
    }) //it

  it("probar getNumSensoresSegunEstado()",
    async function() {
      var res = await laLogica.getNumSensoresSegunEstado(1);
      assert.equal(res, "1", "no coge el num de sensores correctamente")
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

  it("probar insertarMedida",
    async function() {
      await laLogica.borrarFilasDeTodasLasTablas();
      var IdTipoMedida = 2
      var IdUsuario = 15
      var Valor = 243
      var Latitud = 38.95;
      var Longitud = -0.17;
      for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
          var medida = {
            IdTipoMedida: 2,
            IdUsuario: 15,
            Valor: Valor + 10,
            Tiempo: Date.now(),
            Latitud: Latitud + i * 0.003 + j * 0.003,
            Longitud: Longitud - i * 0.003 + j * 0.003
          }
          Valor += 10;
          await laLogica.insertarMedida(medida);
        }
      }
      var res = await laLogica.getLaUltimaMedidaPorUsuario(15);
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
        'desde': 1574347324211,
        'hasta': 1574347324243
      });
      console.log(res);
      assert.equal(res.length, 0, "¿no hay un resulado?")

    }

  ) //probar getTodasLasMedidasPorFecha()

  it("probar insertarSensor",
    async function() {

      var sensor = {
        IdTipoMedida: 2,
        IdEstado: 2,
      }
      var err = await laLogica.insertarSensor(sensor);
      var res = await laLogica.getNumSensoresSegunEstado(2);
      assert.equal(res, 2, "¿no hay un resulado?")
      await laLogica.borrarSensorPorID(3);

    }

  ) //probar insertarSensor()

    // Emilia Rosa van der Heide
    it("probar getMedidasPorIdPorFecha",
    async function() {
       var dato = {
         Intervalo: {
          desde: 0,
          hasta: Date.now()
        },
        IdUsuario: 15};
      var res = await laLogica.getMedidasPorIdPorFecha(dato.Intervalo, dato.IdUsuario);
      assert.notEqual(res.length, 0, "¿no hay resultado?")
    }
  ) //probar getMedidasPorIdPorFecha()

  // Emilia Rosa van der Heide
  it("probar getMediaCalidadDelAireDeLaJornada",
  async function() {
    var datos = {
      Intervalo: {
        desde: 0,
        hasta: Date.now() 
      },
      IdUsuario: 15};
    var res = await laLogica.getMediaCalidadDelAireDeLaJornada(datos);

    console.log(res)

    // 748 -> en el test insertarMedida empieza por 253 y crea 100 medidas de 10 en 10 (max valor 1243)
    // por tanto la media debería ser: (253+1243)/2 = 748
    assert.equal(res, 748, "no calcula bien la media")
  }) //probar getMediaCalidadDelAireDeLaJornada()

}) // describe
