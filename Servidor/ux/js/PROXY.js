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
      Password: hash,
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

  async ComprobacionLogin(email) {

    var resu;

    var myInit = {
      method: 'GET',
      headers: {
        'User-Agent': 'jordi',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'default'
    };


    fetch(IP_PUERTO + "/GetUsuarioPorEmail/" + email, myInit)
      .then((res) => {
        return res.json();
      })
      .then((data) => {

        var pass = document.getElementById('Pass').value;
        if (data[0].Password == pass) {
          console.log("funciona");
        } else {
          console.log("no funciona");
        }

      })
  }

}
