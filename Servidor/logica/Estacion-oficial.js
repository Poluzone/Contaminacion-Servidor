// Importar JSDOM
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Opciones para JSDOM
const options = {
  cookieJar: new jsdom.CookieJar() // Habilitar cookies
};

// URLs de los datos
const urlDatosGandia = "http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/pde.jsp?PDE.CONT=912&estacion=5&titulo=46131002-Gandia&provincia=null&municipio=null&red=0&PDE.SOLAPAS.Mostrar=1111";
const urlDatos = "http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/datos_on_line.jsp";

(async function () {
  // Array donde guardaremos las medidas
  let data = [];

  // Primera petición para obtener las cookies
  await JSDOM.fromURL(urlDatosGandia, options);

  // Petición para obtener datos contaminación
  await JSDOM.fromURL(urlDatos, options).then(dom => {

    // Tabla de contaminación
    let table = dom.window.document.getElementsByTagName("table")[7];

    // Filas de la tabla
    let rows = table.getElementsByTagName("tr");

    // Recorremos filas
    for (i = 1; i < rows.length; i++) {
      // Por cada fila, montamos un objeto medida
      let measure = {
        hora: rows[i].children[0].innerHTML,
        s02: rows[i].children[1].innerHTML,
        co: rows[i].children[3].innerHTML,
        no: rows[i].children[5].innerHTML,
        no2: rows[i].children[6].innerHTML,
        nox: rows[i].children[8].innerHTML,
        o3: rows[i].children[9].innerHTML
      }
      // Guardamos objeto en el array de medidas
      data.push(measure);
    }
  })
  // Mostramos array medidas
  console.log(data);
  //console.log(JSON.stringify(data));
}())