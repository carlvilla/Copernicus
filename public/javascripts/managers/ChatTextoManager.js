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

       /* if(tipo=="archivo"){
            blob = new Blob([data], { type: 'application/vnd.ms-excel' })


        }*/

        mensajes.push(mensajeAux);


        $("#mensajes").animate({
            scrollTop: $("#fin-mensajes").offset().top - $("#mensajes").offset().top + $("#mensajes").scrollTop()
        }, 500);


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
        console.log("Enviar archivo");
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