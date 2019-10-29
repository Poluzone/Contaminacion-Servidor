const IP_PUERTO = "http://localhost:8080";


class Proxy {
  constructor() {
    console.log("Funciono");
  }


  async insertarMedida(dato, fecha, posicion) {
    var data = {
      dato: dato,
      fecha: fecha,
      posicion: posicion
    };

    fetch(IP_PUERTO + "/insertarMedida", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'User-Agent': 'jordi',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(data)
      console.log(res)
    })
  }

  async insertarUsuarioP(email, pass, tel) {

    var data = {
      Email: email,
      Password: pass,
      Telefono: tel
    };

    fetch(IP_PUERTO + "/insertarUsuario", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'User-Agent': 'jordi',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(data)
      console.log(res)
    })

  }

  async ComprobacionLogin(data) {


    fetch(IP_PUERTO + "/ComprobarLogin",{
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'User-Agent': 'jordi',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res)
    })
  }

}
