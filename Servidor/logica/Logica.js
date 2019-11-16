// .....................................................................
// Logica.js
// .....................................................................
const sqlite3 = require("sqlite3")

// .....................................................................
// .....................................................................
module.exports = class Logica {
  // .................................................................
  // nombreBD: Texto
  // -->
  // constructor () -->
  // .................................................................
  constructor(nombreBD, cb) {
    this.laConexion = new sqlite3.Database(
      nombreBD,
      (err) => {
        if (!err) {
          this.laConexion.run("PRAGMA foreign_keys = ON")
        }
        cb(err)
      })
  } // ()

  async insertarMedida(medida) {
    var textoSQL =
      'insert into Medidas values( $IdMedida, $IdTipoMedida , $IdUsuario, $Valor , $Tiempo , $Latitud , $Longitud);'
    var valoresParaSQL = {
      $IdMedida: null,
      $IdTipoMedida: medida.IdTipoMedida,
      $IdUsuario: medida.IdUsuario,
      $Valor: medida.Valor,
      $Tiempo: medida.Tiempo,
      $Latitud: medida.Latitud,
      $Longitud: medida.Longitud
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  async getLaUltimaMedidaPorUsuario(userId) {
    var textoSQL = "SELECT * FROM Medidas WHERE IdUsuario=" + userId + " ORDER BY IdMedida DESC LIMIT 0, 1";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  /*async GetLaUltimaMedida(idUsuario) {
    var textoSQL = "SELECT * FROM Medidas WHERE IdUsuario="+$idUsuario+" ORDER BY IdMedida DESC LIMIT 0, 1";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }*/

  async GetIdDelUsuario(email) {
    var textoSQL = "SELECT * FROM Usuarios WHERE Email='" + email + "';";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // email -> GetHashPorEmail() ->
  // .................................................................
  async GetHashPorEmail(email) {
    //  var textoSQL = "select Password from Usuarios where Email = $email ";
    var valoresParaSQL = {
      $email: email
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // email -> GetUsuarioPorEmail() ->
  // .................................................................
  async GetUsuarioPorEmail(email) {
    var textoSQL = "select * from Usuarios where Email = $email ";
    var valoresParaSQL = { $email: email };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // -> getSensoresYSusUsuarios() ->
  // llama a getTodosLosSensores
  // y getUsuarioPorIdSensor
  // .................................................................
  async getSensoresYSusUsuarios() {
    var sensores = await this.getTodosLosSensores();
    for (var i = 0; i < sensores.length; i++) {
      var sensor = sensores[i]
      var idSensor = sensor.IdSensor;
      var usuario = await this.getUsuarioPorIdSensor(idSensor);
      sensores[i].Usuario = usuario[0];
    }
    console.log(sensores)
    return new Promise((resolver, rechazar) => {
      resolver(sensores)
    })
  }

  // .................................................................
  // -> getTodosLosSensores() ->
  // Coge la info de todos los sensores
  // .................................................................
  async getTodosLosSensores() {
    var textoSQL = "select * from Sensor";
    console.log("logica: getTodosLosSensores")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, {},
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // -> getUsuarioPorIdSensor(idSensor) ->
  // Coge la info de un usuario a partir del id de su sensor
  // .................................................................
  async getUsuarioPorIdSensor(idSensor) {
    var textoSQL = "select IdUsuario from UsuarioSensor where IdSensor = $idSensor ";
    var valoresParaSQL = { $idSensor: idSensor };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) console.log(err)
          else {
            var id = res[0].IdUsuario
            textoSQL = "select * from Usuarios where IdUsuario = $id";
            valoresParaSQL = { $id: id };
            this.laConexion.all(textoSQL, valoresParaSQL,
              (err, res) => {
                (err ? rechazar(err) : resolver(res))
              })
          }
        }
      )
    })
  }

  // .................................................................
  // datos -> insertarUsuario() ->
  // .................................................................

  insertarUsuario(datos) {
    var textoSQL = "insert into Usuarios values( $IdUsuario, $Email, $Password, $Nombre, $Telefono, $TipoUsuario)";
    var valoresParaSQL = {
      $IdUsuario: null,
      $Email: datos.Email,
      $Password: datos.Password,
      $Nombre: datos.Nombre,
      $Telefono: datos.Telefono,
      $TipoUsuario: datos.TipoUsuario
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }

  async borrarFilasDe(tabla) {
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(
        "delete from " + tabla + ";",
        (err) => (err ? rechazar(err) : resolver())
      )
    })
  } // ()
  // .................................................................
  // borrarFilasDeTodasLasTablas() ->
  // .................................................................
  async borrarFilasDeTodasLasTablas() {
    await this.borrarFilasDe("Usuarios")
  } // ()
  // .................................................................
  // cerrar() -->
  // .................................................................
  cerrar() {
    return new Promise((resolver, rechazar) => {
      this.laConexion.close((err) => {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

} // class
// .....................................................................
// .....................................................................
