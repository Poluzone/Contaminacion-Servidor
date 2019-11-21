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


  it("probar GetUsuarioPorEmail",
    async function() {
      var datos = {
        Email: "test1@gti.com",
        Password: "test1TodoOK",
        Nombre: "Testing",
        Telefono: "555555555",
        TipoUsuario: "Conductor"
      }

      try {
        await laLogica.insertarUsuario(datos)
      } catch (err) {
        error = err
      }

      var res = await laLogica.GetUsuarioPorEmail("test1@gti.com")

      //assert.equal(res.length, 1, "¿no hay un resulado?")
      if(res.length < 1)
      {
        console.log("¿No hay resultado?");
      }else
      {
        console.log(res);
      }
      //assert.equal(res[0].Telefono, "22132", "¿no es 1234A?")
      //assert.equal(res[0].Password, "prueba1", "¿no es 1234A?")

    })

    it("probar insertarMedida",
      async function() {
            await laLogica.borrarFilasDeTodasLasTablas();
        var IdTipoMedida = 2
        var IdUsuari= 15
        var Valor= 243
        var Latitud = 38.95;
        var Longitud = -0.17;
        for(let j = 0; j<10;j++){
        for(let i = 0; j<50; i++){
        var medida = {
          IdTipoMedida: IdTipoMedida+i,
          IdUsuario: 15+1,
          Valor: 243+i,
          Tiempo: Date.now(),
          Latitud: Latitud+i*0.003+j*0.003,
          Longitud: Longitud+i*0.003+j*0.003
            } 
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
      if(res.length < 1)
      {
        console.log("¿No hay resultado?");
      }else
      {
        console.log(res);
      }

    })
    
        it("probar getTodasLasMedidasPorFecha",
       async function(){

        var res = await laLogica.getTodasLasMedidasPorFecha({'desde': 6, 'hasta':7});
         console.log(res);
        assert.equal(res.length, 2, "¿no hay un resulado?")

    }

      )//probar getTodasLasMedidasPorFecha()

}) // describe
