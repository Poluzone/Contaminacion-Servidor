const bcrypt = require(' bcrypt ');
const saltRounds = 10;

module.exports = class Crypt {
  constructor() {
    console.log("Funciono");}

    function EncriptarContraseña(pass) {

      brypt.hash(pass, saltRounds, function(err, hash) {
        if (!err) {
          return hash;
        } else {
          console.log(err);
        }
      });
    }

    function ComprobarContraseña(pass, hash) {

      brypt.compare(pass, hash, function(err, res) {
        if(!err){
          return res;
        }else {
          console.log(err);
        }
      });
    }

  }
