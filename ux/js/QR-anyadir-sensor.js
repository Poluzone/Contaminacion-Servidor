var QRescaneado;
// Emilia Rosa van der Heide
// -> crearEscanerQR -> 
// crea un escaner de QR para escanear el QR de cada sensor
function crearEscanerQR() {
    if (modoActual == 0) {
        $("#modal").modal("hide");
        //console.log("aaaaaaaaaaaaaa" + $('#modal').is(':visible'))
        $("#modal-anyadir-sensor").modal();
        let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {
            console.log(content);
            QRescaneado = content;
            document.getElementById("qr-escaneado-p").innerText = "QR escaneado: " + content;
        });
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
    }
}


// Emilia Rosa van der Heide
// -> anyadirSensor -> 
// añade un sensor a la BBDD
function anyadirSensor() {
    console.log(QRescaneado)
   // if (QRescaneado.includes("poluzone")) {
        proxy.insertarSensor(QRescaneado)
        location.reload()
    //}
}