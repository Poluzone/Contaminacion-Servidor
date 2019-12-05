// .....................................................................
// Logica.js
// .....................................................................
const sqlite3 = require("sqlite3")
const estacionOficial = require('./Estacion-oficial');

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

  // .................................................................
  // Josep Carreres Fluixà
  // medida -> insertarMedida() ->
  // inserta Medida
  // .................................................................
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
      this.laConexion.run(textoSQL, valoresParaSQL, function(err) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // datos -> vincularSensorConUsuario() ->
  // vincula usuario con sensor y cambia el estado del sensor
  // .................................................................
  async vincularSensorConUsuario(datos) {
    var textoSQL =
      'insert into UsuarioSensor values($IdUsuario,$IdSensor);'
    var valoresParaSQL = {
      $IdUsuario: datos.IdUsuario,
      $IdSensor: datos.IdSensor,
    }

    var dato = {
      estado: "Activo",
      idSensor: datos.IdSensor,
    }
    await this.indicarActividadNodo(dato);

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, async function(err) {
        (err ? rechazar(err) : resolver())
      })
    })
  }


  // .................................................................
  // userId -> getLaUltimaMedidaPorUsuario() ->
  // .................................................................
  async getLaUltimaMedidaPorUsuario(userId) {
    var textoSQL = "SELECT * FROM Medidas WHERE IdUsuario=" + userId + " ORDER BY IdMedida DESC LIMIT 0, 1";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // email -> GetIdDelUsuario() ->
  // .................................................................
  async GetIdDelUsuario(email) {
    var textoSQL = "SELECT idUsuario FROM Usuarios WHERE Email='" + email + "';";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // email -> GetUsuarioPorEmail() ->
  // devuelve un Usuario dandole un email
  // .................................................................
  async GetUsuarioPorEmail(email) {
    var textoSQL = "SELECT Usuarios.IdUsuario, Usuarios.Email, Usuarios.Nombre, Usuarios.Password, Usuarios.Telefono, Usuarios.TipoUsuario, UsuarioSensor.IdSensor FROM Usuarios LEFT JOIN UsuarioSensor ON Usuarios.IdUsuario = UsuarioSensor.IdUsuario WHERE Email = $email ";
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
  // Emilia Rosa van der Heide
  // -> getTodosLosUsuariosYSusSensores() -> JSON con todos los usuarios y su sensor
  // .................................................................
  async getTodosLosUsuariosYSusSensores() {
    console.log("logica: getTodosLosUsuariosYSusSensores")
    var usuarios = await this.getTodosLosUsuarios();
    //console.log(usuarios)
    for (var i = 0; i < usuarios.length; i++) {
      var usuario = usuarios[i]

      // Cogemos el Id para obtener el sensor correspondiente
      var idUser = usuario.IdUsuario;
      var sensor = await this.getSensorPorIdUsuario(idUser);
      //console.log(sensor)
      if (sensor[0] != undefined) usuarios[i].Sensor = sensor[0];
      else usuarios[i].Sensor = null;
    }
    //console.log(sensores)
    return new Promise((resolver, rechazar) => {
      resolver(usuarios)
    })
  }

  // .................................................................
  // Emilia Rosa van der Heide
  // -> ensoresYSusUsuarios() ->
  // llama a getTodosLosSensores
  // y getUsuarioPorIdSensor
  // .................................................................
  async getSensoresYSusUsuarios() {
    var sensores = await this.getTodosLosSensores();
    for (var i = 0; i < sensores.length; i++) {
      var sensor = sensores[i]

      // Tipo del sensor
      var idTipoMedida = sensor.IdTipoMedida;
      var tiposSensores = await this.getTipoSensor(idTipoMedida);
      var tipoSensor = tiposSensores[0].Descripcion
      //console.log(tipoSensor);
      sensores[i].TipoSensor = tipoSensor;

      // Estado del sensor
      var idEstado = sensor.IdEstado;
      var estados = await this.getEstado(idEstado);
      var estadoSensor = estados[0].Descripcion
      //console.log(estadoSensor);
      sensores[i].Estado = estadoSensor;

      // Cogemos el Id para obtener el usuario correspondiente
      var idSensor = sensor.IdSensor;
      var usuario = await this.getUsuarioPorIdSensor(idSensor);
      sensores[i].Usuario = usuario[0];
    }
    //console.log(sensores)
    return new Promise((resolver, rechazar) => {
      resolver(sensores)
    })
  }

  // .................................................................
  // Emilia Rosa van der Heide
  // -> getTodosLosUsuarios() -> JSON: usuarios
  // Coge la info de todos los usuarios
  // .................................................................
  async getTodosLosUsuarios() {
    var textoSQL = "SELECT Usuarios.IdUsuario, Usuarios.Email, Usuarios.Nombre, Usuarios.Password, Usuarios.Telefono, Usuarios.TipoUsuario, UsuarioSensor.IdSensor FROM Usuarios LEFT JOIN UsuarioSensor ON Usuarios.IdUsuario = UsuarioSensor.IdUsuario";
    console.log("logica: getTodosLosUsuarios")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // tipoMedida -> getTipoSensor() ->
  // Coge el tipo del sensor en texto a partir del tipo en nº
  // .................................................................
  async getTipoSensor(tipoMedida) {
    var textoSQL = "select Descripcion from TipoSensor where IdTipoMedida = $tipoMedida";
    var valoresParaSQL = {
      $tipoMedida: tipoMedida
    };
    console.log("logica: getTipoSensor")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // idEstado -> getEstado() ->
  // Coge el tipo del sensor en texto a partir del tipo en nº
  // .................................................................
  async getEstado(idEstado) {
    var textoSQL = "select Descripcion from Estados where IdEstado = $estado";
    var valoresParaSQL = {
      $estado: idEstado
    };
    console.log("logica: getEstado")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
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
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // -> getUsuarioPorIdSensor(idSensor) ->
  // Coge la info de un usuario a partir del id de su sensor
  // .................................................................
  async getUsuarioPorIdSensor(idSensor) {
    var textoSQL = "SELECT IdUsuario FROM UsuarioSensor WHERE IdSensor = $idSensor ";
    var valoresParaSQL = {
      $idSensor: idSensor
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        async (err, res) => {
          if (!err) {
            if (res.length == 0) {
              resolver(0);
            } else {
              var resu = await this.getUsuarioPorIdUsuario(res[0].IdUsuario);
              resolver(resu);
            }
          } else {
            rechazar(err);
          }
        })
    })
  }

  // .................................................................
  // -> getSensorPorIdUsuario(idUsuario) ->
  // Coge la info de un sensor a partir del id de su usuario
  // .................................................................
  async getSensorPorIdUsuario(idUsuario) {
    var textoSQL = "SELECT Sensor.IdSensor, TipoSensor.Descripcion TipoSensor, Estados.Descripcion Estado FROM Sensor INNER JOIN UsuarioSensor ON UsuarioSensor.IdSensor = Sensor.IdSensor INNER JOIN TipoSensor ON Sensor.IdTipoMedida = TipoSensor.IdTipoMedida LEFT JOIN Estados ON Sensor.IdEstado = Estados.IdEstado WHERE UsuarioSensor.IdUsuario = $idUsuario ";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    };
    return new Promise((resolver, rechazar) => {
        this.laConexion.all(textoSQL, valoresParaSQL,
          (err, res) => {
            (err ? rechazar(err) : resolver(res))
          })
    })
  }

  //------------------------------------------------------------
  // Josep Carreres Fluixà
  // getUsuarioPorIdUsuario()
  //------------------------------------------------------------

  getUsuarioPorIdUsuario(idUsuario) {
    var textoSQL = "SELECT * FROM Usuarios WHERE IdUsuario = $idUsuario ";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  } //()

  //------------------------------------------------------------
  // Josep Carreres Fluixà
  // getNumeroUsuariosTotales()-->Entero
  //------------------------------------------------------------

  getNumeroUsuariosTotales() {
    var textoSQL = "SELECT * FROM Usuarios";

    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          if(!err){
            resolver(res.length)
          }else {
            rechazar();
          }
        })
    })
  } //()

  //------------------------------------------------------------
  // Josep Carreres Fluixà
  // tipoUsuario-->getNumeroUsuariosTotalesPorTipo()--> Entero
  //------------------------------------------------------------

  getNumeroUsuariosTotalesPorTipo(tipoUsuario) {
    var textoSQL = "SELECT * FROM Usuarios where TipoUsuario = $TipoUsuario";
    var valoresParaSQL = {
      $TipoUsuario: tipoUsuario
    };

    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,valoresParaSQL,
        (err, res) => {
          if(!err){
            resolver(res.length)
          }else {
            rechazar(err);
          }
        })
    })
  } //()


  // .................................................................
  //     getMedidasPorFecha()
  // .................................................................
  getTodasLasMedidasPorFecha(intervalo) {
      if(intervalo.desde == 0 && intervalo.hasta == 0){
          var textoSQL = "SELECT * FROM Medidas"
      } else {
          var textoSQL = "SELECT * FROM Medidas WHERE Tiempo BETWEEN " + intervalo.desde + " AND " + intervalo.hasta + " ORDER BY IdMedida DESC";
      }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  } //()


  // .................................................................
  // Emilia Rosa van der Heide
  // desde: N, hasta: N, IdUsuario: N -> getMedidasPorIdPorFecha() -> Medidas
  // recoge las medidas de un usuario concreto
  // .................................................................
  getMedidasDeEsteUsuarioPorFecha(intervalo, idUsuario) {
    console.log("logica: getMedidasDeEsteUsuarioPorFecha")
    var textoSQL = "SELECT * FROM Medidas WHERE IdUsuario = $idUsuario AND Tiempo BETWEEN $desde AND $hasta ORDER BY IdMedida DESC";
    //console.log(textoSQL)
    var valoresParaSQL = {
      $idUsuario: idUsuario,
      $desde: intervalo.desde,
      $hasta: intervalo.hasta
    };
    //console.log(valoresParaSQL)
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  } // getMedidasDeEsteUsuarioPorFecha()


  // .................................................................
  // Emilia Rosa van der Heide
  // desde: N, hasta: N, IdUsuario: N -> getMediaCalidadDelAireDeLaJornada() -> R
  // obtiene la media de las medidas de la jornada
  // .................................................................
  async getMediaCalidadDelAireDeLaJornada(datos) {
    console.log("logica: getMediaCalidadDelAireDeLaJornada")
    // Obtenemos todas las medidas
    var medidas = await this.getMedidasDeEsteUsuarioPorFecha(datos.Intervalo, datos.IdUsuario)
    //console.log(medidas)

    // Hacemos el sumatorio de los valores
    var sumatorio = 0;
    for (var i = 0; i < medidas.length; i++) {
      sumatorio = sumatorio + medidas[i].Valor;
    }

    // Calulamos la media
    var media = sumatorio / medidas.length;

    return media;
  } // getMediaCalidadDelAireDeLaJornada()


  // .................................................................
  // Emilia Rosa van der Heide
  // idestado -> getSensoresSegunEstado() ->
  // devuelve los sensores según el estado
  // .................................................................
  getSensoresSegunEstado(idEstado) {
    var textoSQL = "SELECT * FROM Sensor WHERE IdEstado = $idestado";
    var valoresParaSQL = {
      $idestado: idEstado
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  } //()

  // .................................................................
  // Emilia Rosa van der Heide
  // idestado -> getNumSensoresSegunEstado() ->
  // devuelve los sensores según el estado
  // .................................................................
  async getNumSensoresSegunEstado(idEstado) {
    var sensores = await this.getSensoresSegunEstado(idEstado);
    //console.log(sensores)
    return new Promise((resolver, rechazar) => {
      resolver(sensores.length)
    })
  } //()

  // .................................................................
  // Josep Carreres Fluixà
  // datos -> insertarUsuario() ->
  // inserta usuario
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
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // sensor -> insertarSensor() ->
  // inserta sensor
  // .................................................................
  insertarSensor(sensor) {
    var textoSQL = "insert into Sensor values( $IdSensor, $IdTipoMedida, $IdEstado)";
    var valoresParaSQL = {
      $IdSensor: sensor.IdSensor,
      $IdTipoMedida: sensor.IdTipoMedida,
      $IdEstado: sensor.IdEstado,
    };

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }


  // .................................................................
  // Emilia Rosa van der Heide
  // actividad:texto, idsensor: N -> indicarActividadNodo() ->
  // cambia el estado del nodo en la BBDD
  // .................................................................
  indicarActividadNodo(datos) {
    console.log("logica: indicarActividadNodo")
    var textoSQL = "UPDATE Sensor SET IdEstado = $IdEstado WHERE IdSensor = $IdSensor";
    var estado;
    var stringestado = datos.estado;
    if (stringestado.localeCompare("Inactivo") == 0) estado = 3
    else if (stringestado.localeCompare("Activo") == 0) estado = 2
    else estado = 1
    var valoresParaSQL = {
      $IdSensor: datos.idSensor,
      $IdEstado: estado,
    };
    console.log(textoSQL)
    console.log(valoresParaSQL)
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }


  // .................................................................
  // Emilia Rosa van der Heide
  // -> getMedidasEstacionOficialGandia() -> medidas
  // recibe las medidas de la estacion oficial de Gandia
  // .................................................................
  async getMedidasEstacionOficialGandia() {
    console.log("logica: getMedidasEstacionOficialGandia")
    var data = await estacionOficial.getMedidasEstacion();
    
    var estaciones = await this.getEstacionesOficiales()
    //console.log(estaciones.length)
    for (var i = 0; i < estaciones.length; i++) {
      var municipio = estaciones[i].Municipio
      if(municipio.localeCompare("Gandia") == 0) estaciones[i].Medidas = data[0];
    }

    return estaciones;
  }

  // .................................................................
  // Emilia Rosa van der Heide
  // -> getEstacionesOficiales() -> estaciones
  // .................................................................
  async getEstacionesOficiales() {
    var textoSQL = "select * from Estaciones;";
    console.log("logica: getTodosLosSensores")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // idUsuario -> editarInformacionUsuario() ->
  // edita informacion de un usuario pasandole un json con los datos a cambiar y su ID
  // .................................................................
  editarInformacionUsuario(datos) {
    var textoSQL = "UPDATE Usuarios SET Email = $email , Password = $password , Telefono = $telefono WHERE IdUsuario = $idUsuario;";
    var valoresParaSQL = {
      $email: datos.Email,
      $password: datos.Password,
      $telefono: datos.Telefono,
      $idUsuario: datos.IdUsuario
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }



  // .................................................................
  // tabla -> borrarFilasDe() ->
  //  Le pasas el nombre de la tabla y lo elimina en la BD
  // .................................................................
  borrarFilasDe(tabla) {
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(
        "delete from " + tabla + ";",
        (err) => (err ? rechazar(err) : resolver())
      )
    })
  }

  // .................................................................
  // Idsensor -> borrarSensorPorID() ->
  //  Le pasas el nombre del sensor y lo elimina en la BD
  // .................................................................
  borrarSensorPorID(idSensor) {
    var textoSQL = "Delete from Sensor where IdSensor = $idSensor";
    var valoresParaSQL = {
      $idSensor: idSensor
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  // .................................................................
  // idUsuario -> borrarUsuarioPorId() ->
  //  Le pasas el id y lo elimina en la BD
  // .................................................................
  borrarUsuarioPorId(idUsuario) {
    var textoSQL = "Delete from Usuarios where IdUsuario = $idUsuario";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  // .................................................................
  // IDUsuario -> desvincularUsuarioDeSensorPorIdUsuario() ->
  //  Le pasas el nombre del sensor y lo elimina en la BD
  // .................................................................
  async desvincularUsuarioDeSensorPorIdUsuario(idUsuario) {
    var textoSQL = "Delete from UsuarioSensor where IdUsuario = $idUsuario";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    };

    var idSensor = await this.getSensorPorIdUsuario(idUsuario);
    //console.log(idSensor);
    var dato = {
      estado: "Inactivo",
      idSensor: idSensor[0].IdSensor,
    }
    await this.indicarActividadNodo(dato);
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  // .................................................................
  // borrarFilasDeTodasLasTablas() ->
  // .................................................................
  async borrarFilasDeTodasLasTablas() {
    await this.borrarFilasDe("Medidas")
  }

  // .................................................................
  // cerrar() -->
  // .................................................................
  cerrar() {
    return new Promise((resolver, rechazar) => {
      this.laConexion.close((err) => {
        (err ? rechazar(err) : resolver())
      })
    })
  }

} // class
// .....................................................................
// .....................................................................