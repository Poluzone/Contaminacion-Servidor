// .....................................................................
// Logica.js
// .....................................................................
const sqlite3 = require( "sqlite3" )

// .....................................................................
// .....................................................................
module.exports = class Logica {
// .................................................................
// nombreBD: Texto
// -->
// constructor () -->
// .................................................................
constructor( nombreBD, cb ) {
this.laConexion = new sqlite3.Database(
nombreBD,
( err ) => {
if( ! err ) {
this.laConexion.run( "PRAGMA foreign_keys = ON" )
}
cb( err)
})} // ()

insertarMedida( datos ){
  var textoSQL =
  'insert into Datos values( $dato, $fecha , $posicion);'
  var valoresParaSQL = { $dato: datos.dato, $fecha: datos.fecha, $posicion: datos.posicion }
    return new Promise( ( resolver, rechazar ) => {
      this.laConexion.run( textoSQL, valoresParaSQL, function( err ) {
        ( err ? rechazar( err ) : resolver( ) )
      })
    })
}

GetSoloMedidas() {
var textoSQL = "select * from Datos";
return new Promise( (resolver, rechazar) => {
this.laConexion.all( textoSQL,
( err, res ) => {
( err ? rechazar(err) : resolver(res) )
})
})
}

borrarFilasDe( tabla ) {
return new Promise( (resolver, rechazar) => {
this.laConexion.run(
"delete from " + tabla + ";",
(err)=> ( err ? rechazar(err) : resolver() )
)
})
} // ()
// .................................................................
// borrarFilasDeTodasLasTablas() -->
// .................................................................
async borrarFilasDeTodasLasTablas() {
await this.borrarFilasDe( "Datos" )
} // ()
// .................................................................
// cerrar() -->
// .................................................................
cerrar() {
return new Promise( (resolver, rechazar) => {
this.laConexion.close( (err)=>{
( err ? rechazar(err) : resolver() )
})
})
} // ()

} // class
// .....................................................................
// .....................................................................
