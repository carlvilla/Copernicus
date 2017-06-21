function ChatTextoManager(ws, utils, $translate) {

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

    this.enviarMensaje = function (mensaje) {
        sendData(mensaje);
        this.addMensaje({username: usernameUsuario, mensaje: mensaje, tipo: "texto"});
    }

    this.addMensaje = function (mensaje) {
        console.log("Recibido mensaje");
        var mensajeAux = {
            username: mensaje.username,
            mensaje: mensaje.mensaje,
            tipo: mensaje.tipo,
            fichero: mensaje.fichero,
            contenido: mensaje.contenido
        }

        mensajes.push(mensajeAux);

        $("#mensajes").animate({
            scrollTop: $("#fin-mensajes").offset().top - $("#mensajes").offset().top + $("#mensajes").scrollTop()
        }, 300);
    }

    this.getFeedback = function (feedback) {

        if (feedback.mensaje.tipoMensaje == 'texto') {
            ($(".feedback-" + usernameUsuario)[0]).append(feedback.mensaje.participantes + " √");
        }

        else {
            if (feedback.mensaje == 1) {
                utils.mensajeInfo($translate.instant('FICHERO_ENVIADO_FEEDBACK')
                    + feedback.mensaje.participantes + " " + $translate.instant('USUARIO'));
            } else {
                utils.mensajeInfo($translate.instant('FICHERO_ENVIADO_FEEDBACK') +
                    feedback.mensaje.participantes + " " + $translate.instant('USUARIOS'));
            }
        }

        ($(".feedback-" + usernameUsuario)).removeClass('feedback-' + usernameUsuario);

    }

    function sendData(mensaje) {
        ws.send(JSON.stringify(
            {
                'seccion': 'chatTexto',
                'data': {
                    'username': usernameUsuario,
                    'sala': sala,
                    'tipo': 'texto',
                    'mensaje': mensaje
                }

            }));
    }

    this.sendArchivo = function (file, contenido, tipo) {
        var fr = new FileReader();

        ws.send(JSON.stringify({
            'seccion': 'chatTexto',
            'data': {
                'tipo': tipo,
                'fichero': file.name,
                'contenido': contenido,
                'username': usernameUsuario,
                'sala': sala
            }
        }));

    };


}