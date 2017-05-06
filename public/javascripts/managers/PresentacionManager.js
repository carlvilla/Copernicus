function PresentacionManager(ws){

    var presentacion;
    var reveal;
    var usernameUsuario;
    var sala;

    this.start = function (salaParam) {
        presentacion = document.getElementById("presentacion");
        sala = salaParam;

        presentacion.onload = function () {
            reveal = presentacion.contentWindow.Reveal;
            reveal.addEventListener('slidechanged', actualizarAsistentes);
        }
    }


     this.setUsuario = function (username) {
        usernameUsuario = username;
    }

    this.actualizarPresentacion = function(info){
        reveal.slide(info.indexh, info.indexv);
    }

    var actualizarAsistentes = function (evento) {
        sendData(evento.indexh, evento.indexv)
    }

    function sendData(indexh, indexv) {
        ws.send(JSON.stringify(
            {
                'seccion': 'presentacion',
                'data': {
                    'indexh': indexh,
                    'indexv': indexv,
                    'username': usernameUsuario,
                    'sala': sala
                }

            }));
    }

}
