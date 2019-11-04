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

  async insertarUsuario(email, pass, tel) {

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
      setCookie("username",data.Email);
      console.log(data.Email);
      console.log(res)
      checkCookie();
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
    }).then(function(response) {
    return response.json();
  })
  .then(function(datos) {
    if(datos.status == true){
      setCookie("username",datos.Usuario[0].Email);
      console.log("Iniciar sesion correcto y se han creado los cookies");
      checkCookie();
    }else{
      console.log("No existe o no has puesto bien los datos");
    }
  });
  }

  /**
   * GETultimaMedida()
   */
  async GETultimaMedida(userId, callback) {

    fetch(IP_PUERTO + "/GETultimaMedida",{
      method: 'POST', // or 'PUT'
      body: JSON.stringify(userId), // data can be `string` or {object}!
      headers: {
        'User-Agent': 'jordi',
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
    return response.json();
  })
  .then(function(datos) {
    if(datos != undefined){
      console.log("Tenemos la última medida");
    }else{
      console.log("No existe o no has puesto bien los datos");
    }
    callback(datos);
  });
  }

    /**
   * GetIdUsuario()
   */
  async GETidUsuario(username,callback) {

    fetch(IP_PUERTO + "/GETidUsuario",{
      method: 'POST', // or 'PUT'
      body: JSON.stringify(username), // data
      headers: {
        'User-Agent': 'jordi',
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      console.log(response);
    return response.json();
  })
  .then(function(datos) {
    if(datos != undefined){
      console.log("------------PROXY------------");
      console.log("El id del usuario es: "+datos);
    }else{
      console.log("No existe o no has puesto bien los datos");
    }
      callback(datos);
  });
  }
}