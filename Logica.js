/****************************************************************************************
Logica.js
GTI 3º, 2019-2020, Equipo 3
Autores: Josep Carreres Fluixà, Emilia Rosa van der Heide
Descripcion: Conexión con la base de datos
Fecha: septiembre 2019
© Copyright:
****************************************************************************************/
const sqlite3 = require("sqlite3")
const estacionOficial = require('./Estacion-oficial');


module.exports = class Logica {
  /****************************************************************************************
  nombreBD: Texto -->
  constructor ()
  -->

  Josep Carreres Fluixà
  ****************************************************************************************/
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

  /****************************************************************************************
  medida -->
  insertarMedida()
  -->

  Inserta una medida en la BBDD
  Josep Carreres Fluixà
  ****************************************************************************************/
  async insertarMedida(medida) {
    console.log("logica: insertarMedida")
    var medidaCalibrada = await this.calibrarMedida(medida)
    var textoSQL =
      'insert into Medidas values( $IdMedida, $IdTipoMedida , $IdUsuario, $Valor , $Tiempo , $Latitud , $Longitud);'
    var valoresParaSQL = {
      $IdMedida: null,
      $IdTipoMedida: medida.IdTipoMedida,
      $IdUsuario: medida.IdUsuario,
      $Valor: medidaCalibrada,
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

  /****************************************************************************************
  datos -->
  vincularSensorConUsuario()
  -->

  Vincula usuario con sensor y cambia el estado del sensor
  Josep Carreres Fluixà
  ****************************************************************************************/
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


  /****************************************************************************************
  userId -->
  getLaUltimaMedidaPorUsuario()
  -->
  ****************************************************************************************/
  async getLaUltimaMedidaPorUsuario(userId) {
    var textoSQL = "SELECT * FROM Medidas WHERE IdUsuario=" + userId + " ORDER BY IdMedida DESC LIMIT 0, 1";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  /****************************************************************************************
  email -->
  GetIdDelUsuario()
  -->
  ****************************************************************************************/
  async GetIdDelUsuario(email) {
    var textoSQL = "SELECT idUsuario FROM Usuarios WHERE Email='" + email + "';";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }


  /****************************************************************************************
  email -->
  GetUsuarioPorEmail()
  -->

  Devuelve un Usuario dandole un email
  Josep Carreres Fluixà
  ****************************************************************************************/
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

  /****************************************************************************************
  -->
  getTodosLosUsuariosYSusSensores()
  --> [JSON con todos los usuarios y su sensor]

  Recoge todos los usuarios y si tiene un sensor vinculado devuelve también el sensor
  (si no, Sensor = null)
  Emilia Rosa van der Heide
  ****************************************************************************************/
  async getTodosLosUsuariosYSusSensores() {
    console.log("logica: getTodosLosUsuariosYSusSensores")

    // Recogemos todos los usuarios
    var usuarios = await this.getTodosLosUsuarios();
    //console.log(usuarios)

    // Cogemos los sensores vinculados a los usuarios
    for (var i = 0; i < usuarios.length; i++) {
      var usuario = usuarios[i]

      // Cogemos el Id para obtener el sensor correspondiente
      var idUser = usuario.IdUsuario;

      // Cogemos el sensor correspondiente
      var sensor = await this.getSensorPorIdUsuario(idUser);
      //console.log(sensor)

      // Asignamos el sensor
      if (sensor[0] != undefined) usuarios[i].Sensor = sensor[0];

      // Si no existe, Sensor = null
      else usuarios[i].Sensor = null;
    }
    //console.log(sensores)

    return new Promise((resolver, rechazar) => {
      resolver(usuarios)
    })
  }

  /****************************************************************************************
  -->
  getSensoresYSusUsuarios()
  -->

  Llama a getTodosLosSensores y getUsuarioPorIdSensor
  Emilia Rosa van der Heide
  ****************************************************************************************/
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

  /****************************************************************************************
  -->
  getTodosLosUsuarios()
  --> JSON: usuarios

  Coge la info de todos los usuarios
  Emilia Rosa van der Heide
  ****************************************************************************************/
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

  /****************************************************************************************
  tipomedida -->
  getTipoSensor()
  -->

  Coge el tipo del sensor en texto a partir del tipo en nº
  Emilia Rosa van der Heide
  ****************************************************************************************/
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

  /****************************************************************************************
  idestado -->
  getEstado()
  -->

  Emilia Rosa van der Heide
  ****************************************************************************************/
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

  /****************************************************************************************
  -->
  getTodosLosSensores()
  -->

  Coge la info de todos los sensores
  Emilia Rosa van der Heide
  ****************************************************************************************/
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

  /****************************************************************************************
  idsensor -->
  getUsuarioPorIdSensor()
  -->

  Coge la info de un usuario a partir del id de su sensor
  Josep Carreres Fluixà
  ****************************************************************************************/
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

  /****************************************************************************************
  -->
  getSensorPorIdUsuario()
  --> JSON Sensor

  Coge la info de un sensor a partir del id de su usuario
  ****************************************************************************************/
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


  /****************************************************************************************
  -->
  getMedidasEstacionOficialGandia()
  --> medidas

  Recibe las medidas de la estacion oficial de Gandia
  Emilia Rosa van der Heide
  ****************************************************************************************/
  async getMedidasEstacionOficialGandia() {
    console.log("logica: getMedidasEstacionOficialGandia")
    var data = await estacionOficial.getMedidasEstacion();

    var estaciones = await this.getEstacionesOficiales()
    //console.log(estaciones.length)
    for (var i = 0; i < estaciones.length; i++) {
      var municipio = estaciones[i].Municipio
      if (municipio.localeCompare("Gandia") == 0) estaciones[i].Medidas = data[data.length - 1];
    }

    return estaciones;
  }

  /****************************************************************************************
  -->
  getEstacionesOficiales()
  --> estaciones

  Recibe las medidas de la estacion oficial de Gandia
  Emilia Rosa van der Heide
  ****************************************************************************************/
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


  /****************************************************************************************
  intervalo -->
  getMedidasPorFecha()
  --> medidas
  ****************************************************************************************/
  getTodasLasMedidasPorFecha(intervalo) {
    if (intervalo.desde == 0 && intervalo.hasta == 0) {
      var textoSQL = "SELECT * FROM Medidas"
    } else {
      var textoSQL = "SELECT * FROM Medidas WHERE Tiempo BETWEEN " + intervalo.desde + " AND " + intervalo.hasta + " ORDER BY IdMedida DESC";
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    });
  } //getTodasLasMedidasPorFecha()

  /****************************************************************************************
  -->
  getNumeroUsuariosTotales()
  --> N

  Josep Carreres Fluixà
  ****************************************************************************************/
  getNumeroUsuariosTotales() {
    var textoSQL = "SELECT * FROM Usuarios";
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          if (!err) {
            resolver(res.length)
          } else {
            rechazar();
          }
        })
    })
  } //()


  /****************************************************************************************
  tipousuario -->
  getNumeroUsuariosTotalesPorTipo()
  --> N

  Josep Carreres Fluixà
  ****************************************************************************************/
  getNumeroUsuariosTotalesPorTipo(tipoUsuario) {
    var textoSQL = "SELECT * FROM Usuarios where TipoUsuario = $TipoUsuario";
    var valoresParaSQL = {
      $TipoUsuario: tipoUsuario
    };

    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (!err) {
            resolver(res.length)
          } else {
            rechazar(err);
          }
        })
    })
  } //()


  /****************************************************************************************
  desde: N, hasta: N, IdUsuario: N -->
  getMedidasDeEsteUsuarioPorFecha()
  --> Medidas

  Emilia Rosa van der Heide
  ****************************************************************************************/
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
  }

  /****************************************************************************************
  desde: N, hasta: N, IdUsuario: N -->
  getUltimas20MedicionesPorUsuario()
  --> Medidas

  Josep Carreres Fluixà
  ****************************************************************************************/
  getUltimasNMedicionesPorUsuario(datos) {
    console.log("logica: getMedidasDeEsteUsuarioPorFecha")
    var textoSQL = "select * from Medidas where IdUsuario = $idUsuario order by IdMedida desc limit $num ;";
    //console.log(textoSQL)
    var valoresParaSQL = {
      $idUsuario: datos.idUsuario,
      $num: datos.num
    };
    //console.log(valoresParaSQL)
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }


  // .................................................................
  // -> calcularMedianaDeLas24hAnteriores->
  // Saca la mediana de las 24h anteriores
  // .................................................................

  async calcularMedianaPorIntervaloDeTiempo(intervalo) {

    var medidas = await this.getTodasLasMedidasPorFecha(intervalo);
    var valores = [];
    for (var i = 0; i < medidas.length; i++) {
      valores[i] = medidas[i].Valor;
    }

    valores.sort(function(a, b) {
      return a - b;
    });

    var medianaT;

    if (valores.length % 2 == 0) {

      var mediana1 = valores[(valores.length / 2) - 1];
      var mediana2 = valores[valores.length / 2];

      medianaT = (mediana1 + mediana2) / 2;
    } else {

      medianaT = valores[(valores.length / 2) - 0.5];
    }

    return new Promise((resolver, rechazar) => {
      resolver(medianaT)
    })

  }

  // .................................................................
  // -> getTodosErroresDeSensoresSinRevision() ->
  // Coge los errores que no han sido revisados
  // .................................................................

  getUsuariosConSensor() {
    var textoSQL = "select * from UsuarioSensor";

    console.log("logica: getUsuariosConSensor")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // -> comprobarSiHayErrorDeMedicionEnSensor->
  // Comprobar y saber si un error esta midiendo erronamente
  // .................................................................

  async comprobarSiHayErroresDeMedicionEnSensor() {

    var intervalo = {
      desde: Date.now() - 86400000, // 86400000 24h en milisegundos
      hasta: Date.now()
    }

    var mediana = await this.calcularMedianaPorIntervaloDeTiempo(intervalo);
    console.log(mediana);
    var usuarios = await this.getUsuariosConSensor();

    for (var i = 0; i < 6; i++) {
      var inc1 = 0;
      var inc2 = 14400000;
      var cont = 0;

      console.log(usuarios.length);

      for (var u = 0; u < usuarios.length; u++) {

        var medidas = await this.getMedidasDeEsteUsuarioPorFecha({
          desde: Date.now() - 86400000 + inc1,
          hasta: Date.now() - 86400000 + inc2
        }, usuarios[u].IdUsuario);


        for (var j = 0; j < medidas.length; j++) {
          if (medidas[j].Valor > mediana + 20 || medidas[j].Valor < mediana - 20) {
            cont++;
          }
        }

        if ((cont * 100) / medidas.length >= 30) {

          var error = {
            IdError: null,
            IdSensor: usuarios[u].IdSensor,
            Revisado: "false",
            Fecha: Date.now()

          };
          this.insertarErrorSensor(error);

        }

      }

      cont = 0;
      inc1 = inc1 + 14400000; //14400000 4h en milisegundos
      inc2 = inc2 + 14400000;

    }

  }

  // .................................................................
  // -> getTodosErroresDeSensoresSinRevision() ->
  // Coge los errores que no han sido revisados
  // .................................................................

  async getTodosErroresDeSensoresSinRevision() {
    var textoSQL = "select * from ErrorSensor where Revisado = $estado ";
    var valoresParaSQL = {
      $estado: "false"
    };
    console.log("logica: getTodosErroresDeSensoresSinRevision")
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // -> getTodosErroresDeSensoresSinRevision() ->
  // Coge los errores que no han sido revisados
  // .................................................................

  async getErroresConSenoresYUsuarios() {

    var error = await this.getTodosErroresDeSensoresSinRevision();
    for (var i = 0; i < error.length; i++) {

      var usuario = await this.getUsuarioPorIdSensor(error[i].IdSensor);
      error[i].Usuario = usuario[0];
      var sensor = await this.getSensorPorIdUsuario(usuario[0].IdUsuario);
      error[i].Sensor = sensor[0];
      error[i].TipoSensor = sensor[0].TipoSensor;
    }
    return new Promise((resolver, rechazar) => {
      resolver(error)
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // idUsuario -> marcarErrorComoRevisadoPorIdError() ->
  // marca como revisado el error por ID
  // .................................................................
  marcarTodosLosErroresComoRevisados() {
    var textoSQL = "UPDATE ErrorSensor SET Revisado = $revisado";
    var valoresParaSQL = {
      $revisado: "true"
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }

  // .................................................................
  // Josep Carreres Fluixà
  // datos -> insertarErrorSensor () ->
  // inserta un error de sensor
  // .................................................................
  insertarErrorSensor(datos) {
    var textoSQL = "insert into ErrorSensor values( $IdError, $IdSensor, $Revisado, $Fecha)";
    var valoresParaSQL = {
      $IdError: null,
      $IdSensor: datos.IdSensor,
      $Revisado: datos.Revisado,
      $Fecha: datos.Fecha

    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }




  /****************************************************************************************
  IdUsuario: N -->
  getSensorPorIdUsuario()
  --> JSON: Sensor

  Emilia Rosa van der Heide
  ****************************************************************************************/
  async getSensorPorIdUsuario(idUsuario) {
    // Relaciona tabla Sensor con tabla TipoSensor y Estados para coger
    // la Descripción de TipoSensor y Estados
    var textoSQL = "SELECT Sensor.IdSensor, TipoSensor.Descripcion TipoSensor," +
      "Estados.Descripcion Estado FROM Sensor INNER JOIN UsuarioSensor " +
      " ON UsuarioSensor.IdSensor = Sensor.IdSensor INNER JOIN TipoSensor " +
      " ON Sensor.IdTipoMedida = TipoSensor.IdTipoMedida LEFT JOIN Estados " +
      " ON Sensor.IdEstado = Estados.IdEstado WHERE UsuarioSensor.IdUsuario = $idUsuario ";
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


  /****************************************************************************************
  N -->
  getUsuarioPorIdUsuario()
  --> Usuario

  Josep Carreres Fluixà
  ****************************************************************************************/
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


  /****************************************************************************************
  -->
  getNumeroUsuariosTotales()
  --> N

  Josep Carreres Fluixà
  ****************************************************************************************/
  getNumeroUsuariosTotales() {
    var textoSQL = "SELECT * FROM Usuarios";

    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL,
        (err, res) => {
          if (!err) {
            resolver(res.length)
          } else {
            rechazar();
          }
        })
    })
  } //()


  /****************************************************************************************
  tipousuario: N-->
  getNumeroUsuariosTotalesPorTipo()
  --> N

  Josep Carreres Fluixà
  ****************************************************************************************/
  getNumeroUsuariosTotalesPorTipo(tipoUsuario) {
    var textoSQL = "SELECT * FROM Usuarios where TipoUsuario = $TipoUsuario";
    var valoresParaSQL = {
      $TipoUsuario: tipoUsuario
    };

    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (!err) {
            resolver(res.length)
          } else {
            rechazar(err);
          }
        })
    })
  } //()


  /****************************************************************************************
  intervalo-->
  getTodasLasMedidasPorFecha()
  --> medidas
  ****************************************************************************************/
  getTodasLasMedidasPorFecha(intervalo) {
    if (intervalo.desde == 0 && intervalo.hasta == 0) {
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


  /****************************************************************************************
  desde: N, hasta: N, IdUsuario: N -->
  getTodasLasMedidasPorFecha()
  --> Medidas

  Recoge las medidas de un usuario concreto
  Emilia Rosa van der Heide
  ****************************************************************************************/
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


  /****************************************************************************************
  desde: N, hasta: N, IdUsuario: N -->
  getMediaCalidadDelAireDeLaJornada()
  --> R

  Obtiene la media de las medidas de la jornada
  Emilia Rosa van der Heide
  ****************************************************************************************/
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


  /****************************************************************************************
  idestado -->
  getSensoresSegunEstado()
  --> Sensores

  Emilia Rosa van der Heide
  ****************************************************************************************/
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

  /****************************************************************************************
  idestado -->
  getNumSensoresSegunEstado()
  --> Sensores

  Devuelve los sensores según el estado
  Emilia Rosa van der Heide
  ****************************************************************************************/
  async getNumSensoresSegunEstado(idEstado) {
    var sensores = await this.getSensoresSegunEstado(idEstado);
    //console.log(sensores)
    return new Promise((resolver, rechazar) => {
      resolver(sensores.length)
    })
  } //()

  /****************************************************************************************
  datos -->
  insertarUsuario()
  -->

  Inserta usuario
  Josep Carreres Fluixà
  ****************************************************************************************/
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

  /****************************************************************************************
  sensor -->
  insertarSensor()
  -->

  Inserta sensor
  Josep Carreres Fluixà
  ****************************************************************************************/
  insertarSensor(sensor) {
    var textoSQL = "insert into Sensor values( $IdSensor, $IdTipoMedida, $IdEstado, $FactorCalibracion)";
    var valoresParaSQL = {
      $IdSensor: sensor.IdSensor,
      $IdTipoMedida: sensor.IdTipoMedida,
      $IdEstado: sensor.IdEstado,
      $FactorCalibracion: sensor.FactorCalibracion
    };

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function(err, res) {
        (err ? rechazar(err) : resolver(res))
      })
    })
  }


  /****************************************************************************************
  actividad:texto, idsensor: N -->
  indicarActividadNodo()
  -->

  Cambia el estado del nodo en la BBDD
  Emilia Rosa van der Heide
  ****************************************************************************************/
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
      if (municipio.localeCompare("Gandia") == 0) estaciones[i].Medidas = data[0];
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

  /****************************************************************************************
  medida: JSON -->
  calibrarMedida()
  --> medida: R

  Recibe una medida, lo calibra según el factor de calibración del sensor
  Emilia Rosa van der Heide
  ****************************************************************************************/
  async calibrarMedida(medida) {
    console.log("logica: calibrarMedida")
    // Cogemos el valor original
    var medidaOriginal = medida.Valor;

    // Cogemos el IdSensor de la medida
    var idSensorObj = await this.getSensorPorIdUsuario(medida.IdUsuario);
    var idSensor = idSensorObj[0].IdSensor

    // Cogemos el factor de calibracion de este sensor
    var factorArray = await this.getFactorDeCalibracion(idSensor);
    var factor = factorArray[0].FactorCalibracion;

    // Calculamos la nueva medida
    var medidaCalibrada = medidaOriginal * factor;
    return medidaCalibrada;
  }

  /****************************************************************************************
  idSensor: N  -->
  getFactorDeCalibracion()
  --> factor: R

  Recibe el id de un sensor y saca su factor de calibración de la BBDD
  Emilia Rosa van der Heide
  ****************************************************************************************/
  getFactorDeCalibracion(idSensor) {
    console.log("logica: getFactorDeCalibracion")
    var textoSQL = "SELECT FactorCalibracion FROM Sensor WHERE IdSensor = $idSensor";
    var valoresParaSQL = {
      $idSensor: idSensor
    };
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL, function(err, res) {
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
  async borrarUsuarioPorId(idUsuario) {
    var textoSQL = "Delete from Usuarios where IdUsuario = $idUsuario";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    };

    var sensor = await this.getSensorPorIdUsuario(idUsuario)
    if (sensor[0] != undefined) {
      var dato = {
        estado: "STOCK",
        idSensor: sensor[0].IdSensor,
      }
      await this.indicarActividadNodo(dato);
    }
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
