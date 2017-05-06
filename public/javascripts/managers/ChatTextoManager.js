function ChatTextoManager(ws) {

    var mensajes = [];
    var usernameUsuario;
    var sala;


    this.setUsuario = function (username) {
        usernameUsuario = username;
    }

    this.setSala = function (salaParam) {
        sala = salaParam;
    }

    this.getMensajes = function () {
        return mensajes;
    }

    this.sendMensaje = function (mensaje) {
        sendData(mensaje);
        this.addMensaje({username: usernameUsuario, mensaje: mensaje});
    }

    this.addMensaje = function (mensaje) {
        var mensajeAux = {
            username: mensaje.username,
            mensaje: mensaje.mensaje
        }
        mensajes.push(mensajeAux);
    }


    function sendData(mensaje) {
        ws.send(JSON.stringify(
            {
                'seccion': 'chatTexto',
                'data': {
                    'username': usernameUsuario,
                    'sala': sala,
                    'mensaje': mensaje
                }

            }));
    }


}