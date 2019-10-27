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

  insertarMedida(datos) {
    var textoSQL =
      'insert into Datos values( $dato, $fecha , $posicion);'
    var valoresParaSQL = {
      $dato: datos.dato,
      $fecha: datos.fecha,
      $posicion: datos.posicion
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  GetSoloMedidas() {
    var textoSQL = "select * from Datos";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  async GetHashPorEmail(email) {
  var textoSQL = "select Password from Usuarios where Email = $email ";
    var valoresParaSQL = {
      $email: email
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

async  GetUsuarioPorEmail(email) {
    var textoSQL = "select * from Usuarios where Email = $email ";
    var valoresParaSQL = {
      $email: email
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,valoresParaSQL,
(err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  insertarUsuario(datos) {
    var textoSQL = "insert into Usuarios values( $IdUsuario,$Email ,$Password , $Telefono )";
    var valoresParaSQL = {
      $IdUsuario: null,
      $Email: datos.Email,
      $Password: datos.Password,
      $Telefono: datos.Telefono
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }

  borrarFilasDe(tabla) {
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(
        "delete from " + tabla + ";",
        (err) => (err ? rechazar(err) : resolver())
      )
    })
  } // ()
  // .................................................................
  // borrarFilasDeTodasLasTablas() -->
  // .................................................................
  async borrarFilasDeTodasLasTablas() {
    await this.borrarFilasDe("Datos")
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
